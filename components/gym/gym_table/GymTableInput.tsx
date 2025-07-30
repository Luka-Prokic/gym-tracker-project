import { useState } from "react";
import Colors, { Themes } from "../../../constants/Colors";
import { Sets } from "../../context/ExerciseZustand";
import { useTheme } from "../../context/ThemeContext";
import ICellText from "../../text/ICellText";
import { useValidateGymTableInput } from "../hooks/useValidateGymTableInput";
import { DimensionValue } from "react-native";

interface GymTableInputProps {
    column: keyof Sets;
    value?: any;
    onChange: (value: any) => void,
    text: string;
    editable?: boolean;
    height?: DimensionValue
};

const GymTableInput: React.FC<GymTableInputProps> = ({
    column,
    value,
    onChange,
    text,
    editable = true,
    height = 44,
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const [inputValue, handleChange] = useValidateGymTableInput(column, value);
    const [key, onEnd] = useState(0)

    return (
        <ICellText
            key={key}
            value={inputValue === false ? "" : inputValue?.toString()}
            inputStyle={{ fontWeight: "bold", fontSize: 18 }}
            textStyle={[
                { fontWeight: "bold", fontSize: 18 },
                { color: text || color.text }
            ]}
            height={height}
            cellWidth={"100%"}
            onChange={(inputValue) => {
                const validatedValue = handleChange(inputValue);
                onChange(validatedValue);
                onEnd(Date.now());
            }}
            editable={editable}
        />
    );
};

export default GymTableInput
