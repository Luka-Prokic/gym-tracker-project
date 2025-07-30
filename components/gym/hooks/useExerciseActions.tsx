import { useState } from "react";
import useWobbleAnim from "../../widgets/animations/useWobbleAnim";
import useWidgetScaleAnim from "../../widgets/animations/useWidgetScaleAnim";

interface WidgetActionsReturn {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleLongPress: () => void;
    handleRelease: () => void;
    wobbleAnim: any;
    scaleAnim: any;
}

const useExerciseActions = (id?: string, draggable?: boolean): WidgetActionsReturn => {
    // const { widgetLayout, removeFromHome } = useCaka();

    // const widgetData = widgetLayout.find((w) => w.id === id);

    const [modalVisible, setModalVisible] = useState(false);
    const wobbleAnim = useWobbleAnim();
    const scaleAnim = useWidgetScaleAnim(modalVisible);

    const handleLongPress = () => {
        if (!draggable) {
            setModalVisible(true);
        }
    };

    const handleRelease = () => {
        setModalVisible(false);
    };

    return {
        modalVisible,
        setModalVisible,
        handleLongPress,
        handleRelease,
        wobbleAnim, scaleAnim
    };
}

export default useExerciseActions;