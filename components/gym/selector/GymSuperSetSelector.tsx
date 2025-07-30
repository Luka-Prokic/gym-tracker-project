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
import { GymExercise, Layout, SuperSet, useExerciseLayout } from "@/components/context/ExerciseLayoutZustand";
import { useRoute } from "@react-navigation/native";
import NoResults from "@/components/text/NoResults";
import IButton from "@/components/buttons/IButton";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import { useGymSuperSetActions } from "./hooks/useGymSuperSetActions";
import IList from "@/components/containers/IList";
import { useRoutine } from "@/components/context/RoutineZustand";
import { isCardioExercise, isGymExercise } from "@/components/context/utils/GymUtils";

export type EquipmentFilterType = EquipmentType | "All Equipment";
export type BodypartFilterType = BodypartType | "All Muscles";

export const GymSuperSetSelector = () => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const { getSuperSet, getGymExercise, getLayout } = useExerciseLayout();
    const { activeRoutine } = useRoutine();

    const layout = getLayout(activeRoutine.layoutId);
    const route = useRoute();
    const { layoutId, exId, superSetId } = route.params as { layoutId: Layout["id"], exId: GymExercise["id"], superSetId: SuperSet["id"] };

    const type = exId ? "exercise" : superSetId ? "superset" : "none";

    let element;
    if (type === "superset") {
        element = getSuperSet(layoutId, superSetId);

    } else if (type === "exercise") {
        element = getGymExercise(layoutId, exId);
    }

    if (!element || !layout)
        return null;

    const {
        muscle,
        setMuscle,
        equipment,
        setEquipment,
        search,
        setSearch,
        filteredExercisesList,
        toggleExerciseSelection,
        toggleOldSelection,
        toggleLayoutSelection,
        oldSet,
        newSet,
        removedSet,
        layoutSet,
        handleFin,
    } = useGymSuperSetActions(layoutId, exId, superSetId);


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
                contentContainerStyle={{ paddingHorizontal: "5%", gap: 16 }}
            >
                <IList label={exId ? "exercise" : "super set"} style={{ gap: 12 }} hrStart="None">
                    {oldSet.map((ex: any) => (
                        <ExerciseCard
                            key={ex.id}
                            exerciseId={ex.exId}
                            onPress={() => toggleOldSelection(ex.id)}
                            bakcgoundColor={hexToRGBA(color.thirdBackground, .4)}
                            showBodypart={true}
                            selected={!removedSet.some(e => e === ex.id)}
                        />
                    ))}
                </IList>

                <IList label="from routine" style={{ gap: 12 }} hrStart="None">
                    {layout.layout.map((ex: any) => {
                        if ((isGymExercise(ex) || isCardioExercise(ex)) && ex.id !== exId)
                            return <ExerciseCard
                                key={ex.id}
                                exerciseId={ex.exId}
                                onPress={() => toggleLayoutSelection(ex.id)}
                                bakcgoundColor={hexToRGBA(color.thirdBackground, .4)}
                                showBodypart={true}
                                selected={layoutSet.some(e => e === ex.id)}
                            />
                        else null
                    })}
                </IList>

                <IList label="add new" style={{ gap: 12 }} hrStart="None">
                    {filteredExercisesList.length === 0 ? (
                        <NoResults />
                    ) : (
                        filteredExercisesList.map((ex: Exercise) => (
                            <ExerciseCard
                                key={ex.id}
                                exerciseId={ex.id}
                                onPress={() => toggleExerciseSelection(ex.id)}
                                bakcgoundColor={hexToRGBA(color.fourthBackground, .4)}
                                showBodypart={true}
                                selected={newSet.some((e) => e.id === ex.id)}
                            />
                        ))
                    )}
                </IList>

            </ScrollView>
            {newSet.length || removedSet.length || layoutSet.length ?
                <View style={{ gap: "4%", position: "fixed", bottom: 16, paddingHorizontal: 16, width: "100%", height: 44, flexDirection: "row" }}>
                    <IButton
                        height={44} color={color.accent} textColor={color.secondaryText}
                        style={{ borderRadius: 22, flex: 3 }}
                        onPress={handleFin} >
                        <>
                            <Text style={[styles.text, { color: color.secondaryText }]}>
                                Update Super Set
                            </Text>
                        </>
                    </IButton>
                </View> : null}
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