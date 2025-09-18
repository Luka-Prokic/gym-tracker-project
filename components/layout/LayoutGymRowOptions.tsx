import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { GymExercise } from "../context/ExerciseLayoutZustand";
import { Sets } from "../context/ExerciseZustand";
import IButton from "../buttons/IButton";
import { Ionicons } from "@expo/vector-icons";
import useLayoutGymActions from "./hooks/useLayoutGymActions";

interface LayoutGymRowOptionsProps {
    exerciseId: GymExercise["id"];
    index: number;
    set: Sets;
    closeSettings: () => void;
}

const LayoutGymRowOptions: React.FC<LayoutGymRowOptionsProps> = ({ 
    exerciseId, 
    index, 
    set, 
    closeSettings 
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { removeSet, addDropSet } = useLayoutGymActions(exerciseId);

    return (
        <View style={[styles.container, { backgroundColor: color.error || "#FF3B30" }]}>
            <IButton
                height={44}
                width={60}
                onPress={() => {
                    removeSet(exerciseId, index);
                    closeSettings();
                }}
                color={color.error || "#FF3B30"}
                textColor={color.primaryBackground}
            >
                <Ionicons name="trash-outline" size={20} color={color.primaryBackground} />
            </IButton>
            
            <IButton
                height={44}
                width={60}
                onPress={() => {
                    addDropSet(exerciseId, index);
                    closeSettings();
                }}
                color={color.accent}
                textColor={color.primaryBackground}
            >
                <Ionicons name="add" size={20} color={color.primaryBackground} />
            </IButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 44,
        gap: 8,
        paddingHorizontal: 8,
    },
});

export default LayoutGymRowOptions;
