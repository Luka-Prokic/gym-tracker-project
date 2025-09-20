import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTheme } from "../../components/context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import LilButton from "../../components/buttons/LilButton";
import LayoutExerciseBar from "../../components/layout/LayoutExerciseBar";
import { Layout, useExerciseLayout, LayoutItem } from "../../components/context/ExerciseLayoutZustand";
import useCloneLayout from "../../assets/hooks/useCloneLayout";
import { RoutineLayout, useRoutine } from "../../components/context/RoutineZustand";

export default function EditLayoutScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const { layoutId: rawLayoutId, mode: rawMode } = useLocalSearchParams<{ layoutId?: string; mode?: string }>();
    const sourceLayoutId = typeof rawLayoutId === "string" ? rawLayoutId : undefined;
    const isCreateMode = rawMode === "create";

    const { getLayout, saveLayout, removeLayout, addToSaved, updateLayoutName, startEditingLayout, commitStagingLayout, discardStagingLayout, layouts } = useExerciseLayout();
    const { routines, checkAndAddRoutine, setActiveRoutine, clearActiveRoutineOnly } = useRoutine();

    const [editingLayoutId, setEditingLayoutId] = useState<string | undefined>(undefined);
    const [clonedLayoutId, setClonedLayoutId] = useState<string | null>(null);
    const [originalLayout, setOriginalLayout] = useState<Layout | null>(null);

    // Decide if the layout is used by any finished routine
    const isUsedByFinished = useMemo(() => {
        if (!sourceLayoutId) return false;
        return routines.some(r => r.layoutId === sourceLayoutId && r.isFinished === true && r.status === "routine");
    }, [routines, sourceLayoutId]);

    // On mount: prepare an ephemeral routine pointing to the layout to edit (clone if needed)
    useEffect(() => {
        if (!sourceLayoutId) return;
        const original = getLayout(sourceLayoutId);
        if (!original) return;

        let targetLayoutId = sourceLayoutId;

        if (isUsedByFinished) {
            // Clone the layout for safe editing
            const cloned = useCloneLayout({ layout: original, existingLayouts: layouts });
            saveLayout(cloned);
            addToSaved(cloned.id);
            targetLayoutId = cloned.id;
            setClonedLayoutId(cloned.id);
        }

        // Start editing session with staging
        startEditingLayout(targetLayoutId);

        // Create an ephemeral routine to let ExerciseBar operate without timers/header
        const tempRoutineId = "routine_edit_" + Date.now();
        const tempRoutine: RoutineLayout = {
            id: tempRoutineId,
            layoutId: targetLayoutId,
            timer: 0,
            status: "template",
            type: "gym",
            isFinished: false,
        };
        checkAndAddRoutine(tempRoutine);
        setActiveRoutine(tempRoutineId);
        setEditingLayoutId(targetLayoutId);

        return () => {
            // On unmount, discard any uncommitted changes
            if (targetLayoutId) {
                discardStagingLayout(targetLayoutId);
                
                // In create mode, also remove the layout if user navigates away without saving
                if (isCreateMode) {
                    removeLayout(targetLayoutId);
                }
            }
            clearActiveRoutineOnly();
        };
    }, [sourceLayoutId, isUsedByFinished]);

    const handleCancel = () => {
        if (!editingLayoutId) return;

        // Discard all staging changes
        discardStagingLayout(editingLayoutId);
        
        if (isCreateMode) {
            // In create mode: delete the layout completely since it was never properly saved
            removeLayout(editingLayoutId);
        } else {
            // In edit mode: if we created a clone for editing, remove it
            if (clonedLayoutId) {
                removeLayout(clonedLayoutId);
            }
        }

        router.back();
    };

    const handleDone = () => {
        if (!editingLayoutId) return;

        // Commit all staging changes to storage
        commitStagingLayout(editingLayoutId);

        // In create mode, add the layout to saved templates
        if (isCreateMode) {
            addToSaved(editingLayoutId);
        }

        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: color.background }]}>

            <View style={[styles.actionsRow, { pointerEvents: 'box-none' }]}>
                <View style={[styles.left, { pointerEvents: 'auto' }]}>
                    <LilButton
                        height={22}
                        length="short"
                        title="Cancel"
                        color={color.accent}
                        textColor={color.primaryBackground}
                        onPress={handleCancel}
                    />
                </View>
                <View style={[styles.right, { pointerEvents: 'auto' }]}>
                    <LilButton
                        height={22}
                        length="short"
                        title="Done"
                        color={color.primaryBackground}
                        textColor={color.accent}
                        onPress={handleDone}
                    />
                </View>
            </View>

            {/* Layout Name Input */}
            {editingLayoutId && (
                <View style={[styles.nameContainer, { backgroundColor: color.background }]}>
                    <TextInput
                        style={[styles.nameInput, { color: color.text, borderColor: color.handle }]}
                        value={getLayout(editingLayoutId)?.name || ""}
                        onChangeText={(text) => {
                            if (editingLayoutId) {
                                updateLayoutName(editingLayoutId, text);
                            }
                        }}
                        placeholder="Layout Name"
                        placeholderTextColor={color.secondaryText}
                        maxLength={50}
                    />
                </View>
            )}

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {editingLayoutId ? (
                    <LayoutExerciseBar key={`layout-exercise-bar-${editingLayoutId}`} />
                ) : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 8,
    },

    actionsRow: {
        height: 44,
        width: "100%",
        paddingHorizontal: 11,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    right: {
        height: 44,
        justifyContent: "center",
        flexDirection: "column",
    },
    left: {
        height: 44,
        justifyContent: "center",
        flexDirection: "column",
    },
    scrollContainer: {
        flex: 1,
        width: "100%",
    },
    scrollContent: {
        paddingBottom: 80,
        paddingTop: 44,
        flexGrow: 1,
    },
    nameContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 44,
    },
    nameInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: "500",
        backgroundColor: "transparent",
    },
});


