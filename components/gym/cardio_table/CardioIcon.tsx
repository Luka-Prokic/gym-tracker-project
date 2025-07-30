import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { CardioValues } from "../../context/ExerciseLayoutZustand";

interface CardioIconProps {
    column: keyof CardioValues;
    size?: number;
    color?: string;
}

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    duration: "time-outline",
    distance: "flag-outline",
    pace: "timer-outline",
    speed: "rocket-outline",
    calories: "flame-outline",
    steps: "footsteps-outline",
    cadence: "sync-outline",
    elevation: "trending-up",
    incline: "caret-up-outline",
    resistance: "remove-circle-outline",
    heartRate: "heart-outline",
    rest: "stopwatch-outline",
    intensity: "skull-outline",
    label: "pricetag-outline",
};


const CardioIcon: React.FC<CardioIconProps> = ({ column, size = 24, color }) => {
    const { theme } = useTheme();
    const textColor = Colors[theme as Themes].text;
    const iconName = iconMap[column] ?? "ellipse-outline";
    return <Ionicons name={iconName} size={size} color={color ?? textColor} />;
};

export default CardioIcon;