import { DimensionValue, Pressable, ViewStyle } from "react-native";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { StyleSheet } from "react-native";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/ScreenWidth";
import Overlay from "../containers/Overlay";

export enum IBubbleSize {
    "xs" = 44,
    "small" = SCREEN_WIDTH * 0.3,
    "medium" = SCREEN_WIDTH * 0.6,
    "large" = SCREEN_WIDTH * 0.8,
    "xl" = SCREEN_WIDTH * 0.92,
};

interface IBubbleProps {
    loading?: boolean;
    width?: DimensionValue;
    height?: DimensionValue;
    children: React.ReactNode;
    visible: boolean;
    onClose?: () => void;
    top: number;
    left: number;
    overlay?: boolean;
    size?: IBubbleSize;
}

const IBubble: React.FC<IBubbleProps> = ({
    width,
    height,
    children,
    visible,
    onClose,
    top,
    left,
    overlay = true,
    size = IBubbleSize.medium,
    loading = false,
}) => {

    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const widthAnim = useRef(new Animated.Value(typeof width === "number" ? width : 100)).current;
    const heightAnim = useRef(new Animated.Value(typeof height === "number" ? height : 100)).current;
    const leftAnim = useRef(new Animated.Value(left)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const opacityModal = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        leftAnim.setValue(left);
    }, [left]);

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                Animated.spring(widthAnim, {
                    toValue: SCREEN_WIDTH * 0.92,
                    speed: 1,
                    bounciness: 1,
                    useNativeDriver: true,
                }).start();
                Animated.spring(heightAnim, {
                    toValue: size,
                    speed: 1,
                    bounciness: 1,
                    useNativeDriver: true,
                }).start();
                Animated.spring(leftAnim, {
                    toValue: SCREEN_WIDTH / 2,
                    speed: 1,
                    bounciness: 1,
                    useNativeDriver: true,
                }).start();
                Animated.spring(progressAnim, {
                    toValue: 1,
                    speed: 1,
                    bounciness: 1,
                    useNativeDriver: true,
                }).start();
            }, 300);
            setTimeout(() => {
                Animated.spring(opacityModal, {
                    toValue: 1,
                    speed: 1,
                    bounciness: 1,
                    useNativeDriver: true,
                }).start();
            }, 500);
        } else {
            opacityModal.setValue(0);
            Animated.spring(widthAnim, {
                toValue: typeof width === "number" ? width : SCREEN_WIDTH * 0.5,
                speed: 1,
                bounciness: 1,
                useNativeDriver: true,
            }).start();
            Animated.spring(heightAnim, {
                toValue: typeof height === "number" ? height : 100,
                speed: 1,
                bounciness: 1,
                useNativeDriver: true,
            }).start();
            Animated.spring(leftAnim, {
                toValue: left,
                speed: 1,
                bounciness: 1,
                useNativeDriver: true,
            }).start();
            Animated.spring(progressAnim, {
                toValue: 0,
                speed: 1,
                bounciness: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const translateX = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -((SCREEN_WIDTH * 0.92) / 2)],
    });

    const borderRadius = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 16],
    });
    const topAnim = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [top, top - size + (typeof height === "number" ? height : 100)],
    });
    return (
        <Overlay
            visible={visible}
            onClose={onClose ? () => onClose() : () => { }}
            blur={false}
            transparent={!overlay}
        >
            <Animated.View
                style={[
                    styles.modalContainer as ViewStyle,
                    { top: top > SCREEN_HEIGHT / 2 ? topAnim : top },
                    { left: leftAnim },
                    {
                        backgroundColor: hexToRGBA(color.secondaryText, 0.4),
                        width: widthAnim,
                        height: heightAnim,
                        alignItems: "center",
                        justifyContent: "center",
                        transform: [{ translateX }],
                        backdropFilter: 'blur(30px)',
                        borderColor: color.handle,
                        borderWidth: 1,
                        borderRadius,
                    },
                ]}
            >
                <Animated.View style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: opacityModal
                }}>
                    <Pressable style={{
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        userSelect: "none",
                    }}>
                        {children}
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </Overlay >
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        position: "absolute",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 44,
        elevation: 5,
        zIndex: 6,
    },
});

export default IBubble;