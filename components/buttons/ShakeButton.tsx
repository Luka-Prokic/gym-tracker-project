import React, { ReactNode, useRef, useState } from "react";
import { Pressable, GestureResponderEvent, Vibration } from "react-native";
import { Animated, Easing, ViewStyle, StyleProp } from "react-native";

export interface ShakeButtonProps {
    onPress: (event: GestureResponderEvent) => void;
    onLongPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    icon: ReactNode;
    longPressIcon: ReactNode;
    style?: StyleProp<ViewStyle>;
    longPressDelay?: number;
    size?: number;
}

export const ShakeButton: React.FC<ShakeButtonProps> = ({
    onPress,
    onLongPress,
    disabled,
    icon,
    longPressIcon,
    style,
    longPressDelay = 500,
    size = 40,
}) => {
    const [isLongPressed, setIsLongPressed] = useState(false);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const shakeLoop = useRef<Animated.CompositeAnimation | null>(null);

    const startShake = () => {
        shakeLoop.current = Animated.loop(
            Animated.sequence([
                Animated.timing(shakeAnim, {
                    toValue: -3,
                    duration: 50,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 3,
                    duration: 50,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        );
        shakeLoop.current.start();
    };

    const stopShake = () => {
        shakeLoop.current?.stop();
        shakeAnim.setValue(0);
    };

    const handleLongPress = (e: GestureResponderEvent) => {
        if (disabled) return;
        Vibration.vibrate(50);
        setIsLongPressed(true);
        startShake();
    };

    const handlePressOut = (e: GestureResponderEvent) => {
        Vibration.vibrate(30);
        stopShake();
        if (isLongPressed) {
            onLongPress(e);
            setIsLongPressed(false);
        } else {
            onPress(e);
        }
    };


    return (
        <Pressable
            onPressIn={() => setIsLongPressed(false)}
            onPressOut={handlePressOut}
            onLongPress={handleLongPress}
            delayLongPress={longPressDelay}
            disabled={disabled}
            style={[
                style,
                {
                    width: size,
                    height: size,
                    position: "relative",
                },
            ]}
        >
            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: size,
                    height: size,
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ translateX: shakeAnim }],
                }}
            >
                {isLongPressed ? longPressIcon : icon}
            </Animated.View>
        </Pressable>
    );
};