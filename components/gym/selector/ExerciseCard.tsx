import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from "react-native";
import { useExercise, Exercise } from "@/components/context/ExerciseZustand";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import capitalizeWords from "@/assets/hooks/capitalize";
import { Ionicons } from "@expo/vector-icons";

interface ExerciseCardProps {
    exerciseId: Exercise["id"];
    onPress: () => void;
    bakcgoundColor: string;
    disabled?: boolean;
    showBodypart?: boolean;
    selected?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
    exerciseId,
    onPress,
    bakcgoundColor,
    disabled,
    showBodypart,
    selected,
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getExercise } = useExercise();
    const ex = getExercise(exerciseId);
    if (!ex) return null;

    const title = capitalizeWords(ex.name);
    const equipment = ex.equipment
        ? capitalizeWords(ex.equipment)
        : null;

    const parts: string[] = Array.isArray(ex.bodypart)
        ? ex.bodypart
        : [ex.bodypart];

    const bodyPart = parts
        .map(bp => capitalizeWords(bp))
        .join(", ");

    const textColor = selected
        ? color.secondaryText
        : color.text;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: selected
                        ? color.tint
                        : bakcgoundColor,
                    opacity: disabled ? 0.6 : 1,
                    shadowColor: color.shadow,
                    borderColor: color.border,
                },
                selected && { borderColor: "transparent" },
                !selected && styles.shadow,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <View style={styles.textContainer}>
                <Text
                    style={[styles.title, {
                        color: textColor
                    }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {equipment !== "Other" && equipment
                        ? `${equipment} `
                        : ""}
                    {title}
                </Text>
                {showBodypart && bodyPart ? (
                    <Text
                        style={[
                            styles.subtitle,
                            {
                                color: textColor,
                            },
                        ]}
                    >
                        {bodyPart}
                    </Text>
                ) : null}
            </View>
            <Ionicons
                name="caret-forward"
                size={24}
                color={textColor}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "100%",
        minHeight: 64,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
    },
    shadow: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        paddingRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 18,
        flexShrink: 1,
    },
    subtitle: {
        fontSize: 14,
    },
});