import { defaultDropSet } from "@/constants/Defaults";
import { storage } from "../CakaAppZustand";
import { GymExercise, Layout, LayoutItem, SuperSet } from "../ExerciseLayoutZustand";
import { DropSets, Sets } from "../ExerciseZustand";
import { findExercise } from "../utils/GymUtils";

export const createGymDropSetZustand = (set: any, get: any) => ({

    addDropSet: (
        layoutId: Layout["id"],
        exId: GymExercise["id"],
        setIndex: number,
        newDropSet: DropSets = defaultDropSet
    ) => {
        set((state: any) => {
            // Staging-aware
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                if (currentStaging) {
                    const items = [...currentStaging.layout];
                    const found = findExercise(items, exId);
                    if (!found) return {};
                    const { parent, index, exercise } = found;
                    const newSets: Sets[] = (exercise.sets || []).map((s, idx) =>
                        idx === setIndex
                            ? { ...s, dropSets: [...(s.dropSets || []), newDropSet] }
                            : s
                    );
                    parent[index] = { ...exercise, sets: newSets };
                    newStagingLayouts.set(layoutId, { ...currentStaging, layout: items });
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found) return layout;
                const { parent, index, exercise } = found;
                const newSets: Sets[] = (exercise.sets || []).map((s, idx) =>
                    idx === setIndex
                        ? { ...s, dropSets: [...(s.dropSets || []), newDropSet] }
                        : s
                );
                parent[index] = { ...exercise, sets: newSets };
                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    removeDropSet: (
        layoutId: Layout["id"],
        exId: GymExercise["id"],
        setIndex: number,
        dropSetIndex: number
    ) => {
        set((state: any) => {
            // Staging-aware
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                if (currentStaging) {
                    const items = [...currentStaging.layout];
                    const found = findExercise(items, exId);
                    if (!found) return {};
                    const { parent, index, exercise } = found;
                    const newSets: Sets[] = (exercise.sets || []).map((s, idx) => {
                        if (idx !== setIndex) return s;
                        return {
                            ...s,
                            dropSets: (s.dropSets || []).filter((_, di) => di !== dropSetIndex),
                        };
                    });
                    parent[index] = { ...exercise, sets: newSets };
                    newStagingLayouts.set(layoutId, { ...currentStaging, layout: items });
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found) return layout;
                const { parent, index, exercise } = found;
                const newSets: Sets[] = (exercise.sets || []).map((s, idx) => {
                    if (idx !== setIndex) return s;
                    return {
                        ...s,
                        dropSets: (s.dropSets || []).filter((_, di) => di !== dropSetIndex),
                    };
                });
                parent[index] = { ...exercise, sets: newSets };
                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    updateDropColumn: (
        layoutId: Layout["id"],
        exId: GymExercise["id"],
        setIndex: number,
        dropSetIndex: number,
        column: keyof DropSets,
        value: DropSets[typeof column]
    ) => {
        set((state: any) => {
            // Staging-aware
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                if (currentStaging) {
                    const items = [...currentStaging.layout];
                    const found = findExercise(items, exId);
                    if (!found) return {};
                    const { parent, index, exercise } = found;
                    const newSets: Sets[] = (exercise.sets || []).map((s, idx) => {
                        if (idx !== setIndex) return s;
                        const newDropSets = (s.dropSets || []).map((ds, di) =>
                            di === dropSetIndex ? { ...ds, [column]: value } : ds
                        );
                        return { ...s, dropSets: newDropSets };
                    });
                    parent[index] = { ...exercise, sets: newSets };
                    newStagingLayouts.set(layoutId, { ...currentStaging, layout: items });
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found) return layout;
                const { parent, index, exercise } = found;
                const newSets: Sets[] = (exercise.sets || []).map((s, idx) => {
                    if (idx !== setIndex) return s;
                    const newDropSets = (s.dropSets || []).map((ds, di) =>
                        di === dropSetIndex ? { ...ds, [column]: value } : ds
                    );
                    return { ...s, dropSets: newDropSets };
                });
                parent[index] = { ...exercise, sets: newSets };
                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

});