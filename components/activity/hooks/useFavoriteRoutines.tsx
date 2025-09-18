import { useMemo } from 'react';
import { useExerciseLayout } from '../../context/ExerciseLayoutZustand';

export const useSavedRoutines = () => {
    const { layouts, savedLayouts, addToSaved, removeFromSaved, isSaved } = useExerciseLayout();

    const savedRoutineLayouts = useMemo(() => {
        return layouts.filter(layout => savedLayouts.includes(layout.id));
    }, [layouts, savedLayouts]);

    const toggleSaved = (layoutId: string) => {
        if (isSaved(layoutId)) {
            removeFromSaved(layoutId);
        } else {
            addToSaved(layoutId);
        }
    };

    return {
        savedLayouts,
        savedRoutineLayouts,
        toggleSaved,
        isSaved
    };
};

export default useSavedRoutines;
