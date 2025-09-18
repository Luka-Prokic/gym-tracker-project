import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import IButton from "../../components/buttons/IButton";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors, { Themes } from "../../constants/Colors";

interface ITopBarProps {
    children?: React.ReactNode;
}

const IProfileBar: React.FC<ITopBarProps> = () => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const goToShare = () => {
        // Share functionality
    };

    const goEditProfile = () => {
        router.push('/modals/editProfile');
    };

    const backgroundColor = {
        light: "rgba(255, 255, 255, 0.2)", // #FFFFFF
        peachy: "rgba(255, 255, 255, 0.2)", // #FFFFFF
        oldschool: "rgba(255, 254, 246, 0.2)", // #FFFEF6
        dark: "rgba(100, 100, 100, 0.2)", // #646464
        preworkout: "rgba(255, 254, 246, 0.2)", // #FFFEF6
        Corrupted: "rgba(100, 255, 255, 0.2)",
    }[theme as Themes];

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.left}>
                <IButton
                    onPress={goEditProfile} length="one" style={styles.editProfile}>
                    <Text style={[styles.editText, { color: color.tint }]}>Edit Profile</Text>
                </IButton>
            </View>
            <View style={styles.center}>
                <Text style={[styles.text, { color: color.text }]}>Sharing</Text>
            </View>
            <View style={styles.right}>
                <IButton onPress={goToShare} length="one" width={34} >
                    <Ionicons
                        name="share-outline"
                        size={24}
                        color={color.grayText}
                    />
                </IButton>
                <IButton onPress={goToShare} length="one" width={34} >

                    <View style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: color.glow,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Ionicons
                            name="people-circle"
                            size={24}
                            color={color.grayText}
                        />

                    </View>
                    <View style={[
                        styles.addIcon,
                        {
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            // backgroundColor: color.glow,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }]}>
                        <FontAwesome
                            name="plus-circle"
                            size={12}
                            color={color.grayText}
                        />
                    </View>
                </IButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 34,
        width: '100%',
        flexDirection: "row",
        position: "fixed",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        userSelect: "none",
        zIndex: 2,
        backdropFilter: 'blur(10px)',
    },
    right: {
        position: "absolute",
        height: "100%",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        right: 0,
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        height: 34,
        gap: 8,
    },
    left: {
        position: "absolute",
        height: 34,
        justifyContent: "center",
        gap: 8,
        left: 0,
    },
    editProfile: {
        padding: 4,
    },
    editText: {
        fontSize: 14,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
    },
    addIcon: {
        position: "absolute",
        top: 2,
        left: 2,
    },
});

export default IProfileBar;