import Colors, { Themes } from "../../../../constants/Colors";
import { useTheme } from "../../../context/ThemeContext";


const useCorruptedColor = () => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const computedColor =
        theme === "preworkout"
            ? color.caka
            : theme === "peachy"
                ? color.fourthBackground
                : theme === "oldschool"
                    ? color.error
                    : theme === "light"
                        ? color.accent
                        : color.text;

    return { color: computedColor };
};

export default useCorruptedColor;
