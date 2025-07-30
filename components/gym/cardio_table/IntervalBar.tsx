import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import IButton from "../../buttons/IButton";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import hexToRGBA from "../../../assets/hooks/HEXtoRGB";
import { Ionicons } from "@expo/vector-icons";
import { CardioExercise, useExerciseLayout } from "@/components/context/ExerciseLayoutZustand";
import useCardioActions from "../hooks/useCardioActions";

interface IntervalBarProps {
    selectedIndex: number;
    setIndex: (index: number) => void;
    total: number;
    exerciseId: CardioExercise["id"];
}

const CELL_HEIGHT = 34;
const MAX_VISIBLE_CELLS = 5;
const SEPARATOR_WIDTH = 3;

const IntervalBar: React.FC<IntervalBarProps> = ({ selectedIndex, setIndex, total, exerciseId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { addInterval } = useExerciseLayout();
    const { layoutId, exercise, metrics } = useCardioActions(exerciseId);

    if (!exercise) return null;

    const [barWidth, setBarWidth] = useState(0);
    const scrollViewRef = useRef<Animated.ScrollView>(null);
    const [scrollX, setScrollX] = useState(0);

    const cellWidth = useMemo(() => (barWidth - (MAX_VISIBLE_CELLS - 1) * SEPARATOR_WIDTH) / MAX_VISIBLE_CELLS, [barWidth]);

    const centerOffset = useMemo(() => (barWidth - cellWidth) / 2, [barWidth, cellWidth]);

    const snapToIndex = (index: number) => {
        const clamped = Math.max(0, Math.min(index, total - 1));
        setIndex(clamped);

        const offsetX = clamped * (cellWidth + SEPARATOR_WIDTH);
        scrollViewRef.current?.scrollTo({ x: offsetX, animated: true });
    };

    const getClosestIndex = (offsetX: number) => {
        let index = Math.round(offsetX / (cellWidth + SEPARATOR_WIDTH));
        return Math.max(0, Math.min(index, total - 1));
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            snapToIndex(getClosestIndex(scrollX));
        }, 100);
        return () => clearTimeout(timeout);
    }, [scrollX]);

    useEffect(() => {
        if (barWidth > 0) {
            requestAnimationFrame(() => {
                snapToIndex(selectedIndex);
            });
        }
    }, [barWidth]);

    const handleAddNewInterval = () => {
        snapToIndex(total);
        addInterval(layoutId, exerciseId);
    };


    useEffect(() => {
        setIndex(exercise.intervals?.length ? exercise.intervals?.length - 1 : 0);

        snapToIndex(total);
    }, [exercise.intervals?.length])

    return (
        <View
            style={{ height: CELL_HEIGHT, backgroundColor: color.fifthBackground }}
            onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
        >
            {barWidth > 0 ? (
                <>
                    <Animated.ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        decelerationRate="fast"
                        scrollEventThrottle={16}
                        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
                        contentContainerStyle={{ paddingHorizontal: centerOffset }}
                    >

                        {exercise.intervals?.length ?
                            <View style={[styles.grid, { width: total * (cellWidth + SEPARATOR_WIDTH) - SEPARATOR_WIDTH }]}>
                                {Array.from({ length: total }).map((_, i) => (
                                    <React.Fragment key={i}>
                                        <View
                                            style={[
                                                styles.cellContainer,
                                                {
                                                    width: cellWidth,
                                                    height: CELL_HEIGHT,
                                                },
                                            ]}
                                        >
                                            <IButton
                                                height={CELL_HEIGHT}
                                                width={cellWidth}
                                                onPress={() => snapToIndex(i)}
                                                title={`${i + 1}`}
                                                textColor={color.secondaryText}
                                            />
                                        </View>
                                        {i + 1 !== total ? <View style={{ width: SEPARATOR_WIDTH, borderRadius: 2, height: "60%", backgroundColor: color.background }} /> : null}
                                    </React.Fragment>
                                ))}
                            </View>
                            : null}

                    </Animated.ScrollView>

                    {exercise.intervals?.length ? <View
                        style={[
                            styles.selectedOverlay,
                            {
                                width: cellWidth * 0.9,
                                height: CELL_HEIGHT * 0.8,
                                marginVertical: CELL_HEIGHT * 0.1,
                                marginHorizontal: cellWidth * 0.05,
                                borderRadius: 16,
                                left: centerOffset,
                                backgroundColor: hexToRGBA(color.secondaryText, 0.4),
                            },
                        ]}
                        pointerEvents="none"
                    /> :
                        <IButton height={CELL_HEIGHT} width={"100%"} onPress={handleAddNewInterval}>
                            <Ionicons name="add" size={24} color={color.secondaryText} />
                        </IButton>
                    }
                </>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        height: CELL_HEIGHT,
        alignItems: "center",
    },
    cellContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    selectedOverlay: {
        position: "absolute",
        top: 0,
    },
});

export default IntervalBar;