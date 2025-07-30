import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useRoutine } from "../../../components/context/RoutineZustand";
import IButton from "../../../components/buttons/IButton";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { SCREEN_HEIGHT } from "../../../constants/ScreenWidth";
import CardWrapper from "../../../components/bubbles/CardWrapper";
import HR from "../../../components/mis/HR";
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
    const { layouts, getLayout } = useExerciseLayout();

    if (!layouts)
        return null;
    startTimer();

    const [visible, setVisible] = useState<boolean>(true);

    const handleCancel = () => {
        setTimeout(() => clearActiveRoutine(), 100);
        setVisible(false);
        if (activeRoutine.status === "saved")
            updateRoutine(activeRoutine.id, activeRoutine);
    };

    const handleDiscard = () => {
        updateRoutine(activeRoutine.id, { ...activeRoutine, status: "temp" });
        handleCancel();
        // removeLayout(activeRoutine.layoutId);
    };

    const handleFinish = () => {
        saveIt(activeRoutine.id);
        updateRoutine(activeRoutine.id, { ...activeRoutine, status: "saved" });
        handleCancel();
    };

    const handleSaveRoutine = () => {
        saveIt(activeRoutine.id);
        updateRoutine(activeRoutine.id, { ...activeRoutine, status: "saved" });

    };

    const handleUpdateRoutine = () => {
        if (activeRoutine.status === "saved") {
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
        <CardWrapper visible={visible} onClose={handleUpdateRoutine}>
            <View style={[styles.container, { height: SCREEN_HEIGHT, backgroundColor: color.background }]}>

                <ExerciseBar />

                {/* {getLayout(activeRoutine.layoutId)?.layout.length ? <HR width={"90%"} /> : null}

                <View style={styles.bottom}>
                    <IButton color={color.error} textColor={color.secondaryText} width={"48%"} height={44} title="Cancel" onPress={handleDiscard} />
                    {getLayout(activeRoutine.layoutId)?.layout.length ? <IButton color={color.fourthBackground} textColor={color.secondaryText} width={"48%"} height={44} title="Finish" onPress={handleFinish} /> : null}
                </View> */}
            </View>
        </CardWrapper >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        userSelect: "none",
        gap: 16,
        paddingBottom: 88,
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