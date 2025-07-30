import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import OptionButton from "../../buttons/OptionButton";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import useWidgetModalAnim from "../animations/useWidgetModalAnim";
import IList from "../../containers/IList";
import WidgetResizeModal from "./WidgetResizeModal";
import WidgetRenameModal from "./WidgetRenameModal";
import useWidgetActions from "../hooks/useWidgetActions";

interface WidgetOptionsModalProps {
    id: string,
    handleRelease: () => void;
    handleHideWidget: (id:string) => void;
    x: any,
    y: any,
    top: any,
    bottom: any,
    left: any,
    right: any,
    heightOffset: any,
}

const WidgetOptionsModal: React.FC<WidgetOptionsModalProps> = ({
    id,
    handleRelease,
    handleHideWidget,
    x,
    y,
    top,
    bottom,
    left,
    right,
    heightOffset
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const { widgetData, modalVisible } = useWidgetActions(id);
    if (!widgetData)
        return null;

    const modalAnim = useWidgetModalAnim(modalVisible);


    const modalStyle: ViewStyle = {
        opacity: modalAnim,
        transform: [{ scale: modalAnim }],
    };

    return (
        <Animated.View
            style={[
                styles.bubble as ViewStyle,
                modalStyle,
                y === 0 ?
                    { bottom: bottom + heightOffset + 18, }
                    :
                    { top: top + heightOffset + 18, },
                x === 1 ?
                    { left: left, }
                    :
                    { right: right, },
                {
                    
                    backgroundColor: color.secondaryBackground,
                    borderColor: color.handle,
                },
            ]}
        >
            <IList width={160}>
                {widgetData.widgetSettings.rename &&
                    <WidgetRenameModal
                        onClose={handleRelease}
                        id={id} />}
                {widgetData.widgetSettings.resize &&
                    <WidgetResizeModal
                        onClose={handleRelease}
                        id={id} />}
                {widgetData.widgetSettings.hidden &&
                    <OptionButton title="Hide" color={color.error}
                        onPress={() => { handleHideWidget(id); handleRelease(); }}
                        icon={
                            <Ionicons name="remove-circle" size={16} color={color.error} />
                        }
                    />}
            </IList>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bubble: {
        position: "absolute",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 44,
        elevation: 5,
        zIndex: 4,
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
    },
});

export default WidgetOptionsModal;