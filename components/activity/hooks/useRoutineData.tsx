import { useMemo } from 'react';
import { useRoutine } from '../../context/RoutineZustand';
import { useExerciseLayout } from '../../context/ExerciseLayoutZustand';

export const useRoutineData = () => {
    const { routines } = useRoutine();
    const { layouts, savedLayouts } = useExerciseLayout();

    // Filter routines by type and status - only show finished routines
    const recentRoutines = useMemo(() => {
        const filtered = routines
            .filter((routine: any) => routine.status === 'routine' && routine.type === 'gym' && routine.isFinished === true)
            .sort((a, b) => (b.lastStartTime || 0) - (a.lastStartTime || 0))
            .slice(0, 10);

        // Filter out routines that don't have corresponding layouts (ghost routines)
        const validRoutines = filtered.filter((routine: any) => {
            const hasLayout = layouts.some(layout => layout.id === routine.layoutId);
            return hasLayout;
        });

        return validRoutines;
    }, [routines, layouts]);

    // Filter layouts that are templates (only from routines with status: "template")
    const templateLayouts = useMemo(() => {
        return layouts.filter((layout: any) => {
            // Only show layouts that are associated with routines having status: "template"
            const associatedTemplateRoutine = routines.find((routine: any) =>
                routine.layoutId === layout.id && routine.status === 'template'
            );

            // Show layout only if it has an associated template routine
            return associatedTemplateRoutine !== undefined;
        });
    }, [layouts, routines]);

    // Filter layouts that are saved
    const savedLayoutsList = useMemo(() => {
        return layouts.filter((layout: any) => savedLayouts.includes(layout.id));
    }, [layouts, savedLayouts]);

    return {
        recentRoutines,
        templateLayouts,
        savedLayoutsList,
        allRoutines: routines,
        allLayouts: layouts
    };
};

export default useRoutineData;
