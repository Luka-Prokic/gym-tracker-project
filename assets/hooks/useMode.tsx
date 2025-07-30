import { useState } from "react";

export type Mode = "one" | "two" | "four";

export const modes: Mode[] = ["one", "two", "four"];

const useMode = () => {
    const [mode, setMode] = useState<Mode>("one");
    return { mode, setMode };
};

export default useMode;