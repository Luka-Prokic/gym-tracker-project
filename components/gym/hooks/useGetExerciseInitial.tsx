import capitalizeWords from "../../../assets/hooks/capitalize";
import getInitials from "../../../assets/hooks/getInitials";
import { Exercise, useExercise } from "../../context/ExerciseZustand";

const useGetExerciseInitial = (id: Exercise["id"]) => {
    const { getExercise } = useExercise();

    const exercise = getExercise(id);
    if (!exercise)
        return "";

    const exerciseName = capitalizeWords(getInitials(`${(exercise.equipment ? exercise.equipment : "")}`) + "-" + getInitials(`${(exercise.name ?? "")}`));

    return exerciseName;
};

export default useGetExerciseInitial;