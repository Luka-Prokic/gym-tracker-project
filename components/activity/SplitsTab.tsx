import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import { Layout } from '../context/ExerciseLayoutZustand';
import TemplateCard from './TemplateCard';
import IList from '../containers/IList';
import Container from '../containers/Container';
import { TemplateSortFilter } from './TemplateSortFilter';
import IToggleButtons from '../buttons/IToggleButtons';
import EmptyState from './EmptyState';
import { SCREEN_WIDTH } from '@/constants/ScreenWidth';

interface SplitsTabProps {
    savedLayouts: Layout[];
    isSelecting: boolean;
    selectedItems: Set<string>;
    onSelect: (id: string) => void;
    onToggleSaved: (id: string) => void;
    isSaved: (id: string) => boolean;
    onStartRoutine: (layout: Layout) => void;
    onEditLayout: (layout: Layout) => void;
    onDeleteLayout: (layout: Layout) => void;
    onEditOptions?: (layout: Layout) => void;
    bubbleRef?: React.RefObject<any>;
    anchorId?: string;
}

export type SortMode = 'name' | 'date';
export type SortOrder = 'asc' | 'desc';

export const SplitsTab: React.FC<SplitsTabProps> = ({
    savedLayouts = [],
    isSelecting,
    selectedItems,
    onSelect,
    onToggleSaved,
    isSaved,
    onStartRoutine,
    onEditLayout,
    onDeleteLayout,
    onEditOptions,
    bubbleRef,
    anchorId
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const [sortMode, setSortMode] = useState<SortMode>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Helper function to extract timestamp from layout ID
    const extractTimestamp = (layoutId: string): number => {
        const match = layoutId.match(/gym_(\d+)/);
        return match ? parseInt(match[1]) : 0;
    };

    // Filter and sort saved layouts (splits)
    const filteredAndSortedSplits = useMemo(() => {
        if (!savedLayouts) return [];

        let filtered = savedLayouts;

        // Sort splits
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortMode) {
                case 'name':
                    comparison = (a.name || '').localeCompare(b.name || '');
                    break;
                case 'date':
                default:
                    // Extract timestamp from layout ID for sorting by creation date
                    const aTime = extractTimestamp(a.id);
                    const bTime = extractTimestamp(b.id);
                    comparison = aTime - bTime; // Older first for asc, newer first for desc
                    break;
            }

            // Apply sort order
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [savedLayouts, sortMode, sortOrder]);

    return (
        <>
            {/* Filter Bar */}
            <View style={[styles.filterBar, { backgroundColor: color.background }]}>
                <View style={styles.filters}>
                    <TemplateSortFilter value={sortMode} onPress={setSortMode} />
                    <IToggleButtons
                        option1={sortMode === 'name' ? 'A-Z' : 'Old'}
                        option2={sortMode === 'name' ? 'Z-A' : 'New'}
                        value={sortOrder === 'asc' ? (sortMode === 'name' ? 'A-Z' : 'Old') : (sortMode === 'name' ? 'Z-A' : 'New')}
                        onChange={(val) => setSortOrder(val === (sortMode === 'name' ? 'A-Z' : 'Old') ? 'asc' : 'desc')}
                        width={SCREEN_WIDTH * 0.45}
                        height={34}
                        backgroundColor={color.thirdBackground}
                    />
                </View>
            </View>

            {/* Splits List */}
            <IList label="" background="transparent" width={'90%'} hrStart="None" style={{ marginBottom: 12 }}>
                {filteredAndSortedSplits.length > 0 ? (
                    filteredAndSortedSplits.map((layout) => (
                        <TemplateCard
                            key={layout.id}
                            layout={layout}
                            showFavorite={false}
                            showActions={true}
                            showEdit={false}
                            showDateTime={false}
                            isFavorite={isSaved(layout.id)}
                            onPress={() => { }}
                            onToggleFavorite={() => onToggleSaved(layout.id)}
                            onEdit={() => onEditLayout(layout)}
                            onEditOptions={() => onEditOptions?.(layout)}
                            isSelecting={isSelecting}
                            selected={selectedItems.has(layout.id)}
                            onSelect={onSelect}
                            bubbleAnchorRef={!isSelecting && anchorId === layout.id ? bubbleRef : undefined}
                        />
                    ))
                ) : (
                    <Container width={"90%"} style={{ marginVertical: 8 }}>
                        <EmptyState
                            icon="bandage-outline"
                            title="No saved splits yet"
                            subtitle="Combine templates to create workout split"
                        />
                    </Container>
                )}
            </IList>
        </>
    );
};

const styles = StyleSheet.create({
    filterBar: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
    },
    filters: {
        flexDirection: 'row',
        gap: 8,
    },
});

export default SplitsTab;
