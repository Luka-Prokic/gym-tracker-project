import { useState } from 'react';

export type ActivityTab = 'templates' | 'recent' | 'saved';

export const useActivityTabs = (initialTab: ActivityTab = 'templates') => {
    const [selectedTab, setSelectedTab] = useState<ActivityTab>(initialTab);

    const tabs = [
        { id: 'templates' as ActivityTab, label: 'Templates', icon: 'document-outline' },
        { id: 'recent' as ActivityTab, label: 'Recent', icon: 'time-outline' },
        { id: 'saved' as ActivityTab, label: 'Saved', icon: 'bookmark-outline' }
    ];

    return {
        selectedTab,
        setSelectedTab,
        tabs
    };
};

export default useActivityTabs;
