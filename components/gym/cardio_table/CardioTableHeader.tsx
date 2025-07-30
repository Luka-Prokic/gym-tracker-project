import { Text, View } from "react-native";
import IBubble, { IBubbleSize } from "../../bubbles/IBubble";
import IButton from "../../buttons/IButton";
import useBubbleLayout from "../../bubbles/hooks/useBubbleLayout";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { StyleSheet } from "react-native";
import { CardioExercise, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import RestSettings from "../stopwatch/RestSettings";
import Container from "@/components/containers/Container";
import { useRoutine } from "@/components/context/RoutineZustand";
import useGetExerciseFullName from "../hooks/useGetExerciseFullName";
import CardioSettings from "./CardioSettings";

interface CardioTableHeaderProps {
    exerciseId: CardioExercise["id"];
};

const CardioTableHeader: React.FC<CardioTableHeaderProps> = ({ exerciseId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bubbleRef, top, left, height, width, bubbleVisible, popBubble, makeBubble } = useBubbleLayout();
    const { getCardioExercise } = useExerciseLayout();

    const { activeRoutine } = useRoutine();
    const layoutId = activeRoutine.layoutId;
    const exercise = getCardioExercise(layoutId, exerciseId);

    if (!exercise)
        return null;


    const exerciseName = useGetExerciseFullName(exercise.exId);

    return (
        <Container style={{ alignItems: "flex-start" }} width={"100%"}>

            <IBubble
                visible={bubbleVisible}
                onClose={popBubble}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.xl}
            >
                <CardioSettings exerciseId={exerciseId} onClose={popBubble} />
            </IBubble>

            <Text
                style={[styles.title, { color: color.text }]}
                numberOfLines={2}
            >
                {exerciseName}
            </Text>

            <View style={[styles.top]} >

                <RestSettings exerciseId={exerciseId} />

                <IButton
                    height={22} width={44}
                    style={styles.button}
                    onPress={makeBubble}
                >
                    <View ref={bubbleRef}>
                        <Text
                            style={[styles.text, { color: color.fourthBackground }]}
                        >
                            Edit
                        </Text>
                    </View>
                </IButton>
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

export default CardioTableHeader;