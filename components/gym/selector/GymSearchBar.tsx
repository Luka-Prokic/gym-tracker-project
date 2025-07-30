import IButton from "@/components/buttons/IButton";
import { Exercise } from "@/components/context/ExerciseZustand";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface GymSearchBarProps {
    value?: string;
    onChangeText: (element: any) => void;
};

export function searchExercises(query: string, exercises: Exercise[]): Exercise[] {
    const keywords = query
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w);

    return exercises.filter((exercise) => {
        const bodyparts = Array.isArray(exercise.bodypart)
            ? exercise.bodypart.join(" ")
            : exercise.bodypart;

        const haystack = [
            exercise.name,
            exercise.equipment,
            bodyparts,
        ].join(" ")
            .toLowerCase();

        return keywords.every((keyword) => haystack.includes(keyword));
    });
}

export const GymSearchBar: React.FC<GymSearchBarProps> = ({ value, onChangeText }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleSearchPress = () => {
        if (isFocused) {
            setIsFocused(false);
        } else {
            inputRef.current?.focus();
            setIsFocused(true);
        }
    }

    return (<>
        <View style={[
            {
                width: "100%",
                overflow: "hidden",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: color.border,
                backgroundColor: color.input,
                shadowColor: color.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 44,
            }
        ]}>
            <IButton width={44} height={44}
                onPress={handleSearchPress}>
                <Ionicons name="search" size={24} color={color.text} />
            </IButton>
            <TextInput
                ref={inputRef}
                style={[styles.input, {
                    color: color.text,
                }]}
                placeholder={"Search exercise"}
                value={value}
                onChangeText={onChangeText}
                autoFocus
            />
            {value ?
                <IButton width={44} height={44} onPress={() => {
                    onChangeText("");
                    setIsFocused(true);
                    inputRef.current?.focus();
                }}>
                    <Ionicons name="close-circle" size={24} color={color.accent} />
                </IButton>
                : null}
        </View >

    </>);
};

const styles = StyleSheet.create({
    input: {
        fontSize: 16,
        textAlign: "left",
        outlineColor: "rgba(0,0,0,0)",
        borderWidth: 0,
        width: "100%",
        height: 44,
    },
});
