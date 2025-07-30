import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { SCREEN_HEIGHT } from "../../constants/ScreenWidth";
import ModalWrapper from "../../components/bubbles/ModalWrapper";
import { SettingsNavigationContext } from "../../components/context/SettingsContext";
import SettingsNavigator from "../../app/SettingsNavigator";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../../components/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../assets/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


const SettingsModal: React.FC = () => {
    const { exitModal, isModalVisible } = useContext(SettingsNavigationContext);
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Modals'>>();

    return (
        <ModalWrapper visible={isModalVisible} onClose={() => {
            navigation.goBack();
            exitModal();
        }}
            color={color.background}
        >
            <View
                style={{
                    paddingBottom: SCREEN_HEIGHT,
                    width: "100%",
                    height: SCREEN_HEIGHT,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    zIndex: 5,
                }}
            >
                <SettingsNavigator />
            </View>
        </ModalWrapper>
    );
};

export default SettingsModal;
