import React, { useRef, useState, useEffect } from "react";
import { Animated, Dimensions, Platform, StyleSheet, ViewStyle, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SCREEN_HEIGHT } from "../../constants/ScreenWidth";

const { width: screenWidth } = Dimensions.get("window");

type CardWrapperProps = {
    visible?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
};

const CardWrapper: React.FC<CardWrapperProps> = ({ visible = true, onClose, children }) => {
    const translateX = useRef(new Animated.Value(screenWidth)).current;
    const [modalWidth, setModalW] = useState(screenWidth);
    const [isOpen, setIsOpen] = useState(visible);
    const navigation = useNavigation();


    useEffect(() => {
        if (visible) {
            openSheet();
        } else {
            closeSheet();
        }
    }, [visible]);

    const openSheet = () => {
        setIsOpen(true);
        Animated.timing(translateX, {
            toValue: screenWidth - modalWidth,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeSheet = () => {
        setIsOpen(false);
        navigation.goBack();
        if (onClose) onClose();
        Animated.timing(translateX, {
            toValue: screenWidth,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx > 0) {
                    translateX.setValue(screenWidth - modalWidth + gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > modalWidth * 0.4) {
                    closeSheet();
                } else {
                    Animated.spring(translateX, {
                        toValue: screenWidth - modalWidth,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    if (!isOpen) return null;

    if (Platform.OS !== "web")
        return (<>{children}</>);

    return (
        <Animated.View
            style={[styles.card as ViewStyle, { transform: [{ translateX }], backgroundColor: "transparent" }]}
            {...panResponder.panHandlers}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        position: "absolute",
        right: 0,
        top: 0,
        width: "100%",
        minHeight: SCREEN_HEIGHT,
        zIndex: 1,
    },
});

export default CardWrapper;
