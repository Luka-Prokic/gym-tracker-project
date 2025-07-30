import capitalizeWords from "@/assets/hooks/capitalize";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import useBubbleLayout from "@/components/bubbles/hooks/useBubbleLayout";
import ISlide from "@/components/bubbles/ISlide";
import IButton from "@/components/buttons/IButton";
import { EQUIPMENT_LIST } from "@/components/context/ExerciseZustand";
import { useTheme } from "@/components/context/ThemeContext";
import HR from "@/components/mis/HR";
import Colors, { Themes } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface GymEquipmentFilterProps {
    value?: string;
    onPress: (element: any) => void;
};

export const GymEquipmentFilter: React.FC<GymEquipmentFilterProps> = ({ value = "All Equipment", onPress }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bubbleVisible, makeBubble, popBubble } = useBubbleLayout();

    const defValue = value !== "All Equipment";
    return (<>
        <ISlide visible={bubbleVisible} onClose={popBubble} size="xl">
            <Text style={{ fontSize: 18, fontWeight: "bold", color: color.text }}>
                Equipment
            </Text>
            <HR />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    width: "90%", marginHorizontal: "5%", paddingBottom: 88,
                }}>
                <View style={{ gap: 4, }}>
                    {["All Equipment", ...EQUIPMENT_LIST].map((equipment) => {
                        return (
                            <IButton
                                key={equipment}
                                width="100%"
                                height={44}
                                color={equipment === value ? color.thirdBackground : color.background}
                                onPress={() => onPress(equipment)}
                                title={capitalizeWords(equipment)}
                            />
                        );
                    })}
                </View>

            </ScrollView>
        </ISlide>
        <IButton
            height={34} width={"48%"} color={defValue ? color.tint : color.fourthBackground}
            style={{ borderRadius: 17, paddingLeft: defValue ? 16 : 0, gap: 0 }}
            onPress={makeBubble}>
            <Text style={{
                fontSize: 16, fontWeight: "bold",
                color: color.secondaryText,
                width: "100%", textAlign: "center"
            }}>
                {capitalizeWords(value)}
            </Text>
            {defValue ?
                <IButton width={44} height={34} onPress={() => { onPress("All Equipment") }} >
                    <Ionicons name="close-circle" size={24} color={color.background} />
                </IButton>
                : null}
        </IButton >
    </>);
};