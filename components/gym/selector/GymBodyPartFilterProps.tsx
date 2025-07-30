import capitalizeWords from "@/assets/hooks/capitalize";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import useBubbleLayout from "@/components/bubbles/hooks/useBubbleLayout";
import ISlide from "@/components/bubbles/ISlide";
import IButton from "@/components/buttons/IButton";
import { BODYPART_LIST } from "@/components/context/ExerciseZustand";
import { useTheme } from "@/components/context/ThemeContext";
import HR from "@/components/mis/HR";
import Colors, { Themes } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface GymBodyPartFilterProps {
    value?: string;
    onPress: (element: any) => void;
};

export const GymBodyPartFilter: React.FC<GymBodyPartFilterProps> = ({ value = "All Muscles", onPress }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bubbleVisible, makeBubble, popBubble } = useBubbleLayout();

    const defValue = value !== "All Muscles";
    return (<>
        <ISlide visible={bubbleVisible} onClose={popBubble} size="xl">
            <Text style={{ fontSize: 18, fontWeight: "bold", color: color.text }}>
                Body Parts
            </Text>
            <HR />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    width: "90%", marginHorizontal: "5%", paddingBottom: 88,
                }}>
                <View style={{ gap: 4, }}>
                    {["All Muscles", ...BODYPART_LIST].map((bodypart) => {
                        return (
                            <IButton
                                key={bodypart}
                                width="100%"
                                height={44}
                                color={bodypart === value ? color.thirdBackground : color.background}
                                onPress={() => onPress(bodypart)}
                                title={capitalizeWords(bodypart)}
                            />
                        );
                    })}
                </View>

            </ScrollView>
        </ISlide>
        <IButton
            height={34} width={"48%"} color={defValue ? color.tint : color.fourthBackground}
            style={{ borderRadius: 17, gap: 0, paddingLeft: defValue ? 16 : 0 }}
            onPress={makeBubble} >
            <Text style={{
                fontSize: 16, fontWeight: "bold",
                color: color.secondaryText,
                width: "100%", textAlign: "center"
            }}>
                {capitalizeWords(value)}
            </Text>
            {defValue ?
                <IButton width={44} height={34} onPress={() => { onPress("All Muscles") }}>
                    <Ionicons name="close-circle" size={24} color={color.background} />
                </IButton>
                : null}
        </IButton>
    </>);
};