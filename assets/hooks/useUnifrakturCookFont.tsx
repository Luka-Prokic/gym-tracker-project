import { useFonts } from "expo-font";

export const useUnifrakturCookFont = () => {
    const [fontsLoaded] = useFonts({
        "UnifrakturCook-Bold": require("../fonts/UnifrakturCook-Bold.ttf"),
    });

    return fontsLoaded ? { fontFamily: "UnifrakturCook-Bold" } : {};
};
