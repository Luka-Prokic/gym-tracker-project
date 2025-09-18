import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../components/context/ThemeContext';
import Colors, { Themes } from '../../../constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import CardWrapper from '../../../components/bubbles/CardWrapper';
import { SCREEN_HEIGHT } from '../../../constants/ScreenWidth';

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <CardWrapper>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    paddingBottom: 88,
                    paddingTop: 44,
                    width: "100%",
                    minHeight: SCREEN_HEIGHT,
                    backgroundColor: color.background,
                }}
            >
                <ActivityIndicator size="large" />
            </ScrollView>
        </CardWrapper>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    text: {
        fontSize: 14,
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
});