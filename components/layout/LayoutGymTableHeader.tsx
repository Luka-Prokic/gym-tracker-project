import { Text, View } from "react-native";
import IBubble, { IBubbleSize } from "../bubbles/IBubble";
import useLayoutGymActions from "./hooks/useLayoutGymActions";
import LayoutGymSettings from "./LayoutGymSettings";
import IButton from "../buttons/IButton";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { StyleSheet } from "react-native";
import { GymExercise } from "../context/ExerciseLayoutZustand";
import LayoutRestSettings from "./LayoutRestSettings";
import Container from "../containers/Container";

interface LayoutGymTableHeaderProps {
    exerciseId: GymExercise["id"];
};

const LayoutGymTableHeader: React.FC<LayoutGymTableHeaderProps> = ({ exerciseId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { settingsVisible, closeSettings, openSettings, exercise, exerciseName } = useLayoutGymActions(exerciseId);
    const { bubbleRef, top, left, height, width, makeBubble, popBubble } = useBubbleLayout();

    if (!exercise)
        return null;

    return (
        <Container style={{ alignItems: "flex-start" }} width={"100%"}>

            <IBubble
                visible={settingsVisible}
                onClose={() => { popBubble(); closeSettings(); }}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.large}
            >
                <LayoutGymSettings exerciseId={exerciseId} onClose={closeSettings} />
            </IBubble>

            <Text
                style={[styles.title, { color: color.text }]}
                numberOfLines={2}
            >
                {exerciseName}
            </Text>

            <View style={[styles.top]} >

                <LayoutRestSettings exerciseId={exerciseId} />

                <IButton
                    ref={bubbleRef as any}
                    height={22} width={44}
                    style={styles.button}
                    onPress={() => { makeBubble(); openSettings(); }}
                >
                    <Text
                        style={[styles.text, { color: color.fourthBackground }]}
                    >
                        Edit
                    </Text>
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

export default LayoutGymTableHeader;
