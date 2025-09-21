import { useTheme } from "../components/context/ThemeContext";
import Colors, { Themes } from "../constants/Colors";
import { View } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";




export default function ProfileScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <View style={{
            flex: 1,
            backgroundColor: color.background
        }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[
                    {
                        paddingBottom: 88,
                    },
                ]}
            >
            </ScrollView>
        </View>
    );
}





