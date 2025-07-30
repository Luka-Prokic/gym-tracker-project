import { defaultInterval } from "@/constants/Defaults";
import { storage } from "../CakaAppZustand";
import { CardioExercise, Layout, CardioValues } from "../ExerciseLayoutZustand";
import { findExercise, isCardioExercise } from "../utils/GymUtils";

export const createCardioIntervalsZustand = (set: any, get: any) => ({
    addInterval: (
        layoutId: Layout["id"],
        exId: CardioExercise["id"],
        newInterval: CardioValues = defaultInterval
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found || !isCardioExercise(found.exercise)) return layout;

                const { parent, index, exercise } = found;
                const updatedExercise: CardioExercise = {
                    ...exercise,
                    intervals: [...(exercise.intervals || []), newInterval],
                };
                parent[index] = updatedExercise;

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    removeInterval: (
        layoutId: Layout["id"],
        exId: CardioExercise["id"],
        intervalIndex: number
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found || !isCardioExercise(found.exercise)) return layout;

                const { parent, index, exercise } = found;
                const updatedIntervals = (exercise.intervals || []).filter((_, i) => i !== intervalIndex);
                parent[index] = { ...exercise, intervals: updatedIntervals };

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    updateInterval: (
        layoutId: Layout["id"],
        exId: CardioExercise["id"],
        intervalIndex: number,
        updatedInterval: CardioValues
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found || !isCardioExercise(found.exercise)) return layout;

                const { parent, index, exercise } = found;
                const newIntervals = (exercise.intervals || []).map((interval, i) =>
                    i === intervalIndex ? updatedInterval : interval
                );
                parent[index] = { ...exercise, intervals: newIntervals };

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    updateIntervalField: <K extends keyof CardioValues>(
        layoutId: Layout["id"],
        exId: CardioExercise["id"],
        intervalIndex: number,
        field: K,
        value: CardioValues[K] | string | undefined
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found || !isCardioExercise(found.exercise)) return layout;

                const { parent, index, exercise } = found;
                const updatedIntervals = (exercise.intervals || []).map((interval, i) =>
                    i === intervalIndex ? { ...interval, [field]: value } : interval
                );
                parent[index] = { ...exercise, intervals: updatedIntervals };

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    getIntervals: (layoutId: Layout["id"], exId: CardioExercise["id"]) => {
        const layout = get().getLayout(layoutId);
        if (!layout) return undefined;
        const found = findExercise(layout.layout, exId);
        if (!found || !isCardioExercise(found.exercise))
            return undefined;
        return found?.exercise.intervals;
    },
});