import { defaultSet } from "@/constants/Defaults";
import { storage } from "../CakaAppZustand";
import { GymExercise, Layout } from "../ExerciseLayoutZustand";
import { findExercise, isGymExercise } from "../utils/GymUtils";
import { Sets } from "../ExerciseZustand";

export const createGymRestZustand = (set: any, get: any) => ({
    addSet: (
        layoutId: Layout["id"],
        exId: GymExercise["id"],
        newSet: Sets = defaultSet
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found || !isGymExercise(found.exercise)) return layout;

                const { parent, index, exercise } = found;
                const updatedExercise: GymExercise = {
                    ...exercise,
                    sets: [...(exercise.sets || []), newSet],
                };
                parent[index] = updatedExercise;

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    removeSet: (
        layoutId: Layout["id"],
        exId: GymExercise["id"],
        setIndex: number
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found || !isGymExercise(found.exercise)) return layout;

                const { parent, index, exercise } = found;
                const updatedSets = (exercise.sets || []).filter((_, i) => i !== setIndex);
                parent[index] = { ...exercise, sets: updatedSets };

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    updateSet: (
        layoutId: Layout["id"],
        exId: GymExercise["id"],
        setIndex: number,
        updatedSet: Sets
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found || !isGymExercise(found.exercise)) return layout;

                const { parent, index, exercise } = found;
                const newSets = (exercise.sets || []).map((s, i) =>
                    i === setIndex ? { ...s, ...updatedSet } : s
                );
                parent[index] = { ...exercise, sets: newSets };

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    updateColumn: <K extends keyof Sets>(
        layoutId: Layout["id"],
        exId: GymExercise["id"],
        setIndex: number,
        column: K,
        value: Sets[K]
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found || !isGymExercise(found.exercise)) return layout;

                const { parent, index, exercise } = found;
                const updatedSets = (exercise.sets || []).map((s, i) =>
                    i === setIndex ? { ...s, [column]: value } : s
                );
                parent[index] = { ...exercise, sets: updatedSets };

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    getSets: (layoutId: Layout["id"], exId: GymExercise["id"]) => {
        const layout = get().getLayout(layoutId);
        if (!layout) return undefined;
        const found = findExercise(layout.layout, exId);
        if (!found || !isGymExercise(found.exercise))
            return undefined;
        return found?.exercise.sets;
    },
});