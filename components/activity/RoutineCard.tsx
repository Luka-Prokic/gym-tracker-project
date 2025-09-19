import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import Container from '../containers/Container';
import IButton from '../buttons/IButton';
import { Ionicons } from '@expo/vector-icons';
import { Layout } from '../context/ExerciseLayoutZustand';
import { isGymExercise } from '../context/utils/GymUtils';
import { useRoutine } from '../context/RoutineZustand';
import hexToRGBA from '../../assets/hooks/HEXtoRGB';
import { useBodyParts } from '../../hooks/useBodyParts';


interface RoutineCardProps {
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

const RoutineCard: React.FC<RoutineCardProps> = ({
    layout,
    showFavorite = false,
    isFavorite = false,
    showActions = false,
    showEdit = true,
    savedContext = false,
    customName,
    showDateTime = false,
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

    // Glass background colors similar to ISlide
    const glassBackgroundColor = {
        light: "rgba(255, 255, 255, 0.5)",
        peachy: "rgba(255, 242, 252, 0.5)",
        oldschool: "rgba(255, 255, 255, 0.5)",
        dark: "rgba(150, 150, 150, 0.5)",
        preworkout: "rgba(169, 169, 140, 0.5)",
        Corrupted: "rgba(115, 98, 98, 0.69)",
    }[theme as Themes];

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
            // Extract start time from layout ID (format: "gym_" + timestamp)
            const timestampMatch = layout.id.match(/gym_(\d+)/);
            if (timestampMatch) {
                const timestamp = parseInt(timestampMatch[1]);
                const date = new Date(timestamp);
                
                // Always show start time in 24-hour format
                return date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
        }

        // Default: show exercise count
        const exerciseCount = layout.layout.filter(ex => isGymExercise(ex)).length;
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
        <Container width={"100%"} style={styles.routineCard}>
            <Pressable
                style={[styles.cardContent, { backgroundColor: glassBackgroundColor }]}
                onPress={handleCardPress}
            >
                {/* Main content area */}
                <View style={styles.mainContent}>
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
                        <Text style={[styles.routineTitle, { color: color.text }]} numberOfLines={1} ellipsizeMode="tail">
                            {title}
                        </Text>
                        <View style={styles.statsContainer}>
                            <Text style={[styles.routineStats, { color: color.text }]}>
                                {stats}
                            </Text>
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

                    </View>
                    {showFavorite && (
                        <IButton width={40} height={40} onPress={onToggleFavorite} disabled={!!isSelecting}>
                            <Ionicons
                                name={isFavorite ? "bookmark" : "bookmark-outline"}
                                size={24}
                                color={isFavorite ? color.accent : color.grayText}
                            />
                        </IButton>
                    )}
                </View>

                {/* Bottom left corner - Delete button */}
                {showActions && (
                    <View style={styles.bottomLeftButton}>
                        <IButton ref={bubbleAnchorRef as any} width={32} height={32} onPress={onDelete} disabled={!!isSelecting}>
                            <Ionicons
                                name={savedContext ? "bookmark" : "trash-outline"}
                                size={18}
                                color={color.error}
                            />
                        </IButton>
                    </View>
                )}

                {/* Bottom right corner - Tap to recap button */}
                <View style={styles.bottomRightButton}>
                    <View style={styles.cardFooter}>
                        <View style={[styles.difficultyIndicator, { backgroundColor: color.accent }]} />
                        <Text style={[styles.startText, { color: color.accent }]}>
                            Tap to recap
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Container>
    );
};

const styles = StyleSheet.create({
    routineCard: {
        marginBottom: 8,
        width: '100%',
    },
    cardContent: {
        borderRadius: 12,
        padding: 16,
        height: 264,
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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 40, // Space for bottom left button
    },
    cardInfo: {
        flex: 1,
        marginRight: 8,
    },
    bottomLeftButton: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 1,
    },
    bottomRightButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 1,
    },
    routineTitle: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 38,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
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

export default RoutineCard;
