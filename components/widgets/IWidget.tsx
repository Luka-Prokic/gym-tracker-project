import Colors, { Themes } from "../../constants/Colors";
import React from "react";
import {
    StyleSheet,
    Pressable,
    Animated,
    ViewStyle,
    DimensionValue,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Mode } from "../../assets/hooks/useMode";
import HR from "../mis/HR";
import WidgetButton from "../buttons/WidgetButton";
import HideButton from "./components/HideButton";
import useWidgetActions from "./hooks/useWidgetActions";
import { WidgetModal } from "./components/WidgetModal";


interface IWidgetProps {
    id: string;
    disabled?: boolean;
    loading?: boolean;
    draggable?: boolean;
    mode?: Mode;
    opacity?: number;
    customWidth?: DimensionValue;
    customHeight?: DimensionValue;
    style?: ViewStyle | ViewStyle[];
}

export const IWidget: React.FC<IWidgetProps> = ({
    id,
    disabled,
    mode,
    draggable,
    opacity = 1,
    customWidth,
    customHeight,
    style,
    loading = false,
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const {
        widgetRef,
        widgetData,
        modalVisible,
        handleLongPress,
        handleRelease,
        handleHideWidget,
        left, top, right, bottom, modalX, modalY, width, height,
        wobbleAnim, scaleAnim
    } = useWidgetActions(id);

    if (!widgetData) {
        return null;
    }

    const animatedStyle: ViewStyle = {
        transform: [
            { scale: scaleAnim },
            {
                rotate: wobbleAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ["-3deg", "3deg"],
                }),
            },
        ],
    };
    const scaleStyle: ViewStyle = {
        transform: [{ scale: scaleAnim }],
    };
    const modeStyle: ViewStyle =
        styles[mode || widgetData.mode as keyof typeof styles] as ViewStyle ||
        styles.one as ViewStyle;

    return (
        <Animated.View
            ref={widgetRef}
            style={[
                styles.bubble as ViewStyle,
                modeStyle,
                {
                    backgroundColor: color.primaryBackground,
                    opacity: widgetData.opacity || opacity,
                    width: customWidth,
                    height: customHeight,
                    shadowColor: color.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                    borderColor: color.border,
                },
                scaleStyle,
                draggable && animatedStyle,
                style
            ]}
        >
            <HideButton
                showAsOption={widgetData.widgetSettings.hidden && draggable ? true : false}
                onPress={() => { handleHideWidget(id as string) }}
            />

            <WidgetButton
                onPress={() => { widgetData.labelPressed?.(); }}
                onLongPress={handleLongPress}
                title={widgetData.label} arrow={widgetData.arrow}
                disabled={disabled}
            />
            <HR />
            <Pressable
                onPress={() => { widgetData.childrenPressed?.(); }}
                onLongPress={handleLongPress}
                disabled={disabled}
                style={[
                    styles.children as ViewStyle,
                ]}
            >
                {widgetData.children}
            </Pressable>
            <WidgetModal
                widgetData={widgetData}
                modalVisible={modalVisible}
                handleRelease={handleRelease}
                handleHideWidget={handleHideWidget}
                top={top}
                bottom={bottom}
                left={left}
                right={right}
                width={width}
                height={height}
                modalX={modalX}
                modalY={modalY}
                scaleAnim={scaleAnim}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bubble: {
        borderRadius: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        userSelect: 'none',
        zIndex: 3,
        overflow: 'visible',
        position: 'relative',
        borderWidth: 1,
    },
    children: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexGrow: 1,
        overflow: 'hidden',
    },
    one: {
        width: "48%",
        aspectRatio: "1/1",
    },
    two: {
        width: "100%",
        aspectRatio: "2/1",
    },
    four: {
        width: "100%",
        aspectRatio: "1/1",
    },
});