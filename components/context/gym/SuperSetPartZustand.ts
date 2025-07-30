import { storage } from "../CakaAppZustand";
import { CardioExercise, GymExercise, Layout, LayoutItem, SuperSet, SuperSetSettings } from "../ExerciseLayoutZustand";
import { isGymExercise, isSuperSet, makeId } from "../utils/GymUtils";

export const createSuperSetZustand = (set: any, get: any) => ({


    createSuperSet: (layoutId: Layout["id"]) => {
        const newSsId = makeId("ssil");
        set((state: any) => {
            const newLayouts = state.layouts.map((l: Layout) =>
                l.id === layoutId
                    ? {
                        ...l,
                        layout: [
                            ...l.layout,
                            {
                                id: newSsId,
                                type: "superset",
                                layout: [],
                                restLength: 120,
                                settings: {
                                    supersetType: "default",
                                    noRest: false,
                                },
                                name: "Super Set",
                            } as SuperSet
                        ]
                    }
                    : l
            );
            storage?.set("layouts", JSON.stringify(newLayouts));
            return { layouts: newLayouts };
        });
        return newSsId;
    },

    addToSuperSet: (layoutId: Layout['id'], superSetId: SuperSet["id"], exId: GymExercise["id"] | CardioExercise["id"]) => {
        set((state: any) => {
            let moved: LayoutItem | undefined;

            const layoutsAfterRemoval = state.layouts.map((l: Layout) => {
                if (l.id !== layoutId) return l;

                const newItems = l.layout.flatMap((item: LayoutItem) => {
                    if (item.type === "superset") {
                        const ss = item as SuperSet;
                        const idx = ss.layout.findIndex(ex => ex.id === exId);
                        if (idx !== -1) {
                            moved = ss.layout[idx];
                            return [{ ...ss, layout: ss.layout.filter(ex => ex.id !== exId) }];
                        }
                        return [item];
                    }

                    if (item.id === exId) {
                        if (isGymExercise(item))
                            moved = item as GymExercise;
                        else
                            moved = item as CardioExercise;
                        return [];
                    }

                    return [item];
                });

                return { ...l, layout: newItems };
            });

            if (!moved) return { layouts: layoutsAfterRemoval };

            const finalLayouts = layoutsAfterRemoval.map((l: Layout) => {
                if (l.id !== layoutId) return l;

                const newItems = l.layout.map((item: LayoutItem) => {
                    if (item.type === "superset" && item.id === superSetId) {
                        const ss = item as SuperSet;
                        return { ...ss, layout: [...ss.layout, moved!] };
                    }
                    return item;
                });

                return { ...l, layout: newItems };
            });

            storage?.set("layouts", JSON.stringify(finalLayouts));
            return { layouts: finalLayouts };
        });
    },

    removeFromSuperSet: (layoutId: Layout["id"], superSetId: SuperSet["id"], exId: GymExercise["id"]) => {
        set((state: any) => {
            let removedExercise: LayoutItem | undefined;

            const updatedLayouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const newLayout = layout.layout.flatMap((item: LayoutItem) => {
                    if (item.type === "superset" && item.id === superSetId) {
                        const ss = item as SuperSet;
                        const index = ss.layout.findIndex(ex => ex.id === exId);
                        if (index !== -1) {
                            removedExercise = ss.layout[index];
                            const newSsLayout = ss.layout.filter(ex => ex.id !== exId);
                            return [{ ...ss, layout: newSsLayout }];
                        }
                        return [item];
                    }

                    return [item];
                });

                if (removedExercise) {
                    newLayout.push(removedExercise);
                }

                return { ...layout, layout: newLayout };
            });

            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        });
    },

    removeSuperSet: (layoutId: Layout["id"], superSetId: SuperSet["id"]) => {
        set((state: any) => {
            const updatedLayouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const newLayout = layout.layout.filter(
                    (item: LayoutItem) => !(item.type === "superset" && item.id === superSetId)
                );

                return { ...layout, layout: newLayout };
            });

            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        });
    },


    getSuperSet: (layoutId: Layout["id"], superSetId: LayoutItem["id"]) => {
        const layoutObj = get().layouts.find((l: Layout) => l.id === layoutId);
        if (!layoutObj) return undefined;

        const ss = layoutObj.layout.find(
            (item: LayoutItem): item is SuperSet =>
                item.type === "superset" && item.id === superSetId
        );

        return ss;
    },

    updateSuperSetSettings: <K extends keyof SuperSetSettings>(
        layoutId: Layout["id"],
        supId: SuperSet["id"],
        key: K,
        value: SuperSetSettings[K]
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const index = items.findIndex((item) => isSuperSet(item) && item.id === supId);
                if (index === -1) return layout;

                const updatedSuperSet = items[index];

                if (isSuperSet(updatedSuperSet)) {
                    if (!updatedSuperSet.settings.supersetType) {
                        updatedSuperSet.settings.supersetType = 'default';
                    }

                    items[index] = {
                        ...updatedSuperSet,
                        settings: { ...updatedSuperSet.settings, [key]: value }
                    };
                }

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },



});