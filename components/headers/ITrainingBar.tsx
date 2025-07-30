import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import LilButton from "../buttons/LilButton";
import ISlideShowWidgets from "../widgets/slider/ISlideShowWidgets";
import { useUnifrakturCookFont } from "../../assets/hooks/useUnifrakturCookFont";
import ITimer from "../timer/ITimer";
import { useRoutine } from "../context/RoutineZustand";

interface ITrainingBarProps {
    scrollY?: number;
}


const ITrainingBar: React.FC<ITrainingBarProps> = ({ scrollY = 0 }) => {
    const { theme, homeEditing, setHomeEditing } = useTheme();
    const color = Colors[theme as Themes];
    const { fontFamily } = useUnifrakturCookFont();
    const { activeRoutine } = useRoutine();

    const [addVisible, setAddVisible] = React.useState(false);

    const backgroundBase = {
        light: "rgba(255, 255, 255, 0.2)",
        peachy: "rgba(255, 255, 0.2)",
        oldschool: "rgba(255, 254, 246, 0.2)",
        dark: "rgba(100, 100, 100, 0.2)",
        preworkout: "rgba(255, 254, 246, 0.2)",
        Corrupted: "rgba(100, 255, 255, 0.2)",
    }[theme as Themes]

    const animatedOpacity = useRef(new Animated.Value(0)).current;

    const heightStyle = homeEditing ? { height: 44 } : { height: 34 };

    const trigger = homeEditing ? 0 : 54;
    const backgroundColor = scrollY >= trigger ? { backgroundColor: backgroundBase } : { backgroundColor: color.background };

    useEffect(() => {
        let targetOpacity = 0;

        if (scrollY >= trigger - 34) {
            targetOpacity = (scrollY - (trigger - 10)) / 10;
            targetOpacity = Math.min(1, Math.max(0, targetOpacity));
        }

        Animated.spring(animatedOpacity, {
            toValue: targetOpacity,
            stiffness: 200,
            damping: 20,
            mass: 0.1,
            useNativeDriver: true,
        }).start();
    }, [scrollY, homeEditing]);



    return (
        <>
            <View
                style={[
                    styles.top,
                    backgroundColor,
                    heightStyle,
                ]}
            >
                {!homeEditing && (
                    <>
                        <Animated.Text style={[
                            styles.left,
                            { opacity: animatedOpacity },
                        ]}>
                            <ITimer textColor={color.text} hourColor={color.accent} width={88} />
                        </Animated.Text>
                        <Animated.Text style={[
                            styles.header,
                            { color: color.text },
                            { opacity: animatedOpacity },
                            { fontFamily },
                        ]}>
                            Corrupt
                        </Animated.Text>
                    </>
                )}
            </View>

            {homeEditing && (
                <View style={styles.editingHome}>
                    <View style={styles.left}>
                        <LilButton
                            height={22}
                            length="short"
                            title="+ Add"
                            color={color.accent}
                            textColor={color.primaryBackground}
                            onPress={() => setAddVisible(true)}
                        />
                    </View>
                    <View style={styles.right}>
                        <LilButton
                            height={22}
                            length="short"
                            title="Done"
                            color={color.primaryBackground}
                            textColor={color.accent}
                            onPress={() => setHomeEditing(false)}
                        />
                    </View>
                </View>
            )}

            <ISlideShowWidgets visible={addVisible} onClose={() => setAddVisible(false)} />
        </>
    );
};

const styles = StyleSheet.create({
    top: {
        height: 34,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        left: 0,
        userSelect: "none",
        zIndex: 4,
        backdropFilter: "blur(10px)",
        overflow: "hidden",
    },
    editingHome: {
        height: 44,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 5,
        paddingBottom: 16,
    },
    right: {
        position: "absolute",
        height: "100%",
        justifyContent: "flex-end",
        flexDirection: "column",
        right: "5%",
    },
    left: {
        position: "absolute",
        height: "100%",
        justifyContent: "flex-end",
        flexDirection: "column",
        left: "5%",
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
        position: "absolute",
    },
});

export default ITrainingBar;