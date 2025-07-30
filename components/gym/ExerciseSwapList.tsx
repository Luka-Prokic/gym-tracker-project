import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SCREEN_WIDTH } from "../../constants/ScreenWidth";
import React, { useMemo, useState } from "react";
import {
    Layout,
    LayoutItem,
    useExerciseLayout,
} from "@/components/context/ExerciseLayoutZustand";
import Colors, { Themes } from "@/constants/Colors";
import { useTheme } from "@/components/context/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";
import { isCardioExercise, isGymExercise, isSuperSet } from "../context/utils/GymUtils";
import { ExerciseWidget } from "./ExerciseWidget";
import { SuperSetWidget } from "./SuperSetWidget";
import { CardioWidget } from "./CardioWidget";
import useGetExerciseFullName from "./hooks/useGetExerciseFullName";
import useGetExerciseInitial from "./hooks/useGetExerciseInitial";
import getInitials from "@/assets/hooks/getInitials";
import { ShakeButton } from "../buttons/ShakeButton";
import { Ionicons } from "@expo/vector-icons";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";

interface ExerciseSwapListProps {
    layoutId: Layout["id"];
}

export const ExerciseSwapList: React.FC<ExerciseSwapListProps> = ({ layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getLayout, updateLayoutOrder } = useExerciseLayout();
    const [iKey, setKey] = useState(0);

    const template = getLayout(layoutId);
    const layout = useMemo(() => template?.layout ?? [], [template]);

    if (!template) return null;

    const reorder = (from: number, to: number) => {
        if (to < 0 || to >= layout.length) return;
        const newLayout = [...layout];
        const [moved] = newLayout.splice(from, 1);
        newLayout.splice(to, 0, moved);
        updateLayoutOrder(layoutId, newLayout);
        setKey((prev) => prev + 1);
    };

    return (
        <ScrollView
            key={iKey}
            showsVerticalScrollIndicator={false}
            style={{ paddingBottom: 144, paddingTop: 8, width: "100%" }}
            contentContainerStyle={{ paddingHorizontal: "5%", gap: 8 }}
        >
            {layout.map((exercise: LayoutItem, index: number) => {

                return (
                    <View
                        key={`${exercise.id}-${index}`}
                        style={[styles.card,
                        {
                            backgroundColor: hexToRGBA(color.grayText, 0.2),
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                            shadowColor: color.shadow,
                            borderColor: color.border,
                        },
                        ]}>
                        <View style={{ flex: 1 }}>
                            {isSuperSet(exercise) ?
                                <Text style={{ fontWeight: "bold", color: color.text, fontSize: 16 }}>
                                    {exercise.name}
                                </Text>
                                :
                                <Text style={{ fontWeight: "bold", color: color.text, fontSize: 16 }}>
                                    {useGetExerciseFullName(exercise.exId)}
                                </Text>
                            }
                        </View>

                        <View style={styles.arrows}>
                            <ShakeButton
                                size={44}
                                onPress={() => reorder(index, index + 1)}
                                onLongPress={() => reorder(index, layout.length - 1)}
                                icon={<Ionicons name="chevron-down" size={24} color={color.text} />}
                                longPressIcon={<Ionicons name="chevron-down-circle" size={26} color={color.text} />}
                                disabled={index + 1 === layout?.length}
                            />
                            <ShakeButton
                                size={44}
                                onPress={() => reorder(index, index - 1)}
                                onLongPress={() => reorder(index, 0)}
                                icon={<Ionicons name="chevron-up" size={24} color={color.text} />}
                                longPressIcon={<Ionicons name="chevron-up-circle" size={26} color={color.text} />}
                                disabled={index === 0}
                            />
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "100%",
        height: 54,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
    },
    arrows: {
        flexDirection: "row",
        gap: 6,
        marginLeft: 8,
        alignItems: "center",
    },
});