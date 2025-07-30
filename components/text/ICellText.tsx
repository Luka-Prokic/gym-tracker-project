import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, DimensionValue } from "react-native";
import Colors from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";

export interface ICellTextProps {
    value?: any;
    onChange?: (newValue: string) => void;
    onEditChange?: (isEditing: boolean) => void;
    textStyle?: object;
    inputStyle?: object;
    style?: object;
    cellWidth?: string | number;
    height?: DimensionValue;
    editable?: boolean;
    disabled?: boolean;
}

const ICellText: React.FC<ICellTextProps> = ({
    value,
    onChange,
    onEditChange,
    textStyle,
    inputStyle,
    style,
    height = 44,
    cellWidth = "100%",
    editable = true,
    disabled
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme];

    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value || "");

    const handleEdit = () => {
        setIsEditing(true);
        onEditChange?.(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        onEditChange?.(false);
        onChange?.(text);
    };

    return (
        <TouchableOpacity
            style={[styles.cellContainer, { height, width: cellWidth }, style]}
            onPress={handleEdit}
            activeOpacity={1}
        >
            {!disabled && isEditing ? (
                <TextInput
                    style={[
                        styles.input,
                        {
                            borderColor: colors.border,
                            color: colors.text,
                            backgroundColor: hexToRGBA(colors.input, 0.8),
                            outline: 0,
                            shadowColor: colors.shadow,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            height
                        },
                        inputStyle,
                    ]}
                    value={text}
                    onChangeText={setText}
                    autoFocus
                    onBlur={handleSave}
                    onSubmitEditing={handleSave}
                    editable={editable}
                />
            ) : (
                <View style={styles.textWrapper}>
                    <Text style={[styles.text, textStyle]}>{text}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cellContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    textWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",

    },
    text: {
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        height: 44,
        width: "100%",
        textAlign: "center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#F2F2F7",
        color: "#1C1C1E",
        backgroundColor: "white",
    },
});

export default ICellText;