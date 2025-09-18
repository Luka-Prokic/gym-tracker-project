import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { Sets } from "../context/ExerciseZustand";

interface LayoutSetCellIndexProps {
    index: number;
    set: Sets;
}

const LayoutSetCellIndex: React.FC<LayoutSetCellIndexProps> = ({ index, set }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <View style={styles.cell}>
            <Text style={[styles.text, { color: color.text }]}>
                {index + 1}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 44,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default LayoutSetCellIndex;
