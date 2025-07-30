import getInitials from "@/assets/hooks/getInitials";
import capitalizeWords from "../../../assets/hooks/capitalize";
import { Exercise, useExercise } from "../../context/ExerciseZustand";
import useGetExerciseInitial from "./useGetExerciseInitial";

const useGetExerciseName = (id: Exercise["id"]) => {

    const { getExercise } = useExercise();

    const exerciseInitials = useGetExerciseInitial(id);

    const exercise = getExercise(id);
    if (!exercise)
        return "";


    const exerciseName =
        exerciseInitials.length < 5 ?
            capitalizeWords(`${(exercise.equipment && exercise.equipment !== "other" ? exercise.equipment + " " : "") + (exercise.name ?? "")}`)
            :
            capitalizeWords(`${(exercise.equipment && exercise.equipment !== "other" ? exercise.equipment + " " : "") + getInitials(exercise.name ?? "")}`);

    return exerciseName;
};

export default useGetExerciseName;