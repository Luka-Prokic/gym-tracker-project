import { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import Colors, { Themes } from '../../../constants/Colors';
import IButton from '../../buttons/IButton';
import LilButton from '../../buttons/LilButton';
import ITopBar from '../../headers/ITopBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface UseHeaderConfigProps {
    selectedTab: 'templates' | 'workouts' | 'splits';
    selectedDate: string;
    isSelecting: boolean;
    selectedItems: Set<string>;
    handleCreateNewTemplate: (templateName?: string) => void;
    openCalendar: () => void;
    setIsSelecting: (selecting: boolean) => void;
    setSelectedItems: (items: Set<string>) => void;
    handleMultiDelete: () => void;
}

export const useHeaderConfig = ({
    selectedTab,
    selectedDate,
    isSelecting,
    selectedItems,
    handleCreateNewTemplate,
    openCalendar,
    setIsSelecting,
    setSelectedItems,
    handleMultiDelete,
}: UseHeaderConfigProps) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const navigation = useNavigation();

    const tabBackgroundColor = {
        light: "rgba(255, 255, 255, 0.2)",
        peachy: "rgba(255, 255, 255, 0.2)",
        oldschool: "rgba(255, 254, 246, 0.2)",
        dark: "rgba(100, 100, 100, 0.2)",
        preworkout: "rgba(255, 254, 246, 0.2)",
        Corrupted: "rgba(100, 255, 255, 0.2)",
    }[theme as Themes];

    useEffect(() => {
        let headerLeftComponent = () => <></>;

        switch (selectedTab) {
            case 'templates':
                headerLeftComponent = () => (
                    <View style={{ height: 34, justifyContent: 'center', paddingLeft: 8 }}>
                        {!isSelecting && (
                            <LilButton
                                height={22}
                                length="short"
                                title="Create"
                                color={color.accent}
                                textColor={color.primaryBackground}
                                onPress={handleCreateNewTemplate}
                            />
                        )}
                    </View>
                );
                break;
            case 'workouts':
                headerLeftComponent = () => (
                    <View style={{ height: 34, justifyContent: 'center', paddingLeft: 8 }}>
                        <IButton
                            width={32}
                            height={32}
                            onPress={openCalendar}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <Ionicons name="calendar-outline" size={20} color={color.text} />
                        </IButton>
                    </View>
                );
                break;
            case 'splits':
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
    }, [selectedTab, color, navigation, handleCreateNewTemplate, isSelecting, selectedDate, openCalendar, setIsSelecting, setSelectedItems]);

    return {
        tabBackgroundColor,
    };
};
