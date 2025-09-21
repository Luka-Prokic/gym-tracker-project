import { useState } from 'react';

export const useDateManagement = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [navigateToDate, setNavigateToDate] = useState<Date | null>(null);
    const [sharedSelectedDate, setSharedSelectedDate] = useState<Date | null>(new Date());

    const handleCalendarDateSelect = (date: Date) => {
        // Navigate to the selected date in the workouts tab
        setNavigateToDate(date);

        // Clear the navigation after a short delay to allow for re-navigation
        setTimeout(() => {
            setNavigateToDate(null);
        }, 100);
    };

    const handleDateChange = (dateLabel: string) => {
        setSelectedDate(dateLabel);
    };

    const handleSharedDateChange = (date: Date | null) => {
        setSharedSelectedDate(date);
    };

    const openCalendar = () => {
        setIsCalendarVisible(true);
    };

    const closeCalendar = () => {
        setIsCalendarVisible(false);
    };

    return {
        // State
        selectedDate,
        setSelectedDate,
        isCalendarVisible,
        setIsCalendarVisible,
        navigateToDate,
        setNavigateToDate,
        sharedSelectedDate,
        setSharedSelectedDate,
        
        // Handlers
        handleCalendarDateSelect,
        handleDateChange,
        handleSharedDateChange,
        openCalendar,
        closeCalendar,
    };
};
