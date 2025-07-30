import { Pressable } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { useExerciseLayout, CardioExercise } from "../../context/ExerciseLayoutZustand";
import useCardioActions from "../hooks/useCardioActions";
import { Ionicons } from "@expo/vector-icons";
import IButton from "@/components/buttons/IButton";
import useBubbleLayout from "@/components/bubbles/hooks/useBubbleLayout";
import { View } from "react-native";
import { CardioColumnList } from "./CardioColumnList";
import ISlide from "@/components/bubbles/ISlide";
import { IntervalSwapList } from "./IntervalSwapList";
import BounceButton from "@/components/buttons/BounceButton";

interface IntervalRowProps {
    exerciseId: CardioExercise["id"];
    intervalIndex: number;
    setIndex: (index: number) => void;
    disabled?: boolean;
};

const ROW_HEIGHT = 34;

const IntervalRow: React.FC<IntervalRowProps> = ({ exerciseId, intervalIndex, setIndex, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { exercise, layoutId } = useCardioActions(exerciseId);
    const { removeInterval, addInterval, addRest, startRest, restStatus } = useExerciseLayout();
    const { bubbleVisible, popBubble, makeBubble } = useBubbleLayout();
    const { settingsVisible, openSettings, closeSettings } = useCardioActions(exerciseId);


    if (!exercise || !exercise.intervals || !exercise.intervals[intervalIndex]) return null;

    const interval = exercise.intervals[intervalIndex];

    const handleRemoveInterval = () => {
        if (intervalIndex === (exercise.intervals?.length ? exercise.intervals?.length - 1 : 0))
            setIndex(intervalIndex - 1)
        removeInterval(layoutId, exerciseId, intervalIndex);
    };

    const handleCloneInterval = () => {
        const cloneInterval = { ...interval, rest: 0, label: "" }
        addInterval(layoutId, exerciseId, cloneInterval);
    };

    const toggleCheck = () => {
        if (exercise.settings?.noRest) {
            addRest(layoutId, exerciseId, intervalIndex, 1);
        } else
            startRest(exerciseId, intervalIndex, exercise.restLength ?? 120)
    };

    return (
        <Pressable
            style={[
                {
                    flexDirection: "row",
                    backgroundColor: color.background,
                    height: ROW_HEIGHT,
                    alignItems: "center",
                }
            ]}
        >

            <ISlide
                visible={settingsVisible}
                onClose={closeSettings}
                size="large"
            >
                <CardioColumnList exerciseId={exerciseId} />
            </ISlide>

            <ISlide
                visible={bubbleVisible}
                onClose={popBubble}
                size="large"
            >
                <IntervalSwapList exerciseId={exerciseId} />
            </ISlide>

            <BounceButton
                width={"20%"} height={ROW_HEIGHT}
                onPress={handleRemoveInterval}
                disabled={disabled}
            >
                <Ionicons
                    name="remove-circle"
                    size={24}
                    color={color.error}
                />
            </BounceButton>

            <BounceButton
                width={"20%"} height={ROW_HEIGHT}
                onPress={handleCloneInterval}
                disabled={disabled}
            >
                <Ionicons
                    name="add-circle"
                    size={24}
                    color={color.tint}
                />
            </BounceButton>

            <BounceButton
                width={"20%"} height={ROW_HEIGHT}
                onPress={makeBubble}
                disabled={disabled}
            >
                <View
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: color.fifthBackground,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={14}
                        color={color.background}
                    />
                </View>
            </BounceButton>
            <BounceButton
                width={"20%"} height={ROW_HEIGHT}
                onPress={openSettings}
                disabled={disabled}
            >
                <Ionicons
                    name="filter-circle"
                    size={24}
                    color={color.grayText}
                />
            </BounceButton>

            {interval.rest ?
                <BounceButton
                    width={"20%"} height={ROW_HEIGHT}
                    onPress={() => addRest(layoutId, exerciseId, intervalIndex, 0)}
                >
                    <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={color.accent}
                    />
                </BounceButton>
                :
                <BounceButton
                    width={"20%"} height={ROW_HEIGHT}
                    onPress={toggleCheck}
                    disabled={restStatus.id !== "stopped" || disabled}
                >
                    <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={color.grayText}
                    />
                </BounceButton>
            }

        </Pressable >

    );
};

export default IntervalRow;