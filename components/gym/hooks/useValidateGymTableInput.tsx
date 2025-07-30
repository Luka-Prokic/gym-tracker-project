import { useState } from "react";
import { Sets } from "../../context/ExerciseZustand";

export const useValidateGymTableInput = (column: keyof Sets, initialValue: any) => {
    const [value, setValue] = useState(initialValue);

    const validateInput = (inputValue: string): Sets[keyof Sets] => {
        let convertedValue: Sets[keyof Sets];

        switch (column) {
            case "reps":
            case "kg":
                const numValue = Math.abs(Number(inputValue));
                convertedValue = isNaN(numValue) ? 0 : numValue;
                break;

            case "rir":
                const rirValue = inputValue;
                if (Number(rirValue) > 5 || rirValue === "6+") {
                    convertedValue = "6+";
                } else if (Number(rirValue) < 0) {
                    convertedValue = 0;
                } else {
                    convertedValue = isNaN(Number(rirValue)) ? 0 : Number(rirValue);
                }
                break;

            case "rpe":
                const rpeValue = inputValue;
                if (Number(rpeValue) < 1) {
                    convertedValue = 1;
                } else if (Number(rpeValue) > 10) {
                    convertedValue = 10;
                } else {
                    convertedValue = isNaN(Number(rpeValue)) ? 0 : Number(rpeValue);
                }
                break;

            default:
                convertedValue = 0;
        }

        return convertedValue;
    };

    const handleChange = (inputValue: string) => {
        const validValue = validateInput(inputValue);
        setValue(validValue);
        return validValue;
    };

    return [value, handleChange] as const;
};