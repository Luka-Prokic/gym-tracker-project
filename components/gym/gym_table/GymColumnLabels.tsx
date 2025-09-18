import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import useGymActions from "../hooks/useGymActions";
import { GymExercise } from "../../context/ExerciseLayoutZustand";
import { useUser } from "@/components/context/UserZustend";
import GymWightLabel from "./GymWightLabel";

interface GymColumnLabelsProps {
  exerciseId: GymExercise["id"];
  heightAnim: Animated.Value;
  readOnly?: boolean;
}

const GymColumnLabels: React.FC<GymColumnLabelsProps> = ({ exerciseId, heightAnim, readOnly }) => {
  const { theme } = useTheme();
  const color = Colors[theme as Themes];
  const { columns, exercise } = useGymActions(exerciseId);
  const { settings } = useUser();

  const weightUnit = settings.units.weight;

  if (!exercise?.sets?.length) return null;

  const headerOpacity = readOnly ? 1 : heightAnim.interpolate({
    inputRange: [0, 34],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.tableLabel,
        {
          borderColor: color.handle,
          opacity: headerOpacity,
          backgroundColor: color.background
        },
      ]}
    >
      {columns.map((col, i) => {
        if (col === "kg")
          return (
            <GymWightLabel exerciseId={exerciseId} heightAnim={heightAnim} readOnly={readOnly} />
          )
        return (
          <View key={i} style={styles.columnLabel}>
            <Animated.Text
              style={{
                color: color.grayText,
                fontWeight: "bold",
                textTransform: "uppercase",
                opacity: headerOpacity,
              }}
            >
              {col}
            </Animated.Text>
          </View>
        )
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tableLabel: {
    height: 34,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  columnLabel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GymColumnLabels;