import React, { useEffect, useRef } from "react";
import { DimensionValue, View } from "react-native";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import { BounceIn } from "react-native-reanimated";
import useBounceScaleAnim from "@/assets/animations/useBounceScaleAnim";

interface IToggleButtonProps {
    option1: string;
    option2: string;
    value: string;
    onChange: (val: string) => void;
    width?: DimensionValue;
    height?: DimensionValue;
    style?: ViewStyle;
    backgroundColor?: string;
}

const IToggleButton: React.FC<IToggleButtonProps> = ({
    option1,
    option2,
    value,
    onChange,
    width = 144,
    height = 44,
    style,
    backgroundColor,
}) => {
    const animation = useRef(new Animated.Value(value === option1 ? 0 : 1)).current;
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bounceAnim, bounceIt } = useBounceScaleAnim();

    useEffect(() => {
        Animated.spring(animation, {
            toValue: value === option1 ? 0 : 1,
            useNativeDriver: false,
            speed: 20,
            bounciness: 6,
        }).start();
    }, [value]);

    const selectorTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, typeof width === "number" ? width / 2 : 100],
    });

    const handlePress = (option: any) => {
        onChange(option);
        bounceIt();
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    width,
                    height,
                    borderRadius: height as number / 2,
                    backgroundColor: backgroundColor ?? color.handle,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                    shadowColor: color.shadow,
                },
                bounceAnim,
                style
            ]}
        >
            <Animated.View
                style={[
                    styles.selector,
                    {
                        width: width as number * 0.4,
                        height: height as number * 0.8,
                        marginVertical: height as number * 0.1,
                        marginHorizontal: width as number * 0.05,
                        borderRadius: height as number / 2,
                        transform: [{ translateX: selectorTranslate }],
                        backgroundColor: color.background,
                    },
                ]}
            />

            <View style={styles.row}>
                {[option1, option2].map((option) => {
                    const isSelected = value === option;
                    return (
                        <Pressable
                            key={option}
                            style={styles.button}
                            onPress={() => handlePress(option)}
                        >
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        color: isSelected ? color.accent : color.text,
                                        fontWeight: "bold",
                                    },
                                ]}
                            >
                                {option.toUpperCase()}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        overflow: "hidden",
        justifyContent: "center",
    },
    selector: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    row: {
        flexDirection: "row",
        width: "100%",
        height: "100%",
        zIndex: 10,
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        letterSpacing: 1,
    },
});

export default IToggleButton;
