import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import Container from '../containers/Container';
import IButton from '../buttons/IButton';
import { Ionicons } from '@expo/vector-icons';
import { Layout } from '../context/ExerciseLayoutZustand';
import { isGymExercise, isSuperSet, isCardioExercise } from '../context/utils/GymUtils';
import { useRoutine } from '../context/RoutineZustand';
import hexToRGBA from '../../assets/hooks/HEXtoRGB';
import { SCREEN_WIDTH } from '@/constants/ScreenWidth';

interface TemplateCardProps {
    layout: Layout;
    showFavorite?: boolean;
    isFavorite?: boolean;
    showActions?: boolean;
    showEdit?: boolean;
    savedContext?: boolean;
    customName?: string;
    showDateTime?: boolean;
    onPress: () => void;
    onToggleFavorite?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    isSelecting?: boolean;
    selected?: boolean;
    onSelect?: (id: string) => void;
    bubbleAnchorRef?: React.RefObject<any>;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
    layout,
    showFavorite = false,
    isFavorite = false,
    showActions = true,
    showEdit = true,
    savedContext = false,
    customName,
    showDateTime = true,
    onPress,
    onToggleFavorite,
    onEdit,
    onDelete,
    isSelecting,
    selected,
    onSelect,
    bubbleAnchorRef
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { routines } = useRoutine();

    const getRoutineTitle = (layout: Layout) => {
        // Use custom name if provided (for recent workouts), otherwise use layout name
        return customName || layout.name || 'Unnamed Layout';
    };

    const getRoutineStatus = (layout: Layout) => {
        // Find the routine associated with this layout
        const associatedRoutine = routines.find(routine => routine.layoutId === layout.id);
        return associatedRoutine?.status || 'unknown';
    };

    const getRoutineStats = (layout: Layout) => {
        if (showDateTime) {
            // Extract creation date from layout ID (format: "gym_" + timestamp)
            const timestampMatch = layout.id.match(/gym_(\d+)/);
            if (timestampMatch) {
                const timestamp = parseInt(timestampMatch[1]);
                const date = new Date(timestamp);
                const now = new Date();
                const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

                if (diffInHours < 24) {
                    // Today - show time
                    return date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                } else {
                    // Older - show date
                    return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' })
                    });
                }
            }
        }

        // Default: show exercise count (including gym exercises, supersets, and cardio)
        const exerciseCount = layout.layout.filter(ex => 
            isGymExercise(ex) || isSuperSet(ex) || isCardioExercise(ex)
        ).length;
        return `${exerciseCount} exercises`;
    };

    const title = getRoutineTitle(layout);
    const stats = getRoutineStats(layout);
    const status = getRoutineStatus(layout);

    const handleCardPress = () => {
        if (isSelecting) {
            onSelect?.(layout.id);
        } else {
            onPress();
        }
    };

    return (
        <Container >
            <Pressable
                style={[styles.cardContent, { backgroundColor: hexToRGBA(color.primaryBackground, 0.8) }]}
                onPress={handleCardPress}
            >
                <View style={styles.cardHeader}>
                    {isSelecting && (
                        <IButton width={40} height={40} onPress={() => onSelect?.(layout.id)}>
                            <Ionicons
                                name={selected ? "checkbox" : "square-outline"}
                                size={24}
                                color={color.text}
                            />
                        </IButton>
                    )}
                    <View style={styles.cardInfo}>
                        <Text style={[styles.routineTitle, { color: color.text }]} numberOfLines={2}>
                            {title}
                        </Text>
                        <View style={styles.statsContainer}>
                            <Text style={[styles.routineStats, { color: color.grayText }]}>
                                {stats}
                            </Text>
                            <Text style={[styles.statusBadge, { 
                                color: status === 'template' ? color.accent : color.tint,
                                backgroundColor: hexToRGBA(status === 'template' ? color.accent : color.tint, 0.1)
                            }]}>
                                {status}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.cardActions}>
                        {showFavorite && (
                            <IButton width={40} height={40} onPress={onToggleFavorite} disabled={!!isSelecting}>
                                <Ionicons
                                    name={isFavorite ? "bookmark" : "bookmark-outline"}
                                    size={24}
                                    color={isFavorite ? color.accent : color.grayText}
                                />
                            </IButton>
                        )}
                        {showActions && (
                            <View style={styles.actionsContainer}>
                                {showEdit && (
                                    <IButton width={32} height={32} onPress={onEdit} disabled={!!isSelecting}>
                                        <Ionicons name="create-outline" size={18} color={color.accent} />
                                    </IButton>
                                )}
                                <IButton ref={bubbleAnchorRef as any} width={32} height={32} onPress={onDelete} disabled={!!isSelecting}>
                                    <Ionicons
                                        name={savedContext ? "bookmark" : "trash-outline"}
                                        size={18}
                                        color={color.error}
                                    />
                                </IButton>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.cardFooter}>
                    <View style={[styles.difficultyIndicator, { backgroundColor: color.accent }]} />
                    <Text style={[styles.startText, { color: color.accent }]}>
                        Tap to start
                    </Text>
                </View>
            </Pressable>
        </Container>
    );
};

const styles = StyleSheet.create({
    cardContent: {
        borderRadius: 12,
        padding: 16,
        height: 132,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardInfo: {
        flex: 1,
        marginRight: 8,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    routineTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 2,
        lineHeight: 22,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    routineStats: {
        fontSize: 13,
        fontWeight: '400',
    },
    statusBadge: {
        fontSize: 10,
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        textTransform: 'uppercase',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    difficultyIndicator: {
        width: 3,
        height: 12,
        borderRadius: 1.5,
    },
    startText: {
        fontSize: 13,
        fontWeight: '500',
    },
});

export default TemplateCard;
