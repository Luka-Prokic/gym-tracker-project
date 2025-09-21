import { useState } from 'react';

export type ActivityTab = 'templates' | 'workouts' | 'splits';

export const useActivityTabs = (initialTab: ActivityTab = 'templates') => {
    const [selectedTab, setSelectedTab] = useState<ActivityTab>(initialTab);

    const tabs = [
        { id: 'templates' as ActivityTab, label: 'Templates', icon: 'ticket-outline' },
        { id: 'workouts' as ActivityTab, label: 'Workouts', icon: 'calendar-number-outline' },
        { id: 'splits' as ActivityTab, label: 'Splits', icon: 'flash-outline' }
    ];

    return {
        selectedTab,
        setSelectedTab,
        tabs
    };
};

export default useActivityTabs;
