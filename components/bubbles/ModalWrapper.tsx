import React, { useRef, useState, useEffect } from "react";
import {
    Modal,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    Platform,
    View,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { Themes } from "../../constants/Colors";
import Colors from "../../constants/Colors";

const { height: screenHeight } = Dimensions.get("window");

type ModalWrapperProps = {
    visible?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    color?: string;
    showHeader?: boolean;
    headerComponent?: React.ReactNode;
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({
    visible = true,
    onClose,
    children,
    color,
    showHeader = false,
    headerComponent
}) => {
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const [modalHeight, setModalH] = useState(screenHeight);
    const [isOpen, setIsOpen] = useState(visible);
    const { theme } = useTheme();
    const colorScheme = Colors[theme as Themes];

    const backgroundColor = color || colorScheme.background;
    const overlayColor = {
        light: "rgba(0, 0, 0, 0.4)",
        peachy: "rgba(0, 0, 0, 0.4)",
        oldschool: "rgba(0, 0, 0, 0.4)",
        dark: "rgba(0, 0, 0, 0.6)",
        preworkout: "rgba(0, 0, 0, 0.6)",
        Corrupted: "rgba(0, 0, 0, 0.6)",
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
        router.back();
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
            <Animated.View
                style={[styles.modal, {
                    transform: [{ translateY }],
                    backgroundColor: backgroundColor,
                }]}
                {...panResponder.panHandlers}
            >
                {showHeader && headerComponent && (
                    <View style={styles.headerContainer}>
                        {headerComponent}
                    </View>
                )}
                <View style={styles.content}>
                    {children}
                </View>
            </Animated.View>
        );
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    modal: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        minHeight: "50%",
        maxHeight: "90%",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        zIndex: 1,
    },
    headerContainer: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
    },
});

export default ModalWrapper;