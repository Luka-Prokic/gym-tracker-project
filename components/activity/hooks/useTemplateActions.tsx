import { useExerciseLayout, Layout } from '../../context/ExerciseLayoutZustand';
import { useRoutine } from '../../context/RoutineZustand';
import { useNewLayout } from '../../../assets/hooks/useNewLayout';
import useCloneLayout from '../../../assets/hooks/useCloneLayout';
import { router } from 'expo-router';

interface UseTemplateActionsProps {
    selectedTab: 'templates' | 'workouts' | 'splits';
    templateLayouts: Layout[];
    deleteLayout: any;
    deleteRoutine: any;
    deleteItems: string[];
    editOptionsLayout: Layout | null;
    cloneLayout: Layout | null;
    cloneName: string;
    setCloneName: (name: string) => void;
    setDeleteLayout: (layout: any) => void;
    setDeleteRoutine: (routine: any) => void;
    setEditOptionsLayout: (layout: Layout | null) => void;
    setCloneLayout: (layout: Layout | null) => void;
    resetSelection: () => void;
    popBubble: () => void;
}

export const useTemplateActions = ({
    selectedTab,
    templateLayouts,
    deleteLayout,
    deleteRoutine,
    deleteItems,
    editOptionsLayout,
    cloneLayout,
    cloneName,
    setCloneName,
    setDeleteLayout,
    setDeleteRoutine,
    setEditOptionsLayout,
    setCloneLayout,
    resetSelection,
    popBubble,
}: UseTemplateActionsProps) => {
    const { removeFromSaved, saveLayout } = useExerciseLayout();
    const { removeRoutine } = useRoutine();

    // Helper function to generate unique clone names
    const generateCloneName = (originalName: string, existingLayouts: Layout[]) => {
        const baseName = originalName;
        let counter = 1;
        let newName = `${baseName} Copy ${counter}`;

        // Keep incrementing counter until we find a unique name
        while (existingLayouts.some(layout => layout.name === newName)) {
            counter++;
            newName = `${baseName} Copy ${counter}`;
        }

        return newName;
    };

    const handleCreateNewTemplate = (templateName?: string) => {
        // Create a new empty layout
        const newLayout = useNewLayout();
        // If template name is provided, set it
        if (templateName) {
            newLayout.name = templateName;
        }
        // Save it to storage temporarily (will be removed if user cancels)
        saveLayout(newLayout);
        // Navigate to edit layout screen with create mode flag
        router.push(`/modals/editLayout?layoutId=${newLayout.id}&mode=create`);
    };

    const handleConfirmDelete = () => {
        if (deleteItems.length > 0) {
            if (selectedTab === 'templates') {
                deleteItems.forEach(id => {
                    const { removeLayout } = useExerciseLayout.getState();
                    removeLayout(id);
                });
            } else if (selectedTab === 'workouts') {
                deleteItems.forEach(id => removeRoutine(id));
            } else if (selectedTab === 'splits') {
                deleteItems.forEach(id => removeFromSaved(id));
            }
            resetSelection();
        } else if (deleteRoutine) {
            removeRoutine(deleteRoutine.id);
            setDeleteRoutine(null);
            popBubble();
        } else if (deleteLayout) {
            if (selectedTab === 'splits') {
                removeFromSaved(deleteLayout.id);
            } else {
                const { removeLayout } = useExerciseLayout.getState();
                removeLayout(deleteLayout.id);
            }
            setDeleteLayout(null);
            popBubble();
        }
    };

    const handleEditFromOptions = () => {
        if (editOptionsLayout) {
            router.push(`/modals/editLayout?layoutId=${editOptionsLayout.id}`);
            setEditOptionsLayout(null);
            popBubble();
        }
    };

    const handleCloneFromOptions = () => {
        if (editOptionsLayout) {
            setCloneLayout(editOptionsLayout);
            setCloneName(generateCloneName(editOptionsLayout.name || 'Untitled', templateLayouts));
            setEditOptionsLayout(null); // Close edit options bubble
            setTimeout(() => popBubble(), 0); // Open clone bubble
        }
    };

    const handleConfirmClone = () => {
        if (cloneLayout && cloneName.trim()) {
            // Create cloned layout with custom name
            const clonedLayout = useCloneLayout({
                layout: { ...cloneLayout, name: cloneName.trim() },
                existingLayouts: templateLayouts
            });

            // Save the cloned layout
            saveLayout(clonedLayout);

            // Reset state and close bubble
            setCloneLayout(null);
            setCloneName('');
            popBubble();
        }
    };

    const handleDeleteFromOptions = () => {
        if (editOptionsLayout) {
            setDeleteLayout(editOptionsLayout);
            setEditOptionsLayout(null);
            popBubble();
        }
    };

    return {
        handleCreateNewTemplate,
        handleConfirmDelete,
        handleEditFromOptions,
        handleCloneFromOptions,
        handleConfirmClone,
        handleDeleteFromOptions,
        generateCloneName,
    };
};
