import { Animated, Text } from "react-native";
import IButton from "../../buttons/IButton";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import hexToRGBA from "../../../assets/hooks/HEXtoRGB";
import { GymExercise, Layout, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import { defaultSet } from "@/constants/Defaults";
import useBounceScaleAnim from "@/assets/animations/useBounceScaleAnim";
import BounceButton from "@/components/buttons/BounceButton";

interface GymAddRowButtonProps {
    exerciseId: GymExercise["id"];
    layoutId: Layout["id"];
};

const GymAddRowButton: React.FC<GymAddRowButtonProps> = ({ exerciseId, layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { addSet, restStatus } = useExerciseLayout();

    const addRow = () => {
        addSet(layoutId, exerciseId, defaultSet);
    };

    if (restStatus.id === exerciseId)
        return null;

    return (
        <BounceButton onPress={addRow} color={color.fifthBackground} width={"100%"} height={44} style={{ marginTop: 16 }}>
            <Text style={{ color: color.secondaryText, fontWeight: "bold", fontSize: 20 }}>Add Set</Text>
        </BounceButton>
    );
}

export default GymAddRowButton;