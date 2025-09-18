import React from "react";
import { SuperSet, useExerciseLayout } from "../context/ExerciseLayoutZustand";
import GymNotes from "../text/GymNotes";
import { useRoutine } from "@/components/context/RoutineZustand";
import { Animated, StyleSheet, View } from "react-native";
import LayoutSuperSetAddRowButton from "./LayoutSuperSetAddRowButton";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";
import LayoutSuperSetTableHeader from "./LayoutSuperSetTableHeader";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import { isCardioExercise, isGymExercise } from "@/components/context/utils/GymUtils";
import LayoutCardioTable from "./LayoutCardioTable";
import LayoutGymTable from "./LayoutGymTable";

interface LayoutSuperSetTableProps {
    supersetId: SuperSet["id"];
}

export const LayoutSuperSetTable: React.FC<LayoutSuperSetTableProps> = ({ supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getSuperSet } = useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const { fadeIn } = useFadeInAnim();

    const ss = getSuperSet(activeRoutine.layoutId, supersetId)

    if (!ss || !ss.layout.length)
        return null;

    return (
        <Animated.View key={`tablesuper-${ss.layout.length}`}
            style={[
                {
                    backgroundColor: hexToRGBA(color.fourthBackground, .2),
                    shadowColor: color.shadow,
                    borderColor: color.border,
                },
                styles.superset, fadeIn]}
        >

            <LayoutSuperSetTableHeader supersetId={supersetId} />

            {ss.layout.map((ex: any, index: number) => {
                const commonProps = {
                    exerciseId: ex.id,
                    supersetId: supersetId,
                };
                if (isGymExercise(ex)) return <LayoutGymTable key={`subtable-${ss.layout.length}-${index}`} {...commonProps} />
                if (isCardioExercise(ex)) return <LayoutCardioTable key={`subtable-${ss.layout.length}-${index}`} {...commonProps} />
                return null;
            })}

            <LayoutSuperSetAddRowButton supersetId={supersetId} layoutId={activeRoutine.layoutId} />

            {ss.settings.noNote ? null : <GymNotes
                elementId={supersetId}
                style={{ marginTop: 16, width: "90%", marginHorizontal: "5%" }}
            />}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    superset: {
        flex: 1,
        paddingBottom: 16,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
    },
});

export default LayoutSuperSetTable;