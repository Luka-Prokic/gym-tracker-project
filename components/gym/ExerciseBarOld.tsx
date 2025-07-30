import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import IButton from "../buttons/IButton";
import Container from "../containers/Container";
import { useUnifrakturCookFont } from "../../assets/hooks/useUnifrakturCookFont";

const MAX_COLUMNS = 3;

const CELL_HEIGHT = 44;

const ExerciseBarOld = () => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { fontFamily } = useUnifrakturCookFont();


    const [exercises, setExercises] = useState<
        { id: number; selected: boolean }[]
    >([]);

    const [barWidth, setBarWidth] = useState(0);

    const selectedX = useSharedValue(0);
    const selectedY = useSharedValue(0);


    const selectExercise = (id: number) => {
        setExercises((prev) =>
            prev.map((ex) => ({ ...ex, selected: ex.id === id }))
        );
    };


    const addExercise = () => {
        const newExercise = { id: Date.now(), selected: true };
        setExercises((prev) => {
            const updated = prev.map((ex) => ({ ...ex, selected: false }));
            return [...updated, newExercise];
        });
    };


    useEffect(() => {
        if (!barWidth) return;

        const selectedIndex = exercises.findIndex((ex) => ex.selected);

        if (selectedIndex === -1) return;


        const containerWidth = barWidth / MAX_COLUMNS;
        const row = Math.floor(selectedIndex / MAX_COLUMNS);
        const col = selectedIndex % MAX_COLUMNS;

        selectedX.value = withTiming(col * containerWidth);
        selectedY.value = withTiming(row * CELL_HEIGHT);
    }, [exercises, barWidth, selectedX, selectedY]);


    const animatedOverlayStyle = useAnimatedStyle(() => {
        const containerWidth = barWidth / MAX_COLUMNS;
        return {
            transform: [
                { translateX: selectedX.value },
                { translateY: selectedY.value },
            ],
            width: containerWidth,
            height: CELL_HEIGHT,
        };
    });

    return (
        <Container width={"90%"} label="exercises">
            <Animated.View
                style={[
                    styles.bar,
                    { backgroundColor: hexToRGBA(color.handle, 0.4) },
                ]}
                onLayout={(event) => {
                    setBarWidth(event.nativeEvent.layout.width);
                }}
            >
                {exercises.map((ex, index) => (
                    <View key={ex.id} style={[styles.cellContainer, { width: barWidth / MAX_COLUMNS }]}>
                        <IButton height={CELL_HEIGHT} onPress={() => selectExercise(ex.id)}>
                            <Text style={[{ fontFamily }, { color: color.text }]}>{index + 1}</Text>
                        </IButton>
                    </View>
                ))}
                <View style={[
                    styles.cellContainer,
                    {
                        width: barWidth / MAX_COLUMNS,
                        borderRadius: 8,
                        backgroundColor: hexToRGBA(color.fourthBackground, 0.4),
                    },
                ]}>
                    <IButton
                        height={CELL_HEIGHT}
                        onPress={addExercise}
                    >
                        <Ionicons name="add" size={24} color={color.text} />
                    </IButton>
                </View>
                {exercises?.length ? (
                    <Animated.View
                        style={[
                            styles.selectedOverlay,
                            animatedOverlayStyle,
                            { backgroundColor: hexToRGBA(color.text, 0.2) },
                        ]}
                        pointerEvents="none"
                    />
                ) : null}
            </Animated.View>
        </Container >
    );
};

const styles = StyleSheet.create({
    bar: {
        width: "100%",
        minHeight: CELL_HEIGHT,
        borderRadius: 8,
        flexDirection: "row",
        flexWrap: "wrap",
        position: "relative",
    },
    cellContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: CELL_HEIGHT,
    },
    selectedOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 8,
        height: CELL_HEIGHT,
    },
});

export default ExerciseBarOld;