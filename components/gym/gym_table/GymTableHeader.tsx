import { Text, View } from "react-native";
import IBubble, { IBubbleSize } from "../../bubbles/IBubble";
import useGymActions from "../hooks/useGymActions";
import GymSettings from "./GymSettings";
import IButton from "../../buttons/IButton";
import useBubbleLayout from "../../bubbles/hooks/useBubbleLayout";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { StyleSheet } from "react-native";
import { GymExercise } from "../../context/ExerciseLayoutZustand";
import RestSettings from "../stopwatch/RestSettings";
import Container from "@/components/containers/Container";

interface GymTableHeaderProps {
    exerciseId: GymExercise["id"];
    readOnly?: boolean;
};

const GymTableHeader: React.FC<GymTableHeaderProps> = ({ exerciseId, readOnly }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { settingsVisible, closeSettings, openSettings, exercise, exerciseName } = useGymActions(exerciseId);
    const { bubbleRef, top, left, height, width } = useBubbleLayout();

    if (!exercise)
        return null;

    return (
        <Container style={{ alignItems: "flex-start" }} width={"100%"}>

            <IBubble
                visible={settingsVisible}
                onClose={closeSettings}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.large}
            >
                <GymSettings exerciseId={exerciseId} onClose={closeSettings} />
            </IBubble>

            <Text
                style={[styles.title, { color: color.text }]}
                numberOfLines={2}
            >
                {exerciseName}
            </Text>

            <View style={[styles.top]} >

                {!readOnly && <RestSettings exerciseId={exerciseId} />}

                {!readOnly && <IButton
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
                </IButton>}

            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        fontWeight: "bold",
        alignContent: "flex-end",
        fontSize: 34,
    },
    top: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
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

export default GymTableHeader;