import { Text, View } from "react-native";
import IBubble, { IBubbleSize } from "../bubbles/IBubble";
import IButton from "../buttons/IButton";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { StyleSheet } from "react-native";
import { SuperSet, useExerciseLayout } from "../context/ExerciseLayoutZustand";
import Container from "@/components/containers/Container";
import LayoutSuperRestSettings from "./LayoutSuperRestSettings";
import LayoutSuperSetModeButton from "./LayoutSuperSetModeButton";
import LayoutSuperSetSettings from "./LayoutSuperSetSettings";
import { useRoutine } from "@/components/context/RoutineZustand";

interface LayoutSuperSetTableHeaderProps {
    supersetId: SuperSet["id"];
}

const LayoutSuperSetTableHeader: React.FC<LayoutSuperSetTableHeaderProps> = ({ supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bubbleRef, top, left, height, width, makeBubble, bubbleVisible, popBubble } = useBubbleLayout();
    const {
        getSuperSet,
    } = useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const layoutId = activeRoutine.layoutId;

    const ss = getSuperSet(layoutId, supersetId)

    if (!ss)
        return null;

    return (
        <Container style={{ marginBottom: 16 }} width={"90%"} direction="row" >

            <IBubble
                visible={bubbleVisible}
                onClose={popBubble}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.large}
            >
                <LayoutSuperSetSettings supersetId={supersetId} onClose={popBubble} />
            </IBubble>


            <View style={{ flex: 3, alignItems: "flex-start" }} >
                <Text
                    style={[styles.title, { color: color.accent }]}
                    numberOfLines={2}
                >
                    {ss.name}
                </Text>
                <LayoutSuperRestSettings supersetId={supersetId} />
            </View>
            <View style={{ flex: 2, alignItems: "flex-end" }} >
                <IButton
                    height={44} width={44}
                    style={styles.button}
                    onPress={makeBubble}
                >
                    <View ref={bubbleRef}>
                        <Text
                            style={[styles.text, { color: color.text }]}
                        >
                            Edit
                        </Text>
                    </View>
                </IButton>
                <LayoutSuperSetModeButton supersetId={supersetId} />
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
    button: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    text: {
        fontWeight: "bold",
        fontSize: 18,
        padding: 4,
    },
});

export default LayoutSuperSetTableHeader;
