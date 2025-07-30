import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import ThemePicker from "../settings/app/ThemePicker";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../../components/context/ThemeContext";
import List from "../../components/containers/List"; ``
import SettingsButton from "../../components/buttons/SettingsButton";
import { Ionicons } from "@expo/vector-icons";
import CakaIcon from "../../components/mis/CakaIcon";
import { StyleSheet, Text, View } from "react-native";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsParamList } from "../../assets/types";
import { useNavigation } from "@react-navigation/native";
import { SCREEN_HEIGHT } from "../../constants/ScreenWidth";


type SettingsNavigationProp = NativeStackNavigationProp<SettingsParamList, "Settings">;

const SettingsScreen: React.FC = () => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const navigation = useNavigation<SettingsNavigationProp>();

    return (
        <>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    paddingBottom: 88,
                    width: "100%",
                    minHeight: SCREEN_HEIGHT,
                }}
            >

                <List background={hexToRGBA(color.handle, 0.8)} width={'90%'} hrStart="Custom">
                    <SettingsButton
                        onPress={() => navigation.navigate('Account')}
                        title={'Account'} height={54} arrow={true}
                        icon={<View style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            backgroundColor: color.glow,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Ionicons name="person-circle" size={44} color={color.grayText} />
                        </View>}
                    />
                </List>

                <List background={hexToRGBA(color.handle, 0.8)} width={'90%'} hrStart="Custom">
                    <SettingsButton
                        onPress={() => navigation.navigate('Notifications')}
                        title={'Notifications'} height={34} arrow={true}
                        icon={<Ionicons name="notifications" size={18} color={color.text} />}
                    />
                    <SettingsButton
                        onPress={() => navigation.navigate('Privacy')}
                        title={'Privicy & Protection'} height={34} arrow={true}
                        icon={<Ionicons name="lock-closed" size={18} color={color.text} />}
                    />
                    <ThemePicker />
                </List>

                <List background={hexToRGBA(color.handle, 0.8)} width={'90%'} hrStart="Custom">
                    <SettingsButton
                        onPress={() => navigation.navigate('Measurements')}
                        title={'Measurements'} height={34} arrow={true}
                        icon={<Ionicons name="scale" size={18} color={color.text} />}
                    />
                    <SettingsButton
                        onPress={() => navigation.navigate('Units')}
                        title={'Units'} height={34} arrow={true}
                        icon={<Ionicons name="globe" size={18} color={color.text} />}
                    />
                    <SettingsButton
                        onPress={() => navigation.navigate('Goals')}
                        title={'Goals'} height={34} arrow={true}
                        icon={<Ionicons name="calendar" size={18} color={color.text} />}
                    />
                    <SettingsButton
                        onPress={() => navigation.navigate('Awards')}
                        title={'Awards'} height={34} arrow={true}
                        icon={<Ionicons name="trophy" size={18} color={color.text} />}
                    />
                </List>

                <List background={hexToRGBA(color.handle, 0.8)} width={'90%'} hrStart="Custom">
                    <SettingsButton
                        // onPress={() => navigation.navigate('Account')}
                        title={'FAQ'} height={34} arrow={true}
                        icon={<Ionicons name="help-circle" size={18} color={color.text} />}
                    />
                    <SettingsButton
                        // onPress={() => navigation.navigate('Account')}
                        title={'Contact Us'} height={34} arrow={true}
                        icon={<Ionicons name="mail-open" size={18} color={color.text} />}
                    />
                    <SettingsButton
                        // onPress={() => navigation.navigate('EditProfile')}
                        title={'About'} height={34} arrow={true}
                        icon={<CakaIcon name="caka-icon" size={18} fill={color.text} />}
                    />
                </List>

            </ScrollView>
        </>

    );
};

const styles = StyleSheet.create({
    blur: {
        backdropFilter: 'blur(30px)',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
    back: {
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 9,
    },
});

export default SettingsScreen;