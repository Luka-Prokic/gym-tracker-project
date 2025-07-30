import React from "react";
import { SuperSet, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import GymNotes from "../../text/GymNotes";
import { useRoutine } from "@/components/context/RoutineZustand";
import { Animated, StyleSheet, View } from "react-native";
import SuperSetAddRowButton from "./SuperSetAddRowButton";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";
import SuperSetTableHeader from "./SuperSetTableHeader";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import { isCardioExercise, isGymExercise } from "@/components/context/utils/GymUtils";
import CardioTable from "../cardio_table/CardioTable";
import GymTable from "../gym_table/GymTable";

interface SuperSetTableProps {
    supersetId: SuperSet["id"];
}

export const SuperSetTable: React.FC<SuperSetTableProps> = ({ supersetId }) => {
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

            <SuperSetTableHeader supersetId={supersetId} />

            {ss.layout.map((ex: any, index: number) => {
                const commonProps = {
                    key: `subtable-${ss.layout.length}-${index}`,
                    exerciseId: ex.id,
                    supersetId: supersetId,
                };
                if (isGymExercise(ex)) return <GymTable {...commonProps} />
                if (isCardioExercise(ex)) return <CardioTable {...commonProps} />
                return null;
            })}

            <SuperSetAddRowButton supersetId={supersetId} layoutId={activeRoutine.layoutId} />

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