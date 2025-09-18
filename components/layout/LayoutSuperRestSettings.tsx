import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import useLayoutGymActions from "./hooks/useLayoutGymActions";
import { GymExercise, SuperSet, useExerciseLayout } from "../context/ExerciseLayoutZustand";
import ISlide from "../bubbles/ISlide";
import { Text } from "react-native";
import IButton from "../buttons/IButton";
import { Ionicons } from "@expo/vector-icons";
import Container from "../containers/Container";
import HR from "../mis/HR";
import { useRoutine } from "../context/RoutineZustand";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";
import getInitials from "../../assets/hooks/getInitials";
import { hashCode } from "../gym/SuperSetWidget";
import { useExercise } from "../context/ExerciseZustand";

interface LayoutSuperRestSettingsProps {
    supersetId: SuperSet["id"];
};

const LayoutSuperRestSettings: React.FC<LayoutSuperRestSettingsProps> = ({ supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bubbleVisible, makeBubble, popBubble } = useBubbleLayout();
    const { updateRestLength, updateSuperSetSettings, getSuperSet } = useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const { getExercise } = useExercise();
    const layoutId = activeRoutine.layoutId;
    const ss = getSuperSet(layoutId, supersetId);
    const mode = ss.settings.supersetType;
    const firstEx = getExercise(ss.layout[0].exId);

    if (!ss || !firstEx)
        return null;

    const restLength = ss.restLength ?? 0;

    const handleAddTime = () => {
        if (restLength >= 0) {
            updateSuperSetSettings(layoutId, supersetId, "noRest", false);
        }
        updateRestLength(layoutId, supersetId, restLength + 15);
    }

    const handleSubtractTime = () => {
        if (restLength === 15) {
            updateSuperSetSettings(layoutId, supersetId, "noRest", true);
        }
        updateRestLength(layoutId, supersetId, restLength ? restLength - 15 : restLength);
    }

    const typeCode = ss.settings.supersetType.toUpperCase();
    const exCode = getInitials(firstEx.name).slice(0, 2).toUpperCase();
    const ssInitials = `S-${typeCode}-${exCode}`;


    const minutes = String(Math.floor(restLength / 60));
    const seconds = String(restLength % 60).padStart(2, '0');
    const label = ss.settings.noRest ? "off" : minutes !== "0" ? `${minutes}min ${seconds}s` : `${seconds}s`;

    return (
        <>
            <IButton height={22} width={"80%"} style={{ justifyContent: "flex-start" }} onPress={makeBubble} disabled={mode === "default"}>
                <Ionicons name="stopwatch" color={color.grayText} size={22} />
                <Text style={{ fontWeight: "bold", fontSize: 16, color: color.grayText }}>{label}</Text>
            </IButton>
            <ISlide size="small" visible={bubbleVisible} onClose={popBubble}>
                <Text
                    style={{ color: color.tint, fontSize: 16, fontWeight: "bold" }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {ssInitials}
                </Text>
                <Text
                    style={{ color: color.text, fontSize: 24, fontWeight: "bold" }}>
                    Rest Time {label}
                </Text>
                {/* <HR /> */}
                <Container width={"100%"} height={44} direction="row" style={{ gap: "4%", paddingHorizontal: "5%" }}>
                    <IButton color={color.border} height={44} title="-15" width={"48%"}
                        onPress={handleSubtractTime}
                    />
                    <IButton color={color.border} height={44} title="+15" width={"48%"}
                        onPress={handleAddTime}
                    />
                </Container>
            </ISlide>
        </>
    );
}

export default LayoutSuperRestSettings;
