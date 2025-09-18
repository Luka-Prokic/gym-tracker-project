import { TextInput, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import useLayoutGymActions from "./hooks/useLayoutGymActions";

interface LayoutGymNotesProps {
    elementId: string;
    style?: any;
}

const LayoutGymNotes: React.FC<LayoutGymNotesProps> = ({ elementId, style }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { exercise, updateNote } = useLayoutGymActions(elementId);

    if (!exercise) return null;

    return (
        <View style={[styles.container, style]}>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: color.primaryBackground,
                        color: color.text,
                        borderColor: color.handle,
                    }
                ]}
                value={exercise.note || ""}
                onChangeText={(text) => updateNote(elementId, text)}
                placeholder="Add notes..."
                placeholderTextColor={color.secondaryText}
                multiline
                numberOfLines={3}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    input: {
        width: "100%",
        minHeight: 60,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlignVertical: "top",
    },
});

export default LayoutGymNotes;
