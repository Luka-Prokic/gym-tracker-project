import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useTheme } from '../../components/context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import SettingsButton from '../../components/buttons/SettingsButton';
import List from '../../components/containers/List';
import CakaIcon from '../../components/mis/CakaIcon';
import { useRoutine } from '../../components/context/RoutineZustand';

export default function AllScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { routines } = useRoutine();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={[styles.blur, { paddingBottom: 88, paddingTop: 44, width: "100%", backgroundColor: color.background }]}
        >
            <View style={styles.bubble}>
                <List label="stats" background={color.thirdBackground} width={'90%'} hrStart="Custom">
                    {routines.map((routine) => (
                        <SettingsButton
                            key={routine.id}
                            title={routine.id + routine.status} height={34} arrow={true} color={color.secondaryText}
                            icon={<CakaIcon name="circle-icon" size={18} stroke={color.secondaryText} />}
                        />
                    ))}
                </List>

                <List label="stats" background={color.fourthBackground} width={'90%'} hrStart="Custom">
                    <SettingsButton
                        title={'Trends'} height={34} arrow={true} color={color.secondaryText}
                        icon={<CakaIcon name="circle-icon" size={18} stroke={color.secondaryText} />}
                    />
                    <SettingsButton
                        title={'Awards'} height={34} arrow={true} color={color.secondaryText}
                        icon={<CakaIcon name="circle-icon" size={18} stroke={color.secondaryText} />}
                    />
                    <SettingsButton
                        title={'Running'} height={34} arrow={true} color={color.secondaryText}
                        icon={<CakaIcon name="circle-icon" size={18} stroke={color.secondaryText} />}
                    />
                </List>

                <List label="stats" background={color.fifthBackground} width={'90%'} hrStart="Custom">
                    <SettingsButton
                        title={'Swimming'} height={34} arrow={true} color={color.secondaryText}
                        icon={<CakaIcon name="circle-icon" size={18} stroke={color.secondaryText} />}
                    />
                    <SettingsButton
                        title={'Hiking'} height={34} arrow={true} color={color.secondaryText}
                        icon={<CakaIcon name="circle-icon" size={18} stroke={color.secondaryText} />}
                    />
                    <SettingsButton
                        title={'Walking'} height={34} arrow={true} color={color.secondaryText}
                        icon={<CakaIcon name="circle-icon" size={18} stroke={color.secondaryText} />}
                    />
                </List>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    blur: {
        backdropFilter: 'blur(30px)',
    },
    container: {
        flex: 1,
    },
    text: {
        fontSize: 14,
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
    bubble: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 88,
    },
});
