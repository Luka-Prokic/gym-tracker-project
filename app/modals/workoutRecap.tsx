import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../../components/context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import { useRoutine } from '../../components/context/RoutineZustand';
import { useExerciseLayout } from '../../components/context/ExerciseLayoutZustand';
import { useLocalSearchParams, router } from 'expo-router';
import CardWrapper from '../../components/bubbles/CardWrapper';
import { ReadOnlyGymTable } from '../../components/gym/readonly/ReadOnlyGymTable';
import { ReadOnlySuperSetTable } from '../../components/gym/readonly/ReadOnlySuperSetTable';
import { ReadOnlyCardioTable } from '../../components/gym/readonly/ReadOnlyCardioTable';
import { isGymExercise, isSuperSet, isCardioExercise } from '../../components/context/utils/GymUtils';
import ITopBar from '../../components/headers/ITopBar';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import IButton from '../../components/buttons/IButton';
import { Ionicons } from '@expo/vector-icons';
import hexToRGBA from '../../assets/hooks/HEXtoRGB';
import ISlide from '../../components/bubbles/ISlide';
import Container from '../../components/containers/Container';
import { useStartNewRoutine } from '../../assets/hooks/useStartNewRoutine';
import useCloneLayout from '../../assets/hooks/useCloneLayout';

export default function WorkoutRecap() {
    const params = useLocalSearchParams();
    const routineId = params.routineId as string;
    const layoutId = params.layoutId as string;

    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const { routines, checkAndAddRoutine } = useRoutine();
    const { getLayout, saveLayout, layouts } = useExerciseLayout();
    const { startNewRoutine } = useStartNewRoutine();

    // State for template creation
    const [showTemplateSlide, setShowTemplateSlide] = useState(false);
    const [templateName, setTemplateName] = useState('');

    const routine = routines.find(r => r.id === routineId);
    const layout = getLayout(layoutId);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <ITopBar />
            )
        });
    }, [navigation]);

    if (!routine || !layout) {
        return (
            <CardWrapper visible={true}>
                <View style={styles.container}>
                    <Text style={[styles.title, { color: color.text }]}>Workout Not Found</Text>
                </View>
            </CardWrapper>
        );
    }

    const getWorkoutDate = () => {
        const date = new Date(routine.lastStartTime || routine.endTime || Date.now());
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDuration = () => {
        if (routine?.timer) {
            const minutes = Math.floor(routine.timer / 60);
            const seconds = routine.timer % 60;
            if (minutes > 0) {
                return `${minutes}m ${seconds}s`;
            }
            return `${seconds}s`;
        }
        return 'N/A';
    };

    const handleAddTemplate = () => {
        if (!layout) return;
        setTemplateName(layout.name || 'Unnamed Template');
        setShowTemplateSlide(true);
    };

    const handleConfirmTemplate = () => {
        if (!layout || !routine) return;
        
        // Clone the layout for the template
        const clonedLayout = useCloneLayout({ layout, existingLayouts: layouts });
        clonedLayout.name = templateName;
        
        // Save the cloned layout
        saveLayout(clonedLayout);
        
        // Create a new template routine
        const templateRoutineId = "template_" + Date.now();
        const templateRoutine = {
            id: templateRoutineId,
            layoutId: clonedLayout.id,
            timer: 0,
            status: "template" as const,
            type: "gym" as const,
            isFinished: false,
        };
        
        checkAndAddRoutine(templateRoutine);
        setShowTemplateSlide(false);
        setTemplateName('');
        
        // Navigate to Templates tab in ActivityScreen
        router.replace('/routines?tab=templates');
    };

    const handleRepeat = () => {
        if (!layout) return;
        startNewRoutine({ fromLayout: layout, navigationMethod: 'replace' });
    };

    return (
        <>
            <ISlide
                visible={showTemplateSlide}
                onClose={() => setShowTemplateSlide(false)}
                size="large"
                type="glass"
            >
                <Text style={[styles.slideTitle, { color: color.text }]}>
                    Save as Template
                </Text>
                <Container width="90%" style={styles.nameContainer}>
                    <TextInput
                        style={[styles.nameInput, { color: color.text, borderColor: color.handle }]}
                        value={templateName}
                        onChangeText={setTemplateName}
                        placeholder="Enter template name"
                        placeholderTextColor={color.secondaryText}
                        maxLength={50}
                    />
                    <Text style={[styles.inputLabel, { color: color.grayText }]}>
                        Template Name
                    </Text>
                </Container>
                <Text style={[styles.slideDescription, { color: color.text }]}>
                    Create a reusable template from this workout that you can use to start future workouts
                </Text>
                <IButton
                    height={44}
                    width="90%"
                    color={color.accent}
                    textColor={color.secondaryText}
                    title="Confirm"
                    style={{ borderRadius: 22, marginTop: 16 }}
                    onPress={handleConfirmTemplate}
                />
            </ISlide>

            <ScrollView style={[styles.container, { backgroundColor: color.background }]}>
                <Text style={[styles.title, { color: color.text }]}>
                    {routine.displayName || 'Workout Recap'}
                </Text>
                <View style={styles.headerInfo}>
                    <Text style={[styles.infoText, { color: color.grayText }]}>
                        {getWorkoutDate()}
                    </Text>
                    <Text style={[styles.infoText, { color: color.grayText }]}>
                        Duration: {getDuration()}
                    </Text>
                </View>

                {layout.layout && layout.layout.length > 0 ? (
                    layout.layout.map((item: any, index: number) => {
                        if (isGymExercise(item)) {
                            return <ReadOnlyGymTable key={index} exerciseId={item.id} layoutId={layoutId} />;
                        } else if (isSuperSet(item)) {
                            return <ReadOnlySuperSetTable key={index} supersetId={item.id} layoutId={layoutId} />;
                        } else if (isCardioExercise(item)) {
                            return <ReadOnlyCardioTable key={index} exerciseId={item.id} layoutId={layoutId} />;
                        }
                        return null;
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: color.grayText }]}>
                            This routine is empty - no exercises were performed
                        </Text>
                    </View>
                )}

                {/* Spacer for buttons */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Buttons */}
            <LinearGradient
                colors={[
                    hexToRGBA(color.text, 0),
                    hexToRGBA(color.text, 0.4),
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.buttonGradient}
            >
                <IButton
                    height={44}
                    width="48%"
                    color={color.tint}
                    textColor={color.secondaryText}
                    title="Make Template"
                    style={{ borderRadius: 22 }}
                    onPress={handleAddTemplate}
                />
                <IButton
                    height={44}
                    width="48%"
                    color={color.accent}
                    textColor={color.secondaryText}
                    title="Start Again"
                    style={{ borderRadius: 22 }}
                    onPress={handleRepeat}
                />
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 44,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        marginHorizontal: "5%",
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginHorizontal: "5%",
    },
    infoText: {
        fontSize: 14,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    buttonGradient: {
        height: 88,
        width: "100%",
        position: "absolute",
        bottom: 0,
        paddingHorizontal: "5%",
        paddingVertical: 22,
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    slideTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    slideDescription: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.7,
        lineHeight: 20,
        paddingHorizontal: '10%',
    },
    nameContainer: {
        marginBottom: 8,
    },
    nameInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: "500",
        backgroundColor: "transparent",
        width: "100%",
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'center',
        textTransform: 'capitalize',
        letterSpacing: 0.5,
    },
});
