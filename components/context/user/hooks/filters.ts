import { useCallback } from "react";
import { useUser } from "../../UserZustend";

export const useDisplayedWeight = () => {
    const { settings } = useUser();
    const unit = settings.units.weight;

    const fromKg = useCallback((kg: number): string => {
        const converted = unit === "lbs" ? kg * 2.20462 : kg;
        return unit === "lbs"
            ? `${converted.toFixed(0)}`
            : `${Math.round(converted)}`;
    }, [unit]);

    const toKg = useCallback((value: number | string): number => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return unit === "lbs" ? num / 2.20462 : num;
    }, [unit]);

    return { unit, fromKg, toKg };
};

export const useDisplayedDistance = () => {
    const { settings } = useUser();
    const unit = settings.units.distance;

    const fromKm = useCallback((km: number): string => {
        const converted = unit === "mi" ? km * 0.621371 : km;
        return unit === "mi"
            ? `${converted.toFixed(0)}`
            : `${km.toFixed(0)}`;
    }, [unit]);

    const toKm = useCallback((value: number | string): number => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return unit === "mi" ? num / 0.621371 : num;
    }, [unit]);

    return { unit, fromKm, toKm };
};

export const useDisplayedSpeed = () => {
    const unit = "";

    const fromSpeed = useCallback((speed: string): string => {
        return speed;
    }, []);

    const toSpeed = useCallback((speed: string): string => {
        return speed;
    }, []);

    return { unit, fromSpeed, toSpeed };
};

export const useDisplayedPace = () => {
    const { settings } = useUser();
    const unit = settings.units.pace;

    const fromMinPerKm = useCallback((minPerKm: number): string => {
        const converted = unit === "min/mi" ? minPerKm / 0.621371 : minPerKm;
        const mins = Math.floor(converted);
        const secs = Math.round((converted - mins) * 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, [unit]);

    const toMinPerKm = useCallback((value: string): number => {
        const [minStr, secStr = "0"] = value.split(":");
        const total = parseFloat(minStr) + parseFloat(secStr) / 60;
        return unit === "min/mi" ? total * 0.621371 : total;
    }, [unit]);

    return { unit, fromMinPerKm, toMinPerKm };
};

export const useDisplayedElevation = () => {
    const { settings } = useUser();
    const unit = settings.units.elevation;

    const fromMeters = useCallback((m: number): string => {
        const converted = unit === "ft" ? m * 3.28084 : m;
        return Math.round(converted).toString();
    }, [unit]);

    const toMeters = useCallback((value: number | string): number => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return unit === "ft" ? num / 3.28084 : num;
    }, [unit]);

    return { unit, fromMeters, toMeters };
};

export const useDisplayedTemperature = () => {
    const { settings } = useUser();
    const unit = settings.units.temperature;

    const fromCelsius = useCallback((c: number): string => {
        const converted = unit === "F" ? (c * 9) / 5 + 32 : c;
        return Math.round(converted).toString();
    }, [unit]);

    const toCelsius = useCallback((value: number | string): number => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return unit === "F" ? ((num - 32) * 5) / 9 : num;
    }, [unit]);

    return { unit, fromCelsius, toCelsius };
};

export const useDisplayedEnergy = () => {
    const { settings } = useUser();
    const unit = settings.units.energy;

    const fromKcal = useCallback((kcal: number): string => {
        const converted = unit === "kJ" ? kcal * 4.184 : kcal;
        return Math.round(converted).toString();
    }, [unit]);

    const toKcal = useCallback((value: number | string): number => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return unit === "kJ" ? num / 4.184 : num;
    }, [unit]);

    return { unit, fromKcal, toKcal };
};

export const useDisplayedResistance = () => {
    const { settings } = useUser();
    const unit = settings.units.weight;

    const fromKg = useCallback((kg: number): string => {
        const converted = unit === "lbs" ? kg * 2.20462 : kg;
        return unit === "lbs"
            ? `${converted.toFixed(0)}`
            : `${Math.round(converted)}`;
    }, [unit]);

    const toKg = useCallback((value: number | string): number => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return unit === "lbs" ? num / 2.20462 : num;
    }, [unit]);

    return { unit, fromKg, toKg };
};

export const useDisplayedDuration = () => {
    const unit = "sec"; // seconds

    const fromSeconds = useCallback((sec: number): string => {
        return `${Math.round(sec)}`;
    }, []);

    const toSeconds = useCallback((value: number | string): number => {
        return typeof value === "string" ? parseFloat(value) : value;
    }, []);

    return { unit, fromSeconds, toSeconds };
};

export const useDisplayedIntensity = () => {
    const unit = "%"; // Intensity in percent

    const fromPercent = useCallback((intensity: number): string => {
        return `${Math.round(intensity)}`;
    }, []);

    const toPercent = useCallback((value: number | string): number => {
        return typeof value === "string" ? parseFloat(value) : value;
    }, []);

    return { unit, fromPercent, toPercent };
};

export const useDisplayedHeartRate = () => {
    const unit = "bpm";

    const fromBPM = useCallback((bpm: number): string => {
        return `${Math.round(bpm)}`;
    }, []);

    const toBPM = useCallback((value: number | string): number => {
        return typeof value === "string" ? parseFloat(value) : value;
    }, []);

    return { unit, fromBPM, toBPM };
};

export const useDisplayedSteps = () => {
    const unit = "steps";

    const fromSteps = useCallback((steps: number): string => {
        return `${Math.round(steps)}`;
    }, []);

    const toSteps = useCallback((value: number | string): number => {
        return typeof value === "string" ? parseFloat(value) : value;
    }, []);

    return { unit, fromSteps, toSteps };
};

export const useDisplayedCadence = () => {
    const unit = "spm"; // steps per minute

    const fromSPM = useCallback((cadence: number): string => {
        return `${Math.round(cadence)}`;
    }, []);

    const toSPM = useCallback((value: number | string): number => {
        return typeof value === "string" ? parseFloat(value) : value;
    }, []);

    return { unit, fromSPM, toSPM };
};

export const useDisplayedIncline = () => {
    const unit = "%";

    const fromIncline = useCallback((incline: number): string => {
        return `${Math.round(incline)}`;
    }, []);

    const toIncline = useCallback((value: number | string): number => {
        return typeof value === "string" ? parseFloat(value) : value;
    }, []);

    return { unit, fromIncline, toIncline };
};

export const useDisplayedRest = () => {
    const unit = "s";

    const fromSeconds = useCallback((sec: number): string => {
        return `${Math.round(sec)}`;
    }, []);

    const toSeconds = useCallback((value: number | string): number => {
        return typeof value === "string" ? parseFloat(value) : value;
    }, []);

    return { unit, fromSeconds, toSeconds };
};

export const useDisplayedLabel = () => {
    const unit = ""; // no unit

    const fromLabel = useCallback((label: string): string => {
        return label;
    }, []);

    const toLabel = useCallback((value: string): string => {
        return value;
    }, []);

    return { unit, fromLabel, toLabel };
};
