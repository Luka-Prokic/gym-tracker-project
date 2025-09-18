import { TextInput, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { Sets } from "../context/ExerciseZustand";

interface LayoutGymTableInputProps {
    column: keyof Sets;
    value: any;
    text: string;
    onChange: (value: any) => void;
    editable?: boolean;
}

const LayoutGymTableInput: React.FC<LayoutGymTableInputProps> = ({ 
    column, 
    value, 
    text, 
    onChange, 
    editable = true 
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const getKeyboardType = () => {
        if (column === "kg" || column === "reps" || column === "rest") return "numeric";
        return "default";
    };

    const getPlaceholder = () => {
        switch (column) {
            case "kg": return "0";
            case "reps": return "0";
            case "rest": return "0";
            case "rir": return "RIR";
            case "rpe": return "RPE";
            case "note": return "Note";
            default: return "";
        }
    };

    return (
        <TextInput
            style={[
                styles.input,
                {
                    color: text,
                    backgroundColor: editable ? color.primaryBackground : color.secondaryBackground,
                }
            ]}
            value={value?.toString() || ""}
            onChangeText={onChange}
            keyboardType={getKeyboardType()}
            placeholder={getPlaceholder()}
            placeholderTextColor={color.secondaryText}
            editable={editable}
            multiline={column === "note"}
            numberOfLines={column === "note" ? 2 : 1}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 32,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "500",
        borderRadius: 8,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: "transparent",
    },
});

export default LayoutGymTableInput;
