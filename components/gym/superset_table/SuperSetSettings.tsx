import { Ionicons } from "@expo/vector-icons";
import OptionButton from "../../buttons/OptionButton";
import Container from "../../containers/Container";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import { SuperSet, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import { RootStackParamList } from "@/assets/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useRoutine } from "@/components/context/RoutineZustand";
import IText from "@/components/text/IText";

interface SuperSetSettingsBubbleProps {
    supersetId: SuperSet["id"];
    onClose: () => void;
};

const SuperSetSettings: React.FC<SuperSetSettingsBubbleProps> = ({ supersetId, onClose }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { activeRoutine } = useRoutine();
    const {
        removeSuperSet,
        getSuperSet,
        updateSuperSetSettings,
        updateSuperSetName,
    } = useExerciseLayout();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();
    const layoutId = activeRoutine.layoutId;

    const ss = getSuperSet(layoutId, supersetId)

    if (!ss)
        return null;

    const handleDeleteSuperSet = async () => {
        removeSuperSet(layoutId, supersetId);
    }

    const showNote = !ss.settings.noNote;

    const toggleNote = () => {
        updateSuperSetSettings(layoutId, supersetId, "noNote", showNote);
    };

    return (
        <Container width={"100%"} >
            <IText value={ss.name} onChange={(e) => { updateSuperSetName(layoutId, supersetId, e) }} />
            <OptionButton title={"Update Superset Layout"} color={color.tint} icon={<Ionicons name="caret-up-circle" color={color.tint} size={24} />}
                onPress={() => {
                    onClose();
                    navigation.navigate("Modals", { screen: "SuperSet", params: { layoutId: layoutId, exId: "", superSetId: supersetId } });
                }} />

            <Container width={"100%"}>
                <OptionButton
                    title={showNote ? "Hide Note Section" : "Show Note Section"}
                    color={showNote ? color.tint : color.text}
                    icon={
                        <Ionicons
                            name={showNote ? "checkmark-circle" : "close-circle"}
                            color={showNote ? color.tint : color.text}
                            size={24}
                        />}
                    onPress={toggleNote}
                />
            </Container>
            <OptionButton title={"Remove Super Set"} color={color.error} icon={<Ionicons name="remove-circle" color={color.error} size={24} />}
                onPress={() => {
                    handleDeleteSuperSet();
                    onClose();
                }}
            />
        </Container>
    );
}

export default SuperSetSettings;