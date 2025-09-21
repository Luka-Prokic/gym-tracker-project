import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import Container from '../containers/Container';
import IButton from '../buttons/IButton';
import ISlide from '../bubbles/ISlide';
import { useRoutineData } from './hooks/useRoutineData';

interface FullCalendarProps {
    visible: boolean;
    onClose: () => void;
    onDateSelect: (date: Date) => void;
    selectedDate?: Date | null | undefined;
    sharedSelectedDate?: Date | null;
    onSharedDateChange?: (date: Date | null) => void;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function FullCalendar({ visible, onClose, onDateSelect, selectedDate, sharedSelectedDate, onSharedDateChange }: FullCalendarProps) {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const today = useMemo(() => new Date(), []); // Memoize today to prevent re-renders
    const scrollViewRef = useRef<ScrollView>(null);

    const [months, setMonths] = useState<Date[]>([]);
    const [selectedDay, setSelectedDay] = useState<Date | null>(selectedDate || null);
    const [currentVisibleYear, setCurrentVisibleYear] = useState<number>(new Date().getFullYear());

    // Get routine data to check for workouts on specific dates
    const { recentRoutines } = useRoutineData();

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

    // Initialize months array and scroll to bottom
    useEffect(() => {
        if (visible) {
            const targetDate = selectedDate || new Date();
            const monthsArray = [];

            // Load 12 previous months + current month
            for (let i = 12; i >= 0; i--) {
                const month = new Date(targetDate);
                month.setMonth(targetDate.getMonth() - i);
                monthsArray.push(month);
            }

            setMonths(monthsArray);

            // Scroll to the very bottom of all content
            setTimeout(() => {
                // Get the total content height and scroll to the bottom
                scrollViewRef.current?.scrollToEnd({ animated: false });

                // Update the visible year to match the target date
                setCurrentVisibleYear(targetDate.getFullYear());
            }, 100);
        }
    }, [visible, selectedDate]);

    // Sync shared selected date back to local selectedDay
    useEffect(() => {
        if (sharedSelectedDate && sharedSelectedDate !== selectedDay) {
            setSelectedDay(sharedSelectedDate);
        }
    }, [sharedSelectedDate, selectedDay]);

    // Generate calendar days for a specific month (only current month dates)
    const generateCalendarDays = (month: Date) => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();

        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);

        const days = [];
        const current = new Date(firstDay);

        // Generate only the days of the current month
        while (current <= lastDay) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const monthHeight = 280; // Approximate height of each month card

        // Calculate which month is currently visible
        const currentMonthIndex = Math.round(offsetY / monthHeight);
        if (currentMonthIndex >= 0 && currentMonthIndex < months.length) {
            const currentMonth = months[currentMonthIndex];
            if (currentMonth) {
                setCurrentVisibleYear(currentMonth.getFullYear());
            }
        }
    };

    const handleDateSelect = (date: Date) => {
        // Only allow selection of past and current dates
        if (date <= today) {
            setSelectedDay(date);
            onDateSelect(date);
            // Update shared state
            if (onSharedDateChange) {
                onSharedDateChange(date);
            }
            onClose();
        }
    };

    const isSelected = (date: Date) => {
        return selectedDay && date.toDateString() === selectedDay.toDateString();
    };

    const isFuture = (date: Date) => {
        return date > today;
    };

    return (
        <ISlide
            visible={visible}
            onClose={onClose}
            size="large"
            type="glass"
        >
            <Container width="100%" style={styles.container}>
                <Text style={[styles.yearText, { color: color.text }]}>
                    {currentVisibleYear}
                </Text>
                <Text style={[styles.scrollHint, { color: color.grayText }]}>
                    Scroll to navigate months
                </Text>

                {/* Scrollable Calendar with Month Cards */}
                <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {months.map((month, monthIndex) => {
                        const monthName = MONTHS[month.getMonth()];
                        const year = month.getFullYear();
                        const calendarDays = generateCalendarDays(month);

                        return (
                            <View key={`${month.getMonth()}-${year}`} style={styles.monthCard}>
                                {/* Month Header */}
                                <Text style={[styles.monthYear, { color: color.text }]}>
                                    {monthName}
                                </Text>

                                {/* Days of week header */}
                                <View style={styles.daysHeader}>
                                    {DAYS_OF_WEEK.map((day, index) => (
                                        <Text key={`${monthIndex}-day-${index}`} style={[styles.dayHeader, { color: color.grayText }]}>
                                            {day}
                                        </Text>
                                    ))}
                                </View>

                                {/* Calendar Grid */}
                                <View style={styles.calendarGrid}>
                                    {calendarDays.map((date, index) => {
                                        const dayNumber = date.getDate();
                                        const dayOfWeek = date.getDay();
                                        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday-based (0-6)

                                        const isSelectedDay = isSelected(date);
                                        const isFutureDay = isFuture(date);

                                        return (
                                            <View
                                                key={`${monthIndex}-${index}`}
                                                style={[
                                                    styles.dayCell,
                                                    { marginLeft: index === 0 ? mondayOffset * 44 : 0 }
                                                ]}
                                            >
                                                <IButton
                                                    width={40}
                                                    height={40}
                                                    onPress={isFutureDay ? undefined : () => handleDateSelect(date)}
                                                    style={[
                                                        styles.dayButton,
                                                        {
                                                            backgroundColor: isSelectedDay
                                                                ? (date.toDateString() === today.toDateString() ? color.accent : color.grayText)
                                                                : hasWorkoutOnDate(date)
                                                                    ? color.tint
                                                                    : 'transparent',
                                                            opacity: isFutureDay ? 0.3 : 1,
                                                        }
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.dayText,
                                                        {
                                                            color: isSelectedDay
                                                                ? color.primaryBackground
                                                                : hasWorkoutOnDate(date)
                                                                    ? color.primaryBackground
                                                                    : isFutureDay
                                                                        ? color.grayText
                                                                        : color.text
                                                        }
                                                    ]}>
                                                        {dayNumber}
                                                    </Text>
                                                </IButton>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </Container>
        </ISlide>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        paddingHorizontal: 20,
        paddingBottom: 20,
        height: 400,
    },
    yearText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 5,
    },
    monthYear: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 15,
    },
    scrollHint: {
        fontSize: 12,
        marginBottom: 15,
        opacity: 0.7,
        paddingTop: 0,
        marginTop: 0,
    },
    daysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    dayHeader: {
        fontSize: 12,
        fontWeight: '500',
        width: 44,
        textAlign: 'center',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    monthCard: {
        padding: 15,
        marginBottom: 15,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    dayCell: {
        width: 44,
        height: 44,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButton: {
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
