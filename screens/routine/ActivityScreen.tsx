import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../components/context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import SettingsButton from '../../components/buttons/SettingsButton';
import List from '../../components/containers/List';
import CakaIcon from '../../components/mis/CakaIcon';
import ModalWrapper from '../../components/bubbles/ModalWrapper';
import { Layout, useExerciseLayout } from '../../components/context/ExerciseLayoutZustand';
import useGetExerciseInitial from '../../components/gym/hooks/useGetExerciseInitial';
import { SCREEN_HEIGHT } from '../../constants/ScreenWidth';
import { RoutineLayout, useRoutine } from '../../components/context/RoutineZustand';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CorruptParamList } from '../../assets/types';
import { useNavigation } from '@react-navigation/native';
import useCloneLayout from '../../assets/hooks/useCloneLayout';
import { isGymExercise } from '@/components/context/utils/GymUtils';

export default function ActivityScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layouts, saveLayout } = useExerciseLayout();
    const { activeRoutine, checkAndAddRoutine, setActiveRoutine } = useRoutine();
    const navigation = useNavigation<NativeStackNavigationProp<CorruptParamList, "Routines">>();

    const labelPressed = (layout: Layout) => {
        if (activeRoutine.id !== "routine_111" && activeRoutine?.id && activeRoutine.type === "gym") {

            setTimeout(() => { navigation.navigate("Routine"); }, 100);
            navigation.goBack()
        } else {
            const newRoutineId = "routine_" + new Date().getTime();
            const cloneLayout = useCloneLayout({ layout });

            const newRoutine = {
                id: newRoutineId,
                layoutId: cloneLayout.id,
                timer: 0,
                status: "temp",
                type: "gym",
            };
            checkAndAddRoutine(newRoutine as RoutineLayout);
            setActiveRoutine(newRoutineId);
            saveLayout(cloneLayout);
            setTimeout(() => { navigation.navigate("Routine"); }, 100);
            navigation.goBack()
        }
    };

    return (
        <ModalWrapper>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[styles.blur, { paddingBottom: 88, paddingTop: 44, width: "100%", height: SCREEN_HEIGHT, backgroundColor: color.secondaryBackground }]}
            >
                <List label="layouts" background={color.thirdBackground} width={'90%'} hrStart="Custom">
                    {layouts.map((layout) => {
                        const title = `${layout.layout.map((ex) => {
                            if (!isGymExercise(ex))
                                return null;
                            const exName = useGetExerciseInitial(ex.exId);
                            return exName;
                        })}`;
                        return (
                            <SettingsButton
                                key={layout.id}
                                title={title} height={34} arrow={true} color={color.secondaryText}
                                icon={<CakaIcon name="circle-icon" size={18} stroke={color.secondaryText} />}
                                onPress={() => { labelPressed(layout) }}
                            />
                        )
                    })}
                </List>
            </ScrollView>
        </ModalWrapper>
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
});
