import { Layout } from "../../components/context/ExerciseLayoutZustand";

interface UseCloneLayoutProps {
    layout: Layout;
}

const useCloneLayout = ({ layout }: UseCloneLayoutProps): Layout => {

    const clonedExercises = layout.layout.map(exercise => ({
        ...exercise,
        sets: exercise.sets?.map(set => ({
            ...set,
            rest: 0,
        })),
    }));

    const newLayout: Layout = {
        id: "gym_" + new Date().getTime(),
        layout: clonedExercises,
    };

    return newLayout;
};

export default useCloneLayout;