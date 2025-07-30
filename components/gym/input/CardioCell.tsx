import React from "react";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { CardioExercise, CardioValues, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import ICellText from "@/components/text/ICellText";
import useCardioActions from "../hooks/useCardioActions";
import useBubbleLayout from "@/components/bubbles/hooks/useBubbleLayout";
import { StyleSheet, Text, View } from "react-native";
import ISlideToggle from "@/components/bubbles/ISlideToggle";
import {
    useDisplayedCadence,
    useDisplayedDistance,
    useDisplayedDuration,
    useDisplayedElevation,
    useDisplayedEnergy,
    useDisplayedHeartRate,
    useDisplayedIncline,
    useDisplayedPace,
    useDisplayedResistance,
    useDisplayedRest,
    useDisplayedSpeed,
    useDisplayedSteps
} from "@/components/context/user/hooks/filters";
import { useUser } from "@/components/context/UserZustend";
import BounceButton from "@/components/buttons/BounceButton";

interface CardioCellProps {
    exerciseId: CardioExercise["id"];
    intervalIndex: number;
    column: keyof CardioValues;
    disabled: boolean;
}

const unitLabels: Record<keyof CardioValues, [string, string]> = {
    distance: ["km", "mi"],
    pace: ["min/km", "min/mi"],
    elevation: ["m", "ft"],
    resistance: ["kg", "lbs"],
    calories: ["kcal", "kJ"],
    speed: ["", ""],
    duration: ["", ""],
    intensity: ["", ""],
    heartRate: ["", ""],
    steps: ["", ""],
    cadence: ["", ""],
    incline: ["", ""],
    rest: ["", ""],
    label: ["", ""],
};

const CardioCell: React.FC<CardioCellProps> = ({ column, exerciseId, intervalIndex, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const {
        exercise,
        layoutId,
    } = useCardioActions(exerciseId);

    const { bubbleVisible, makeBubble, popBubble } = useBubbleLayout();
    const { updateIntervalField } = useExerciseLayout();
    const { toggleDistanceUnit, togglePaceUnit, toggleElevationUnit, toggleWeightUnit, toggleEnergyUnit, settings } = useUser();

    if (!exercise || !exercise.intervals || !exercise?.intervals?.[intervalIndex] || !column) return null;
    const interval = exercise.intervals[intervalIndex];

    const handleValueChange = (input: string) => {
        let parsed: number | string = input;

        if (column === "distance" && "toKm" in currentHook) parsed = currentHook.toKm(input);
        else if (column === "pace" && "toMinPerKm" in currentHook) parsed = currentHook.toMinPerKm(input);
        else if (column === "elevation" && "toMeters" in currentHook) parsed = currentHook.toMeters(input);
        else if (column === "resistance" && "toKg" in currentHook) parsed = currentHook.toKg(input);
        else if (column === "calories" && "toKcal" in currentHook) parsed = currentHook.toKcal(input);

        const n = Math.abs(Number(parsed));

        if (column === "intensity" || column === "label")
            updateIntervalField(layoutId, exerciseId, intervalIndex, column, parsed as string);

        updateIntervalField(layoutId, exerciseId, intervalIndex, column, n);
    };

    const checked = !!interval.rest;
    const unitColor = checked ? color.handle : color.grayText;
    const inputColor = checked ? color.secondaryText : color.text;

    if (column === "label")
        return (
            <ICellText
                key={`cell-${column}`}
                value={interval[column]}
                inputStyle={styles.inputText}
                textStyle={[
                    styles.inputText,
                    { color: inputColor }
                ]}
                height={44}
                cellWidth={"80%"}
                onChange={handleValueChange}
                disabled={disabled}
            />
        );

    if (column === "intensity")
        return (
            <View style={styles.cell}>
                <ICellText
                    key={`cell-${column}`}
                    value={interval[column]}
                    inputStyle={styles.inputText}
                    textStyle={[
                        styles.inputText,
                        { color: inputColor }
                    ]}
                    height={44}
                    cellWidth={"100%"}
                    onChange={handleValueChange}
                    disabled={disabled}
                />
            </View>
        );

    const hookMap = {
        distance: useDisplayedDistance(),
        pace: useDisplayedPace(),
        elevation: useDisplayedElevation(),
        resistance: useDisplayedResistance(),
        calories: useDisplayedEnergy(),
        speed: useDisplayedSpeed(),
        duration: useDisplayedDuration(),
        heartRate: useDisplayedHeartRate(),
        steps: useDisplayedSteps(),
        cadence: useDisplayedCadence(),
        incline: useDisplayedIncline(),
        rest: useDisplayedRest(),
    };

    const currentHook = hookMap[column];

    if (["speed", "duration", "heartRate", "steps", "cadence", "incline", "rest"].includes(column))
        return (
            <View style={styles.cell}>

                <Text style={[styles.fakeCell, { color: unitColor }]}>
                    {currentHook.unit ?? ""}
                </Text>

                <ICellText
                    key={`cell-${column}`}
                    value={interval[column]}
                    inputStyle={styles.inputText}
                    textStyle={[
                        styles.inputText,
                        { color: inputColor }
                    ]}
                    height={44}
                    cellWidth={"50%"}
                    onChange={handleValueChange}
                    disabled={disabled}
                />
            </View>
        );


    const toggleMap = {
        distance: toggleDistanceUnit,
        pace: togglePaceUnit,
        elevation: toggleElevationUnit,
        resistance: toggleWeightUnit,
        calories: toggleEnergyUnit,
    };

    type ToggleKey = keyof typeof toggleMap;
    const toggleUnit = toggleMap[column as ToggleKey];
    const [opt1, opt2] = unitLabels[column] ?? ["", ""];

    const displayValue = (() => {
        const rawValue = interval[column];
        if (column === "distance" && "fromKm" in currentHook) return currentHook.fromKm(rawValue as number);
        if (column === "pace" && "fromMinPerKm" in currentHook) return currentHook.fromMinPerKm(rawValue as number);
        if (column === "elevation" && "fromMeters" in currentHook) return currentHook.fromMeters(rawValue as number);
        if (column === "resistance" && "fromKg" in currentHook) return currentHook.fromKg(rawValue as number);
        if (column === "calories" && "fromKcal" in currentHook) return currentHook.fromKcal(rawValue as number);
        return rawValue?.toString?.() ?? "";
    })();



    return (
        <View style={styles.cell}>

            <BounceButton
                textColor={unitColor}
                title={currentHook.unit}
                height={34}
                width="50%"
                onPress={makeBubble}
                disabled={disabled}
            />

            <ISlideToggle
                visible={bubbleVisible}
                onClose={popBubble}
                option1={opt1}
                option2={opt2}
                value={currentHook.unit}
                onChange={toggleUnit}
                title={(column).toUpperCase() + " UNIT"}
                width={column === "pace" ? 188 : 144}
            />

            <ICellText
                key={`cell-${settings.units[column === "resistance" ? "weight" : column]}`}
                value={displayValue}
                inputStyle={styles.inputText}
                textStyle={[
                    styles.inputText,
                    { color: inputColor }
                ]}
                height={34}
                cellWidth={"50%"}
                onChange={handleValueChange}
                disabled={disabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cell: {
        flexDirection: "row",
        alignItems: "center",
        width: "45%",
    },
    fakeCell: {
        width: "50%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
    inputText: {
        fontWeight: "bold",
        fontSize: 18,
    }
});

export default CardioCell;