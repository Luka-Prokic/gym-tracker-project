import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import IButton from '../buttons/IButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface BottomSelectModeBarProps {
    isSelecting: boolean;
    selectedItemsCount: number;
    tabBackgroundColor: string;
    translateY: any;
    onMultiDelete: () => void;
    onMoreOptions?: () => void;
}

export const BottomSelectModeBar: React.FC<BottomSelectModeBarProps> = ({
    isSelecting,
    selectedItemsCount,
    tabBackgroundColor,
    translateY,
    onMultiDelete,
    onMoreOptions = () => {}
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <View style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: 66, 
            overflow: 'hidden', 
            pointerEvents: isSelecting ? 'auto' : 'none' 
        }}>
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
                <IButton width={34} height={34} onPress={onMoreOptions}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={color.text} />
                </IButton>
                <Text style={{ color: color.text, fontSize: 17, fontWeight: '600' }}>
                    {selectedItemsCount} Selected
                </Text>
                <IButton width={34} height={34} onPress={onMultiDelete}>
                    <Ionicons 
                        name="trash-outline" 
                        size={24} 
                        color={selectedItemsCount > 0 ? color.error : color.grayText} 
                    />
                </IButton>
            </Animated.View>
        </View>
    );
};
