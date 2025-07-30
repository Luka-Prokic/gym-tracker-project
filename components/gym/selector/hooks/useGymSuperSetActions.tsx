import { useState } from "react";
import { BodypartType, EquipmentType, useExercise, Exercise } from "@/components/context/ExerciseZustand";
import { useExerciseLayout, Layout, SuperSet } from "@/components/context/ExerciseLayoutZustand";
import { useNavigation } from "@react-navigation/native";

export type EquipmentFilterType = EquipmentType | "All Equipment";
export type BodypartFilterType = BodypartType | "All Muscles";

export const useGymSuperSetActions = (layoutId: Layout["id"], exId?: string, supersetId?: SuperSet["id"]) => {
    const { exercises, getExercise } = useExercise();
    const {
        addGymExercise, getSuperSet, getGymExercise, addToSuperSet,
        createSuperSet, removeFromSuperSet, removeSuperSet, addCardioExercise
    } = useExerciseLayout();
    const navigation = useNavigation();

    const [muscle, setMuscle] = useState<BodypartFilterType>("All Muscles");
    const [equipment, setEquipment] = useState<EquipmentFilterType>("All Equipment");
    const [search, setSearch] = useState("");

    const [removedSet, setRemovedSet] = useState<string[]>([]);
    const [layoutSet, setLayoutSet] = useState<string[]>([]);

    const [oldSet, setOldSet] = useState<Exercise[]>(() => {
        if (supersetId) {
            return getSuperSet(layoutId, supersetId).layout;
        }
        if (exId) {
            const gymEx = getGymExercise(layoutId, exId);
            return gymEx ? [gymEx] : [];
        }
        return [];
    });

    const [newSet, setNewSet] = useState<Exercise[]>([]);

    const toggleOldSelection = (exId: string) => {
        setRemovedSet(prev =>
            prev.includes(exId)
                ? prev.filter(id => id !== exId)
                : [...prev, exId]
        );
    };

    const toggleLayoutSelection = (exId: string) => {
        setLayoutSet(prev =>
            prev.includes(exId)
                ? prev.filter(id => id !== exId)
                : [...prev, exId]
        );
    };

    const toggleExerciseSelection = (exId: Exercise["id"]) => {
        const ex = getExercise(exId);
        if (!ex) return;

        setNewSet((prev) => {
            const exists = prev.some((e) => e.id === ex.id);
            return exists ? prev.filter((e) => e.id !== ex.id) : [...prev, ex];
        });
    };



    const handleFin = async () => {

        if (newSet.length) {
            const newSsElements = await Promise.all(
                newSet.map((ex) => {
                    if (ex.kind === "gym")
                        return addGymExercise(layoutId, ex.id);
                    if (ex.kind === "cardio")
                        return addCardioExercise(layoutId, ex.id);
                    return "";
                })
            );

            const targetSsId = supersetId ?? createSuperSet(layoutId);

            if (exId)
                addToSuperSet(layoutId, targetSsId, exId);

            await Promise.all(newSsElements.map(exId => addToSuperSet(layoutId, targetSsId, exId)));

        }
        if (layoutSet.length) {
            const targetSsId = supersetId ?? createSuperSet(layoutId);

            if (exId)
                addToSuperSet(layoutId, targetSsId, exId);

            await Promise.all(layoutSet.map(exId => addToSuperSet(layoutId, targetSsId, exId)));

        }

        if (supersetId) {
            await Promise.all(
                removedSet.map(exId => removeFromSuperSet(layoutId, supersetId, exId))
            );
            if (oldSet.length === removedSet.length)
                removeSuperSet(layoutId, supersetId);
        }

        navigation.goBack();
    };



    const filteredExercisesList = exercises.filter((exercise) => {
        const matchesMuscle = muscle === "All Muscles" || exercise.bodypart === muscle;
        const matchesEquipment = equipment === "All Equipment" || exercise.equipment === equipment;

        const searchLower = search.trim().toLowerCase();
        const combinedSearchString = `${exercise.name} ${exercise.equipment} ${exercise.bodypart}`.toLowerCase();
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
        toggleOldSelection,
        toggleLayoutSelection,
        oldSet,
        newSet,
        removedSet,
        layoutSet,
        handleFin
    };
};