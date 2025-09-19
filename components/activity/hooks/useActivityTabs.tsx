import { useState } from 'react';

export type ActivityTab = 'templates' | 'workouts' | 'saved';

export const useActivityTabs = (initialTab: ActivityTab = 'templates') => {
    const [selectedTab, setSelectedTab] = useState<ActivityTab>(initialTab);

    const tabs = [
        { id: 'templates' as ActivityTab, label: 'Templates', icon: 'document-outline' },
        { id: 'workouts' as ActivityTab, label: 'Workouts', icon: 'calendar-number-outline' },
        { id: 'saved' as ActivityTab, label: 'Saved', icon: 'bookmark-outline' }
    ];

    return {
        selectedTab,
        setSelectedTab,
        tabs
    };
};

export default useActivityTabs;
