import { Sets } from "@/components/context/ExerciseZustand";
import { Layout } from "../../components/context/ExerciseLayoutZustand";

interface UseCloneLayoutProps {
    layout: Layout;
    existingLayouts?: Layout[];
}

const useCloneLayout = ({ layout, existingLayouts = [] }: UseCloneLayoutProps): Layout => {
    const clonedExercises = layout.layout.map(exercise => ({
        ...exercise,
        sets: exercise.sets?.map((set: Sets) => ({
            ...set,
            rest: 0,
        })),
    }));

    // Keep the original name - no copy suffixes
    const layoutName = layout.name || "Workout";

    const newLayout: Layout = {
        id: "gym_" + new Date().getTime(),
        name: layoutName,
        layout: clonedExercises,
    };

    return newLayout;
};

export default useCloneLayout;