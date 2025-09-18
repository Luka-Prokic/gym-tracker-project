import { StyleSheet, ScrollView, View } from 'react-native';
import { useTheme } from '../../components/context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';

export default function StatsScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <View style={[styles.container, { backgroundColor: color.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scroller}
            >
                {/* Stats content will go here */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroller: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    text: {
        fontSize: 14,
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
