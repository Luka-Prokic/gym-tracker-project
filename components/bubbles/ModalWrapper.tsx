import React, { useRef, useState, useEffect } from "react";
import {
    Modal,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { Themes } from "../../constants/Colors";

const { height: screenHeight } = Dimensions.get("window");

type ModalWrapperProps = {
    visible?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    color?: string;
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({ visible = true, onClose, children, color }) => {
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const [modalHeight, setModalH] = useState(screenHeight);
    const [isOpen, setIsOpen] = useState(visible);
    const navigation = useNavigation();
    const { theme } = useTheme();

    const backgroundColor = {
        light: "rgba(225, 225, 225, 0.4)",
        peachy: "rgba(210, 200, 170, 0.4)",
        oldschool: "rgba(210, 200, 180, 0.4)",
        dark: "rgba(100, 100, 100, 0.4)",
        preworkout: "rgba(255, 250, 240, 0.4)",
        Corrupted: "rgba(100, 255, 255, 0.4)",
    }[theme as Themes];

    useEffect(() => {
        if (visible) {
            openSheet();
        } else {
            closeSheet();
        }
    }, [visible]);

    const openSheet = () => {
        setIsOpen(true);
        Animated.timing(translateY, {
            toValue: screenHeight - modalHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeSheet = () => {
        setIsOpen(false);
        navigation.goBack();
        if (onClose) onClose();
        Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(screenHeight - modalHeight + gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > modalHeight * 0.4) {
                    closeSheet();
                } else {
                    Animated.spring(translateY, {
                        toValue: screenHeight - modalHeight,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;


    if (!isOpen) return null;

    if (Platform.OS === "web") {
        return (
            <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onClose}
                style={{ width: "100%", height: "100%" }}>
                <Animated.View
                    style={[styles.bottomSheet, {
                        transform: [{ translateY }],
                        backgroundColor: color || backgroundColor,
                        backdropFilter: "blur(10px)",
                    }]}
                    {...panResponder.panHandlers}
                >
                    {children}
                </Animated.View>
            </Modal>
        );
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    bottomSheet: {
        bottom: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: "100%",
    },
});

export default ModalWrapper;