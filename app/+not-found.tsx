import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeTabParamList } from "../assets/types";

type NavigationProp = NativeStackNavigationProp<HomeTabParamList, "Caka">;

export default function NotFoundScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>

      <TouchableOpacity
        onPress={() => { }
        }
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    fontSize: 14,
    color: "#2e78b7",
    textDecorationLine: "underline",
  },
});