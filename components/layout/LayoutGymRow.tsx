import { Pressable, Swipeable } from "react-native-gesture-handler";
import useLayoutGymActions from "./hooks/useLayoutGymActions";
import { useExerciseLayout, GymExercise } from "../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { View } from "react-native";
import { Sets } from "../context/ExerciseZustand";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import LayoutSetCellInput from "./LayoutSetCellInput";
import LayoutDropSetCellInput from "./LayoutDropSetCellInput";
import LayoutSetCellIndex from "./LayoutSetCellIndex";
import LayoutDropSetCellIndex from "./LayoutDropSetCellIndex";
import LayoutGymRowOptions from "./LayoutGymRowOptions";

interface LayoutGymRowProps {
    exerciseId: GymExercise["id"];
    index: any;
    set: Sets;
};

const LayoutGymRow: React.FC<LayoutGymRowProps> = ({ exerciseId, index, set }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { columns, exercise, settingsVisible, openSettings, closeSettings } = useLayoutGymActions(exerciseId);

    if (!exercise || !set)
        return null;

    const checked = set.rest !== 0 && set.rest ? true : false;
    const checkBackground = index % 2 === 1
        ?
        color.secondaryBackground
        :
        color.primaryBackground;

    const renderRightActions = () => (
        <LayoutGymRowOptions
            exerciseId={exerciseId}
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
                            <LayoutSetCellIndex
                                key={`set-cell-${column}-${set.dropSets?.length}`}
                                index={index}
                                set={set}
                            />
                        );

                    if (columns.includes(column))
                        return (
                            <LayoutSetCellInput
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
                                    <LayoutDropSetCellIndex
                                        key={`drop-set-cell-${column}-${dropSetIndex}-${set.dropSets?.length}`}
                                        index={dropSetIndex}
                                    />
                                );

                            if (column === "kg" || column === "reps")
                                return (
                                    <LayoutDropSetCellInput
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

export default LayoutGymRow;
