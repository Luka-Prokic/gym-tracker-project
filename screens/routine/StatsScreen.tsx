import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../components/context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import ModalWrapper from '../../components/bubbles/ModalWrapper';
import { SCREEN_HEIGHT } from '../../constants/ScreenWidth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CorruptParamList } from '../../assets/types';
import { useNavigation } from '@react-navigation/native';
import CardWrapper from '@/components/bubbles/CardWrapper';

export default function StatsScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const navigation = useNavigation<NativeStackNavigationProp<CorruptParamList, "Routines">>();


    return (
        <CardWrapper>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[styles.blur, styles.scroller]}
            >

            </ScrollView>
        </CardWrapper>
    );
}

const styles = StyleSheet.create({
    blur: {
        backdropFilter: 'blur(30px)',
    },
    scroller: {
        paddingBottom: 88,
        paddingTop: 44,
        width: "100%",
        height: SCREEN_HEIGHT,
    },
    text: {
        fontSize: 14,
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
