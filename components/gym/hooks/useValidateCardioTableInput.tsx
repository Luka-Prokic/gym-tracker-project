import { useState } from "react";
import {
    useDisplayedDistance,
    useDisplayedPace,
    useDisplayedElevation,
    useDisplayedEnergy,
    useDisplayedResistance,
} from "@/components/context/user/hooks/filters";
import { CardioValues } from "../../context/ExerciseLayoutZustand";

type CardioKey = keyof CardioValues;

export function useValidateCardioInput(
    column: CardioKey,
    initialValue: CardioValues[CardioKey]
) {
    const hookMap: Partial<Record<CardioKey, any>> = {
        distance: useDisplayedDistance(),
        pace: useDisplayedPace(),
        elevation: useDisplayedElevation(),
        resistance: useDisplayedResistance(),
        calories: useDisplayedEnergy(),
    };
    const converter = hookMap[column];

    const [value, setValue] = useState<CardioValues[CardioKey]>(initialValue);

    const validateInput = (input: string): CardioValues[CardioKey] => {
        let out: CardioValues[CardioKey];
        let convertedValue: CardioValues[keyof CardioValues];
        const numValue = Math.abs(Number(initialValue));

        switch (column) {
            case "distance":

                convertedValue = isNaN(numValue) ? 0 : numValue;

                out = converter && typeof converter.toKm === "function"
                    ? converter.toKm(convertedValue)
                    : 0;
                break;
            case "pace":

                convertedValue = isNaN(numValue) ? 0 : numValue;

                out = converter && typeof converter.toMinPerKm === "function"
                    ? converter.toMinPerKm(convertedValue)
                    : 0;
                break;
            case "elevation":

                convertedValue = isNaN(numValue) ? 0 : numValue;

                out = converter && typeof converter.toMeters === "function"
                    ? converter.toMeters(convertedValue)
                    : 0;
                break;
            case "resistance":

                convertedValue = isNaN(numValue) ? 0 : numValue;

                out = converter && typeof converter.toKg === "function"
                    ? converter.toKg(convertedValue)
                    : 0;
                break;
            case "calories":

                convertedValue = isNaN(numValue) ? 0 : numValue;

                out = converter && typeof converter.toKcal === "function"
                    ? converter.toKcal(convertedValue)
                    : 0;
                break;
            case "duration":
            case "heartRate":
            case "steps":
            case "cadence":
            case "incline":
            case "speed":
            case "rest":

                convertedValue = isNaN(numValue) ? 0 : numValue;

                const n = Math.abs(Number(input));
                out = isNaN(n) ? 0 : n;
                break;
            case "intensity":
                const norm = input.toLowerCase();
                out = (["low", "moderate", "high"].includes(norm)
                    ? (norm as "low" | "moderate" | "high")
                    : "moderate") as CardioValues["intensity"];
                break;
            case "label":
                out = input.trim().slice(0, 30) as CardioValues["label"];
                break;
            default:
                out = input as CardioValues[typeof column];
        }
        return out;
    };

    const handleChange = (input: string) => {
        const valid = validateInput(input);
        setValue(valid);
        return valid;
    };

    return [value, handleChange] as const;
}