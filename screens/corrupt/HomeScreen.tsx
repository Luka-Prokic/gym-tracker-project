import { useTheme } from "../../components/context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import WidgetLayout from "./WidgetLayout";
import HR from "../../components/mis/HR";
import IButton from "../../components/buttons/IButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../assets/types";
import { useNavigation } from "@react-navigation/native";


type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function HomeScreen() {
  const { theme, homeEditing, setHomeEditing } = useTheme();
  const color = Colors[theme as Themes];
  const navigation = useNavigation<HomeNavigationProp>();

  const goToAll = () => {
    navigation.navigate("Modals", { screen: "All" });
  };

  if (homeEditing)
    return (<WidgetLayout />);

  return (
    <View style={styles.container} >

      <WidgetLayout />

      < HR />


      <IButton
        width={"100%"}
        height={44}
        title={"Edit View"}
        color={color.primaryBackground}
        textColor={color.accent}
        onPress={() => {
          setHomeEditing(true);
        }}
      />

      <IButton
        width={"100%"}
        height={44}
        title={"Show All Items"}
        color={color.primaryBackground}
        textColor={color.accent}
        onPress={() => {
          goToAll()
        }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingBottom: 88,
    width: "90%",
    marginHorizontal: "5%",
  },
});