import React, { useState, useRef, useEffect, useMemo } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import IButton from "../buttons/IButton";
import Container from "../containers/Container";
import { router } from "expo-router";
import { LayoutItem, useExerciseLayout } from "../context/ExerciseLayoutZustand";
import { useRoutine } from "../context/RoutineZustand";
import { isCardioExercise, isGymExercise, isSuperSet } from "../context/utils/GymUtils";
import { ExerciseWidget } from "./ExerciseWidget";
import { SuperSetWidget } from "./SuperSetWidget";
import { CardioWidget } from "./CardioWidget";
import { TextInput } from "react-native";
import ISlide from "../bubbles/ISlide";
import { ExerciseSwapList } from "./ExerciseSwapList";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";

const MAX_VISIBLE_CELLS = 5;
const CELL_HEIGHT = 44;

const EditExerciseBar: React.FC = React.memo(() => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const { getLayout, removeFromLayout, updateLayoutItem } = useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const { bubbleVisible, popBubble, makeBubble } = useBubbleLayout();

    const template = getLayout(activeRoutine.layoutId);
    const layout = useMemo(() => template?.layout ?? [], [template]);
    const id = activeRoutine.layoutId;

    const [barWidth, setBarWidth] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

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

    const handleRemoveExercise = (index: number) => {
        if (layout[index]) {
            removeFromLayout(id, layout[index].id);
            if (selectedIndex === index) {
                setSelectedIndex(-1);
            } else if (selectedIndex > index) {
                setSelectedIndex(selectedIndex - 1);
            }
        }
    };

    const handleUpdateRest = (index: number, rest: number) => {
        const exercise = layout[index];
        if (exercise && isGymExercise(exercise)) {
            updateLayoutItem(id, exercise.id, { ...exercise, restLength: rest });
        }
    };

    return (
        <View style={{ width: "100%", gap: 8, flexDirection: "column" }}>
            <ISlide
                visible={bubbleVisible}
                onClose={popBubble}
                size="xl"
            >
                <ExerciseSwapList layoutId={id} />
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
                                {layout?.length !== 0 ? (
                                    <View
                                        style={[
                                            styles.cellContainer,
                                            {
                                                width: cellWidth,
                                                height: CELL_HEIGHT,
                                                backgroundColor: hexToRGBA(color.handle, 0.6),
                                            },
                                            layout?.length !== 0 ? {} : { borderRadius: 8 },
                                        ]}
                                    >
                                        <IButton
                                            height={CELL_HEIGHT}
                                            width={cellWidth}
                                            onPress={makeBubble}
                                        >
                                            <Ionicons name="swap-horizontal" size={24} color={color.tint} />
                                        </IButton>
                                    </View>
                                ) : null}

                                <View style={styles.grid}>
                                    {layout.map((ex: LayoutItem, index: number) => {
                                        const commonProps = {
                                            key: index,
                                            id: String(ex.id),
                                            layoutId: id,
                                            customHeight: CELL_HEIGHT,
                                            customWidth: cellWidth,
                                            onPress: () => onCellPress(index),
                                        };
                                        if (isGymExercise(ex)) return <ExerciseWidget {...commonProps} />;
                                        if (isSuperSet(ex)) return <SuperSetWidget {...commonProps} />;
                                        if (isCardioExercise(ex)) return <CardioWidget {...commonProps} />;
                                    })}
                                </View>
                                
                                <View
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
                                    <IButton 
                                        height={CELL_HEIGHT} 
                                        width={"100%"} 
                                        onPress={() => {
                                            router.push(`/modals/addExercise?layoutId=${id}`);
                                        }}
                                    >
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
            </Container>

            {/* Selected Exercise Details */}
            {selectedIndex > 0 && layout[selectedIndex - 1] && (
                <Container width={"90%"} style={styles.detailsContainer}>
                    <View style={styles.detailsHeader}>
                        <Text style={[styles.detailsTitle, { color: color.text }]}>
                            {isGymExercise(layout[selectedIndex - 1]) && layout[selectedIndex - 1].name}
                            {isSuperSet(layout[selectedIndex - 1]) && `Super Set (${layout[selectedIndex - 1].layout?.length || 0} exercises)`}
                            {isCardioExercise(layout[selectedIndex - 1]) && layout[selectedIndex - 1].name}
                        </Text>
                        <IButton
                            height={32}
                            width={80}
                            onPress={() => handleRemoveExercise(selectedIndex - 1)}
                            color={color.error || "#FF3B30"}
                            textColor={color.primaryBackground}
                        >
                            <Ionicons name="trash-outline" size={16} color={color.primaryBackground} />
                        </IButton>
                    </View>

                    {/* Exercise Parameters */}
                    {isGymExercise(layout[selectedIndex - 1]) && (
                        <View style={styles.parametersContainer}>
                            <View style={styles.parameterRow}>
                                <Text style={[styles.parameterLabel, { color: color.text }]}>Rest (s):</Text>
                                <TextInput
                                    style={[styles.parameterInput, { 
                                        backgroundColor: color.primaryBackground, 
                                        color: color.text,
                                        borderColor: color.handle 
                                    }]}
                                    value={layout[selectedIndex - 1].restLength?.toString() || "60"}
                                    onChangeText={(text) => {
                                        const rest = parseInt(text) || 60;
                                        handleUpdateRest(selectedIndex - 1, rest);
                                    }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    )}
                </Container>
            )}
        </View>
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
    detailsContainer: {
        marginTop: 8,
    },
    detailsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        marginBottom: 12,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
    },
    parametersContainer: {
        gap: 12,
    },
    parameterRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    parameterLabel: {
        fontSize: 14,
        fontWeight: "500",
        minWidth: 60,
    },
    parameterInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        minWidth: 80,
        textAlign: "center",
    },
});

export default EditExerciseBar;
