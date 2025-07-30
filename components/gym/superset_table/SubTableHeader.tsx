import { Text, View } from "react-native";
import IBubble, { IBubbleSize } from "../../bubbles/IBubble";
import useGymActions from "../hooks/useGymActions";
import IButton from "../../buttons/IButton";
import useBubbleLayout from "../../bubbles/hooks/useBubbleLayout";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { StyleSheet } from "react-native";
import { GymExercise, SuperSet, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import RestSettings from "../stopwatch/RestSettings";
import Container from "@/components/containers/Container";
import SubSettings from "./SubSettings";
import { useRoutine } from "@/components/context/RoutineZustand";

interface SubTableHeaderProps {
    exerciseId: GymExercise["id"];
    supersetId: SuperSet["id"];
};

const SubTableHeader: React.FC<SubTableHeaderProps> = ({ exerciseId, supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { settingsVisible, closeSettings, openSettings, exercise, exerciseName } = useGymActions(exerciseId);
    const { bubbleRef, top, left, height, width } = useBubbleLayout();
    const { getSuperSet } = useExerciseLayout();
    const { activeRoutine } = useRoutine()

    const ss = getSuperSet(activeRoutine.layoutId, supersetId);
    const mode = ss.settings.supersetType;

    if (!ss || !exercise)
        return null;

    return (
        <Container style={{ alignItems: "flex-start" }} width={"100%"}>

            <Text
                style={[styles.title, { color: color.text }]}
                numberOfLines={2}
            >
                {exerciseName}
            </Text>

            <IBubble
                visible={settingsVisible}
                onClose={closeSettings}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.large}
            >
                <SubSettings exerciseId={exerciseId} supersetId={supersetId} onClose={closeSettings} />
            </IBubble>

            <View style={[styles.top]} >

                <RestSettings exerciseId={exerciseId} disabled={mode === "circuit"} />

                <IButton
                    height={22} width={44}
                    style={styles.button}
                    onPress={openSettings}
                >
                    <View ref={bubbleRef}>
                        <Text
                            style={[styles.text, { color: color.fourthBackground }]}
                        >
                            Edit
                        </Text>
                    </View>
                </IButton>
            </View >


        </Container >
    );
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        fontWeight: "bold",
        alignContent: "flex-end",
        fontSize: 26,
    },
    top: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end"
    },
    button: {
        justifyContent: "flex-end",
    },
    text: {
        fontWeight: "bold",
        fontSize: 18,
        padding: 4,
    },
});

export default SubTableHeader;