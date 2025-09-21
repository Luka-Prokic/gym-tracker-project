import { storage } from "../CakaAppZustand";
import { CardioExercise, GymExercise, Layout, LayoutItem, SuperSet, SuperSetSettings } from "../ExerciseLayoutZustand";
import { isSuperSet, makeId } from "../utils/GymUtils";

export const createSuperSetZustand = (set: any, get: any) => ({


    createSuperSet: (layoutId: Layout["id"]) => {
        const newSsId = makeId("ssil");
        set((state: any) => {
            // Staging-aware
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                if (currentStaging) {
                    const next = {
                        ...currentStaging,
                        layout: [
                            ...currentStaging.layout,
                            {
                                id: newSsId,
                                type: "superset",
                                layout: [],
                                restLength: 120,
                                settings: { supersetType: "default", noRest: false },
                                name: "Super Set",
                            } as SuperSet,
                        ],
                    };
                    newStagingLayouts.set(layoutId, next);
                    return { stagingLayouts: newStagingLayouts };
                }
            }

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
                                settings: { supersetType: "default", noRest: false },
                                name: "Super Set",
                            } as SuperSet,
                        ],
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
            // staging path
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                if (currentStaging) {
                    let moved: LayoutItem | undefined;
                    const newItems = currentStaging.layout.flatMap((item: LayoutItem) => {
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
                            moved = item;
                            return [];
                        }
                        return [item];
                    });
                    if (!moved) return {};
                    const finalItems = newItems.map((item: LayoutItem) => {
                        if (item.type === "superset" && item.id === superSetId) {
                            const ss = item as SuperSet;
                            return { ...ss, layout: [...ss.layout, moved!] };
                        }
                        return item;
                    });
                    newStagingLayouts.set(layoutId, { ...currentStaging, layout: finalItems });
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            // persisted path
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
                        moved = item;
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
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                if (currentStaging) {
                    let removedExercise: LayoutItem | undefined;
                    const newLayout = currentStaging.layout.flatMap((item: LayoutItem) => {
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
                    if (removedExercise) newLayout.push(removedExercise);
                    newStagingLayouts.set(layoutId, { ...currentStaging, layout: newLayout });
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            const updatedLayouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;
                let removedExercise: LayoutItem | undefined;
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
                if (removedExercise) newLayout.push(removedExercise);
                return { ...layout, layout: newLayout };
            });
            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        });
    },

    removeSuperSet: (layoutId: Layout["id"], superSetId: SuperSet["id"]) => {
        set((state: any) => {
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                if (currentStaging) {
                    const newLayout = currentStaging.layout.filter((item: LayoutItem) => !(item.type === "superset" && item.id === superSetId));
                    newStagingLayouts.set(layoutId, { ...currentStaging, layout: newLayout });
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            const updatedLayouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;
                const newLayout = layout.layout.filter((item: LayoutItem) => !(item.type === "superset" && item.id === superSetId));
                return { ...layout, layout: newLayout };
            });
            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        });
    },


    getSuperSet: (layoutId: Layout["id"], superSetId: LayoutItem["id"]) => {
        const layoutObj = get().getLayout(layoutId);
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
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                if (currentStaging) {
                    const items = [...currentStaging.layout];
                    const index = items.findIndex((item) => isSuperSet(item) && item.id === supId);
                    if (index !== -1) {
                        const updatedSuperSet = items[index] as SuperSet;
                        if (!updatedSuperSet.settings.supersetType) {
                            updatedSuperSet.settings.supersetType = 'default';
                        }
                        items[index] = { ...updatedSuperSet, settings: { ...updatedSuperSet.settings, [key]: value } };
                        newStagingLayouts.set(layoutId, { ...currentStaging, layout: items });
                        return { stagingLayouts: newStagingLayouts };
                    }
                }
            }

            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;
                const items = [...layout.layout];
                const index = items.findIndex((item) => isSuperSet(item) && item.id === supId);
                if (index === -1) return layout;
                const updatedSuperSet = items[index] as SuperSet;
                if (!updatedSuperSet.settings.supersetType) {
                    updatedSuperSet.settings.supersetType = 'default';
                }
                items[index] = { ...updatedSuperSet, settings: { ...updatedSuperSet.settings, [key]: value } };
                return { ...layout, layout: items };
            });
            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },



});