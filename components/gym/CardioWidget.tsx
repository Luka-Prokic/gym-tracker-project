import { DimensionValue, Pressable, Text, ViewStyle } from "react-native";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import { Animated } from "react-native";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import Container from "../containers/Container";
import IBubble, { IBubbleSize } from "../bubbles/IBubble";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";
import useExerciseActions from "./hooks/useExerciseActions";
import { Layout, LayoutItem, useExerciseLayout } from "../context/ExerciseLayoutZustand";
import useGetExerciseInitial from "./hooks/useGetExerciseInitial";
import useGetExerciseFullName from "./hooks/useGetExerciseFullName";

interface CardioWidgetProps {
    id: LayoutItem["id"];
    layoutId: Layout["id"];
    loading?: boolean;
    draggable?: boolean;
    customWidth: DimensionValue;
    customHeight: DimensionValue;
    children?: React.ReactNode;
    onPress?: () => void;
}

export const CardioWidget: React.FC<CardioWidgetProps> = ({
    id,
    layoutId,
    customWidth,
    customHeight,
    draggable,
    children,
    onPress,
    loading = false,
}) => {

    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { modalVisible, handleRelease, handleLongPress, scaleAnim, wobbleAnim } = useExerciseActions(id, draggable);
    const { bubbleRef, top, left, width, height } = useBubbleLayout();
    const { getCardioExercise } = useExerciseLayout();
    const exercise = getCardioExercise(layoutId, id);

    if (!exercise)
        return null;

    const exerciseName = useGetExerciseFullName(exercise.exId);
    const exerciseInitials = useGetExerciseInitial(exercise.exId);

    const animatedStyle: ViewStyle = {
        transform: [
            { scale: scaleAnim },
            {
                rotate: wobbleAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ["-6deg", "6deg"],
                }),
            },
        ],
    };


    const opacity = scaleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <>
            <Animated.View
                ref={bubbleRef}
                style={[
                    {
                        width: customWidth,
                        height: customHeight,
                        backgroundColor: hexToRGBA(color.handle, 0.6),
                        opacity,
                    },
                    draggable && animatedStyle,
                ]}
            >
                <Pressable
                    onPress={onPress}
                    onLongPress={handleLongPress}
                    style={[{
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    ]}>
                    <Text style={{ fontWeight: "bold", color: color.text }}>{exerciseInitials}</Text>
                </Pressable>
            </Animated.View>

            <IBubble
                visible={modalVisible}
                onClose={handleRelease}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.xl}
            >
                <Container width={"90%"}>
                    <Text style={{ fontSize: 42, fontWeight: "bold", color: color.text }}>{exerciseName}</Text>
                </Container>
            </IBubble >
        </>
    );
};