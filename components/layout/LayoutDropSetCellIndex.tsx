import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";

interface LayoutDropSetCellIndexProps {
    index: number;
}

const LayoutDropSetCellIndex: React.FC<LayoutDropSetCellIndexProps> = ({ index }) => {
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
        height: 34,
    },
    text: {
        fontSize: 14,
        fontWeight: "600",
    },
});

export default LayoutDropSetCellIndex;
