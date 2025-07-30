import { Layout } from "../../components/context/ExerciseLayoutZustand";

export const useNewLayout = () => {
    const newLayout: Layout = {
        id: "gym_" + new Date().getTime(),
        layout: [],
    };

    return newLayout;
};