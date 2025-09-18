import { useRef, useState } from "react";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default function useBubbleLayout() {
    const bubbleRef = useRef<View>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [bubbleVisible, setVisible] = useState<boolean>(false);

    const handleLayout: any = (event: any) => {
        const layout = event.nativeEvent.layout;
        setLeft(layout.left);
        setTop(layout.top);
        setHeight(layout.height);
        setWidth(layout.width);
    };

    bubbleRef.current?.measureInWindow((x, y, width, height) => {
        handleLayout({
            nativeEvent: {
                layout: {
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                },
            },
        });
    });

    const makeBubble = () => {
        setVisible(true)
    };

    const popBubble = () => {
        setVisible(false)
    };


    return {
        bubbleRef, left, top, width, height, handleLayout, bubbleVisible, makeBubble, popBubble
    };
}