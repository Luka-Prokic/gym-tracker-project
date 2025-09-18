import { storage } from "../CakaAppZustand";
import { Layout, LayoutItem } from "../ExerciseLayoutZustand";


export const createLayoutsZustand = (set: any, get: any) => ({
    layouts: JSON.parse(
        storage?.getString("layouts") || "[]") as Layout[],

    savedLayouts: JSON.parse(
        storage?.getString("savedLayouts") || "[]") as string[], // Array of layout IDs

    // Staging system for layout changes
    stagingLayouts: new Map<string, Layout>(), // Temporary changes not yet persisted
    editingSessions: new Set<string>(), // Track which layouts are being edited

    isReady: false,

    setReady: (isReady: boolean) => set({ isReady }),


    loadLayouts: () => {
        set({ layouts: JSON.parse(storage?.getString("layouts") || "[]") });
    },

    getLayout: (id: string) => {
        const state = get();
        // Return staging version if it exists, otherwise return persisted version
        return state.stagingLayouts.get(id) || state.layouts.find((l: Layout) => l.id === id);
    },

    // Start editing session - creates staging copy
    startEditingLayout: (id: string) => {
        set((state: any) => {
            const layout = state.layouts.find((l: Layout) => l.id === id);
            if (!layout) return {};

            const newStagingLayouts = new Map(state.stagingLayouts);
            const newEditingSessions = new Set(state.editingSessions);
            
            // Create staging copy with deep clone of layout items
            newStagingLayouts.set(id, {
                ...layout,
                layout: layout.layout ? JSON.parse(JSON.stringify(layout.layout)) : []
            });
            newEditingSessions.add(id);

            return { 
                stagingLayouts: newStagingLayouts,
                editingSessions: newEditingSessions 
            };
        });
    },

    // Update staging layout (doesn't persist to storage)
    updateStagingLayout: (id: string, updates: Partial<Layout>) => {
        set((state: any) => {
            const newStagingLayouts = new Map(state.stagingLayouts);
            const currentStaging = newStagingLayouts.get(id);
            
            if (currentStaging) {
                newStagingLayouts.set(id, { ...currentStaging, ...updates });
            }

            return { stagingLayouts: newStagingLayouts };
        });
    },

    // Commit staging changes to storage
    commitStagingLayout: (id: string) => {
        set((state: any) => {
            const stagingLayout = state.stagingLayouts.get(id);
            
            if (!stagingLayout) {
                console.warn('No staging layout found for id:', id);
                return {};
            }

            const existingLayoutIndex = state.layouts.findIndex((l: Layout) => l.id === id);
            let updatedLayouts;
            
            if (existingLayoutIndex !== -1) {
                updatedLayouts = state.layouts.map((l: Layout) =>
                    l.id === id ? stagingLayout : l
                );
            } else {
                updatedLayouts = [...state.layouts, stagingLayout];
            }

            // Persist to storage
            storage?.set("layouts", JSON.stringify(updatedLayouts));

            // Clean up staging
            const newStagingLayouts = new Map(state.stagingLayouts);
            const newEditingSessions = new Set(state.editingSessions);
            newStagingLayouts.delete(id);
            newEditingSessions.delete(id);

            return { 
                layouts: updatedLayouts,
                stagingLayouts: newStagingLayouts,
                editingSessions: newEditingSessions
            };
        });
    },

    // Discard staging changes
    discardStagingLayout: (id: string) => {
        set((state: any) => {
            const newStagingLayouts = new Map(state.stagingLayouts);
            const newEditingSessions = new Set(state.editingSessions);
            newStagingLayouts.delete(id);
            newEditingSessions.delete(id);

            return { 
                stagingLayouts: newStagingLayouts,
                editingSessions: newEditingSessions
            };
        });
    },

    // Check if layout is being edited
    isLayoutBeingEdited: (id: string) => {
        return get().editingSessions.has(id);
    },

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

    updateLayoutName: (layoutId: Layout["id"], name: string) => {
        set((state: any) => {
            // If layout is being edited, update staging version
            if (state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                
                if (currentStaging) {
                    newStagingLayouts.set(layoutId, { ...currentStaging, name });
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            // Otherwise update persisted version directly (for backward compatibility)
            const existingLayout = state.layouts.find((l: Layout) => l.id === layoutId);
            if (!existingLayout) return {};

            const updatedLayout: Layout = {
                ...existingLayout,
                name: name,
            };

            const updatedLayouts = state.layouts.map((l: Layout) =>
                l.id === layoutId ? updatedLayout : l
            );

            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        });
    },

    updateLayoutOrder: (layoutId: Layout["id"], newOrder: LayoutItem[]) => {
        set((state: any) => {
            // If layout is being edited, update staging version
            if (state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                
                if (currentStaging) {
                    newStagingLayouts.set(layoutId, { ...currentStaging, layout: newOrder });
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            // Otherwise update persisted version directly (for backward compatibility)
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

    updateLayoutItem: (layoutId: Layout["id"], itemId: string, updatedItem: LayoutItem) => {
        set((state: any) => {
            const existingLayout = state.layouts.find((l: Layout) => l.id === layoutId);
            if (!existingLayout) return {};

            const updatedLayout: Layout = {
                ...existingLayout,
                layout: existingLayout.layout.map((item: LayoutItem) =>
                    item.id === itemId ? updatedItem : item
                ),
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

    removeFromLayout: (layoutId: Layout["id"], itemId: string) => {
        set((state: any) => {
            // If layout is being edited, update staging version
            if (state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId);
                
                if (currentStaging) {
                    const updatedLayout = {
                        ...currentStaging,
                        layout: currentStaging.layout.filter((item: LayoutItem) => item.id !== itemId),
                    };
                    newStagingLayouts.set(layoutId, updatedLayout);
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            // Otherwise update persisted version directly (for backward compatibility)
            const existingLayout = state.layouts.find((l: Layout) => l.id === layoutId);
            if (!existingLayout) return {};

            const updatedLayout: Layout = {
                ...existingLayout,
                layout: existingLayout.layout.filter((item: LayoutItem) => item.id !== itemId),
            };

            const updatedLayouts = state.layouts.map((l: Layout) =>
                l.id === layoutId ? updatedLayout : l
            );

            storage?.set("layouts", JSON.stringify(updatedLayouts));
            return { layouts: updatedLayouts };
        });
    },

    // Saved layouts management
    addToSaved: (layoutId: string) => {
        set((state: any) => {
            if (!state.savedLayouts.includes(layoutId)) {
                const updatedSaved = [...state.savedLayouts, layoutId];
                storage?.set("savedLayouts", JSON.stringify(updatedSaved));
                return { savedLayouts: updatedSaved };
            }
            return {};
        });
    },

    removeFromSaved: (layoutId: string) => {
        set((state: any) => {
            const updatedSaved = state.savedLayouts.filter((id: string) => id !== layoutId);
            storage?.set("savedLayouts", JSON.stringify(updatedSaved));
            return { savedLayouts: updatedSaved };
        });
    },

    isSaved: (layoutId: string) => {
        return get().savedLayouts.includes(layoutId);
    },

    // Check if layout is currently being edited
    isEditingLayout: (layoutId: string) => {
        return get().editingSessions.has(layoutId);
    },

    // Safe layout editing - clones if used by finished routines
    safeEditLayout: (layoutId: string, updates: Partial<Layout>) => {
        const { useRoutine } = require("../RoutineZustand");
        const routines = useRoutine.getState().routines;
        
        // Check if layout is used by any finished routine
        const isUsedByFinishedRoutine = routines.some((routine: any) => 
            routine.layoutId === layoutId && routine.isFinished === true
        );

        if (isUsedByFinishedRoutine) {
            // Clone the layout for editing
            const originalLayout = get().layouts.find((l: Layout) => l.id === layoutId);
            if (!originalLayout) return;

            const clonedLayout: Layout = {
                ...originalLayout,
                ...updates,
                id: "layout_" + new Date().getTime(), // New ID for clone
            };

            // Save the clone and add to saved
            get().saveLayout(clonedLayout);
            get().addToSaved(clonedLayout.id);
            
            return clonedLayout.id; // Return new layout ID
        } else {
            // Safe to edit directly
            const updatedLayout = {
                ...get().layouts.find((l: Layout) => l.id === layoutId),
                ...updates,
            } as Layout;

            get().saveLayout(updatedLayout);
            return layoutId; // Return original layout ID
        }
    },

    // Safe layout deletion - only if not used by finished routines
    safeDeleteLayout: (layoutId: string) => {
        const { useRoutine } = require("../RoutineZustand");
        const routines = useRoutine.getState().routines;
        
        // Check if layout is used by any finished routine
        const isUsedByFinishedRoutine = routines.some((routine: any) => 
            routine.layoutId === layoutId && routine.isFinished === true
        );

        if (!isUsedByFinishedRoutine) {
            // Safe to delete
            get().removeLayout(layoutId);
            get().removeFromSaved(layoutId);
            return true;
        } else {
            // Cannot delete - used by finished routine
            return false;
        }
    },

});
