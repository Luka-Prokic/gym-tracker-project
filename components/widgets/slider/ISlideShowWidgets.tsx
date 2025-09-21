import React, { useState } from "react";
import { StyleSheet, ScrollView, ViewStyle, Pressable, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import ISlide from "../../bubbles/ISlide";
import { IWidget } from "../IWidget";
import { useCaka } from "../../context/CakaAppZustand";
import List from "../../containers/List";
import Container from "../../containers/Container";
import { Ionicons } from "@expo/vector-icons";
import IButton from "../../buttons/IButton";
import useBubbleLayout from "../../bubbles/hooks/useBubbleLayout";
import IBubble, { IBubbleSize } from "../../bubbles/IBubble";
import WidgetSizePicker from "./WidgetSizePicker";

type ISlideWidgetsProps = {
    visible?: boolean;
    onClose?: () => void;
};

const ISlideShowWidgets: React.FC<ISlideWidgetsProps> = ({ visible, onClose }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { widgetsDefault, widgetLayout, addToHome } = useCaka();

    const defaultWidgets = widgetLayout
        .filter((widget) => widgetsDefault.includes(widget.id))
        .map(widget => ({ ...widget }));

    const handleShowWidget = (id: string) => {
        setTimeout(() => addToHome(id), 300);
        if (onClose) onClose();
    };

    return (
        <>
            <ISlide visible={visible} onClose={onClose} type="glass"
                size="xl" style={styles.addSlide as ViewStyle}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    pagingEnabled={true}
                    bounces={true}
                    style={[
                        {
                            overflowX: "visible",
                            width: "100%",
                            borderColor: "transparent",
                        },
                    ]}
                    contentContainerStyle={{
                        paddingTop: 88,
                        paddingBottom: 88,
                    }}
                >
                    <List style={styles.addContainer as ViewStyle} width={"90%"}>
                        {defaultWidgets.map((widget) => {
                            const { bubbleRef, top, left, width, height } = useBubbleLayout();
                            const [sizeVisibel, setSize] = useState<boolean>(false);

                            return (<Container key={widget.id} width={"100%"}>
                                <IBubble
                                    visible={sizeVisibel}
                                    onClose={() => { setSize(false) }}
                                    height={height}
                                    width={width}
                                    top={top}
                                    left={left}
                                    size={IBubbleSize.xl}
                                >
                                    <Container width={"100%"} height={"100%"} direction="column" >
                                        <WidgetSizePicker
                                            id={widget.id}
                                            width={170}
                                            onPress={() => { setSize(false); handleShowWidget(widget.id); }}
                                        />
                                    </Container>
                                </IBubble>
                                {widget.hidden ? (
                                    <Pressable style={[
                                        styles.addWidget as ViewStyle,
                                        {
                                            borderRadius: 16,
                                            borderWidth: 1,
                                            borderColor: color.handle,
                                            shadowColor: color.shadow,
                                            shadowOffset: { width: 0, height: 12 },
                                            shadowOpacity: 0.2,
                                            shadowRadius: 24,
                                        }
                                    ]} onPress={() => setSize(true)}>
                                        <View ref={bubbleRef}>
                                            <IButton
                                                width={44}
                                                height={44}
                                                onPress={() => setSize(true)}
                                                style={styles.addButton as ViewStyle}
                                            >
                                                <Ionicons name="add-circle" color={color.accent} size={44} />

                                            </IButton>
                                            <IWidget
                                                id={widget.id}
                                                disabled={true}
                                                mode="one"
                                                customWidth={"100%"}
                                            />
                                        </View>
                                    </Pressable>
                                ) : (
                                    <IWidget
                                        id={widget.id}
                                        disabled={true}
                                        mode="one"
                                        opacity={0.6}
                                        customWidth={"50%"}
                                    />
                                )}
                            </Container>)
                        })}
                    </List>
                </ScrollView>
            </ISlide >
        </>
    );
};

const styles = StyleSheet.create({
    addContainer: {
        marginBottom: 88,
        gap: 8,
    },
    addButton: {
        position: 'absolute',
        top: "50%",
        left: "50%",
        transform: [
            { translateX: '-50%' },
            { translateY: '-50%' },
        ],
        zIndex: 5,
    },
    addWidget: {
        width: "50%",
        aspectRatio: "1/1"
    },
    addSlide: {
        backdropFilter: 'blur(30px)',
        gap: 0,
    },
    addSection: {
        marginBottom: 0,
        flexDirection: "row",
        width: "90%",
    },
    selectedMode: {
        borderBottomWidth: 4,
        borderBottomColor: "transparent",
        borderRadius: 0,
    },
});

export default ISlideShowWidgets;