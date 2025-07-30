import React from 'react';
import {
    TextInput,
    StyleSheet,
    StyleProp,
    TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors from '@/constants/Colors';
import { LayoutItem, useExerciseLayout } from '../context/ExerciseLayoutZustand';
import { useRoutine } from '../context/RoutineZustand';

interface GymNotesProps {
    elementId: LayoutItem["id"];
    placeholder?: string;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
}

const GymNotes: React.FC<GymNotesProps> = ({
    elementId,
    placeholder = 'Add a note here…',
    style,
    numberOfLines = 5,
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const { updateItemNote, getItemNote } = useExerciseLayout();
    const { activeRoutine } = useRoutine();

    const onChangeText = (text: string) => {
        updateItemNote(activeRoutine.layoutId, elementId, text);
    };

    const note = getItemNote(activeRoutine.layoutId, elementId);

    return (
        <TextInput
            style={[
                styles.input,
                style,
                {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.input,
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                },
            ]}
            value={note}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            multiline
            numberOfLines={numberOfLines}
            textAlignVertical="top"
        />
    );
};

const styles = StyleSheet.create({
    input: {
        fontSize: 16,
        lineHeight: 22,
        minHeight: 88,
        padding: 8,
        borderRadius: 16,
        borderWidth: 1,
    },
});

export default GymNotes;