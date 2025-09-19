import { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import Container from '../containers/Container';
import IList from '../containers/IList';
import RoutineCard from './RoutineCard';
import IButton from '../buttons/IButton';
import { useRoutineData } from './hooks/useRoutineData';
import { useSavedRoutines } from './hooks/useSavedRoutines';
import { useStartNewRoutine } from '../../assets/hooks/useStartNewRoutine';

interface WorkoutsTabProps {
    isSelecting: boolean;
    selectedItems: Set<string>;
    onSelect: (id: string) => void;
    onDeleteRecent: (routine: any) => void;
    bubbleAnchorRef?: any;
    anchorId?: string | null;
    onDateChange?: (date: string, dateObj?: Date) => void;
    navigateToDate?: Date | null;
    onGetCurrentDate?: (getCurrentDate: () => Date | null) => void;
    sharedSelectedDate?: Date | null;
    onSharedDateChange?: (date: Date | null) => void;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper function to get week dates starting from Monday with week offset
const getWeekDates = (weekOffset: number = 0, today: Date) => {
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to get Monday

    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date);
    }

    return weekDates;
};

export default function WorkoutsTab({
    isSelecting,
    selectedItems,
    onSelect,
    onDeleteRecent,
    bubbleAnchorRef,
    anchorId,
    onDateChange,
    navigateToDate,
    onGetCurrentDate,
    sharedSelectedDate,
    onSharedDateChange
}: WorkoutsTabProps) {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const today = useMemo(() => new Date(), []); // Memoize today to prevent re-renders

    // Calculate dynamic button size to fit 7 buttons with larger gaps
    const screenWidth = Dimensions.get('window').width;
    const containerPadding = 16; // 8px on each side for the 90% container
    const gapSize = 4; // Increased gap size
    const totalGaps = 6 * gapSize; // 6 gaps between 7 buttons
    const availableWidth = (screenWidth * 0.9) - containerPadding - totalGaps;
    const buttonSize = Math.floor(availableWidth / 7);
    const [weekOffset, setWeekOffset] = useState<number>(0); // 0 = current week, -1 = previous week, 1 = next week
    const [selectedDay, setSelectedDay] = useState<number>(0);
    const scrollViewRef = useRef<Animated.ScrollView>(null);

    // Animated value for sliding background
    const animatedPosition = useSharedValue(0);

    // Get current week dates and find today's index (memoized to prevent re-renders)
    const weekDates = useMemo(() => getWeekDates(weekOffset, today), [weekOffset, today]);
    const todayIndex = useMemo(() =>
        weekDates.findIndex(date => date.toDateString() === today.toDateString()),
        [weekDates, today]
    );

    // Auto-select today when week changes to current week (offset 0)
    useEffect(() => {
        if (weekOffset === 0 && todayIndex >= 0) {
            setSelectedDay(todayIndex);
        }
    }, [weekOffset, todayIndex]);

    // Animate background position when selected day changes
    useEffect(() => {
        animatedPosition.value = withTiming(selectedDay, {
            duration: 250,
        });
    }, [selectedDay]);

    // Provide function to get current selected date
    const getCurrentDate = useMemo(() => {
        return () => {
            const currentWeekDates = getWeekDates(weekOffset, today);
            if (currentWeekDates && currentWeekDates[selectedDay]) {
                return currentWeekDates[selectedDay];
            }
            return null;
        };
    }, [weekOffset, selectedDay, today]);

    useEffect(() => {
        if (onGetCurrentDate) {
            onGetCurrentDate(getCurrentDate);
        }
    }, [onGetCurrentDate, getCurrentDate]);

    // Handle navigation to specific date from FullCalendar
    useEffect(() => {
        if (navigateToDate) {
            const targetDate = new Date(navigateToDate);

            // Calculate the week offset needed to show this date
            const targetWeekStart = new Date(targetDate);
            const dayOfWeek = targetDate.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            targetWeekStart.setDate(targetDate.getDate() + mondayOffset);

            // Calculate the week offset relative to current week
            const currentWeekStart = new Date(today);
            const currentDayOfWeek = today.getDay();
            const currentMondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
            currentWeekStart.setDate(today.getDate() + currentMondayOffset);

            // Calculate the difference in weeks
            const timeDiff = targetWeekStart.getTime() - currentWeekStart.getTime();
            const weeksDiff = Math.round(timeDiff / (7 * 24 * 60 * 60 * 1000));

            // Update week offset
            setWeekOffset(weeksDiff);

            // Find the day index within that week
            const weekDatesForTarget = getWeekDates(weeksDiff, today);
            const dayIndex = weekDatesForTarget.findIndex(date =>
                date.toDateString() === targetDate.toDateString()
            );

            if (dayIndex >= 0) {
                setSelectedDay(dayIndex);
            }
        }
    }, [navigateToDate, today]);

    // Sync shared selected date back to local selectedDay
    useEffect(() => {
        if (sharedSelectedDate) {
            const dayIndex = weekDates.findIndex(date =>
                date.toDateString() === sharedSelectedDate.toDateString()
            );
            if (dayIndex >= 0 && dayIndex !== selectedDay) {
                setSelectedDay(dayIndex);
            }
        }
    }, [sharedSelectedDate, weekDates, selectedDay]);

    // Update parent component with selected date
    useEffect(() => {
        const currentSelectedDate = weekDates[selectedDay];
        if (currentSelectedDate && onDateChange) {
            let dateLabel;
            if (currentSelectedDate.toDateString() === today.toDateString()) {
                dateLabel = 'Today';
            } else if (currentSelectedDate.toDateString() === new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
                dateLabel = 'Yesterday';
            } else {
                dateLabel = currentSelectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                });
            }

            onDateChange(dateLabel, currentSelectedDate);
        }
    }, [selectedDay, weekDates, today, onDateChange]);

    // Activity hooks
    const { recentRoutines, allLayouts } = useRoutineData();
    const { toggleSaved, isSaved } = useSavedRoutines();
    const { startNewRoutine } = useStartNewRoutine();

    // Generate display name for recent workouts
    const getRecentWorkoutName = (layout: any, routine: any) => {
        // Use layout name if it exists (for templates), otherwise use "Workout"
        return layout?.name || 'Workout';
    };

    // Helper function to check if a workout was done on a specific date
    const hasWorkoutOnDate = (date: Date) => {
        const dateString = date.toDateString();
        return recentRoutines.some((routine) => {
            if (routine.lastStartTime) {
                const routineDate = new Date(routine.lastStartTime);
                return routineDate.toDateString() === dateString;
            }
            return false;
        });
    };

    // Filter routines by selected day
    const selectedDate = weekDates[selectedDay];
    const selectedDateString = selectedDate.toDateString();

    const filteredRoutines = recentRoutines.filter((routine) => {
        if (routine.lastStartTime) {
            const routineDate = new Date(routine.lastStartTime);
            return routineDate.toDateString() === selectedDateString;
        }
        return false;
    });

    // Create date label for selected day
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Create date label for selected day
    let dateLabel;
    if (selectedDate.toDateString() === today.toDateString()) {
        dateLabel = 'Today';
    } else if (selectedDate.toDateString() === yesterday.toDateString()) {
        dateLabel = 'Yesterday';
    } else {
        dateLabel = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    }

    // Check if today is selected and has no workouts
    const isTodaySelected = selectedDate.toDateString() === today.toDateString();
    const hasNoWorkoutsToday = isTodaySelected && filteredRoutines.length === 0;

    // Check if other day is selected and has no workouts
    const hasNoWorkoutsOtherDay = !isTodaySelected && filteredRoutines.length === 0;

    const handleDayPress = (dayIndex: number) => {
        setSelectedDay(dayIndex);
        // Update shared state with the selected date
        if (onSharedDateChange && weekDates[dayIndex]) {
            onSharedDateChange(weekDates[dayIndex]);
        }
    };

    const handleWeekChange = (direction: 'prev' | 'next') => {
        const newOffset = direction === 'prev' ? weekOffset - 1 : weekOffset + 1;
        setWeekOffset(newOffset);

        // Get the new week dates
        const newWeekDates = getWeekDates(newOffset, today);

        // Determine which day to select
        let selectedDayIndex;
        if (newOffset === 0) {
            // If returning to current week, select today
            const todayIndex = newWeekDates.findIndex(date =>
                date.toDateString() === today.toDateString()
            );
            selectedDayIndex = todayIndex >= 0 ? todayIndex : 0;
        } else {
            // For other weeks, select Monday (index 0) when going to next week, Sunday (index 6) when going to previous week
            selectedDayIndex = direction === 'next' ? 0 : 6;
        }

        setSelectedDay(selectedDayIndex);

        // Update shared state with the selected day of the new week
        if (onSharedDateChange && newWeekDates[selectedDayIndex]) {
            onSharedDateChange(newWeekDates[selectedDayIndex]);
        }
    };

    // Animated style for sliding background
    const animatedBackgroundStyle = useAnimatedStyle(() => {
        // Calculate positions based on space-between layout
        const circleSize = 28;
        const containerWidth = screenWidth * 0.9; // Available width for weekday letters

        const positions = [0, 1, 2, 3, 4, 5, 6].map(index => {
            if (index === 0) return (buttonSize / 2) - (circleSize / 2); // First letter
            if (index === 6) return containerWidth - (buttonSize / 2) - (circleSize / 2); // Last letter
            // Middle letters distributed evenly
            return (index / 6) * (containerWidth - buttonSize) + (buttonSize / 2) - (circleSize / 2);
        });

        const translateX = interpolate(
            animatedPosition.value,
            [0, 1, 2, 3, 4, 5, 6],
            positions
        );

        return {
            transform: [{ translateX }],
            top: 0,
        };
    });

    return (
        <>
            {/* Calendar Header */}
            <Container width={"90%"} style={styles.calendarContainer}>
                {/* Week Navigation Arrows Above Day Labels */}
                <View style={styles.weekNavContainer}>
                    <IButton
                        width={32}
                        height={32}
                        onPress={() => handleWeekChange('prev')}
                        style={[styles.weekNavButton, { backgroundColor: 'transparent', borderColor: 'transparent' }]}
                    >
                        <Ionicons name="chevron-back" size={22} color={color.text} />
                    </IButton>

                    <View style={styles.weekNavSpacer} />

                    <IButton
                        width={32}
                        height={32}
                        onPress={weekOffset >= 0 ? undefined : () => handleWeekChange('next')}
                        style={[
                            styles.weekNavButton,
                            {
                                backgroundColor: 'transparent',
                                borderColor: 'transparent',
                                opacity: weekOffset >= 0 ? 0.4 : 1
                            }
                        ]}
                    >
                        <Ionicons
                            name="chevron-forward"
                            size={22}
                            color={weekOffset >= 0 ? color.grayText : color.text}
                        />
                    </IButton>
                </View>

                {/* Day Labels */}
                <View style={[styles.dayLabelsRow, { height: 28 }]}>
                    {/* Animated sliding background */}
                    <Animated.View
                        style={[
                            animatedBackgroundStyle,
                            styles.animatedBackground,
                            {
                                backgroundColor: weekDates[selectedDay]?.toDateString() === today.toDateString()
                                    ? color.accent
                                    : color.grayText,
                                // width: buttonSize / 2,
                                // height: buttonSize / 2,
                            }
                        ]}
                    />

                    {/* Day labels */}
                    {DAY_LABELS.map((label, index) => {
                        const isSelected = selectedDay === index;

                        return (
                            <View key={`day-label-${index}`} style={[styles.dayLabelContainer, { width: buttonSize }]}>
                                <Text style={[
                                    styles.dayLabel,
                                    {
                                        color: isSelected ? color.background : color.grayText,
                                    }
                                ]}>
                                    {label}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Day Buttons */}
                <View style={[styles.dayButtonsRow, { height: buttonSize }]}>
                    {weekDates.map((date, index) => {
                        const dayNumber = date.getDate();
                        const isFuture = date.getTime() > today.getTime();
                        const isDisabled = isFuture;
                        const hasWorkout = hasWorkoutOnDate(date);

                        return (
                            <IButton
                                key={`${weekOffset}-${index}`}
                                width={buttonSize}
                                height={buttonSize}
                                onPress={isDisabled ? undefined : () => handleDayPress(index)}
                                style={[
                                    styles.dayButton,
                                    {
                                        backgroundColor: hasWorkout ? color.tint : color.primaryBackground,
                                        opacity: isDisabled ? 0.4 : 1,
                                        borderRadius: buttonSize / 2,
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.dayButtonText,
                                    {
                                        color: hasWorkout ? color.secondaryText : (isDisabled ? color.grayText : color.text)
                                    }
                                ]}>
                                    {dayNumber}
                                </Text>
                            </IButton>
                        );
                    })}
                </View>
            </Container>

            {/* Workout List */}
            <IList background="transparent" width={'90%'} hrStart="None">
                {filteredRoutines.map((routine) => {
                    const layout = allLayouts.find(l => l.id === routine.layoutId);
                    if (!layout) return null;
                    return (
                        <RoutineCard
                            key={routine.id}
                            layout={layout}
                            customName={getRecentWorkoutName(layout, routine)}
                            showFavorite={false}
                            showActions={true}
                            showEdit={false}
                            showDateTime={true}
                            isFavorite={isSaved(layout.id)}
                            onPress={() => router.push(`/modals/workoutRecap?routineId=${routine.id}&layoutId=${layout.id}`)}
                            onToggleFavorite={() => toggleSaved(layout.id)}
                            onDelete={() => onDeleteRecent(routine)}
                            isSelecting={isSelecting}
                            selected={selectedItems.has(layout.id)}
                            onSelect={onSelect}
                            bubbleAnchorRef={!isSelecting && anchorId === routine.id ? bubbleAnchorRef : undefined}
                        />
                    );
                })}
            </IList>

            {/* Quick Start Section - Only show on today when no workouts */}
            {hasNoWorkoutsToday && (
                <Container width={"90%"} style={styles.quickStartContainer}>
                    <View style={styles.quickStartTextContainer}>
                        <Text style={[styles.quickStartTitle, { color: color.text }]}>
                            Still waiting?
                        </Text>
                        <Text style={[styles.quickStartSubtitle, { color: color.grayText }]}>
                            No workout logged for today yet
                        </Text>
                    </View>
                    <IButton
                        width={"100%"}
                        height={44}
                        title="Quick Start"
                        color={color.primaryBackground}
                        textColor={color.text}
                        onPress={() => startNewRoutine({ navigationMethod: 'replace' })}
                    />
                </Container>
            )}

            {/* No Workout Message - Show for other days with no workouts */}
            {hasNoWorkoutsOtherDay && (
                <Container width={"90%"} style={styles.noWorkoutContainer}>
                    <View style={styles.noWorkoutTextContainer}>
                        <Text style={[styles.noWorkoutTitle, { color: color.text }]}>
                            Rest day
                        </Text>
                        <Text style={[styles.noWorkoutSubtitle, { color: color.grayText }]}>
                            No workout was logged on this day
                        </Text>
                    </View>
                </Container>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    calendarContainer: {
        gap: 4,
    },
    dayLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    animatedBackground: {
        position: 'absolute',
        borderRadius: '50%',
        height: 28,
        width: 28,
    },
    dayLabelContainer: {
        alignItems: 'center',
        zIndex: 1,
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    weekNavContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    weekNavSpacer: {
        flex: 1,
    },
    weekNavButton: {
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    dayButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    quickStartContainer: {
        marginTop: 16,
        gap: 16,
    },
    quickStartTextContainer: {
        alignItems: 'center',
        gap: 8,
    },
    quickStartTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    quickStartSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.8,
    },
    noWorkoutContainer: {
        marginTop: 16,
    },
    noWorkoutTextContainer: {
        alignItems: 'center',
        gap: 8,
        paddingVertical: 24,
    },
    noWorkoutTitle: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
    noWorkoutSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.7,
    },
});
