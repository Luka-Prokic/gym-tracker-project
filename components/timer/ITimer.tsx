import { DimensionValue, StyleSheet, Text } from "react-native";
import { useRoutine } from "../../components/context/RoutineZustand";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { useEffect, useState } from "react";
import { useRubikBubblesFont } from "../../assets/hooks/useRubikBubblesFont";
import { defaultRoutine } from "@/constants/Defaults";

export const formatTime = (seconds: number) => {
    const formattedSeconds = String(seconds % 60).padStart(2, "0");
    const minutes = Math.floor((seconds / 60) % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const hours = Math.floor(seconds / 3600);

    return {
        main: `${formattedMinutes}:${formattedSeconds}`,
        hours: hours > 0 ? `+${hours}` : "",
    };
};
interface ITimerProps {
    textColor?: string;
    hourColor?: string;
    width?: DimensionValue;
}

const ITimer: React.FC<ITimerProps> = ({ textColor, hourColor, width }) => {
    const { theme, homeEditing } = useTheme();
    const color = Colors[theme as Themes];
    const { time, activeRoutine } = useRoutine();
    const { fontFamily } = useRubikBubblesFont()
    const [fontSize, setFontSize] = useState(42);

    const { main, hours } = formatTime(time);

    const translateY = useSharedValue(activeRoutine.id !== defaultRoutine.id ? 0 : -100);
    const opacity = useSharedValue(activeRoutine.id !== defaultRoutine.id ? 1 : 0);

    useEffect(() => {
        if (activeRoutine.id !== defaultRoutine.id && !homeEditing) {
            translateY.value = withSpring(0, { damping: 10, stiffness: 80 });
            opacity.value = withTiming(1, { duration: 200 });
        } else {
            translateY.value = withTiming(-100, { duration: 300 });
            opacity.value = withTiming(0, { duration: 200 });
        }
    }, [activeRoutine, homeEditing, translateY, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        const newSize = Math.min(width / 3, height);
        setFontSize(newSize);
    };

    return (
        <Animated.View style={[styles.container, animatedStyle, width ? { width } : {}]} onLayout={handleLayout}>
            {hours && (
                <Text style={[styles.hours, { fontFamily }, { color: hourColor ?? color.text, fontSize: fontSize * 0.4 }]}>
                    {hours}
                </Text>
            )}
            <Text style={[styles.timer, { fontFamily }, { color: textColor ?? color.tint, fontSize }]}>
                {main}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        userSelect: "none",
        borderRadius: 16,
    },
    timer: {
        fontWeight: "bold",
    },
    hours: {
        position: "absolute",
        top: -2,
        left: -9,
        fontWeight: "bold",
        zIndex: 1,
    },
});

export default ITimer;