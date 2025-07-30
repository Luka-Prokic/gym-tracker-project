import { Layout, LayoutItem, SuperSet, GymExercise, CardioExercise } from "../ExerciseLayoutZustand";
import { storage } from "../CakaAppZustand";
import { findAndUpdate, findExercise } from "../utils/GymUtils";

export const createLabelsZustand = (set: any, get: any) => ({

    updateItemNote: (
        layoutId: Layout["id"],
        itemId: LayoutItem["id"],
        note: string
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;
                const newLayout = findAndUpdate(layout.layout, itemId, node => ({
                    ...node,
                    note,
                }));
                return { ...layout, layout: newLayout };
            });
            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    updateSuperSetName: (
        layoutId: Layout["id"],
        supersetId: SuperSet["id"],
        name: string
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;
                const newLayout = findAndUpdate(layout.layout, supersetId, node => {
                    if ("layout" in node && node.settings.supersetType) {
                        return { ...(node as SuperSet), name };
                    }
                    return node;
                });
                return { ...layout, layout: newLayout };
            });
            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    updateItemPrefix: (
        layoutId: Layout["id"],
        itemId: GymExercise["id"] | CardioExercise["id"],
        prefix: string
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;
                const newLayout = findAndUpdate(layout.layout, itemId, node => {
                    if (node.type === "gym" || node.type === "cardio") {
                        return { ...(node as GymExercise | CardioExercise), prefix };
                    }
                    return node;
                });
                return { ...layout, layout: newLayout };
            });
            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    getItemNote: (
        layoutId: Layout["id"],
        itemId: LayoutItem["id"]
    ): string | undefined => {
        const layout = get().layouts.find((l: Layout) => l.id === layoutId);
        if (!layout) return undefined;
        const found = findExercise(layout.layout, itemId);
        return found?.exercise.note;
    },
});