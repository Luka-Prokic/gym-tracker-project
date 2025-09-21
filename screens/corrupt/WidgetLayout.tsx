import { StyleSheet, View } from "react-native";
import { useCaka } from "../../components/context/CakaAppZustand";
import { IWidget } from "../../components/widgets/IWidget";
import { useTheme } from "../../components/context/ThemeContext";
import { DndProvider, Draggable, DraggableGrid, UniqueIdentifier } from "@mgcrea/react-native-dnd";
import { SCREEN_WIDTH } from "../../constants/ScreenWidth";
import { useEffect, useState } from "react";
import LEDstrip from "../../components/mis/LEDstrip";
import { useRoutine } from "../../components/context/RoutineZustand";
import { router } from "expo-router";
import { useStartNewRoutine } from "../../assets/hooks/useStartNewRoutine";

export default function WidgetLayout() {
    const { widgetLayout, setWidgetLayout, updateWidget } = useCaka();
    const { activeRoutine } = useRoutine();
    const { startNewRoutine } = useStartNewRoutine();
    const [key, setKey] = useState(0);

    const { homeEditing } = useTheme();

    const handleOrderChange = (newOrder: UniqueIdentifier[]) => {

        const reorderedItems = newOrder.map((id: any) =>
            widgetLayout.find(item => item.id === id)!
        );

        if (reorderedItems === widgetLayout)
            return;

        const hiddenWidgets = widgetLayout.filter((item: any) => item.hidden);
        const updatedLayout = [...reorderedItems, ...hiddenWidgets];

        setWidgetLayout(updatedLayout);
        setKey(prevKey => prevKey + 1);
    };

    useEffect(() => {
        const updatedLayout = widgetLayout.map(widget => {
            //quick start
            if (widget.id === "11233d") {
                return {
                    ...widget,
                    labelPressed: () => {
                        startNewRoutine({ navigationMethod: 'push' });
                    },
                    childrenPressed: () => router.push("/routines"),
                };
            }
            //statistics
            if (widget.id === "12234d") {
                return {
                    ...widget,
                    labelPressed: () => router.push("/stats"),
                    childrenPressed: () => router.push("/stats"),
                };
            }
            return widget;
        });
        setWidgetLayout(updatedLayout);
    }, [activeRoutine]);


    useEffect(() => {
        if (activeRoutine.id !== "routine_111" && activeRoutine?.id && activeRoutine.type === "gym") {
            updateWidget("11233d", { label: "Continue" });
            updateWidget("11233d", { childrenPressed: () => router.push("/routine") });
        } else {
            updateWidget("11233d", { label: "Quick Start" });
            updateWidget("11233d", { childrenPressed: () => router.push("/routines") });
        }
    }, [activeRoutine])


    let totalSlots = 0;
    let oneCount = 0;

    widgetLayout.forEach(widget => {
        if (!widget.hidden) {
            if (widget.mode === "one") {
                totalSlots += 1;
                oneCount += 1;
            } else if (widget.mode === "two") {
                if (oneCount % 2 !== 0) {
                    totalSlots += 1;
                    oneCount = 0;
                }
                totalSlots += 2;
            } else if (widget.mode === "four") {
                if (oneCount % 2 !== 0) {
                    totalSlots += 1;
                    oneCount = 0;
                }
                totalSlots += 4;
            }
        }
    });

    return (
        <DndProvider>
            {homeEditing && (
                <View style={styles.placeholderGrid}>
                    {Array.from({ length: totalSlots }).map((_, index) => (
                        <LEDstrip key={index} />
                    ))}
                </View>
            )}

            <DraggableGrid
                key={key}
                direction="row"
                size={2}
                style={styles.grid}
                onOrderChange={handleOrderChange}
            >
                {widgetLayout.map((widget) => (
                    !widget.hidden && (
                        <Draggable
                            key={widget.id}
                            id={String(widget.id)}
                            style={[
                                styles[widget.mode as keyof typeof styles] || styles.one,
                            ]}
                            disabled={!homeEditing}
                        >
                            <IWidget
                                id={widget.id}
                                customWidth={"100%"}
                                customHeight={"100%"}
                                disabled={homeEditing}
                                draggable={homeEditing}
                            />
                        </Draggable>
                    )
                ))}
            </DraggableGrid>
        </DndProvider >
    );
}

const styles = StyleSheet.create({
    placeholderGrid: {
        position: "absolute",
        width: SCREEN_WIDTH,
        flexDirection: "row",
        flexWrap: "wrap",
        zIndex: -1,
        paddingHorizontal: "3%",
    },
    grid: {
        height: "100%",
        width: SCREEN_WIDTH,
        paddingHorizontal: "4%",
    },
    one: {
        width: "50%",
        padding: "1%",
        aspectRatio: 1,
    },
    two: {
        width: "100%",
        padding: "1%",
        aspectRatio: 2,
    },
    four: {
        width: "100%",
        padding: "1%",
        aspectRatio: 1,
    },
});