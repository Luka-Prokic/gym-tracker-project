import React, { useContext } from "react";
import { View, StyleSheet, Animated, TextStyle, ViewStyle } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import IButton from "../../buttons/IButton";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import DateDisplay from "../../mis/DateDisplay";
import ITimer from "../../timer/ITimer";
import { SettingsNavigationContext } from "../../context/SettingsContext";
import { useUnifrakturCookFont } from "../../../assets/hooks/useUnifrakturCookFont";
import useFlickerAnim from "../../../assets/animations/useFlickerAnim";
import useMainHeaderHeightAnim from "./animations/useMainHeaderHeightAnim";
import useCorruptedColor from "./hooks/useCorruptedColor";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";

interface MainHeaderProps extends NativeStackHeaderProps {
    scrollY: number;
}

const HeaderLeft: React.FC<{
    headerLeft: NativeStackHeaderProps["options"]["headerLeft"];
    color: any;
    fontFamily: string;
    theme: Themes;
    corruptedColorStyle: any;
}> = ({ headerLeft, color, fontFamily, theme, corruptedColorStyle }) => {

    const flickerAnim = useFlickerAnim();
    const { fadeIn } = useFadeInAnim();

    return (
        <View style={[styles.leftContainer, headerLeft ? { flex: 1 } : { flex: 2 }]}>
            {headerLeft ? (
                <View style={{ paddingTop: 34 }}>
                    {headerLeft({ tintColor: color.text })}
                </View>
            ) : (
                <Animated.View style={[styles.caka, fadeIn]}>
                    <DateDisplay color={color.grayText} />
                    <Animated.Text
                        style={[
                            styles.title as TextStyle,
                            {
                                opacity: theme === "Corrupted" ? flickerAnim : 1,
                                fontFamily,
                            },
                            corruptedColorStyle,
                        ]}
                    >
                        Corrupt
                    </Animated.Text>
                </Animated.View>
            )}
        </View>
    );
};

const HeaderRight: React.FC<{
    headerRight: NativeStackHeaderProps["options"]["headerRight"];
    color: any;
    navigation: any;
    openModal: () => void;
}> = ({ headerRight, color, navigation, openModal }) => {
    return (
        <View style={styles.rightContainer}>
            {headerRight ? (
                <View style={{ paddingTop: 34 }}>
                    {headerRight({ tintColor: color.text })}
                </View>
            ) : (
                <IButton
                    onPress={() => {
                        navigation.navigate("Settings", { screen: "Settings" });
                        openModal();
                    }}
                    height={44}
                    width={44}
                    style={styles.icon}
                >
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: color.glow,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="person-circle" size={34} color={color.grayText} />
                    </View>
                </IButton>
            )}
        </View>
    );
};

const MainHeader: React.FC<MainHeaderProps> = ({ navigation, options, scrollY }) => {
    const { theme, homeEditing } = useTheme();
    const color = Colors[theme as Themes];
    const { openModal } = useContext(SettingsNavigationContext);
    const { fontFamily } = useUnifrakturCookFont();
    const heightAnim = useMainHeaderHeightAnim();
    const opacity = scrollY >= 54 ? 0 : 1;
    const corruptedColorStyle = useCorruptedColor();

    return (
        <Animated.View
            style={[
                styles.header as ViewStyle,
                {
                    opacity: homeEditing ? 0 : opacity,
                    height: heightAnim,
                },
            ]}
        >
            <HeaderLeft
                headerLeft={options.headerLeft}
                color={color}
                fontFamily={fontFamily ?? ""}
                theme={theme as Themes}
                corruptedColorStyle={corruptedColorStyle}
            />
            <View style={styles.centerContainer}>
                <ITimer />
            </View>
            <HeaderRight
                headerRight={options.headerRight}
                color={color}
                navigation={navigation}
                openModal={openModal}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 0,
    },
    leftContainer: {
        height: "100%",
        marginLeft: "5%",
        alignItems: "flex-start",
    },
    centerContainer: {
        flex: 2,
        height: "100%",
        paddingTop: 34,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    rightContainer: {
        flex: 1,
        height: "100%",
        marginRight: "5%",
        alignItems: "flex-end",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
    },
    caka: {
        zIndex: 6,
        marginTop: 34,
        userSelect: "none",
        justifyContent: "flex-end",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        bottom: 0,
    },
    icon: {
        position: "absolute",
        right: 0,
        bottom: 0,
        zIndex: 6,
    },
});

export default MainHeader;