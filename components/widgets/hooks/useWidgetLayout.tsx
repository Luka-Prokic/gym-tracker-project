import { useRef, useState } from "react";
import { Dimensions } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default function useWidgetLayout() {
    const widgetRef = useRef<View>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [right, setRight] = useState(0);
    const [bottom, setBottom] = useState(0);
    const [modalX, setModalX] = useState(0);
    const [modalY, setModalY] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const handleLayout = (event: any) => {
        const layout = event.nativeEvent.layout;
        const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

        const elementLeft = layout.left;
        const elementTop = layout.top;
        const elementRight = screenWidth - elementLeft - layout.width;
        const elementBottom = screenHeight - elementTop - layout.height;

        const closeLeft = elementLeft - screenWidth / 2;
        const closeTop = elementTop - screenHeight / 2;
        const closeRight = elementRight - screenWidth / 2;
        const closeBottom = elementBottom - screenHeight / 2;

        setModalX(closeLeft < closeRight ? 1 : 0);
        setModalY(closeTop < closeBottom ? 1 : 0);

        setLeft(elementLeft);
        setTop(elementTop);
        setRight(elementRight);
        setBottom(elementBottom);
        setWidth(layout.width);
        setHeight(layout.height);
    };

    return {
        widgetRef, left, top, right, bottom, modalX, modalY, width, height, handleLayout
    };
}
