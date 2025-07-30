import capitalizeWords from "@/assets/hooks/capitalize";
import { storage } from "../CakaAppZustand";
import { Layout, CardioExercise, CardioValues, CardioSettings } from "../ExerciseLayoutZustand";
import { Exercise, useExercise } from "../ExerciseZustand";
import { useUser } from "../UserZustend";
import { findExercise, isCardioExercise, makeId } from "../utils/GymUtils";
import { cardioEquipmentSettings, defaultCardioColumnOrder, defaultInterval } from "@/constants/Defaults";

export const createCardioExercisesZustand = (set: any, get: any) => ({

    addCardioExercise: (layoutId: Layout["id"], newExerciseId: Exercise["id"]) => {
        const id = makeId("ceil");
        set((state: any) => {
            const defaultRestLength = useUser.getState().settings.defaultRestLength;

            const exDef = useExercise.getState().getExercise(newExerciseId);
            const equip = exDef?.equipment ?? "machine";

            const overrides = cardioEquipmentSettings[equip] || {};

            const baseSettings: CardioSettings = {
                noDuration: false,
                noDistance: true,
                noPace: true,
                noSpeed: true,
                noCalories: true,
                noHeartRate: true,
                noSteps: true,
                noCadence: true,
                noElevation: true,
                noIncline: true,
                noResistance: true,
                noIntensity: true,
                noRest: false,
                noLabel: true,
                noNote: true,
                noGPS: true,
                columnOrder: [],
            };

            const settings = { ...baseSettings, ...overrides };

            const columnOrder = defaultCardioColumnOrder.filter((key) => {
                return !settings[`no${capitalizeWords(key)}` as keyof CardioSettings];
            });

            settings.columnOrder = columnOrder;

            const newExercise: CardioExercise = {
                id,
                exId: newExerciseId,
                note: "",
                prefix: "",
                type: "cardio",
                restLength: defaultRestLength,
                settings,
                intervals: [defaultInterval],
            };

            const layouts = state.layouts.map((layout: Layout) =>
                layout.id !== layoutId
                    ? layout
                    : { ...layout, layout: [...layout.layout, newExercise] }
            );

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
        return id;
    },

    removeCardioExercise: (layoutId: Layout["id"], exId: CardioExercise["id"]) => {
        set((state: any) => {
            const layouts = state.layouts.map((l: Layout) => {
                if (l.id !== layoutId) return l;
                const items = [...l.layout];
                const found = findExercise(items, exId);
                if (found) found.parent.splice(found.index, 1);
                return { ...l, layout: items.filter(item => item.type !== "cardio" || (item as CardioExercise).intervals?.length! > 0) };
            });
            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    getCardioExercise: (layoutId: Layout["id"], exId: CardioExercise["id"]) => {
        const layout = get().getLayout(layoutId);
        if (!layout) return undefined;
        const found = findExercise(layout.layout, exId);
        return found?.exercise as CardioExercise | undefined;
    },

    updateCardioExerciseSettings: <
        K extends keyof CardioSettings
    >(
        layoutId: Layout["id"],
        exId: CardioExercise["id"],
        key: K,
        value: CardioSettings[K]
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;
                const items = [...layout.layout];
                const found = findExercise(items, exId);
                if (found && isCardioExercise(found.exercise)) {
                    const ce = found.exercise as CardioExercise;
                    found.parent[found.index] = {
                        ...ce,
                        settings: {
                            ...ce.settings,
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