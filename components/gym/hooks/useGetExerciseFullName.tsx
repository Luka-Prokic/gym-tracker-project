import capitalizeWords from "../../../assets/hooks/capitalize";
import { Exercise, useExercise } from "../../context/ExerciseZustand";

const useGetExerciseFullName = (id: Exercise["id"]) => {
    const { getExercise } = useExercise();

    const exercise = getExercise(id);
    if (!exercise)
        return "";

    const exerciseName = capitalizeWords(`${(exercise.equipment && exercise.equipment !== "other" ? exercise.equipment + " " : "") + (exercise.name ?? "")}`);

    return exerciseName;
};

export default useGetExerciseFullName;