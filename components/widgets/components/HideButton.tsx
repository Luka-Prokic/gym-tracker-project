import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import IButton from "../../buttons/IButton";

interface HideButtonProps {
    showAsOption: boolean,
    onPress: () => void,
}

const HideButton: React.FC<HideButtonProps> = ({ showAsOption, onPress }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    if (showAsOption)
        return (
            <IButton width={34} height={34} onPress={onPress}
                style={styles.hideButton as ViewStyle}
            >
                <Ionicons name="remove-circle" color={color.grayText} size={18} />
            </IButton>
        );

    return null;
};

const styles = StyleSheet.create({
    hideButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: [
            { translateX: '-40%' },
            { translateY: '-40%' },
        ],
        zIndex: 5,
    },
});

export default HideButton;