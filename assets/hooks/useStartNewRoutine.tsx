import { useCallback } from 'react';
import { router } from 'expo-router';
import { useRoutine } from '../../components/context/RoutineZustand';
import { useExerciseLayout } from '../../components/context/ExerciseLayoutZustand';
import { RoutineLayout } from '../../components/context/RoutineZustand';
import { Layout } from '../../components/context/ExerciseLayoutZustand';
import useCloneLayout from './useCloneLayout';
import { useNewLayout } from './useNewLayout';

interface UseStartNewRoutineOptions {
    /**
     * If provided, will clone this layout for the new routine
     * If not provided, will create an empty routine
     */
    fromLayout?: Layout;
    /**
     * Navigation method to use after starting routine
     * @default 'push' - navigates to routine screen
     * @default 'replace' - replaces current screen with routine screen
     */
    navigationMethod?: 'push' | 'replace';
    /**
     * Whether to navigate to routine screen after starting
     * @default true
     */
    shouldNavigate?: boolean;
}

export const useStartNewRoutine = () => {
    const { activeRoutine, setActiveRoutine, checkAndAddRoutine } = useRoutine();
    const { saveLayout, layouts, startEditingLayout } = useExerciseLayout();

    const startNewRoutine = useCallback((options: UseStartNewRoutineOptions = {}) => {
        const {
            fromLayout,
            navigationMethod = 'push',
            shouldNavigate = true
        } = options;

        // Check if there's already an active routine
        if (activeRoutine.id !== "routine_111" && activeRoutine?.id && activeRoutine.type === "gym") {
            // If there's an active routine, just navigate to it
            if (shouldNavigate) {
                if (navigationMethod === 'replace') {
                    router.replace("/routine");
                } else {
                    router.push("/routine");
                }
            }
            return;
        }

        // Create new routine
        const newRoutineId = "routine_" + new Date().getTime();
        
        // Create layout (either clone existing or create new)
        const newLayout = fromLayout
            ? useCloneLayout({ layout: fromLayout, existingLayouts: layouts })
            : useNewLayout();

        const newRoutine: RoutineLayout = {
            id: newRoutineId,
            layoutId: newLayout.id,
            timer: 0,
            status: "template",
            type: "gym",
            isFinished: false,
        };

        // Save the routine and initial layout
        checkAndAddRoutine(newRoutine);
        setActiveRoutine(newRoutineId);
        saveLayout(newLayout);
        
        // Start staging session for all workout sessions
        // This ensures that any changes made during workout are staged until explicitly saved
        startEditingLayout(newLayout.id);

        // Navigate to routine screen
        if (shouldNavigate) {
            if (navigationMethod === 'replace') {
                router.replace("/routine");
            } else {
                router.push("/routine");
            }
        }
    }, [activeRoutine, setActiveRoutine, checkAndAddRoutine, saveLayout]);

    return { startNewRoutine };
};

export default useStartNewRoutine;
