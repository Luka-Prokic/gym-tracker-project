import { defaultSet } from "@/constants/Defaults";
import { storage } from "../CakaAppZustand";
import { GymExercise, GymExerciseSettings, Layout, SuperSet } from "../ExerciseLayoutZustand";
import { Exercise } from "../ExerciseZustand";
import { useUser } from "../UserZustend";
import { findExercise, isGymExercise, makeId } from "../utils/GymUtils";

export const createGymExercisesZustand = (set: any, get: any) => ({

    addGymExercise: (layoutId: Layout["id"], newExerciseId: Exercise["id"]) => {
        const id = makeId("geil");
        set((state: any) => {
            const defaultRestLength = useUser.getState().settings.defaultRestLength;
            const showRIR = useUser.getState().settings.gym.showRIR;
            const showRPE = useUser.getState().settings.gym.showRPE;
            const newExercise: GymExercise = {
                id,
                exId: newExerciseId,
                sets: [defaultSet],
                restLength: defaultRestLength,
                settings: {
                    noRest: (defaultRestLength === 0),
                    noRIR: !showRIR,
                    noRPE: !showRPE,
                    noNote: true,
                },
                note: "",
                type: "gym",
            };

            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;
                return { ...layout, layout: [...layout.layout, newExercise] };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
        return id;
    },

    removeGymExercise: (layoutId: Layout["id"], exId: GymExercise["id"]) => {
        set((state: any) => {
            const layouts = state.layouts.map((l: Layout) => {
                if (l.id !== layoutId) return l;

                const items = [...l.layout];
                const found = findExercise(items, exId);
                if (found) {
                    found.parent.splice(found.index, 1);
                }

                const cleaned = items.filter(item =>
                    item.type !== "superset" ||
                    ((item as SuperSet).layout.length > 0)
                );

                return { ...l, layout: cleaned };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },


    getGymExercise: (layoutId: Layout["id"], exId: GymExercise["id"]) => {
        const layout = get().getLayout(layoutId);
        if (!layout) return undefined;
        const found = findExercise(layout.layout, exId);
        return found?.exercise as GymExercise;
    },

    swapExercise: (layoutId: Layout["id"], exId: GymExercise["id"], newExerciseId: Exercise["id"]) =>
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found) return layout;

                const parentList = found.parent;
                parentList[found.index] = { ...found.exercise, exId: newExerciseId };

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        }),

    updateGymExerciseSettings: <K extends keyof GymExerciseSettings>(
        layoutId: Layout["id"],
        exId: GymExercise["id"],
        key: K,
        value: GymExerciseSettings[K]
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (!found) return layout;

                if (isGymExercise(found.exercise)) {
                    const ge = found.exercise;
                    found.parent[found.index] = {
                        ...ge,
                        settings: {
                            ...ge.settings,
                            [key]: value,
                        },
                    };
                }

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

});