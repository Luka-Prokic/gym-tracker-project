import React, { useRef, useEffect, useContext } from "react";
import { StyleSheet, ViewStyle, TextStyle, Animated, Easing, DimensionValue } from "react-native";
import DateDisplay from "../../mis/DateDisplay";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import ITimer from "../../timer/ITimer";
import { View } from "react-native";
import IButton from "../../buttons/IButton";
import { router } from "expo-router";
import { SettingsNavigationContext } from "../../context/SettingsContext";
import { Ionicons } from "@expo/vector-icons";
import { useUnifrakturCookFont } from "../../../assets/hooks/useUnifrakturCookFont";

interface ITrainingTopProps {
    width?: DimensionValue;
}

const OldMainHeader: React.FC<ITrainingTopProps> = ({ width }) => {
    const { theme, homeEditing } = useTheme();
    const color = Colors[theme as Themes];
    const { fontFamily } = useUnifrakturCookFont();
    const heightAnim = useRef(new Animated.Value(homeEditing ? 44 : 64)).current;
    const flickerAnim = useRef(new Animated.Value(1)).current;
    const flickerActive = useRef(false);

    const { openModal } = useContext(SettingsNavigationContext);


    useEffect(() => {
        if (theme === 'Corrupted') {
            flickerActive.current = true;

            const flickerBurst = () => {
                if (!flickerActive.current) return;

                const flickCount = Math.floor(Math.random() * 5) + 1;
                let flickerSequence = [];

                for (let i = 0; i < flickCount; i++) {
                    flickerSequence.push(
                        Animated.timing(flickerAnim, {
                            toValue: Math.random() > 0.5 ? 0.2 : 1,
                            duration: Math.random() * 40 + 10,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        })
                    );
                }

                flickerSequence.push(
                    Animated.timing(flickerAnim, {
                        toValue: Math.random() > 0.8 ? 0.2 : 1,
                        duration: Math.random() * 50 + 50,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                );

                Animated.sequence(flickerSequence).start(() => {
                    if (!flickerActive.current) return;
                    const nextDelay = Math.random() * 2800 + 2200;
                    setTimeout(flickerBurst, nextDelay);
                });
            };

            flickerBurst();
        } else {
            flickerActive.current = false;
            flickerAnim.stopAnimation(() => flickerAnim.setValue(1));
        }

        return () => {
            flickerActive.current = false;
            flickerAnim.stopAnimation(() => flickerAnim.setValue(1));
        };
    }, [theme]);

    useEffect(() => {
        Animated.spring(heightAnim, {
            toValue: homeEditing ? 44 : 88,
            speed: 1,
            useNativeDriver: true,
        }).start();
    }, [homeEditing]);

    return (
        <Animated.View
            style={[styles.container as ViewStyle, { opacity: homeEditing ? 0 : 1, height: heightAnim, width }]}>
            <View style={styles.caka}>
                <DateDisplay color={color.grayText} />
                <Animated.Text
                    style={[styles.header as TextStyle, { color: color.text, opacity: flickerAnim }, { fontFamily },
                    [theme === "preworkout" && { color: color.caka }],
                    [theme === "peachy" && { color: color.fourthBackground }],
                    [theme === "oldschool" && { color: color.error }],
                    [theme === "light" && { color: color.accent }],
                    ]}
                >
                    Corrupt
                </Animated.Text>
            </View>

            <View style={styles.timer}>
                <ITimer />
            </View>

            <IButton
                onPress={() => {
                    router.push("/settings");
                    openModal();
                }}
                height={44} width={44} style={styles.icon}
            >
                <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: color.glow,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Ionicons name="person-circle" size={34} color={color.grayText} />
                </View>
            </IButton>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        userSelect: "none",
        zIndex: 6,
        flexDirection: "row",
        marginHorizontal: "5%",
    },
    caka: {
        userSelect: "none",
        zIndex: 6,
        justifyContent: "flex-end",
        flexDirection: "column"
    },
    header: {
        fontSize: 32,
        fontWeight: "bold",
    },
    timer: {
        marginTop: 34,
        marginLeft: 16,
        marginRight: 44,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        position: "absolute",
        right: 0,
        bottom: 0,
        zIndex: 6,
    },
});

export default OldMainHeader;
