import { Pressable } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { useExerciseLayout, CardioExercise, SuperSet, LayoutItem } from "../../context/ExerciseLayoutZustand";
import useCardioActions from "../hooks/useCardioActions";
import { Ionicons } from "@expo/vector-icons";
import useBubbleLayout from "@/components/bubbles/hooks/useBubbleLayout";
import { View } from "react-native";
import { CardioColumnList } from "./CardioColumnList";
import ISlide from "@/components/bubbles/ISlide";
import { IntervalSwapList } from "./IntervalSwapList";
import BounceButton from "@/components/buttons/BounceButton";
import { isCardioExercise, isGymExercise } from "@/components/context/utils/GymUtils";

interface SubRowProps {
    supersetId: SuperSet["id"];
    exerciseId: CardioExercise["id"];
    intervalIndex: number;
    setIndex: (index: number) => void;
    disabled?: boolean;
};

const ROW_HEIGHT = 34;

const SubRow: React.FC<SubRowProps> = ({ supersetId, exerciseId, intervalIndex, setIndex, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { exercise, layoutId } = useCardioActions(exerciseId);
    const { removeInterval, addRest, startRest, getSuperSet, removeSet, restStatus } = useExerciseLayout();
    const { bubbleVisible, popBubble, makeBubble } = useBubbleLayout();
    const { settingsVisible, openSettings, closeSettings } = useCardioActions(exerciseId);


    if (!exercise || !exercise.intervals || !exercise.intervals[intervalIndex]) return null;

    const ss = getSuperSet(layoutId, supersetId);
    const mode = ss.settings.supersetType;

    if (!ss || restStatus.id === ss.layout[ss.layout.length - 1].id || mode === "default")
        return null;

    const interval = exercise.intervals[intervalIndex];

    const handleRemoveInterval = () => {
        if (intervalIndex === (exercise.intervals?.length ? exercise.intervals?.length - 1 : 0))
            setIndex(intervalIndex - 1)
        if (mode === "circuit") {
            ss.layout.map((ex: LayoutItem) => {
                if (isGymExercise(ex)) return removeSet(layoutId, ex.id, intervalIndex)
                if (isCardioExercise(ex)) return removeInterval(layoutId, ex.id, intervalIndex)
            });
        } else {
            return removeInterval(layoutId, exerciseId, intervalIndex)
        }
    };

    const toggleCheck = () => {
        if (exercise.intervals && (exercise.intervals[intervalIndex].rest === 0)) {
            checkIt();
            // unCheck();
        } else
            unCheck();
    };

    const checkIt = () => {
        if (mode === "circuit") {
            if (!ss.settings?.noRest) {
                startRest(ss.layout[ss.layout.length - 1].id, intervalIndex, ss.restLength ?? 120);
            }
            ss.layout.map((ex: LayoutItem) => addRest(layoutId, ex.id, intervalIndex, 1));
        } else
            if (exercise.settings?.noRest) {
                addRest(layoutId, exerciseId, intervalIndex, 1);
            } else {
                startRest(exerciseId, intervalIndex, exercise.restLength ?? 120)
            }

    };

    const unCheck = () => {
        if (mode === "circuit") {
            ss.layout.map((ex: LayoutItem) => addRest(layoutId, ex.id, intervalIndex, 0));
        } else {
            addRest(layoutId, exerciseId, intervalIndex, 0);
        }
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
                disabled={true}
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

export default SubRow;