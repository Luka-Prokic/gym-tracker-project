import { Pressable, Swipeable } from "react-native-gesture-handler";
import useLayoutGymActions from "./hooks/useLayoutGymActions";
import { useExerciseLayout, GymExercise, SuperSet } from "../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { View } from "react-native";
import { Sets } from "../context/ExerciseZustand";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import LayoutSetCellInput from "./LayoutSetCellInput";
import LayoutSetCellIndex from "./LayoutSetCellIndex";
import LayoutGymRowOptions from "./LayoutGymRowOptions";

interface LayoutSuperSetRowProps {
    exerciseId: GymExercise["id"];
    supersetId: SuperSet["id"];
    index: any;
    set: Sets;
}

const LayoutSuperSetRow: React.FC<LayoutSuperSetRowProps> = ({ exerciseId, index, set }) => {
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
        </Swipeable >
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
});

export default LayoutSuperSetRow;
