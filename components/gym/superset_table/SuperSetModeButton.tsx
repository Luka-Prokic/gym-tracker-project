import { Ionicons } from "@expo/vector-icons";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import { SuperSet, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import IButton from "@/components/buttons/IButton";
import { Text } from "react-native";
import { useRoutine } from "@/components/context/RoutineZustand";

interface SuperSetModeButtonProps {
    supersetId: SuperSet["id"];
};

const SuperSetModeButton: React.FC<SuperSetModeButtonProps> = ({ supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getSuperSet, updateSuperSetSettings } = useExerciseLayout();
    const { activeRoutine } = useRoutine();


    const layoutId = activeRoutine.layoutId;
    const ss = getSuperSet(layoutId, supersetId);
    if (!ss)
        return null;

    const mode = ss.settings.supersetType;

    const handleClick = () => {
        if (mode === "default")
            updateSuperSetSettings(layoutId, supersetId, "supersetType", "circuit")
        else
            updateSuperSetSettings(layoutId, supersetId, "supersetType", "default")

    }

    return (
        <IButton title={"default"} color={color.tint} width={"auto"} height={34} style={{ borderRadius: 16, padding: 4 }}
            onPress={() => {
                handleClick()
            }}
        >
            <Ionicons
                name={mode === "circuit" ? "sync" : "analytics"}
                size={24} color={color.secondaryText}
            />
            <Text
                style={{ fontSize: 16, fontWeight: "bold", color: color.secondaryText, textTransform: "capitalize" }}
            >
                {ss.settings.supersetType}
            </Text>
        </IButton>
    );
}

export default SuperSetModeButton;