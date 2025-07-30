import { useState } from "react";
import { BodypartType, EquipmentType, useExercise, Exercise } from "@/components/context/ExerciseZustand";
import { useExerciseLayout, Layout } from "@/components/context/ExerciseLayoutZustand";
import { useNavigation } from "@react-navigation/native";

export type EquipmentFilterType = EquipmentType | "All Equipment";
export type BodypartFilterType = BodypartType | "All Muscles";

export const useGymAddExerciseActions = (layoutId: Layout["id"]) => {
    const { exercises, getExercise } = useExercise();
    const { addGymExercise, addCardioExercise, createSuperSet, addToSuperSet } = useExerciseLayout();
    const navigation = useNavigation();

    const [muscle, setMuscle] = useState<BodypartFilterType>("All Muscles");
    const [equipment, setEquipment] = useState<EquipmentFilterType>("All Equipment");
    const [search, setSearch] = useState("");

    const [newExercises, setExercises] = useState<Exercise[]>([]);

    const toggleExerciseSelection = (exId: Exercise["id"]) => {
        const ex = getExercise(exId);
        if (!ex) return;

        setExercises((prev) => {
            const exists = prev.some((e) => e.id === ex.id);
            return exists ? prev.filter((e) => e.id !== ex.id) : [...prev, ex];
        });
    };

    const handleFin = async () => {
        await Promise.all(newExercises.map((ex) => {
            if (ex.kind === "gym")
                return addGymExercise(layoutId, ex.id);
            if (ex.kind === "cardio")
                return addCardioExercise(layoutId, ex.id);
        }
        ));
        navigation.goBack();
    };

    const handleSuperFin = async () => {

        const newSsElements = await Promise.all(
            newExercises.map((ex) => {
                if (ex.kind === "gym")
                    return addGymExercise(layoutId, ex.id);
                if (ex.kind === "cardio")
                    return addCardioExercise(layoutId, ex.id);
                return "";
            })
        );

        const ssId = createSuperSet(layoutId);

        await Promise.all(newSsElements.map((exId) => addToSuperSet(layoutId, ssId, exId)));

        navigation.goBack();
    };

    const filteredExercisesList = exercises.filter((exercise) => {
        const matchesMuscle = muscle === "All Muscles" || exercise.bodypart === muscle;
        const matchesEquipment = equipment === "All Equipment" || exercise.equipment === equipment;

        const searchLower = search.trim().toLowerCase();
        const combinedSearchString = `${exercise.name} ${exercise.equipment} ${exercise.bodypart}  ${exercise.kind}`.toLowerCase();
        const matchesSearch = combinedSearchString.includes(searchLower);

        return matchesMuscle && matchesEquipment && matchesSearch;
    });

    return {
        muscle,
        setMuscle,
        equipment,
        setEquipment,
        search,
        setSearch,
        filteredExercisesList,
        toggleExerciseSelection,
        newExercises,
        handleFin,
        handleSuperFin
    };
};