import { CardioExercise, CardioValues, CardioSettings, useExerciseLayout } from "@/components/context/ExerciseLayoutZustand";
import { useTheme } from "@/components/context/ThemeContext";
import useCardioActions, { allCardioToggles } from "@/components/gym/hooks/useCardioActions";
import Colors, { Themes } from "@/constants/Colors";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

const allToggles = [
] as const;

interface CardioRowOptionsProps {
    exerciseId: CardioExercise["id"];
    column: keyof CardioValues;
};

const CardioRowOptions = ({ exerciseId, column }: CardioRowOptionsProps): JSX.Element | null => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise } = useCardioActions(exerciseId);
    const { updateCardioExerciseSettings } = useExerciseLayout();

    if (!exercise) return null;

    const toggleSetting = allCardioToggles.find(toggle => toggle.label === column);
    if (!toggleSetting) return null;

    const handlePress = () => {
        updateCardioExerciseSettings(layoutId, exerciseId, toggleSetting.key, true);
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: color.thirdBackground }]}
                onPress={handlePress}
            >
                <Text style={[styles.optionText, { color: color.secondaryText }]}>
                    Hide
                </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: color.fifthBackground }]}
                onPress={handlePress}
            >
                <Text style={[styles.optionText, { color: color.secondaryText }]}>
                    Unuits
                </Text>
            </TouchableOpacity > */}
        </>
    );
};

const styles = StyleSheet.create({
    optionButton: {
        width: "25%",
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    optionText: {
        fontWeight: "bold",
    },
});

export default CardioRowOptions;
