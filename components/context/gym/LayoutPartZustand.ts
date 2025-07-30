import { storage } from "../CakaAppZustand";
import { Layout, LayoutItem } from "../ExerciseLayoutZustand";


export const createLayoutsZustand = (set: any, get: any) => ({
    layouts: JSON.parse(
        // storage?.getString("layouts") ||
        "[]") as Layout[],

    isReady: false,

    setReady: (isReady: boolean) => set({ isReady }),


    loadLayouts: () => {
        set({ layouts: JSON.parse(storage?.getString("layouts") || "[]") });
    },

    getLayout: (id: string) => get().layouts.find((l: Layout) => l.id === id),

    saveLayout: (layout: Layout) => {
        set((state: any) => {
            const existingRoutineIndex = state.layouts.findIndex((l: Layout) => l.id === layout.id);
            let updatedLayouts;
            if (existingRoutineIndex !== -1) {
                updatedLayouts = state.layouts.map((l: Layout) =>
                    l.id === layout.id ? { ...l, ...layout } : l
                );
            } else {
                updatedLayouts = [...state.layouts, layout];
            }
            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        })
    },

    updateLayoutOrder: (layoutId: Layout["id"], newOrder: LayoutItem[]) => {
        set((state: any) => {
            const existingLayout = state.layouts.find((l: Layout) => l.id === layoutId);
            if (!existingLayout) return {};

            const updatedLayout: Layout = {
                ...existingLayout,
                layout: newOrder,
            };

            const updatedLayouts = state.layouts.map((l: Layout) =>
                l.id === layoutId ? updatedLayout : l
            );

            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        });
    },

    removeLayout: (id: Layout["id"]) => {
        set((state: any) => {
            const updatedLayouts = state.layouts.filter((l: Layout) => l.id !== id);
            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        });
    },

});
