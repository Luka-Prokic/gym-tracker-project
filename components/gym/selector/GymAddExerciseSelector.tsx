import { StyleSheet, Text, View } from "react-native";
import { GymBodyPartFilter } from "./GymBodyPartFilterProps";
import { GymEquipmentFilter } from "./GymEquipmentFilter";
import { GymSearchBar } from "./GymSearchBar";
import React from "react";
import { ExerciseCard } from "./ExerciseCard";
import { ScrollView } from "react-native-gesture-handler";
import { BodypartType, EquipmentType, Exercise } from "@/components/context/ExerciseZustand";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import { Layout } from "@/components/context/ExerciseLayoutZustand";
import { useRoute } from "@react-navigation/native";
import { useGymAddExerciseActions } from "./hooks/useGymAddExerciseActions";
import NoResults from "@/components/text/NoResults";
import IButton from "@/components/buttons/IButton";
import { Ionicons } from "@expo/vector-icons";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import { LinearGradient } from 'expo-linear-gradient';

export type EquipmentFilterType = EquipmentType | "All Equipment";
export type BodypartFilterType = BodypartType | "All Muscles";

export const GymAddExerciseSelector = () => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];


    const route = useRoute();
    const { layoutId } = route.params as { layoutId: Layout["id"] };

    const {
        muscle,
        setMuscle,
        equipment,
        setEquipment,
        search,
        setSearch,
        filteredExercisesList,
        toggleExerciseSelection,
        newExercises,
        handleFin,
        handleSuperFin,
    } = useGymAddExerciseActions(layoutId);

    return (
        <>
            <View style={[styles.body, { backgroundColor: color.background }]}>
                <GymSearchBar value={search} onChangeText={setSearch} />
                <View style={styles.filters}>
                    <GymEquipmentFilter key={equipment} value={equipment} onPress={setEquipment} />
                    <GymBodyPartFilter key={muscle} value={muscle} onPress={setMuscle} />
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    paddingBottom: 88,
                    paddingTop: 8,
                    width: "100%",
                    backgroundColor: color.background,
                }}
                contentContainerStyle={{ paddingHorizontal: "5%", gap: 12 }}
            >
                {filteredExercisesList.length === 0 ? (
                    <NoResults />
                ) : (
                    filteredExercisesList.map((ex: Exercise) => (
                        <ExerciseCard
                            key={ex.id}
                            exerciseId={ex.id}
                            onPress={() => toggleExerciseSelection(ex.id)}
                            bakcgoundColor={hexToRGBA(color.primaryBackground, 1)}
                            showBodypart={true}
                            selected={newExercises.some((e) => e.id === ex.id)}
                        />
                    ))
                )}

            </ScrollView>
            {newExercises.length ?
                <LinearGradient
                    colors={[
                        hexToRGBA(color.text, 0),
                        hexToRGBA(color.text, 0.4),
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        height: 88,
                        width: "100%",
                        position: "absolute",
                        bottom: 0,
                        padding: 22,
                        flexDirection: "row",
                        gap: 16,
                    }}
                >

                    {newExercises.length > 1 ?
                        <IButton
                            height={44} width={"40%"} color={color.tint} textColor={color.secondaryText}
                            title="Super Set"
                            style={{ borderRadius: 22, flex: 2 }}
                            onPress={handleSuperFin} >
                        </IButton> : null}
                    <IButton
                        height={44} color={color.accent} textColor={color.secondaryText}
                        title={newExercises.length === 1 ? "" : `Add ${newExercises.length} Exercises`}
                        style={{ borderRadius: 22, flex: 3 }}
                        onPress={handleFin} >
                        {newExercises.length === 1 ?
                            <>
                                <Ionicons name="add" size={24} color={color.secondaryText} />
                                <Text style={[styles.text, { color: color.secondaryText }]}>
                                    Add Exercise
                                </Text>
                            </>
                            : null}
                    </IButton>
                </LinearGradient> : null}
        </>
    );
};

const styles = StyleSheet.create({
    body: {
        width: "100%",
        height: 156,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'visible',
        position: 'relative',
        paddingHorizontal: "5%",
        paddingTop: 44,
        gap: 8,
        userSelect: 'none',
        zIndex: 3,
    },
    filters: {
        width: "100%",
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
        position: 'relative',
        gap: 8,
        userSelect: 'none',
        zIndex: 3,
        flexDirection: "row"
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
});