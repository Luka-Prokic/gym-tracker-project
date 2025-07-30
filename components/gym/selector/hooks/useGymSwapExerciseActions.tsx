import { useState } from "react";
import { BODYPART_LIST, BodypartType, EquipmentType, useExercise } from "@/components/context/ExerciseZustand";
import { useExerciseLayout } from "@/components/context/ExerciseLayoutZustand";
import { Layout, GymExercise } from "@/components/context/ExerciseLayoutZustand";
import { Exercise } from "@/components/context/ExerciseZustand";
import { useNavigation } from "@react-navigation/native";

export type EquipmentFilterType = EquipmentType | "All Equipment";
export type BodypartFilterType = BodypartType | "All Muscles";

export const useGymSwapExerciseActions = (layoutId: Layout["id"], exId: GymExercise["id"]) => {
    const { exercises, getExercise } = useExercise();
    const { swapExercise, getGymExercise } = useExerciseLayout();
    const navigation = useNavigation();

    const [muscle, setMuscle] = useState<BodypartFilterType>("All Muscles");
    const [equipment, setEquipment] = useState<EquipmentFilterType>("All Equipment");
    const [search, setSearch] = useState("");

    const oldExerciseId = getGymExercise(layoutId, exId)?.exId;
    const oldExerciseKind = getExercise(oldExerciseId ?? "")?.kind;

    const handleSwapExercise = (id: Exercise["id"]) => {
        const ex = getExercise(id);
        const oldEx = getExercise(oldExerciseId ?? "");
        if (!ex) return null;
        if (oldEx?.kind === ex.kind) {
            swapExercise(layoutId, exId, ex.id);
        }
        navigation.goBack();
    };

    const filteredExercisesList = exercises.filter((exercise) => {
        if (!oldExerciseKind) return false;

        const matchesKind = exercise.kind === oldExerciseKind;
        const matchesMuscle = muscle === "All Muscles" || exercise.bodypart === muscle;
        const matchesEquipment = equipment === "All Equipment" || exercise.equipment === equipment;

        const searchLower = search.trim().toLowerCase();
        const combinedSearchString = `${exercise.name} ${exercise.equipment} ${exercise.bodypart} ${exercise.kind}`.toLowerCase();
        const matchesSearch = combinedSearchString.includes(searchLower);

        return matchesKind && matchesMuscle && matchesEquipment && matchesSearch;
    });


    return {
        muscle,
        setMuscle,
        equipment,
        setEquipment,
        search,
        setSearch,
        filteredExercisesList,
        handleSwapExercise,
        oldExerciseId
    };
};