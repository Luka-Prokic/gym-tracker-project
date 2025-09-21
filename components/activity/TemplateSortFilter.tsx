import IButton from "../buttons/IButton";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";
import ISlide from "../bubbles/ISlide";
import HR from "../mis/HR";
import { Animated, ScrollView, Text, View } from "react-native";
import { SortMode } from "./TemplatesTab";
import useBounceScaleAnim from "@/assets/animations/useBounceScaleAnim";

interface TemplateSortFilterProps {
    value: SortMode;
    onPress: (mode: SortMode) => void;
}

const SORT_MODES: { value: SortMode; label: string }[] = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' },
];

export const TemplateSortFilter: React.FC<TemplateSortFilterProps> = ({ value, onPress }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bubbleVisible, makeBubble, popBubble } = useBubbleLayout();
    const { bounceAnim, bounceIt } = useBounceScaleAnim();

    const currentMode = SORT_MODES.find(mode => mode.value === value);
    const displayText = currentMode?.label || 'Sort by';

    return (
        <>
            <ISlide visible={bubbleVisible} onClose={popBubble} size="medium">
                <Text style={{ fontSize: 18, fontWeight: "bold", color: color.text }}>
                    Sort By
                </Text>
                <HR />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        width: "90%",
                        marginHorizontal: "5%",
                        paddingBottom: 88,
                    }}>
                    <View style={{ gap: 4 }}>
                        {SORT_MODES.map((mode) => (
                            <IButton
                                key={mode.value}
                                width="100%"
                                height={44}
                                color={mode.value === value ? color.thirdBackground : color.background}
                                onPress={() => {
                                    onPress(mode.value);
                                    popBubble();
                                }}
                                title={mode.label}
                                textColor={color.text}
                            />
                        ))}
                    </View>
                </ScrollView>
            </ISlide>
            <Animated.View style={[bounceAnim, { width: "48%", height: 34 }]}>
                <IButton
                    height={34}
                    color={color.tint}
                    style={{ borderRadius: 17, gap: 0 }}
                    onPress={() => { makeBubble(); bounceIt(); }}
                >
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: color.secondaryText,
                        width: "100%",
                        textAlign: "center"
                    }}>
                        {displayText}
                    </Text>
                </IButton>
            </Animated.View>

        </>
    );
};
