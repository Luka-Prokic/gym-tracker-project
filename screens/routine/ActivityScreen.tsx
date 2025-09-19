import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Dimensions } from 'react-native';
import { useTheme } from '../../components/context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import List from '../../components/containers/List';
import Container from '../../components/containers/Container';
import IButton from '../../components/buttons/IButton';
import { router, useLocalSearchParams } from 'expo-router';
import { useStartNewRoutine } from '../../assets/hooks/useStartNewRoutine';
import IBubble, { IBubbleSize } from '../../components/bubbles/IBubble';
import ISlide from '../../components/bubbles/ISlide';
import useBubbleLayout from '../../components/bubbles/hooks/useBubbleLayout';
import { useExerciseLayout } from '../../components/context/ExerciseLayoutZustand';
import { useNewLayout } from '../../assets/hooks/useNewLayout';
import { useRoutine } from '../../components/context/RoutineZustand';
import { useNavigation } from '@react-navigation/native';
import LilButton from '../../components/buttons/LilButton';
import ITopBar from '../../components/headers/ITopBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Activity components
import RoutineCard from '../../components/activity/RoutineCard';
import TabButton from '../../components/activity/TabButton';
import EmptyState from '../../components/activity/EmptyState';
import ComingSoon from '../../components/activity/ComingSoon';
import TemplateCard from '../../components/activity/TemplateCard';
import TemplatesTab from '../../components/activity/TemplatesTab';
import WorkoutsTab from '../../components/activity/WorkoutsTab';
import FullCalendar from '../../components/activity/FullCalendar';

// Activity hooks
import { useRoutineData } from '../../components/activity/hooks/useRoutineData';
import { useSavedRoutines } from '../../components/activity/hooks/useSavedRoutines';
import { useActivityTabs } from '../../components/activity/hooks/useActivityTabs';
import IList from '@/components/containers/IList';

export default function ActivityScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const params = useLocalSearchParams();
    const initialTab = (params.tab as 'templates' | 'workouts' | 'saved') || 'templates';

    const tabBackgroundColor = {
        light: "rgba(255, 255, 255, 0.2)",
        peachy: "rgba(255, 255, 255, 0.2)",
        oldschool: "rgba(255, 254, 246, 0.2)",
        dark: "rgba(100, 100, 100, 0.2)",
        preworkout: "rgba(255, 254, 246, 0.2)",
        Corrupted: "rgba(100, 255, 255, 0.2)",
    }[theme as Themes];
    const { startNewRoutine } = useStartNewRoutine();
    const { removeFromSaved, saveLayout } = useExerciseLayout();
    const { removeRoutine } = useRoutine();

    // Activity hooks
    const { templateLayouts, savedLayoutsList } = useRoutineData();
    const { savedRoutineLayouts, toggleSaved, isSaved } = useSavedRoutines();

    const { selectedTab, setSelectedTab, tabs } = useActivityTabs(initialTab);

    // Delete confirmation state
    const [deleteLayout, setDeleteLayout] = useState<any>(null);
    const [deleteRoutine, setDeleteRoutine] = useState<any>(null);
    
    // Start confirmation state
    const [startLayout, setStartLayout] = useState<any>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set<string>());
    const [deleteItems, setDeleteItems] = useState<string[]>([]);
    const { bubbleRef, top, left, height, width, makeBubble, bubbleVisible, popBubble } = useBubbleLayout();
    const [anchorId, setAnchorId] = useState<string | null>(null);
    const [isSlideVisible, setIsSlideVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [navigateToDate, setNavigateToDate] = useState<Date | null>(null);
    const [currentWorkoutsTabDate, setCurrentWorkoutsTabDate] = useState<Date | null>(null);
    const [getCurrentWorkoutsTabDate, setGetCurrentWorkoutsTabDate] = useState<(() => Date | null) | null>(null);

    // Shared selected date state for synchronization between FullCalendar and WorkoutsTab
    const [sharedSelectedDate, setSharedSelectedDate] = useState<Date | null>(new Date());

    const startRoutine = (layout: any) => {
        startNewRoutine({
            fromLayout: layout,
            navigationMethod: 'replace'
        });
    };

    const handleConfirmDelete = () => {
        if (deleteItems.length > 0) {
            if (selectedTab === 'templates') {
                deleteItems.forEach(id => {
                    const { removeLayout } = useExerciseLayout.getState();
                    removeLayout(id);
                });
            } else if (selectedTab === 'workouts') {
                deleteItems.forEach(id => removeRoutine(id));
            } else if (selectedTab === 'saved') {
                deleteItems.forEach(id => removeFromSaved(id));
            }
            setDeleteItems([]);
            setIsSelecting(false);
            setSelectedItems(new Set());
            setIsSlideVisible(false);
        } else if (deleteRoutine) {
            removeRoutine(deleteRoutine.id);
            setDeleteRoutine(null);
            popBubble();
        } else if (deleteLayout) {
            if (selectedTab === 'saved') {
                removeFromSaved(deleteLayout.id);
            } else {
                const { removeLayout } = useExerciseLayout.getState();
                removeLayout(deleteLayout.id);
            }
            setDeleteLayout(null);
            popBubble();
        }
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

    const handleCancelMultiDelete = () => {
        setIsSlideVisible(false);
    };

    const handleDeleteRecent = (routine: any) => {
        setDeleteItems([]);
        setDeleteRoutine(routine);
        setAnchorId(routine.id);
        setTimeout(() => makeBubble(), 0);
    };

    const handleDeleteLayout = (layout: any) => {
        setDeleteItems([]);
        setDeleteLayout(layout);
        setAnchorId(layout.id);
        setTimeout(() => makeBubble(), 0);
    };

    const handleStartLayout = (layout: any) => {
        setStartLayout(layout);
        setAnchorId(layout.id);
        setTimeout(() => makeBubble(), 0);
    };

    const handleCalendarDateSelect = (date: Date) => {
        // Navigate to the selected date in the workouts tab
        setNavigateToDate(date);

        // Clear the navigation after a short delay to allow for re-navigation
        setTimeout(() => {
            setNavigateToDate(null);
        }, 100);
    };

    const handleDateChange = (dateLabel: string, dateObj?: Date) => {
        setSelectedDate(dateLabel);
        if (dateObj) {
            setSelectedDateObj(dateObj);
            setCurrentWorkoutsTabDate(dateObj);
        }
    };

    const handleGetCurrentDate = (getCurrentDate: () => Date | null) => {
        setGetCurrentWorkoutsTabDate(() => getCurrentDate);
    };

    // Handler for updating shared selected date
    const handleSharedDateChange = (date: Date | null) => {
        setSharedSelectedDate(date);
    };

    const handleCreateNewTemplate = () => {
        // Create a new empty layout
        const newLayout = useNewLayout();
        // Save it to storage
        saveLayout(newLayout);
        // Navigate to edit layout screen
        router.push(`/modals/editLayout?layoutId=${newLayout.id}`);
    };


    const navigation = useNavigation();

    useEffect(() => {
        let headerLeftComponent = () => <></>;

        switch (selectedTab) {
            case 'templates':
                headerLeftComponent = () => (
                    <View style={{ height: 34, justifyContent: 'center', paddingLeft: 8 }}>
                        <LilButton
                            height={22}
                            length="short"
                            title="Create"
                            color={color.accent}
                            textColor={color.primaryBackground}
                            onPress={handleCreateNewTemplate}
                        />
                    </View>
                );
                break;
            case 'workouts':
                headerLeftComponent = () => (
                    <View style={{ height: 34, justifyContent: 'center', paddingLeft: 8 }}>
                        <IButton
                            width={32}
                            height={32}
                            onPress={() => setIsCalendarVisible(true)}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <Ionicons name="calendar-outline" size={20} color={color.text} />
                        </IButton>
                    </View>
                );
                break;
            case 'saved':
                // blank for now
                break;
        }

        navigation.setOptions({
            header: () => (
                <ITopBar
                    title={selectedTab === 'workouts' ? selectedDate : ''}
                    headerLeft={headerLeftComponent}
                    headerRight={() => {
                        // For workouts tab, only show X button
                        if (selectedTab === 'workouts') {
                            return (
                                <IButton width={34} height={34} onPress={() => router.back()}>
                                    <Ionicons name="close" size={24} color={color.text} />
                                </IButton>
                            );
                        }

                        // For other tabs, show Select and X buttons
                        return (
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <View style={{ height: 34, justifyContent: 'center' }}>
                                    <LilButton
                                        height={22}
                                        length="short"
                                        title={isSelecting ? "Cancel" : "Select"}
                                        color={isSelecting ? color.accent : color.primaryBackground}
                                        textColor={isSelecting ? color.primaryBackground : color.accent}
                                        onPress={() => {
                                            setIsSelecting(!isSelecting);
                                            if (isSelecting) setSelectedItems(new Set());
                                        }}
                                    />
                                </View>
                                <IButton width={34} height={34} onPress={() => router.back()}>
                                    <Ionicons name="close" size={24} color={color.text} />
                                </IButton>
                            </View>
                        );
                    }}
                />
            )
        });
    }, [selectedTab, color, navigation, handleCreateNewTemplate, startNewRoutine, isSelecting, selectedDate]);

    useEffect(() => {
        setSelectedItems(new Set());
        if (isSelecting) {
            setAnchorId(null);
        }
    }, [selectedTab]);

    useEffect(() => {
        if (isSelecting) {
            setAnchorId(null);
        }
    }, [isSelecting]);


    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };
    // Deletions are confirmed via IBubble -> handleConfirmDelete only. No side-effects during render.

    const translateY = useSharedValue(66);
    const tabOpacity = useSharedValue(1);

    useEffect(() => {
        translateY.value = withTiming(isSelecting ? 0 : 66, { duration: 200 });
        tabOpacity.value = withTiming(isSelecting ? 0 : 1, { duration: 200 });
    }, [isSelecting]);

    return (
        <View style={[styles.container, { backgroundColor: color.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Content Sections */}
                {selectedTab === 'templates' && (
                    <TemplatesTab
                        templateLayouts={templateLayouts}
                        isSelecting={isSelecting}
                        selectedItems={selectedItems}
                        onSelect={toggleSelect}
                        onToggleSaved={toggleSaved}
                        isSaved={isSaved}
                        onStartRoutine={handleStartLayout}
                        onEditLayout={(layout) => router.push(`/modals/editLayout?layoutId=${layout.id}`)}
                        onDeleteLayout={handleDeleteLayout}
                        bubbleRef={bubbleRef}
                        anchorId={anchorId || undefined}
                    />
                )}

                {selectedTab === 'workouts' && (
                    <View style={{ marginBottom: 12 }}>
                        <WorkoutsTab
                            isSelecting={isSelecting}
                            selectedItems={selectedItems}
                            onSelect={toggleSelect}
                            onDeleteRecent={handleDeleteRecent}
                            bubbleAnchorRef={bubbleRef}
                            anchorId={anchorId}
                            onDateChange={(dateLabel, dateObj) => handleDateChange(dateLabel, dateObj)}
                            navigateToDate={navigateToDate}
                            onGetCurrentDate={handleGetCurrentDate}
                            sharedSelectedDate={sharedSelectedDate}
                            onSharedDateChange={handleSharedDateChange}
                        />
                    </View>
                )}

                {selectedTab === 'saved' && (
                    <Container width={"90%"} style={{ marginVertical: 8 }}>
                        <EmptyState
                            icon="bookmark-outline"
                            title="Saved routines"
                            subtitle="Coming soon..."
                        />
                    </Container>
                )}

            </ScrollView>

            {/* Bottom Tab Navigation */}
            <Animated.View style={useAnimatedStyle(() => ({ opacity: tabOpacity.value }))}>
                <Container width={"100%"} style={[styles.bottomTabContainer, { backgroundColor: tabBackgroundColor, backdropFilter: 'blur(10px)', '-webkit-backdrop-filter': 'blur(10px)', position: 'absolute', bottom: 0, left: 0, right: 0, margin: 0, marginBottom: 0, paddingBottom: 0 }] as any}>
                    <View style={styles.tabRow}>
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab.id}
                                tab={tab.id}
                                label={tab.label}
                                icon={tab.icon}
                                isSelected={selectedTab === tab.id}
                                onPress={() => setSelectedTab(tab.id)}
                            />
                        ))}
                    </View>
                </Container>
            </Animated.View>

            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 66, overflow: 'hidden', pointerEvents: isSelecting ? 'auto' : 'none' }}>
                <Animated.View
                    style={[
                        useAnimatedStyle(() => ({
                            transform: [{ translateY: translateY.value }]
                        })),
                        {
                            height: 66,
                            backgroundColor: tabBackgroundColor,
                            backdropFilter: 'blur(10px)',
                            '-webkit-backdrop-filter': 'blur(10px)',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 16
                        }
                    ] as any}
                >
                    <IButton width={34} height={34} onPress={() => { }}>
                        <Ionicons name="ellipsis-horizontal" size={24} color={color.text} />
                    </IButton>
                    <Text style={{ color: color.text, fontSize: 17, fontWeight: '600' }}>
                        {selectedItems.size} Selected
                    </Text>
                    <IButton width={34} height={34} onPress={() => { if (selectedItems.size > 0) { setDeleteItems(Array.from(selectedItems)); setIsSlideVisible(true); } }}>
                        <Ionicons name="trash-outline" size={24} color={selectedItems.size > 0 ? color.error : color.grayText} />
                    </IButton>
                </Animated.View>
            </View>

            <ISlide visible={isSlideVisible} onClose={handleCancelMultiDelete} size="small">
                <Container width={"90%"} height={"auto"} direction="column" style={{ paddingBottom: 16 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: color.text,
                        textAlign: "center",
                        marginBottom: 12
                    }}>
                        {deleteItems.length === 1 ? "Delete Item" : "Delete Items"}
                    </Text>
                    <Text style={{
                        fontSize: 13,
                        color: color.grayText,
                        textAlign: "center",
                        marginBottom: 16,
                        lineHeight: 18
                    }}>
                        {`Delete ${deleteItems.length} ${deleteItems.length === 1 ? 'item' : 'items'}? This action cannot be undone.`}
                    </Text>
                    <View style={{ gap: 10, width: "100%" }}>
                        <IButton
                            width={"100%"}
                            height={40}
                            title={deleteItems.length > 0 ? `Delete ${deleteItems.length}` : "Delete"}
                            color={color.error}
                            textColor={color.secondaryText}
                            onPress={handleConfirmDelete}
                        />
                    </View>
                </Container>
            </ISlide>

            <IBubble
                visible={bubbleVisible}
                onClose={handleCancelDelete}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.large}
            >
                <Container width={"90%"} height={"100%"} direction="column">
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: color.text,
                        textAlign: "center",
                        marginBottom: 12
                    }}>
                        {deleteLayout ? "Delete Template" : "Delete Workout"}
                    </Text>

                    <Text style={{
                        fontSize: 13,
                        color: color.grayText,
                        textAlign: "center",
                        marginBottom: 16,
                        lineHeight: 18
                    }}>
                        {deleteLayout
                            ? `Delete the template "${deleteLayout?.name || 'template'}"? This will permanently remove it from Templates and cannot be undone; your past workouts won't change.`
                            : `Delete this workout?`}
                    </Text>

                    <View style={{ gap: 10 }}>
                        <IButton
                            width={"100%"}
                            height={40}
                            title={"Delete"}
                            color={color.error}
                            textColor={color.secondaryText}
                            onPress={handleConfirmDelete}
                        />

                        <IButton
                            width={"100%"}
                            height={40}
                            title={"Cancel"}
                            color={color.primaryBackground}
                            textColor={color.accent}
                            onPress={handleCancelDelete}
                        />
                    </View>
                </Container>
            </IBubble>

            {/* Start Confirmation Bubble */}
            <IBubble
                visible={bubbleVisible && startLayout}
                onClose={handleCancelStart}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.large}
            >
                <Container width={"90%"} height={"100%"} direction="column">
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: color.text,
                        textAlign: "center",
                        marginBottom: 12
                    }}>
                        Are you sure about that?
                    </Text>

                    <Text style={{
                        fontSize: 13,
                        color: color.grayText,
                        textAlign: "center",
                        marginBottom: 16,
                        lineHeight: 18
                    }}>
                        Start a new workout using "{startLayout?.name || 'this template'}"?
                    </Text>

                    <View style={{ gap: 10 }}>
                        <IButton
                            width={"100%"}
                            height={40}
                            title={"Start"}
                            color={color.accent}
                            textColor={color.secondaryText}
                            onPress={() => {
                                startRoutine(startLayout);
                                handleCancelStart();
                            }}
                        />

                        <IButton
                            width={"100%"}
                            height={40}
                            title={"Cancel"}
                            color={color.primaryBackground}
                            textColor={color.accent}
                            onPress={handleCancelStart}
                        />
                    </View>
                </Container>
            </IBubble>

            {/* Full Calendar Modal */}
            <FullCalendar
                visible={isCalendarVisible}
                onClose={() => setIsCalendarVisible(false)}
                onDateSelect={handleCalendarDateSelect}
                selectedDate={sharedSelectedDate || undefined}
                sharedSelectedDate={sharedSelectedDate}
                onSharedDateChange={handleSharedDateChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 66,
        paddingTop: 32,
    },
    bottomTabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 66,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        paddingBottom: 0,
    },
    tabRow: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    quickActions: {
        marginTop: 8,
        marginBottom: 70, // Space for bottom tabs
    },
});
