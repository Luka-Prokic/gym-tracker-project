import Colors, { Themes } from "../../constants/Colors";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useRef,
    useState as useLocalState,
    useEffect,
} from "react";
import {
    View,
    Modal,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    Pressable,
    ViewStyle,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

const { height: screenHeight } = Dimensions.get("window");

const HEIGHT_MAP = {
    xs: 0.2,
    small: 0.3,
    medium: 0.5,
    large: 0.8,
    xl: 0.9,
};

// ─── Drag-Lock Context (scoped) ──────────────────────────────────────────────
type LockCtx = { innerDragging: boolean; setInnerDragging: (v: boolean) => void };
const DragLockContext = createContext<LockCtx | null>(null);

export const DragLockProvider = ({ children }: { children: ReactNode }) => {
    const [innerDragging, setInnerDragging] = useState(false);
    return (
        <DragLockContext.Provider value={{ innerDragging, setInnerDragging }}>
            {children}
        </DragLockContext.Provider>
    );
};

export const useDragLock = () => {
    const ctx = useContext(DragLockContext);
    if (!ctx) throw new Error("useDragLock must be inside DragLockProvider");
    return ctx;
};
// ─────────────────────────────────────────────────────────────────────────────

type ISlideProps = {
    visible?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    size?: "xs" | "small" | "medium" | "large" | "xl";
    color?: string;
    style?: ViewStyle;
    glow?: boolean;
    type?: "classic" | "glass";
};

const ISlide: React.FC<ISlideProps> = ({
    visible,
    onClose,
    children,
    size = "medium",
    color,
    style,
    type = "classic",
    glow = true,
}) => {
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const [modalHeight, setModalH] = useLocalState(screenHeight * HEIGHT_MAP[size]);
    const [isOpen, setIsOpen] = useLocalState(!!visible);

    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    const backgroundSlideClassic =
        theme === "dark" || theme === "preworkout" || theme === "Corrupted"
            ? "#333333"
            : "#FFFFFF";

    const backgroundColor = {
        light: "rgba(255, 255, 255, 0.5)",
        peachy: "rgba(255, 242, 252, 0.5)",
        oldschool: "rgba(255, 255, 255, 0.5)",
        dark: "rgba(150, 150, 150, 0.5)",
        preworkout: "rgba(169, 169, 140, 0.5)",
        Corrupted: "rgba(115, 98, 98, 0.69)",
    }[theme as Themes];

    let innerDragging = false;
    try {
        innerDragging = useDragLock().innerDragging;
    } catch { }

    const innerDraggingRef = useRef(innerDragging);
    useEffect(() => {
        innerDraggingRef.current = innerDragging;
    }, [innerDragging]);

    useEffect(() => {
        if (visible) openSheet();
        else closeSheet();
    }, [visible]);

    useEffect(() => {
        moveSheet();
    }, [type]);

    const moveSheet = () => {
        const newHeight = screenHeight * HEIGHT_MAP[size];
        setModalH(newHeight);
        Animated.timing(translateY, {
            toValue: screenHeight - newHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

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
        onClose?.();
        Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !innerDraggingRef.current,
            onMoveShouldSetPanResponder: () => !innerDraggingRef.current,
            onPanResponderMove: (_, gs) => {
                if (gs.dy > 0) {
                    translateY.setValue(screenHeight - modalHeight + gs.dy);
                }
            },
            onPanResponderRelease: (_, gs) => {
                if (gs.dy > modalHeight * 0.4) {
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

    return (
        <Modal transparent animationType="none" visible={isOpen}>
            <Pressable onPress={onClose} style={styles.overlay as ViewStyle}>
                {glow && (
                    <Animated.View
                        style={[
                            {
                                width: "100%",
                                height: "100%",
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                transform: [{ translateY }],
                                borderLeftWidth: 22,
                                borderRightWidth: 22,
                                borderColor: colors.accent,
                                opacity: 0.8,
                                zIndex: 3,
                            },
                        ]}
                    />
                )}
            </Pressable>
            <Animated.View
                style={[
                    styles.bottomSheet as ViewStyle,
                    { transform: [{ translateY }], backgroundColor: color || backgroundSlideClassic },
                    type === "glass" && { backgroundColor },
                    { borderColor: colors.handle },
                    style,
                ]}
                {...panResponder.panHandlers}
            >
                <View
                    style={[
                        styles.handle as ViewStyle,
                        type === "classic"
                            ? { backgroundColor: colors.grayText }
                            : { backgroundColor: colors.secondaryText },
                    ]}
                />
                {children}
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: "rgba(0,0,0,0.1)",
        width: "100%",
        height: "100%",
        zIndex: 1,
    },
    bottomSheet: {
        position: "fixed",
        width: "100%",
        height: "100%",
        bottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10,
        backdropFilter: "blur(20px)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 88,
        elevation: 5,
        zIndex: 4,
        userSelect: "none",
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 8,
    },
});

export default ISlide;

export const ISlideExtra: React.FC<ISlideProps> = (props) => (
    <DragLockProvider>
        <ISlide {...props} />
    </DragLockProvider>
);