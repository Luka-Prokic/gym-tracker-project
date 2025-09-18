import { DimensionValue, Pressable, Text, ViewStyle } from "react-native";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import { Animated } from "react-native";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import Container from "../containers/Container";
import IBubble from "../bubbles/IBubble";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";
import useExerciseActions from "../gym/hooks/useExerciseActions";
import { Layout, LayoutItem, useExerciseLayout } from "../context/ExerciseLayoutZustand";
import getInitials from "@/assets/hooks/getInitials";
import { useExercise } from "../context/ExerciseZustand";

export const getBackgroundById = (id: string, theme: Themes) => {
    const colorSet = [
        Colors[theme].tint,
        Colors[theme].secondaryBackground,
        Colors[theme].thirdBackground,
        Colors[theme].caka,
        Colors[theme].accent,
    ];

    let hash = 5381;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorSet.length;

    return colorSet[index];
};

export function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

interface SuperSetWidgetProps {
    id: LayoutItem["id"];
    layoutId: Layout["id"];
    loading?: boolean;
    draggable?: boolean;
    customWidth: DimensionValue;
    customHeight: DimensionValue;
    children?: React.ReactNode;
    onPress?: () => void;
}

export const SuperSetWidget: React.FC<SuperSetWidgetProps> = ({
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
    const { getSuperSet, } = useExerciseLayout();
    const ss = getSuperSet(layoutId, id);
    if (!ss)
        return null;

    const typeCode = ss.settings.supersetType[0].toUpperCase();
    const exCode = getInitials(ss.name).slice(0, 2).toUpperCase();
    const ssInitials = `${exCode}-${typeCode}`;

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
                        backgroundColor: hexToRGBA(getBackgroundById(id, theme), 0.6),
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
                    <Text style={{ fontWeight: "bold", color: color.text }}>{ssInitials}</Text>
                </Pressable>
            </Animated.View>

            <IBubble
                visible={modalVisible}
                onClose={handleRelease}
                height={height}
                width={width}
                top={top}
                left={left}
            >
                <Container width={"90%"}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", color: color.text }}>
                        {/* {ssNames} */}
                    </Text>
                </Container>
            </IBubble >
        </>
    );
};
