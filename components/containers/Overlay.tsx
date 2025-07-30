import React from "react";
import { Modal, Pressable, ViewStyle, StyleSheet } from "react-native";

interface OverlayProps {
    visible: boolean;
    onClose: () => void;
    blur?: boolean;
    transparent?: boolean;
    children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ visible, onClose, children, blur = true, transparent }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable onPress={onClose}
                style={[
                    styles.overlay as ViewStyle,
                    blur ? { backdropFilter: "blur(10px)" } : {},
                    transparent ? {} : { backgroundColor: "rgba(0, 0, 0, 0.1)" }
                ]}>
                {children}
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Overlay;