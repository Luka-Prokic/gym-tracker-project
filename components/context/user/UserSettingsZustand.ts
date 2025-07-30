import { storage } from "../CakaAppZustand";
import { defaultSettings } from "@/constants/Defaults";


export const createUserSettingsZustand = (set: any, get: any) => ({
    settings: {
        ...defaultSettings,
        ...JSON.parse(
            storage?.getString("user-settings") ||
            "{}"),
    },

    isReady: false,

    toggleCardioVissible: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                cardio: {
                    ...state.settings.cardio,
                    showExercises: !state.settings.cardio.showExercises,
                },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    toggleRIR: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                gym: { ...state.settings.gym, showRIR: !state.settings.gym.showRIR },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    toggleRPE: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                gym: { ...state.settings.gym, showRPE: !state.settings.gym.showRPE },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    togglePreviousStats: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                gym: {
                    ...state.settings.gym,
                    showPreviousStats: !state.settings.gym.showPreviousStats,
                },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    toggleCardioCalories: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                cardio: {
                    ...state.settings.cardio,
                    showCalories: !state.settings.cardio.showCalories,
                },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    toggleCardioHeartRate: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                cardio: {
                    ...state.settings.cardio,
                    showHeartRate: !state.settings.cardio.showHeartRate,
                },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    setDefaultRestLength: (seconds: number) => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                defaultRestLength: seconds,
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    toggleAutoRest: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                autoRest: !state.settings.autoRest,
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    setReady: (ready: boolean) => set({ isReady: ready }),
});