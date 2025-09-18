import { Text } from "react-native";
import IButton from "../buttons/IButton";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import { Layout, LayoutItem, SuperSet, useExerciseLayout } from "../context/ExerciseLayoutZustand";
import { defaultInterval, defaultSet } from "@/constants/Defaults";
import { isCardioExercise, isGymExercise } from "@/components/context/utils/GymUtils";

interface LayoutSuperSetAddRowButtonProps {
    supersetId: SuperSet["id"];
    layoutId: Layout["id"];
};

const LayoutSuperSetAddRowButton: React.FC<LayoutSuperSetAddRowButtonProps> = ({ supersetId, layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { addSet, addInterval, getSuperSet, restStatus } = useExerciseLayout();

    const ss = getSuperSet(layoutId, supersetId);
    const mode = ss.settings.supersetType;

    if (!ss || restStatus.id === ss.layout[ss.layout.length - 1].id || mode === "default")
        return null;

    const addRow = () => {
        ss.layout.map((ex: LayoutItem) => {
            if (isGymExercise(ex)) return addSet(layoutId, ex.id, defaultSet)
            if (isCardioExercise(ex)) return addInterval(layoutId, ex.id, defaultInterval)
        })
    };

    return (
        <IButton onPress={addRow} color={hexToRGBA(color.accent, 1)} width={"90%"} height={44} style={{ marginTop: 16, marginHorizontal: "5%" }}>
            <Text style={{ color: color.secondaryText, fontWeight: "bold", fontSize: 20 }}>Add Set</Text>
        </IButton>
    );
}

export default LayoutSuperSetAddRowButton;
