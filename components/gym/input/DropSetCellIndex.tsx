import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { View } from "react-native";
import { Text } from "react-native";

interface DropSetCellIndexProps {
    index: any;
};


const DropSetCellIndex: React.FC<DropSetCellIndexProps> = ({ index }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <View
            key={`drop-set-cell-sets-${index}`}
            style={styles.cell}
        >
            <Text
                style={[
                    { fontWeight: "bold", fontSize: 18 },
                    { color: color.secondaryText }
                ]}>
                {`'${index + 1}`}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 34,
    },
});

export default DropSetCellIndex;