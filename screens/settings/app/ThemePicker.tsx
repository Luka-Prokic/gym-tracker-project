import React, { useState, useRef } from "react";
import { StyleSheet, Text, Animated, View } from "react-native";
import { themeList, useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import CakaIcon from "../../../components/mis/CakaIcon";
import SettingsButton from "../../../components/buttons/SettingsButton";
import { Ionicons } from "@expo/vector-icons";
import ISlide from "../../../components/bubbles/ISlide";
import ChooseButton from "../../../components/buttons/ChooseButton";
import Container from "../../../components/containers/Container";
import hexToRGBA from "../../../assets/hooks/HEXtoRGB";
import capitalizeWords from "@/assets/hooks/capitalize";

const ThemePicker: React.FC = () => {
    const { theme, selectTheme } = useTheme();
    const color = Colors[theme as Themes];
    const [visible, setVisible] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<string>(theme);
    const scaleAnim = useRef(new Animated.Value(1.05)).current;

    const handlePress = (themeKey: Themes) => {
        selectTheme(themeKey);

        scaleAnim.setValue(1);

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 10,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1.05,
                speed: 1,
                bounciness: 10,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <>
            <SettingsButton
                onPress={() => setVisible(true)}
                title="Theme"
                icon={<Ionicons name="moon" size={18} color={color.text} />}
                info={capitalizeWords(theme)}
                width="100%"
                height={34}
            />

            <ISlide visible={visible} onClose={() => setVisible(false)} color={color.primaryBackground} size="large" type="glass">
                <Text style={[styles.title, styles.text, { color: color.text }]}>Select Theme</Text>

                <Container direction="column" width={'100%'} >
                    {themeList.map((themeKey) => {
                        const backgroundColor =
                            themeKey === theme
                                ?
                                hexToRGBA(Colors[themeKey].secondaryBackground, 0.4)
                                :
                                hexToRGBA(Colors[themeKey].secondaryBackground, 0);

                        return (<Animated.View
                            key={themeKey}
                            style={[
                                {
                                    transform: [{ scale: selectedTheme === themeKey ? scaleAnim : 1 }],
                                    width: "100%",
                                },
                            ]}
                        >
                            <ChooseButton
                                onPress={() => {
                                    selectTheme(themeKey);
                                    setSelectedTheme(themeKey);
                                    handlePress(themeKey);
                                }}
                                title={themeKey}
                                style={styles.text}
                                color={backgroundColor}
                                icon={
                                    themeKey === "light" ? <CakaIcon name="sun-icon" size={22} /> :
                                        themeKey === "peachy" ? <CakaIcon name="peach-icon" size={22} /> :
                                            themeKey === "oldschool" ? <CakaIcon name="bag-icon" size={22} /> :
                                                themeKey === "dark" ? <CakaIcon name="moon-icon" size={22} /> :
                                                    themeKey === "preworkout" ? <CakaIcon name="bolt-icon" size={22} /> :
                                                        themeKey === "Corrupted" ? <CakaIcon name="money-icon" size={22} /> :
                                                            null
                                }
                            >
                                <Ionicons name="square" color={Colors[themeKey].accent} size={18}
                                />
                                <Ionicons name="square" color={Colors[themeKey].primaryBackground} size={18}
                                />
                                <Ionicons name="square" color={Colors[themeKey].thirdBackground} size={18}
                                />
                                <Ionicons name="square" color={Colors[themeKey].fifthBackground} size={18}
                                />
                            </ChooseButton>
                        </Animated.View>)
                    })}
                </Container>
            </ISlide>
        </>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: "bold",
        userSelect: "none",
        textTransform: "capitalize",
        zIndex: 20,
    },
    title: {
        width: "100%",
        textAlign: "center",
        padding: 8,
    },
});

export default ThemePicker;