import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, Animated, StyleSheet, DimensionValue } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import hexToRGBA from "../../../assets/hooks/HEXtoRGB";
import IButton from "../../buttons/IButton";
import useWidgetActions from "../hooks/useWidgetActions";
import { Mode, modes } from "../../../assets/hooks/useMode";
import { IWidget } from "../IWidget";
import { useCaka } from "../../context/CakaAppZustand";

type WidgetSizePickerProps = {
    width: DimensionValue;
    id: string;
    onPress: () => void,
};

const WidgetSizePicker: React.FC<WidgetSizePickerProps> = ({ id, width = 100, onPress }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const { widgetLayout, setWidgetLayout } = useCaka();
    const { widgetData } = useWidgetActions(id);
    if (!widgetData)
        return null;

    const sizeOptions = widgetData.widgetSettings.resize === "two"
        ? modes.filter((m: Mode) => m !== "four")
        : modes;

    useEffect(() => {
        const listener = scrollX.addListener(({ value }) => {
            const newIndex = Math.round(value / (typeof width === "number" ? width : 100));
            setActiveIndex(newIndex);
        });
        return () => scrollX.removeListener(listener);
    }, [scrollX]);

    const handleIndicatorPress = (index: number) => {
        scrollViewRef.current?.scrollTo({ x: index * (typeof width === "number" ? width : 100), animated: true });
    };

    const handleModeChange = (newMode: Mode) => {
        if (onPress)
            onPress();
        setWidgetLayout(
            widgetLayout.map((w) => (w.id === id ? { ...w, mode: newMode } : w))
        );
    };

    return (
        <>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                style={{
                    width,
                }}
            >

                {sizeOptions.map((size, index) => (
                    <View key={index} style={[styles.page, { width }, index !== activeIndex ? { opacity: 0.1 } : {}]}>
                        <IButton
                            length="one"
                            height={width}
                            onPress={() => handleModeChange(size)}
                        >
                            <IWidget
                                id={id}
                                disabled
                                mode={size}
                                customWidth={size === "one" ? "120%" : "160%"}
                                // opacity={widgetData.mode === size ? 1 : 0.6}
                                style={{
                                    transform: [
                                        { scale: 0.6 }]
                                }}
                            />
                        </IButton>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.indicatorContainer}>
                {sizeOptions.map((_, index) => (
                    <IButton
                        key={index}
                        width={32}
                        height={32}
                        onPress={() => handleIndicatorPress(index)}
                    >
                        <View
                            style={[
                                styles.ball,
                                {
                                    backgroundColor:
                                        activeIndex === index
                                            ? color.grayText
                                            : hexToRGBA(color.grayText, 0.4),
                                },
                            ]}
                        />
                    </IButton>
                ))}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    page: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    ball: {
        borderRadius: 8,
        width: 12,
        height: 12,
    },
});

export default WidgetSizePicker;