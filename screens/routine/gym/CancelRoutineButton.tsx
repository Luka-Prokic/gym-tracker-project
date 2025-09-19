import React, { useEffect } from "react";
import { useRoutine } from "../../../components/context/RoutineZustand";
import IButton from "../../../components/buttons/IButton";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Animated, View, Text } from "react-native";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";
import IBubble, { IBubbleSize } from "../../../components/bubbles/IBubble";
import useBubbleLayout from "../../../components/bubbles/hooks/useBubbleLayout";
import Container from "../../../components/containers/Container";
import { useExerciseLayout } from "../../../components/context/ExerciseLayoutZustand";
import { useRoutine as useRoutineHook } from "../../../components/context/RoutineZustand";

export default function CancelRoutineButton() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const {
        updateRoutine, clearActiveRoutine, clearActiveRoutineOnly, saveAsTemplate,
        activeRoutine,
    } = useRoutine();
    const { getLayout } = useExerciseLayout();
    const { fadeIn } = useFadeInAnim();
    const { bubbleRef, top, left, height, width, makeBubble, bubbleVisible, popBubble } = useBubbleLayout();


    const handleCancel = () => {
        const layout = getLayout(activeRoutine.layoutId);
        const hasExercises = layout?.layout && layout.layout.length > 0;
        
        if (hasExercises) {
            makeBubble();
        } else {
          handleDiscardWorkout();
        }
    };

    const handleDiscardWorkout = () => {
        const { discardStagingLayout, isLayoutBeingEdited, removeLayout, getLayout } = useExerciseLayout.getState();
        
        // Discard any staging changes when canceling workout
        if (isLayoutBeingEdited(activeRoutine.layoutId)) {
            discardStagingLayout(activeRoutine.layoutId);
        }

        // If this layout was created for this workout session and has no saved routines using it,
        // remove it completely since it was never properly saved
        const layout = getLayout(activeRoutine.layoutId);
        if (layout && activeRoutine.status === "template") {
            // Check if this layout is used by any other finished routines
            const { routines } = useRoutine.getState();
            const isUsedByOtherFinishedRoutines = routines.some((r: any) => 
                r.layoutId === activeRoutine.layoutId && 
                r.id !== activeRoutine.id && 
                r.isFinished === true
            );
            
            // If layout is not used by other finished routines, remove it
            if (!isUsedByOtherFinishedRoutines) {
                removeLayout(activeRoutine.layoutId);
            }
        }

        updateRoutine(activeRoutine.id, { ...activeRoutine, status: "template" });
        setTimeout(() => clearActiveRoutine(), 100);
        popBubble();
        router.back();
    };

    const handleSaveAsTemplate = () => {
        saveAsTemplate(activeRoutine.id);
        setTimeout(() => clearActiveRoutineOnly(), 100);
        popBubble();
        router.back();
    };

    return (
        <>
            <Animated.View style={fadeIn}>
                <IButton width={44} height={44} onPress={handleCancel} >
                    <View ref={bubbleRef}>
                        <Ionicons name="close-circle" size={44} color={color.error} />
                    </View>
                </IButton>
            </Animated.View>

            {getLayout(activeRoutine.layoutId)?.layout.length > 0 && (
                <IBubble
                    visible={bubbleVisible}
                    onClose={popBubble}
                    height={height}
                    width={width}
                    top={top}
                    left={left}
                    size={IBubbleSize.large}
                >
                <Container width={"90%"} height={"100%"} direction="column">
                    <Text style={{ 
                        fontSize: 18, 
                        fontWeight: "600", 
                        color: color.text, 
                        textAlign: "center",
                        marginBottom: 16 
                    }}>
                        Cancel Workout
                    </Text>
                    
                    <Text style={{ 
                        fontSize: 14, 
                        color: color.grayText, 
                        textAlign: "center",
                        marginBottom: 24,
                        lineHeight: 20
                    }}>
                        Do you want to save this workout as a template before canceling?
                    </Text>

                    <View style={{ gap: 12, alignItems: 'center' }}>
                        <IButton
                            width={"120%"}
                            height={44}
                            title={"Save as Template"}
                            color={color.accent}
                            textColor={color.secondaryText}
                            onPress={handleSaveAsTemplate}
                        />
                        
                        <IButton
                            width={"120%"}
                            height={44}
                            title={"Cancel Workout"}
                            color={color.error}
                            textColor={color.secondaryText}
                            onPress={handleDiscardWorkout}
                        />
                    </View>
                </Container>
                </IBubble>
            )}
        </>
    );
}