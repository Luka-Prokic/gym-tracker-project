import { Pressable, Swipeable } from "react-native-gesture-handler";
import useGymActions from "../hooks/useGymActions";
import { useExerciseLayout, GymExercise, SuperSet } from "../../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { View } from "react-native";
import { Sets } from "@/components/context/ExerciseZustand";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import SetCellInput from "../input/SetCellInput";
import DropSetCellInput from "../input/DropSetCellInput";
import SetCellIndex from "../input/SetCellIndex";
import DropSetCellIndex from "../input/DropSetCellIndex";
import DropSetCellDone from "../input/DropSetCellDone";
import SuperSetRowOptions from "./SuperSetRowOptions";
import DropSuperSetCellDone from "../input/DropSuperSetCellDone";
import SuperSetCellDone from "../input/SuperSetCellDone";

interface SuperSetRowGymRowProps {
    exerciseId: GymExercise["id"];
    supersetId: SuperSet["id"];
    index: any;
    set: Sets;
    startRest: () => void;
};


const SuperSetRow: React.FC<SuperSetRowGymRowProps> = ({ exerciseId, supersetId, index, set }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { columns, exercise, settingsVisible, openSettings, closeSettings } = useGymActions(exerciseId);
    const { restStatus } = useExerciseLayout();

    if (!exercise || !set)
        return null;

    const checked = set.rest !== 0 && set.rest ? true : false;
    const checkBackground = index % 2 === 1
        ?
        color.secondaryBackground
        :
        color.primaryBackground;

    const renderRightActions = () => (
        <SuperSetRowOptions
            exerciseId={exerciseId}
            supersetId={supersetId}
            index={index}
            set={set}
            closeSettings={closeSettings}
        />
    );

    return (
        <Swipeable
            key={`swipe-${index}-${checked}`}
            renderRightActions={() => renderRightActions()}
            onSwipeableOpenStartDrag={openSettings}
            onSwipeableClose={closeSettings}
        >
            <Pressable
                key={index}
                style={[
                    styles.row,
                    {
                        backgroundColor:
                            checked ? color.accent
                                : checkBackground
                    }
                ]}
                disabled={settingsVisible}
                pointerEvents={settingsVisible ? 'none' : 'auto'}
            >
                {columns.map((column) => {
                    if (column === "set")
                        return (
                            <SetCellIndex
                                key={`set-cell-${column}-${set.dropSets?.length}`}
                                index={index}
                                set={set}
                            />
                        );

                    if (column === "done")
                        return (
                            <SuperSetCellDone
                                key={`set-cell-${column}-${set.dropSets?.length}`}
                                exerciseId={exerciseId}
                                supersetId={supersetId}
                                index={index}
                                set={set}
                                disabled={restStatus.id !== "stopped" || settingsVisible}
                            />
                        );

                    if (columns.includes(column))
                        return (
                            <SetCellInput
                                key={`set-cell-${column}-${set.dropSets?.length}`}
                                exerciseId={exerciseId}
                                index={index}
                                set={set}
                                column={column}
                                disabled={!settingsVisible}
                            />
                        );
                })}
            </Pressable>
            {set.dropSets?.map((dropSet, dropSetIndex) => {
                return (
                    <View
                        key={`drop-set-row-${dropSetIndex}-${set.dropSets?.length}`}
                        style={[
                            styles.row,
                            {
                                backgroundColor: dropSetIndex % 2 === 1
                                    ?
                                    hexToRGBA(color.fourthBackground, 0.6)
                                    :
                                    color.fourthBackground,
                                height: 34, width: "100%"
                            }
                        ]}>
                        {columns.map((column) => {
                            if (column === "set")
                                return (
                                    <DropSetCellIndex
                                        key={`drop-set-cell-${column}-${dropSetIndex}-${set.dropSets?.length}`}
                                        index={dropSetIndex}
                                    />
                                );

                            if (column === "done")
                                return (
                                    <DropSuperSetCellDone
                                        key={`drop-set-cell-${column}-${dropSetIndex}-${set.dropSets?.length}`}
                                        exerciseId={exerciseId}
                                        supersetId={supersetId}
                                        setIndex={index}
                                        dropSetIndex={dropSetIndex}
                                        disabled={restStatus.id !== "stopped" || settingsVisible}
                                    />
                                );

                            if (column === "kg" || column === "reps")
                                return (
                                    <DropSetCellInput
                                        key={`drop-set-cell-${column}-${dropSetIndex}-${set.dropSets?.length}`}
                                        exerciseId={exerciseId}
                                        setIndex={index}
                                        dropSetIndex={dropSetIndex}
                                        dropSet={dropSet}
                                        column={column}
                                        disabled={!settingsVisible}
                                    />
                                );
                            return (
                                <View
                                    key={`fake-drop-set-cell-${column}-${set.dropSets?.length}`}
                                    style={styles.fakeCell}
                                />
                            );
                        })}
                    </View>
                )
            })}
        </Swipeable >
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
    fakeCell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 34,
    },
});

export default SuperSetRow;