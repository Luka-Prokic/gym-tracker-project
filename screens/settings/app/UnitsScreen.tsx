import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import { useUser } from "@/components/context/UserZustend";
import Container from "@/components/containers/Container";
import OptionButton from "@/components/buttons/OptionButton";
import { ScrollView } from "react-native-gesture-handler";
import CardWrapper from "@/components/bubbles/CardWrapper";
import List from "@/components/containers/List";
import IList from "@/components/containers/IList";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import SettingsButton from "@/components/buttons/SettingsButton";
import { Text } from "react-native";

const UnitsScreen = () => {
    const {
        toggleWeightUnit,
        toggleDistanceUnit,
        togglePaceUnit,
        toggleElevationUnit,
        toggleTemperatureUnit,
        toggleEnergyUnit,
        settings,
    } = useUser();

    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <CardWrapper>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingBottom: 88, paddingTop: 44, width: "100%" }}
            >
                <View style={{ alignItems: "center" }}>
                    <IList width="90%" label="units" background={hexToRGBA(color.handle, 0.8)} hrStart="Custom">
                        <SettingsButton
                            onPress={toggleWeightUnit}
                            title="Weight"
                            info={settings.units.weight}
                            height={34}
                            icon={
                                <Ionicons
                                    name="barbell"
                                    size={24}
                                    color={color.text}
                                />
                            }
                        />
                        <SettingsButton
                            onPress={toggleDistanceUnit}
                            title="Distance"
                            info={settings.units.distance}
                            height={34}
                            icon={
                                <Ionicons
                                    name="walk"
                                    size={24}
                                    color={color.text}
                                />
                            }
                        />
                        <SettingsButton
                            onPress={togglePaceUnit}
                            title="Pace"
                            info={settings.units.pace}
                            height={34}
                            icon={
                                <Ionicons
                                    name="timer"
                                    size={24}
                                    color={color.text}
                                />
                            }
                        />
                        <SettingsButton
                            onPress={toggleElevationUnit}
                            title="Elevation"
                            info={settings.units.elevation}
                            height={34}
                            icon={
                                <Ionicons
                                    name="trending-up"
                                    size={24}
                                    color={color.text}
                                />
                            }
                        />
                        <SettingsButton
                            onPress={toggleTemperatureUnit}
                            title="Temperature"
                            info={settings.units.temperature}
                            height={34}
                            icon={
                                <Ionicons
                                    name="thermometer"
                                    size={24}
                                    color={color.text}
                                />
                            }
                        />
                        <SettingsButton
                            onPress={toggleEnergyUnit}
                            title="Energy"
                            info={settings.units.energy}
                            height={34}
                            icon={
                                <Ionicons
                                    name="flame"
                                    size={24}
                                    color={color.text}
                                />
                            }
                        />
                    </IList>
                    <Text style={[{
                        color: color.grayText,
                        fontSize: 13,
                        opacity: 0.7,
                    }]}>
                        Tap to toggle
                    </Text>
                </View>
            </ScrollView>
        </CardWrapper>
    );
};

export default UnitsScreen;