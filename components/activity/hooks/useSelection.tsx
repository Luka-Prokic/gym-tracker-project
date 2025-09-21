import { useState, useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export const useSelection = () => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set<string>());
    const [deleteItems, setDeleteItems] = useState<string[]>([]);
    const [isSlideVisible, setIsSlideVisible] = useState(false);

    const translateY = useSharedValue(66);
    const tabOpacity = useSharedValue(1);

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleCancelMultiDelete = () => {
        setIsSlideVisible(false);
    };

    const handleMultiDelete = () => {
        if (selectedItems.size > 0) {
            setDeleteItems(Array.from(selectedItems));
            setIsSlideVisible(true);
        }
    };

    const resetSelection = () => {
        setSelectedItems(new Set());
        setIsSelecting(false);
        setDeleteItems([]);
        setIsSlideVisible(false);
    };

    // Animation effects
    useEffect(() => {
        translateY.value = withTiming(isSelecting ? 0 : 66, { duration: 200 });
        tabOpacity.value = withTiming(isSelecting ? 0 : 1, { duration: 200 });
    }, [isSelecting]);

    return {
        // State
        isSelecting,
        setIsSelecting,
        selectedItems,
        setSelectedItems,
        deleteItems,
        setDeleteItems,
        isSlideVisible,
        setIsSlideVisible,
        
        // Animation values
        translateY,
        tabOpacity,
        
        // Handlers
        toggleSelect,
        handleCancelMultiDelete,
        handleMultiDelete,
        resetSelection,
    };
};
