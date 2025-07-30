import { CardioValues } from "@/components/context/ExerciseLayoutZustand";

export const formatCardioKey = (key: keyof CardioValues): string => {
    if (key)
        return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, str => str.toUpperCase());
    return "";
};