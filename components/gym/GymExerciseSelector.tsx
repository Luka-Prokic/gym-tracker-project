import React, { useState, useRef, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import IButton from "../buttons/IButton";
import Container from "../containers/Container";
import { router } from "expo-router";
import { ExerciseWidget } from "./ExerciseWidget";
import { SuperSetWidget } from "./SuperSetWidget";
import { CardioWidget } from "./CardioWidget";
import { isCardioExercise, isGymExercise, isSuperSet } from "../context/utils/GymUtils";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";
import ISlide from "../bubbles/ISlide";
import { ExerciseSwapList } from "./ExerciseSwapList";

const MAX_VISIBLE_CELLS = 5;
const CELL_HEIGHT = 44;

interface GymExerciseSelectorProps {
    layout: any[];
    layoutId: string;
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
}

const GymExerciseSelector: React.FC<GymExerciseSelectorProps> = React.memo(({ layout, layoutId, selectedIndex, setSelectedIndex }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const { bubbleVisible, popBubble, makeBubble } = useBubbleLayout();

    const [barWidth, setBarWidth] = useState(0);

    const cellWidth = useMemo(() => barWidth / MAX_VISIBLE_CELLS, [barWidth]);
    const centerOffset = useMemo(() => (barWidth - cellWidth) / 2, [barWidth, cellWidth]);

    const scrollViewRef = useRef<Animated.ScrollView>(null);
    const [scrollX, setScrollX] = useState(0);

    const snapToIndex = (index: number) => {
        if (!scrollViewRef.current) return;
        if (layout?.length > 0) {
            const safeIndex = Math.max(1, Math.min(index, layout.length));
            setSelectedIndex(safeIndex);

            const offsetX = safeIndex * cellWidth;
            requestAnimationFrame(() => {
                scrollViewRef.current?.scrollTo({ x: offsetX, animated: true });
            });
        }
    };

    const getClosestIndex = (offsetX: number) => {
        let index = Math.round(offsetX / cellWidth);
        if (index < 1) {
            return 1;
        }
        if (index > layout?.length) {
            return layout?.length;
        }
        return index;
    };

    const onCellPress = (index: number) => {
        snapToIndex(index + 1);
    };

    useEffect(() => {
        let timeout = setTimeout(() => {
            const closestIndex = getClosestIndex(scrollX);
            snapToIndex(closestIndex);
        }, 100);

        return () => clearTimeout(timeout);
    }, [scrollX, barWidth, cellWidth]);

    useEffect(() => {
        if (selectedIndex === 0) {
            snapToIndex(0);
        } else {
            snapToIndex(selectedIndex - 1);
        }
    }, [layout.length]);

    return (
        <View style={{ width: "100%", gap: 8, flexDirection: "column" }}>
            <ISlide
                visible={bubbleVisible}
                onClose={popBubble}
                size="xl"
            >
                <ExerciseSwapList layoutId={layoutId} />
            </ISlide>
            <Container width={"90%"} label={layout?.length !== 0 ? "exercises" : ""}>
                <View
                    style={[
                        styles.bar,
                        {
                            height: CELL_HEIGHT,
                            borderRadius: 22,
                        },
                    ]}
                    onLayout={(event) => {
                        setBarWidth(event.nativeEvent.layout.width);
                    }}
                >
                    {barWidth > 0 ? (
                        <>
                            <Animated.ScrollView
                                ref={scrollViewRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                decelerationRate="fast"
                                onScroll={(event) => {
                                    const offsetX = event.nativeEvent.contentOffset.x;
                                    setScrollX(offsetX);
                                }}
                                scrollEventThrottle={16}
                                contentContainerStyle={{
                                    paddingHorizontal: centerOffset,
                                }}
                                scrollEnabled={layout?.length !== 0}
                            >
                                {layout?.length !== 0 ? (<View
                                    style={[
                                        styles.cellContainer,
                                        {
                                            width: cellWidth,
                                            height: CELL_HEIGHT,
                                            backgroundColor: hexToRGBA(color.handle, 0.6),

                                        },
                                        layout?.length !== 0 ? {} : { borderRadius: 8, },
                                    ]}
                                >
                                    <IButton
                                        height={CELL_HEIGHT}
                                        width={cellWidth}
                                        onPress={makeBubble}
                                    >
                                        <Ionicons name="swap-horizontal" size={24} color={color.tint} />
                                    </IButton>
                                </View>) : null}


                                <View style={styles.grid}>
                                    {layout.map((ex: any, index: number) => {
                                        const commonProps = {
                                            key: `${ex.id}-${index}`,
                                            id: String(ex.id),
                                            layoutId,
                                            customHeight: CELL_HEIGHT,
                                            customWidth: cellWidth,
                                            onPress: () => onCellPress(index),
                                        };
                                        if (isGymExercise(ex)) return <ExerciseWidget {...commonProps} />;
                                        if (isSuperSet(ex)) return <SuperSetWidget {...commonProps} />;
                                        if (isCardioExercise(ex)) return <CardioWidget {...commonProps} />;
                                    })}
                                </View>
                                < View
                                    style={[
                                        styles.cellContainer,
                                        {
                                            height: CELL_HEIGHT,
                                            backgroundColor: hexToRGBA(color.handle, 0.6),

                                        },
                                        layout?.length !== 0 ? {
                                            width: cellWidth,
                                        } : {
                                            borderRadius: 8,
                                            width: cellWidth,
                                        },
                                    ]}
                                >
                                    <IButton height={CELL_HEIGHT} width={"100%"} onPress={() => {
                                        router.push(`/modals/addExercise?layoutId=${layoutId}`);
                                    }}>
                                        <Ionicons name="add" size={24} color={color.accent} />
                                    </IButton>
                                </View>
                            </Animated.ScrollView>

                            {layout?.length !== 0 ? (
                                <View
                                    style={[
                                        styles.selectedOverlay,
                                        {
                                            width: cellWidth,
                                            height: CELL_HEIGHT,
                                            left: centerOffset,
                                            backgroundColor: hexToRGBA(color.text, 0.2),
                                        },
                                    ]}
                                    pointerEvents="none"
                                />
                            ) : null}
                        </>
                    ) : null}
                </View>
            </Container >
        </View >
    );
});

const styles = StyleSheet.create({
    bar: {
        width: "100%",
        overflow: "hidden",
        position: "relative",
    },
    grid: {
        overflow: "hidden",
        position: "relative",
        height: CELL_HEIGHT,
        flexDirection: "row",
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

export default GymExerciseSelector;
