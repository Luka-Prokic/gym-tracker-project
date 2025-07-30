import { useState } from "react";
import useWobbleAnim from "../animations/useWobbleAnim";
import useWidgetScaleAnim from "../animations/useWidgetScaleAnim";
import useWidgetHideAnim from "../animations/useWidgetHideAnim";
import useWidgetLayout from "../hooks/useWidgetLayout";
import { useCaka, WidgetBlueprint } from "../../context/CakaAppZustand";
import { View } from "react-native-reanimated/lib/typescript/Animated";

interface WidgetActionsReturn {
    widgetRef: React.RefObject<View>;
    widgetData: WidgetBlueprint | undefined;
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleLongPress: () => void;
    handleRelease: () => void;
    handleHideWidget: (id: string) => void;
    left: number;
    top: number;
    right: number;
    bottom: number;
    modalX: number;
    modalY: number;
    width: number;
    height: number;
    wobbleAnim: any;
    scaleAnim: any;
}

const useWidgetActions = (id: string): WidgetActionsReturn => {
    const { widgetLayout, removeFromHome } = useCaka();

    const widgetData = widgetLayout.find((w) => w.id === id);

    const [modalVisible, setModalVisible] = useState(false);
    const wobbleAnim = useWobbleAnim();
    const scaleAnim = useWidgetScaleAnim(modalVisible);

    const { widgetRef, left, top, right, bottom, modalX, modalY, width, height, handleLayout } = useWidgetLayout();

    const handleLongPress = () => {
        setModalVisible(true);
        widgetRef.current?.measureInWindow((x, y, width, height) => {
            handleLayout({
                nativeEvent: {
                    layout: { left: x, top: y, width, height },
                },
            });
        });
    };

    const handleRelease = () => {
        setModalVisible(false);
    };

    const handleHideWidget = (id: string) => {
        setTimeout(() => removeFromHome(id), 400);
        useWidgetHideAnim(scaleAnim);
        setModalVisible(false);
    };

    return {
        widgetRef,
        modalVisible,
        widgetData,
        setModalVisible,
        handleLongPress,
        handleRelease,
        handleHideWidget,
        left, top, right, bottom, modalX, modalY, width, height,
        wobbleAnim, scaleAnim
    };
}

export default useWidgetActions;