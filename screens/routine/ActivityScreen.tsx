import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useTheme } from '../../components/context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import Container from '../../components/containers/Container';
import { useLocalSearchParams } from 'expo-router';
import { useStartNewRoutine } from '../../assets/hooks/useStartNewRoutine';
import Animated, { useAnimatedStyle} from 'react-native-reanimated';

// Activity components
import TabButton from '../../components/activity/TabButton';
import TemplatesTab from '../../components/activity/TemplatesTab';
import WorkoutsTab from '../../components/activity/WorkoutsTab';
import SplitsTab from '../../components/activity/SplitsTab';
import FullCalendar from '../../components/activity/FullCalendar';
import { BottomSelectModeBar } from '../../components/activity/BottomSelectModeBar';

// Activity bubble components
import { DeleteConfirmationBubble } from '../../components/activity/bubbles/DeleteConfirmationBubble';
import { StartConfirmationBubble } from '../../components/activity/bubbles/StartConfirmationBubble';
import { EditOptionsBubble } from '../../components/activity/bubbles/EditOptionsBubble';
import { CloneTemplateBubble } from '../../components/activity/bubbles/CloneTemplateBubble';
import { MultiDeleteSlide } from '../../components/activity/bubbles/MultiDeleteSlide';

// Activity hooks
import { useRoutineData } from '../../components/activity/hooks/useRoutineData';
import { useSavedRoutines } from '../../components/activity/hooks/useSavedRoutines';
import { useActivityTabs } from '../../components/activity/hooks/useActivityTabs';
import { useBubbleState } from '../../components/activity/hooks/useBubbleState';
import { useSelection } from '../../components/activity/hooks/useSelection';
import { useTemplateActions } from '../../components/activity/hooks/useTemplateActions';
import { useDateManagement } from '../../components/activity/hooks/useDateManagement';
import { useHeaderConfig } from '../../components/activity/hooks/useHeaderConfig';

export default function ActivityScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const params = useLocalSearchParams();
    const initialTab = (params.tab as 'templates' | 'workouts' | 'splits') || 'templates';

    const { startNewRoutine } = useStartNewRoutine();

    // Activity hooks
    const { templateLayouts, savedLayoutsList } = useRoutineData();
    const { toggleSaved, isSaved } = useSavedRoutines();
    const { selectedTab, setSelectedTab, tabs } = useActivityTabs(initialTab);

    // Custom hooks
    const {
        deleteLayout,
        setDeleteLayout,
        deleteRoutine,
        setDeleteRoutine,
        startLayout,
        editOptionsLayout,
        setEditOptionsLayout,
        cloneLayout,
        setCloneLayout,
        cloneName,
        setCloneName,
        anchorId,
        setAnchorId,
        bubbleRef,
        top,
        left,
        height,
        width,
        bubbleVisible,
        handleDeleteRecent,
        handleStartLayout,
        handleEditOptions,
        handleCancelDelete,
        handleCancelStart,
        handleCancelEditOptions,
        handleCancelClone,
        popBubble,
    } = useBubbleState();

    const {
        isSelecting,
        setIsSelecting,
        selectedItems,
        setSelectedItems,
        deleteItems,
        isSlideVisible,
        translateY,
        tabOpacity,
        toggleSelect,
        handleCancelMultiDelete,
        handleMultiDelete,
        resetSelection,
    } = useSelection();

    const {
        selectedDate,
        isCalendarVisible,
        navigateToDate,
        sharedSelectedDate,
        handleCalendarDateSelect,
        handleDateChange,
        handleSharedDateChange,
        openCalendar,
        closeCalendar,
    } = useDateManagement();

    const {
        handleCreateNewTemplate,
        handleConfirmDelete,
        handleEditFromOptions,
        handleCloneFromOptions,
        handleConfirmClone,
        handleDeleteFromOptions,
    } = useTemplateActions({
        selectedTab,
        templateLayouts,
        deleteLayout,
        deleteRoutine,
        deleteItems,
        editOptionsLayout,
        cloneLayout,
        cloneName,
        setCloneName,
        setDeleteLayout,
        setDeleteRoutine,
        setEditOptionsLayout,
        setCloneLayout,
        resetSelection,
        popBubble,
    });

    const { tabBackgroundColor } = useHeaderConfig({
        selectedTab,
        selectedDate,
        isSelecting,
        selectedItems,
        handleCreateNewTemplate,
        openCalendar,
        setIsSelecting,
        setSelectedItems,
        handleMultiDelete,
    });

    const startRoutine = (layout: any) => {
        startNewRoutine({
            fromLayout: layout,
            navigationMethod: 'replace'
        });
    };

    // Effects for tab changes and selection state
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
                        onCreateTemplate={handleCreateNewTemplate}
                        onEditOptions={handleEditOptions}
                        bubbleRef={bubbleRef}
                        anchorId={anchorId || undefined}
                    />
                )}

                {selectedTab === 'workouts' && (
                    <WorkoutsTab
                        isSelecting={isSelecting}
                        selectedItems={selectedItems}
                        onSelect={toggleSelect}
                        onDeleteRecent={handleDeleteRecent}
                        bubbleAnchorRef={bubbleRef}
                        anchorId={anchorId}
                        onDateChange={(dateLabel) => handleDateChange(dateLabel)}
                        navigateToDate={navigateToDate}
                        sharedSelectedDate={sharedSelectedDate}
                        onSharedDateChange={handleSharedDateChange}
                    />
                )}

                {selectedTab === 'splits' && (
                    <SplitsTab
                        savedLayouts={savedLayoutsList}
                        isSelecting={isSelecting}
                        selectedItems={selectedItems}
                        onSelect={toggleSelect}
                        onToggleSaved={toggleSaved}
                        isSaved={isSaved}
                        onStartRoutine={handleStartLayout}
                        onEditOptions={handleEditOptions}
                        bubbleRef={bubbleRef}
                        anchorId={anchorId || undefined}
                    />
                )}

            </ScrollView>

            {/* Bottom Tab Navigation */}
            <Animated.View style={useAnimatedStyle(() => ({ opacity: tabOpacity.value }))}>
                <Container width={"100%"} style={[styles.bottomTabContainer, { backgroundColor: tabBackgroundColor, backdropFilter: 'blur(10px)', '-webkit-backdrop-filter': 'blur(10px)', position: 'absolute', bottom: 0, left: 0, right: 0, margin: 0, marginBottom: 0, paddingBottom: 0 }] as any}>
                    <View style={styles.tabRow}>
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab.id}
                                label={tab.label}
                                icon={tab.icon}
                                isSelected={selectedTab === tab.id}
                                onPress={() => setSelectedTab(tab.id)}
                            />
                        ))}
                    </View>
                </Container>
            </Animated.View>

            {/* Bottom Select Mode Bar */}
            <BottomSelectModeBar
                isSelecting={isSelecting}
                selectedItemsCount={selectedItems.size}
                tabBackgroundColor={tabBackgroundColor}
                translateY={translateY}
                onMultiDelete={handleMultiDelete}
            />


            {/* Delete Selected Confirmation ISlide */}
            <MultiDeleteSlide
                visible={isSlideVisible}
                onClose={handleCancelMultiDelete}
                deleteItems={deleteItems}
                onConfirm={handleConfirmDelete}
            />


            {/* Delete Confirmation Bubble */}
            <DeleteConfirmationBubble
                visible={bubbleVisible}
                onClose={handleCancelDelete}
                height={height}
                width={width}
                top={top}
                left={left}
                deleteLayout={deleteLayout}
                deleteRoutine={deleteRoutine}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {/* Start Confirmation Bubble */}
            <StartConfirmationBubble
                visible={bubbleVisible && !!startLayout}
                onClose={handleCancelStart}
                height={height}
                width={width}
                top={top}
                left={left}
                startLayout={startLayout}
                onConfirm={() => {
                    startRoutine(startLayout);
                    handleCancelStart();
                }}
                onCancel={handleCancelStart}
            />

            {/* Edit Options Bubble */}
            <EditOptionsBubble
                visible={bubbleVisible && !!editOptionsLayout}
                onClose={handleCancelEditOptions}
                height={height}
                width={width}
                top={top}
                left={left}
                editOptionsLayout={editOptionsLayout}
                onStartWorkout={() => {
                    if (editOptionsLayout) {
                        startRoutine(editOptionsLayout);
                        handleCancelEditOptions();
                    }
                }}
                onEditTemplate={handleEditFromOptions}
                onCloneTemplate={handleCloneFromOptions}
                onDeleteTemplate={handleDeleteFromOptions}
            />

            {/* Clone Template Bubble */}
            <CloneTemplateBubble
                visible={bubbleVisible && !!cloneLayout}
                onClose={handleCancelClone}
                height={height}
                width={width}
                top={top}
                left={left}
                cloneLayout={cloneLayout}
                cloneName={cloneName}
                onCloneNameChange={setCloneName}
                onConfirm={handleConfirmClone}
                onCancel={handleCancelClone}
            />

            {/* Full Calendar Modal */}
            <FullCalendar
                visible={isCalendarVisible}
                onClose={closeCalendar}
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
