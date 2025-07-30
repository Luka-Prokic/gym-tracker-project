import React, { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, DimensionValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";

export interface ITextProps {
  value?: string;
  onChange: (newValue: string) => void;
  onEditChange?: (isEditing: boolean) => void;
  textStyle?: object;
  inputStyle?: object;
  style?: object;
  iconColor?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  focus?: boolean;
}

const IText: React.FC<ITextProps> = ({
  value,
  onChange,
  onEditChange,
  textStyle,
  inputStyle,
  style,
  iconColor = "#8E8E93",
  height = 44,
  width = "100%",
  focus,
}) => {
  const { theme } = useTheme();
  const colors = Colors[theme as Themes];

  const [isEditing, setIsEditing] = useState(focus);
  const [text, setText] = useState(value || "");

  const handleEdit = () => {
    setIsEditing(true);
    onEditChange?.(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEditChange?.(false);
    onChange(text);
  };

  return (
    <View style={[styles.container, { height, width }, style]}>
      <TouchableOpacity
        style={[isEditing ? {} : { padding: 10 }]}
        onPress={handleEdit}
        activeOpacity={1}
      >
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.input,
                outline: 0,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                width,
              },
              inputStyle
            ]}
            value={text}
            onChangeText={setText}
            autoFocus
            onBlur={handleSave}
            onSubmitEditing={handleSave}
          />
        ) : (
          <View style={styles.textWrapper}>
            <Text style={[styles.text, textStyle, { color: colors.text, width }]}>{text}</Text>
            <Ionicons name="pencil" size={16} color={iconColor} />
          </View>
        )}
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  textWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default IText;