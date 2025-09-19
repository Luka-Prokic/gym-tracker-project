import IButton from "../buttons/IButton";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import useBubbleLayout from "../bubbles/hooks/useBubbleLayout";
import ISlide from "../bubbles/ISlide";
import HR from "../mis/HR";
import { ScrollView, Text, View } from "react-native";
import { BodyPartFilterType } from "./TemplatesTab";
import capitalizeWords from "../../assets/hooks/capitalize";

interface TemplateBodyPartFilterProps {
    value: BodyPartFilterType;
    onPress: (bodyPart: BodyPartFilterType) => void;
}

// Common body parts that templates might have
const BODYPART_OPTIONS = [
    "All Muscles",
    "chest",
    "back", 
    "shoulders",
    "arms",
    "biceps",
    "triceps",
    "legs",
    "quads",
    "hamstrings",
    "glutes",
    "calves",
    "core",
    "abs"
];

export const TemplateBodyPartFilter: React.FC<TemplateBodyPartFilterProps> = ({ 
    value = "All Muscles", 
    onPress 
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bubbleVisible, makeBubble, popBubble } = useBubbleLayout();

    const hasFilter = value !== "All Muscles";

    return (
        <>
            <ISlide visible={bubbleVisible} onClose={popBubble} size="xl">
                <Text style={{ fontSize: 18, fontWeight: "bold", color: color.text }}>
                    Body Parts
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
                        {BODYPART_OPTIONS.map((bodypart) => (
                            <IButton
                                key={bodypart}
                                width="100%"
                                height={44}
                                color={bodypart === value ? color.thirdBackground : color.background}
                                onPress={() => onPress(bodypart)}
                                title={capitalizeWords(bodypart)}
                                textColor={color.text}
                            />
                        ))}
                    </View>
                </ScrollView>
            </ISlide>
            <IButton
                height={34} 
                width={"48%"} 
                color={hasFilter ? color.tint : color.fourthBackground}
                style={{ 
                    borderRadius: 17, 
                    gap: 0, 
                    paddingLeft: hasFilter ? 16 : 0 
                }}
                onPress={makeBubble}
            >
                <Text style={{
                    fontSize: 16, 
                    fontWeight: "bold",
                    color: color.secondaryText,
                    width: "100%", 
                    textAlign: "center"
                }}>
                    {capitalizeWords(value)}
                </Text>
                {hasFilter ? (
                    <IButton 
                        width={44} 
                        height={34} 
                        onPress={() => onPress("All Muscles")}
                    >
                        <Ionicons name="close-circle" size={24} color={color.background} />
                    </IButton>
                ) : null}
            </IButton>
        </>
    );
};
