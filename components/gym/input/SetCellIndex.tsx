import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { View } from "react-native";
import { Sets } from "@/components/context/ExerciseZustand";
import { Text } from "react-native";

interface SetCellIndexProps {
    index: any;
    set: Sets;
};


const SetCellIndex: React.FC<SetCellIndexProps> = ({ index, set }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    if (!set)
        return null;


    const checked = set.rest !== 0 && set.rest ? true : false;
    const checkColor = checked ? color.secondaryText : color.text;

    return (
        <View
            key={`set-cell-sets-${set.dropSets?.length}`}
            style={styles.cell}
        >
            <Text
                style={[
                    { fontWeight: "bold", fontSize: 18 },
                    { color: checkColor }
                ]}>
                {index + 1}.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 44,
    },
});

export default SetCellIndex;