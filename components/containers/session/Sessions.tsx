
import React, { useState } from "react";
import { View, Text, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import IButton from "../../buttons/IButton";
import ISlide from "../../bubbles/ISlide";
import List from "../List";
import SettingsButton from "../../buttons/SettingsButton";
import IText from "../../text/IText";
import Colors, { Themes } from "../../../constants/Colors";

interface ISessionsProps {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: ViewStyle;
    color?: string;
    loading?: boolean;
    children?: React.ReactNode;
    padding?: number;
    label?: string;
    open?: boolean;
}

const Sessions: React.FC<ISessionsProps> = ({
    width = "90%",
    height = 'auto',
    style,
    color = 'transparent',
    padding = 10,
    loading = false,
    children,
    label,
    open = false,
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    const [down, setDown] = useState<boolean>(open);
    const [more, setMore] = useState<boolean>(false);
    const [name, setName] = useState(label);
    const [iSlideMode, setISlideMode] = useState<boolean>(false);

    return (
        <>
            <View style={[styles.label, { width }]}>
                {down ?
                    <IButton onPress={() => setDown(false)} length="one" width={34}>
                        <Ionicons name="chevron-up" size={14} color={colors.grayText} />
                    </IButton>
                    :
                    <IButton onPress={() => setDown(true)} length="one" width={34}>
                        <Ionicons name="chevron-down" size={14} color={colors.grayText} />
                    </IButton>
                }
                <Text onPress={() => setDown(!down)}
                    style={[styles.labelText, { color: colors.grayText }]}
                    numberOfLines={1} ellipsizeMode="tail"
                >
                    {name}
                </Text>
                <IButton onPress={() => setMore(true)} length="one" width={34} style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={14} color={colors.grayText} />
                </IButton>
            </View >
            {down && <View
                style={[
                    styles.bubble,
                    {
                        width,
                        height,
                        backgroundColor: color,
                    },
                    style,
                ]}
            >
                {children}
            </View >}
            <ISlide visible={more} onClose={() => setMore(false)}
                size={iSlideMode ? "large" : "medium"}
            >
                <IText
                    textStyle={[styles.moreText, { color: colors.text }]}
                    style={styles.more}
                    value={name}
                    iconColor={colors.grayText}
                    onChange={setName}
                    onEditChange={setISlideMode}
                />

                <List width={'90%'}>
                    <SettingsButton
                        title={'Reorder Groups'} height={34} arrow={true}
                        icon={<Ionicons name="swap-vertical" size={18} color={colors.text} />}
                    />
                    <SettingsButton
                        title={'Add Workouts'} height={34} arrow={true}
                        icon={<Ionicons name="add" size={18} color={colors.text} />}
                    />
                    <SettingsButton
                        title={'Delete Group'} height={34} color={colors.error}
                        icon={<Ionicons name="trash-bin" size={18} color={colors.secondaryText} />}
                    />
                </List>
            </ISlide >
        </>
    );
};

const styles = StyleSheet.create({
    bubble: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        width: '100%',
        gap: 8,
        zIndex: 1,
    },
    label: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: 24,
        userSelect: "none",
    },
    labelText: {
        fontSize: 14,
        maxWidth: "60%",
        overflow: "hidden",
    },
    moreButton: {
        position: "absolute",
        right: 0,
    },
    moreText: {
        fontSize: 16,
        fontWeight: "bold",
        userSelect: "none",
        textAlign: "center",
    },
    more: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Sessions;