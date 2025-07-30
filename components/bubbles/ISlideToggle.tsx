import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import ISlide from "@/components/bubbles/ISlide";
import IToggleButton from "@/components/buttons/IToggleButtons";

interface ISlideToggleProps {
    option1: any;
    option2: any;
    value: any;
    onChange: () => void;
    visible: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    size?: "xs" | "small" | "medium" | "large" | "xl";
    width?: DimensionValue;
};

const ISlideToggle: React.FC<ISlideToggleProps> = ({
    option1,
    option2,
    value,
    onChange,
    visible,
    onClose,
    title = "CURRENT UNIT",
    subtitle = "Tap to toggle",
    size = "small",
    width
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <ISlide visible={visible} onClose={onClose} size={size}>
            <View style={styles.slideContent}>
                <Text style={[styles.title, { color: color.text }]}>{title}</Text>

                <IToggleButton
                    option1={option1}
                    option2={option2}
                    value={value}
                    onChange={onChange}
                    height={54}
                    width={width}
                />
                <Text style={[styles.subtitle, { color: color.grayText }]}>
                    {subtitle}
                </Text>
            </View>
        </ISlide>

    );
};

const styles = StyleSheet.create({
    columnLabel: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    slideContent: {
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 13,
        opacity: 0.7,
    },
});

export default ISlideToggle;