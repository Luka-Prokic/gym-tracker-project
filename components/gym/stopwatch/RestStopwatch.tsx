import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import LilButton from "../../buttons/LilButton";
import hexToRGBA from "../../../assets/hooks/HEXtoRGB";
import { GymExercise, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import CakaIcon from "../../mis/CakaIcon";
import { useRestStopwatchActions } from "../hooks/useRestStopwatchActions";
import { useUser } from "@/components/context/UserZustend";
import BounceButton from "@/components/buttons/BounceButton";

interface RestStopwatchProps {
    exerciseId: GymExercise['id'];
    endRest: () => void;
};

const RestStopwatch: React.FC<RestStopwatchProps> = ({ exerciseId, endRest }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const {
        exercise,
        minutes,
        seconds,
        animatedStyle,
        progressWidth,
        heightAnim,
        handleAddTime,
        handleRemoveTime,
        handleEndRest,
    } = useRestStopwatchActions(exerciseId, endRest);
    const { rest, restTime } = useExerciseLayout();

    if (!exercise) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: hexToRGBA(color.grayText, 0.1),
                    borderColor: color.handle,
                    borderTopWidth: 0,
                    zIndex: 2,
                },
                restTime <= 0 ? animatedStyle : {},
                {
                    height: heightAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 172],
                    }),
                }
            ]}
        >
            <Animated.View
                style={[
                    styles.bar,
                    {
                        backgroundColor: color.tint,
                        width: progressWidth,
                        height: heightAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 34],
                        }),
                    },
                ]}
            />

            <Animated.View style={[styles.body, {
                height: heightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 138],
                }),
                opacity: heightAnim.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [0, 0, 1],
                }),
            }]}>
                <View style={styles.time}>
                    <Text style={[styles.timeText, { color: color.text }]}>
                        {minutes} min
                    </Text>
                    <Text style={[styles.timeText, { color: color.text }]}>
                        {seconds} sec
                    </Text>
                </View>

                <View style={[styles.right, {
                    borderColor: color.handle,
                    backgroundColor: hexToRGBA(color.grayText, 0.1)
                }]}>
                    <Text style={[styles.text, { color: color.text }]}>Passed {rest}s</Text>
                    <View style={styles.buttons}>

                        <BounceButton
                            color={color.handle}
                            width={44}
                            height={44}
                            style={{ borderRadius: "50%" }}
                            onPress={() => handleAddTime(15)}
                        >
                            <CakaIcon name="back-15" size={32} fill={color.text} />
                        </BounceButton>

                        {restTime > 0 ?
                            <BounceButton
                                color={color.handle}
                                width={44}
                                height={44}
                                style={{ borderRadius: "50%" }}
                                onPress={() => handleRemoveTime(15)}
                            >
                                <CakaIcon name="forward-15" size={32} fill={color.text} />
                            </BounceButton>
                            :
                            <BounceButton
                                color={color.handle}
                                width={44}
                                height={44}
                                style={{ borderRadius: "50%" }}
                                onPress={handleEndRest}
                            >
                                <Ionicons name="checkmark-circle-outline" size={32} color={color.text} />
                            </BounceButton>
                        }

                    </View>
                </View>
            </Animated.View>
        </Animated.View >
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 16,
        borderWidth: 1,
        overflow: "hidden",
        position: "relative",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    bar: {
        width: "100%",
        height: 32,
    },
    body: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    time: {
        flex: 3,
        justifyContent: "center",
        alignItems: "center",
    },
    timeText: {
        fontSize: 32,
        fontWeight: "bold",
    },
    right: {
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 8,
        padding: 8,
        margin: 8,
        borderRadius: 16,
        borderWidth: 1,
        width: 122,
        height: 122,
    },
    buttons: {
        flexDirection: "row",
        gap: 8,
        padding: 4,
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default RestStopwatch;