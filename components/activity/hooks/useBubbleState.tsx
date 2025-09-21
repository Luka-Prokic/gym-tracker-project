import { useState } from 'react';
import { Layout } from '../../context/ExerciseLayoutZustand';
import useBubbleLayout from '../../bubbles/hooks/useBubbleLayout';

export const useBubbleState = () => {
    // Delete confirmation state
    const [deleteLayout, setDeleteLayout] = useState<any>(null);
    const [deleteRoutine, setDeleteRoutine] = useState<any>(null);

    // Start confirmation state
    const [startLayout, setStartLayout] = useState<any>(null);

    // State for edit options popup
    const [editOptionsLayout, setEditOptionsLayout] = useState<Layout | null>(null);

    // State for clone popup
    const [cloneLayout, setCloneLayout] = useState<Layout | null>(null);
    const [cloneName, setCloneName] = useState('');

    const { bubbleRef, top, left, height, width, makeBubble, bubbleVisible, popBubble } = useBubbleLayout();
    const [anchorId, setAnchorId] = useState<string | null>(null);

    // Bubble handlers
    const handleDeleteRecent = (routine: any) => {
        setDeleteRoutine(routine);
        setAnchorId(routine.id);
        setTimeout(() => makeBubble(), 0);
    };

    const handleDeleteLayout = (layout: any) => {
        setDeleteLayout(layout);
        setAnchorId(layout.id);
        setTimeout(() => makeBubble(), 0);
    };

    const handleStartLayout = (layout: any) => {
        setStartLayout(layout);
        setAnchorId(layout.id);
        setTimeout(() => makeBubble(), 0);
    };

    const handleEditOptions = (layout: Layout) => {
        setEditOptionsLayout(layout);
        setAnchorId(layout.id);
        setTimeout(() => makeBubble(), 0);
    };

    const handleCancelDelete = () => {
        setDeleteLayout(null);
        setDeleteRoutine(null);
        popBubble();
    };

    const handleCancelStart = () => {
        setStartLayout(null);
        popBubble();
    };

    const handleCancelEditOptions = () => {
        setEditOptionsLayout(null);
        setAnchorId(null);
        popBubble();
    };

    const handleCancelClone = () => {
        setCloneLayout(null);
        setCloneName('');
        setAnchorId(null);
        popBubble();
    };

    return {
        // State
        deleteLayout,
        setDeleteLayout,
        deleteRoutine,
        setDeleteRoutine,
        startLayout,
        setStartLayout,
        editOptionsLayout,
        setEditOptionsLayout,
        cloneLayout,
        setCloneLayout,
        cloneName,
        setCloneName,
        anchorId,
        setAnchorId,
        
        // Bubble layout
        bubbleRef,
        top,
        left,
        height,
        width,
        bubbleVisible,
        
        // Handlers
        handleDeleteRecent,
        handleDeleteLayout,
        handleStartLayout,
        handleEditOptions,
        handleCancelDelete,
        handleCancelStart,
        handleCancelEditOptions,
        handleCancelClone,
        makeBubble,
        popBubble,
    };
};
