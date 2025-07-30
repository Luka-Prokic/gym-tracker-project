import { StyleSheet, View } from "react-native";
import { GymBodyPartFilter } from "./GymBodyPartFilterProps";
import { GymEquipmentFilter } from "./GymEquipmentFilter";
import { GymSearchBar } from "./GymSearchBar";
import React from "react";
import IList from "@/components/containers/IList";
import { BodypartType, EquipmentType, Exercise } from "@/components/context/ExerciseZustand";
import capitalizeWords from "@/assets/hooks/capitalize";
import IButton from "@/components/buttons/IButton";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import { GymExercise, Layout } from "@/components/context/ExerciseLayoutZustand";
import { useRoute } from "@react-navigation/native";
import { useGymSwapExerciseActions } from "./hooks/useGymSwapExerciseActions";
import NoResults from "@/components/text/NoResults";
import { ScrollView } from "react-native-gesture-handler";
import { ExerciseCard } from "./ExerciseCard";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";

export type EquipmentFilterType = EquipmentType | "All Equipment";
export type BodypartFilterType = BodypartType | "All Muscles";

export const GymSwapExerciseSelector = () => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const route = useRoute();
    const { layoutId, exId } = route.params as { layoutId: Layout["id"], exId: GymExercise["id"] };

    const {
        muscle,
        setMuscle,
        equipment,
        setEquipment,
        search,
        setSearch,
        filteredExercisesList,
        handleSwapExercise,
        oldExerciseId
    } = useGymSwapExerciseActions(layoutId, exId);

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
                            onPress={() => handleSwapExercise(ex.id)}
                            bakcgoundColor={hexToRGBA(color.fourthBackground, .4)}
                            showBodypart={true}
                            disabled={oldExerciseId === ex.id}
                        />
                    ))
                )}

            </ScrollView>
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
        paddingBottom: 16,
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
});