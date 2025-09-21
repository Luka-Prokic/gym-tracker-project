import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import { Layout } from '../context/ExerciseLayoutZustand';
import TemplateCard from './TemplateCard';
import IList from '../containers/IList';
import Container from '../containers/Container';
import { TemplateSearchBar } from './TemplateSearchBar';
import { TemplateSortFilter } from './TemplateSortFilter';
import IToggleButtons from '../buttons/IToggleButtons';
import EmptyState from './EmptyState';
import IButton from '../buttons/IButton';
import { Ionicons } from '@expo/vector-icons';
import { SCREEN_WIDTH } from '@/constants/ScreenWidth';

interface TemplatesTabProps {
    templateLayouts: Layout[];
    isSelecting: boolean;
    selectedItems: Set<string>;
    onSelect: (id: string) => void;
    onToggleSaved: (id: string) => void;
    isSaved: (id: string) => boolean;
    onCreateTemplate?: (templateName?: string) => void;
    onEditOptions?: (layout: Layout) => void;
    bubbleRef?: React.RefObject<any>;
    anchorId?: string;
}

export type SortMode = 'name' | 'date';
export type SortOrder = 'asc' | 'desc';

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
    templateLayouts = [],
    isSelecting,
    selectedItems,
    onSelect,
    onToggleSaved,
    isSaved,
    onCreateTemplate,
    onEditOptions,
    bubbleRef,
    anchorId
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const [searchQuery, setSearchQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Helper function to extract timestamp from layout ID
    const extractTimestamp = (layoutId: string): number => {
        const match = layoutId.match(/gym_(\d+)/);
        return match ? parseInt(match[1]) : 0;
    };


    // Filter and sort templates
    const filteredAndSortedTemplates = useMemo(() => {
        if (!templateLayouts) return [];

        let filtered = templateLayouts.filter(layout => {
            // Search filter
            const matchesSearch = searchQuery.trim() === '' ||
                (layout.name && layout.name.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesSearch;
        });

        // Sort templates
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
    }, [templateLayouts, searchQuery, sortMode, sortOrder]);

    return (
        <>
            {/* Search and Filter Bar */}
            <View style={[styles.filterBar, { backgroundColor: color.background }]}>
                <TemplateSearchBar value={searchQuery} onChangeText={setSearchQuery} />
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

            {/* Templates List */}
            <IList label="" background="transparent" width={'90%'} hrStart="None" style={{ marginBottom: 12 }}>
                {filteredAndSortedTemplates.length > 0 ? (
                    filteredAndSortedTemplates.map((layout) => (
                        <TemplateCard
                            key={layout.id}
                            layout={layout}
                            showFavorite={false}
                            showActions={true}
                            showDateTime={false}
                            isFavorite={isSaved(layout.id)}
                            onPress={() => {}}
                            onToggleFavorite={() => onToggleSaved(layout.id)}
                            onEditOptions={() => onEditOptions?.(layout)}
                            isSelecting={isSelecting}
                            selected={selectedItems.has(layout.id)}
                            onSelect={onSelect}
                            bubbleAnchorRef={!isSelecting && anchorId === layout.id ? bubbleRef : undefined}
                        />
                    ))
                ) : (
                    <Container width={"90%"} style={{ marginVertical: 8 }}>
                        {searchQuery ? (
                            // Custom empty state for search results
                            <Container width={"100%"} style={styles.searchEmptyState}>
                                <Ionicons name="bandage-outline" size={48} color={color.grayText} />
                                <Text style={[styles.emptyText, { color: color.grayText }]}>
                                    No matching templates
                                </Text>
                                <Text style={[styles.emptySubtext, { color: color.grayText }]}>
                                    Try something else or you can create new one with this name?
                                </Text>
                                <IButton
                                    width={"100%"}
                                    height={44}
                                    title={`Create "${searchQuery}"`}
                                    color={color.primaryBackground}
                                    textColor={color.accent}
                                    onPress={() => onCreateTemplate?.(searchQuery)}
                                    style={styles.createButton}
                                />
                            </Container>
                        ) : (
                            // Regular empty state for no templates
                            <EmptyState
                                icon="bandage-outline"
                                title="No templates yet"
                                subtitle="Start by creating your first template"
                                buttonText="Create Template"
                                onButtonPress={() => onCreateTemplate?.()}
                            />
                        )}
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
        marginTop: 12,
    },
    searchEmptyState: {
        alignItems: 'center',
        padding: 24,
        gap: 12,
    },
    emptyText: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '400',
    },
    createButton: {
        marginTop: 8,
    },
});

export default TemplatesTab;
