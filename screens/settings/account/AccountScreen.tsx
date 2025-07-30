import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../components/context/ThemeContext';
import Colors, { Themes } from '../../../constants/Colors';
import { Text } from 'react-native';
import Container from '../../../components/containers/Container';
import { ScrollView } from 'react-native-gesture-handler';
import CardWrapper from '../../../components/bubbles/CardWrapper';

export default function AccountScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <CardWrapper>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[{
                    paddingBottom: 88, paddingTop: 44, width: "100%", height: "100%",
                }]}
            >
                <Container color={color.secondaryBackground} height={64} width={200}>
                    <Text style={[styles.text, { color: color.text }]}>Two</Text>
                </Container>
                <Container color={color.thirdBackground} height={64} width={200}>
                    <Text style={[styles.text, { color: color.secondaryText }]}>Three</Text>
                </Container>
                <Container color={color.fourthBackground} height={64} width={200}>
                    <Text style={[styles.text, { color: color.secondaryText }]}>Four</Text>
                </Container>
                <Container color={color.fifthBackground} height={64} width={200}>
                    <Text style={[styles.text, { color: color.secondaryText }]}>Five</Text>
                </Container>
            </ScrollView>
        </CardWrapper>
    );
}

const styles = StyleSheet.create({
    blur: {
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
    back: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
    },
});