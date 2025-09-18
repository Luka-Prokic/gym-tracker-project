import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useRoutine } from "../../../components/context/RoutineZustand";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { SCREEN_HEIGHT } from "../../../constants/ScreenWidth";
import CardWrapper from "../../../components/bubbles/CardWrapper";
import ExerciseBar from "../../../components/gym/ExerciseBar";
import { useExerciseLayout } from "../../../components/context/ExerciseLayoutZustand";

export default function GymScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const {
        updateRoutine, clearActiveRoutine, saveIt,
        activeRoutine,
        startTimer
    } = useRoutine();
    const layouts = useExerciseLayout();

    if (!layouts)
        return null;

    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        startTimer();
    }, []);

    const handleCancel = () => {
        setTimeout(() => clearActiveRoutine(), 100);
        setVisible(false);
        if (activeRoutine.status === "routine")
            updateRoutine(activeRoutine.id, activeRoutine);
    };

    const handleDiscard = () => {
        updateRoutine(activeRoutine.id, { ...activeRoutine, status: "template" });
        handleCancel();
        // removeLayout(activeRoutine.layoutId);
    };

    const handleFinish = () => {
        updateRoutine(activeRoutine.id, { ...activeRoutine, isFinished: true });
        saveIt(activeRoutine.id);
        handleCancel();
    };

    const handleSaveRoutine = () => {
        saveIt(activeRoutine.id);
        updateRoutine(activeRoutine.id, { ...activeRoutine, status: "routine" });

    };

    const handleUpdateRoutine = () => {
        if (activeRoutine.status === "routine") {
            updateRoutine(activeRoutine.id, activeRoutine);
            saveIt(activeRoutine.id);
        }

    };

    useEffect(() => {
        if (activeRoutine.id === "routine_111") {
            handleCancel();
        }
    }, [activeRoutine]);

    return (
        <ScrollView 
            style={[styles.container, { flex: 1, backgroundColor: color.background }]} 
            contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
            showsVerticalScrollIndicator={false}
        >
            <CardWrapper visible={visible} onClose={handleUpdateRoutine}>

                <ExerciseBar />

                {/* {getLayout(activeRoutine.layoutId)?.layout.length ? <HR width={"90%"} /> : null}

                    <View style={styles.bottom}>
                        <IButton color={color.error} textColor={color.secondaryText} width={"48%"} height={44} title="Cancel" onPress={handleDiscard} />
                        {getLayout(activeRoutine.layoutId)?.layout.length ? <IButton color={color.fourthBackground} textColor={color.secondaryText} width={"48%"} height={44} title="Finish" onPress={handleFinish} /> : null}
                    </View> */}
            </CardWrapper >
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    timerControls: {
        flexDirection: "row",
        width: "90%",
        justifyContent: "flex-end",
        gap: 16,
    },
    bottom: {
        flexDirection: "row",
        width: "90%",
        gap: "4%",
        justifyContent: "center",
        marginHorizontal: "5%",
    },
});