import { Text, View } from "react-native";
import IButton from "../../buttons/IButton";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { Layout, CardioExercise, useExerciseLayout } from "../../context/ExerciseLayoutZustand";

interface CardioAddIntervalButtonProps {
    exerciseId: CardioExercise["id"];
    layoutId: Layout["id"];
}

const CardioAddIntervalButton: React.FC<CardioAddIntervalButtonProps> = ({ exerciseId, layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { addInterval } = useExerciseLayout();

    const addRow = () => {
        addInterval(layoutId, exerciseId);
    };

    return (
        <IButton
            onPress={addRow}
            color={color.fifthBackground}
            width={"100%"}
            height={44}
            style={[{ marginTop: 16 }]}
        >
            <Text style={{ color: color.secondaryText, fontWeight: "bold", fontSize: 20 }}>
                Add Interval
            </Text>
        </IButton>
    );
};

export default CardioAddIntervalButton;