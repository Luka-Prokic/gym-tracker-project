import React from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { WidgetBlueprint } from "../../context/CakaAppZustand";
import Overlay from "../../containers/Overlay";
import WidgetButton from "../../buttons/WidgetButton";
import WidgetOptionsModal from "./WidgetOptionsModal";
import HR from "../../mis/HR";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import hexToRGBA from "../../../assets/hooks/HEXtoRGB";

interface WidgetModalProps {
    widgetData: WidgetBlueprint;
    modalVisible: boolean;
    handleRelease: () => void;
    handleHideWidget: (id: string) => void;
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
    scaleAnim: any;
    modalX: any;
    modalY: any;
}

export const WidgetModal: React.FC<WidgetModalProps> = ({
    widgetData,
    modalVisible,
    handleRelease,
    handleHideWidget,
    top,
    bottom,
    left,
    right,
    width,
    height,
    scaleAnim,
    modalX,
    modalY
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <Overlay visible={modalVisible} onClose={handleRelease}>
            <Animated.View
                style={[
                    styles.bubble,
                    {
                        top: top,
                        left: left,
                        width: width,
                        height: height,
                        transform: [{ scale: scaleAnim }],
                        backgroundColor: hexToRGBA(color.primaryBackground, 0.4),
                    },
                ]}
            >
                <WidgetButton onPress={handleRelease} title={widgetData.label} arrow={widgetData.arrow} />
                <HR />
                <Pressable onPress={handleRelease} >
                    {widgetData.children}
                </Pressable>
            </Animated.View>

            <WidgetOptionsModal
                id={widgetData.id}
                handleRelease={handleRelease}
                handleHideWidget={handleHideWidget}
                x={modalX}
                y={modalY}
                top={top}
                bottom={bottom}
                left={left}
                right={right}
                heightOffset={height}
            />
        </Overlay>
    );
};

const styles = StyleSheet.create({
    bubble: {
        position: 'absolute',
        zIndex: 3,
        borderRadius: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 44,
        overflow: 'hidden',
        userSelect: 'none',
    },
});