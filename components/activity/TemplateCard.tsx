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
import { useBodyParts } from '../../hooks/useBodyParts';

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
    const bodyParts = useBodyParts(layout);

    // Glass background using thirdBackground for differentiation from RoutineCard
    const glassBackgroundColor = hexToRGBA(color.thirdBackground, 0.5);

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
                    // Today - show time in 24-hour format
                    return date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
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
        
        if (exerciseCount === 0) {
            return "no exercises";
        } else if (exerciseCount === 1) {
            return "1 exercise";
        } else {
            return `${exerciseCount} exercises`;
        }
    };

    const title = getRoutineTitle(layout);
    const stats = getRoutineStats(layout);
    const status = getRoutineStatus(layout);

    const handleCardPress = () => {
        if (isSelecting) {
            onSelect?.(layout.id);
        } else {
            onEdit?.();
        }
    };

    return (
        <Container width={"100%"} style={styles.templateCard}>
            <Pressable
                style={[styles.cardContent, { backgroundColor: glassBackgroundColor }]}
                onPress={handleCardPress}
            >
                {/* Main content area */}
                <View style={styles.mainContent}>
                    {/* Description section - 85% width */}
                    <View style={styles.descriptionSection}>
                        <View style={styles.cardInfo}>
                            <Text style={[styles.routineTitle, { color: color.text }]} numberOfLines={1} ellipsizeMode="tail">
                                {title}
                            </Text>
                            <View style={styles.statsContainer}>
                                <View style={styles.bodyPartsTags}>
                                    {bodyParts.slice(0, 3).map((bodyPart, index) => (
                                        <Text 
                                            key={index}
                                            style={[styles.statusBadge, { 
                                                color: status === 'template' ? color.accent : color.tint,
                                                backgroundColor: hexToRGBA(status === 'template' ? color.accent : color.tint, 0.1)
                                            }]}
                                        >
                                            {bodyPart.name}
                                        </Text>
                                    ))}
                                    {bodyParts.length > 3 && (
                                        <Text
                                            style={[styles.statusBadge, {
                                                color: status === 'template' ? color.accent : color.tint,
                                                backgroundColor: hexToRGBA(status === 'template' ? color.accent : color.tint, 0.1)
                                            }]}
                                        >
                                            ...
                                        </Text>
                                    )}
                                </View>
                            </View>
                            {/* Bottom section with Tap to edit/select and exercise counter */}
                            <View style={styles.bottomSection}>
                                <View style={styles.cardFooter}>
                                    <View style={[styles.difficultyIndicator, { backgroundColor: color.accent }]} />
                                    <Text style={[styles.startText, { color: color.accent }]}>
                                        {isSelecting ? 'Tap to select' : 'Tap to edit'}
                                    </Text>
                                </View>
                                <Text style={[styles.routineStats, { color: color.text }]}>
                                    {stats}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Buttons section - 15% width */}
                    <View style={styles.buttonsSection}>
                        {isSelecting ? (
                            /* Selection mode - only show selection button */
                            <IButton width={40} height={40} onPress={() => onSelect?.(layout.id)}>
                                <Ionicons
                                    name={selected ? "checkbox" : "square-outline"}
                                    size={24}
                                    color={color.text}
                                />
                            </IButton>
                        ) : (
                            /* Normal mode - show all other buttons */
                            <>
                                {showFavorite && (
                                    <IButton width={40} height={40} onPress={onToggleFavorite}>
                                        <Ionicons
                                            name={isFavorite ? "bookmark" : "bookmark-outline"}
                                            size={24}
                                            color={isFavorite ? color.accent : color.grayText}
                                        />
                                    </IButton>
                                )}
                                {showActions && (
                                    <View style={styles.actionsContainer}>
                                        <IButton ref={bubbleAnchorRef as any} width={32} height={32} onPress={onDelete}>
                                            <Ionicons
                                                name={savedContext ? "bookmark" : "trash-outline"}
                                                size={18}
                                                color={color.error}
                                            />
                                        </IButton>
                                        {showEdit && (
                                            <IButton width={32} height={32} onPress={onPress}>
                                                <Ionicons name="play" size={18} color={color.accent} />
                                            </IButton>
                                        )}
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </Pressable>
        </Container>
    );
};

const styles = StyleSheet.create({
    templateCard: {
        marginBottom: 8,
        width: '100%',
    },
    cardContent: {
        borderRadius: 12,
        padding: 16,
        height: 132,
        width: '100%',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative',
        backdropFilter: 'blur(20px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    mainContent: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'stretch',
    },
    descriptionSection: {
        width: '85%',
        paddingRight: 8,
    },
    buttonsSection: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    cardInfo: {
        flex: 1,
    },
    actionsContainer: {
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center',
    },
    routineTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 28,
    },
    statsContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 16,
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    routineStats: {
        fontSize: 13,
        fontWeight: '400',
    },
    statusBadge: {
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        textTransform: 'uppercase',
    },
    bodyPartsTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
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
