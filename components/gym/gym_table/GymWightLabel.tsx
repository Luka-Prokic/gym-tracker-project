import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import useGymActions from "../hooks/useGymActions";
import { GymExercise } from "../../context/ExerciseLayoutZustand";
import { useUser } from "@/components/context/UserZustend";
import IButton from "@/components/buttons/IButton";
import ISlide from "@/components/bubbles/ISlide";
import useBubbleLayout from "@/components/bubbles/hooks/useBubbleLayout";
import IToggleButton from "@/components/buttons/IToggleButtons";
import ISlideToggle from "@/components/bubbles/ISlideToggle";

interface GymColumnLabelsProps {
    exerciseId: GymExercise["id"];
    heightAnim: Animated.Value;
}

const GymWightLabel: React.FC<GymColumnLabelsProps> = ({ exerciseId, heightAnim }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { exercise } = useGymActions(exerciseId);
    const { settings, toggleWeightUnit } = useUser();
    const { bubbleVisible, popBubble, makeBubble } = useBubbleLayout();

    const weightUnit = settings.units.weight;

    if (!exercise?.sets?.length) return null;

    const headerOpacity = heightAnim.interpolate({
        inputRange: [0, 34],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    return (
        <>
            <IButton style={styles.columnLabel} onPress={makeBubble}>
                <Animated.Text
                    style={{
                        color: color.grayText,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        opacity: headerOpacity,
                    }}
                >
                    {weightUnit}
                </Animated.Text>
            </IButton>

            <ISlideToggle
                visible={bubbleVisible}
                onClose={popBubble}
                option1="kg"
                option2="lbs"
                value={weightUnit}
                onChange={toggleWeightUnit}
                title="WEIGHT UNIT"
            />
        </>
    );
};

const styles = StyleSheet.create({
    columnLabel: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    slideContent: {
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 13,
        opacity: 0.7,
    },
});

export default GymWightLabel;