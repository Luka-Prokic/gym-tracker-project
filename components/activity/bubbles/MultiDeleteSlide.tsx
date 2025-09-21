import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Colors, { Themes } from '../../../constants/Colors';
import ISlide from '../../bubbles/ISlide';
import Container from '../../containers/Container';
import IButton from '../../buttons/IButton';

interface MultiDeleteSlideProps {
    visible: boolean;
    onClose: () => void;
    deleteItems: string[];
    onConfirm: () => void;
}

export const MultiDeleteSlide: React.FC<MultiDeleteSlideProps> = ({
    visible,
    onClose,
    deleteItems,
    onConfirm
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <ISlide visible={visible} onClose={onClose} size="small">
            <Container width={"90%"} height={"auto"} direction="column" style={{ paddingBottom: 16 }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: color.text,
                    textAlign: "center",
                    marginBottom: 12
                }}>
                    {deleteItems.length === 1 ? "Delete Item" : "Delete Items"}
                </Text>
                <Text style={{
                    fontSize: 13,
                    color: color.grayText,
                    textAlign: "center",
                    marginBottom: 16,
                    lineHeight: 18
                }}>
                    {`Delete ${deleteItems.length} ${deleteItems.length === 1 ? 'item' : 'items'}? This action cannot be undone.`}
                </Text>
                <View style={{ gap: 10, width: "100%" }}>
                    <IButton
                        width={"100%"}
                        height={40}
                        title={deleteItems.length > 0 ? `Delete ${deleteItems.length}` : "Delete"}
                        color={color.error}
                        textColor={color.secondaryText}
                        onPress={onConfirm}
                    />
                </View>
            </Container>
        </ISlide>
    );
};
