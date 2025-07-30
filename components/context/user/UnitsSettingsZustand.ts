import { storage } from "../CakaAppZustand";

export const createUnitSettingsZustand = (set: any, get: any) => ({

    toggleWeightUnit: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                units: {
                    ...state.settings.units,
                    weight: state.settings.units.weight === 'kg' ? 'lbs' : 'kg',
                },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    toggleDistanceUnit: () => {
        set((state: any) => {
            const isKm = state.settings.units.distance === 'km';
            const updated = {
                ...state.settings,
                units: {
                    ...state.settings.units,
                    distance: isKm ? 'mi' : 'km',
                },
            };
            storage?.set("user-settings", JSON.stringify(updated));
            return { settings: updated };
        });
    },

    // Pace only
    togglePaceUnit: () => {
        set((state: any) => {
            const isMinPerKm = state.settings.units.pace === 'min/km';
            const updated = {
                ...state.settings,
                units: {
                    ...state.settings.units,
                    pace: isMinPerKm ? 'min/mi' : 'min/km',
                },
            };
            storage?.set("user-settings", JSON.stringify(updated));
            return { settings: updated };
        });
    },

    // Elevation only
    toggleElevationUnit: () => {
        set((state: any) => {
            const isMeters = state.settings.units.elevation === 'm';
            const updated = {
                ...state.settings,
                units: {
                    ...state.settings.units,
                    elevation: isMeters ? 'ft' : 'm',
                },
            };
            storage?.set("user-settings", JSON.stringify(updated));
            return { settings: updated };
        });
    },

    toggleTemperatureUnit: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                units: {
                    ...state.settings.units,
                    temperature: state.settings.units.temperature === 'C' ? 'F' : 'C',

                },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

    toggleEnergyUnit: () => {
        set((state: any) => {
            const updatedSettings = {
                ...state.settings,
                units: {
                    ...state.settings.units,
                    energy: state.settings.units.energy === 'kcal' ? 'kJ' : 'kcal',
                },
            };
            storage?.set("user-settings", JSON.stringify(updatedSettings));
            return { settings: updatedSettings };
        });
    },

});
