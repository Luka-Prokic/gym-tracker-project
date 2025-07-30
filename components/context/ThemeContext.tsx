import { Themes } from "../../constants/Colors";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import { storage } from "./CakaAppZustand";

interface ThemeContextType {
  theme: Themes;
  homeEditing: boolean;
  setHomeEditing: (state: boolean) => void;
  toggleTheme: () => void;
  selectTheme: (theme: Themes) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeList: Themes[] = ["light", "peachy", "oldschool", "dark", "preworkout", "Corrupted"];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = (useColorScheme() as Themes) ?? "dark";

  const getStoredTheme = (): Themes => {
    const stored = storage?.getString("theme") as Themes | null;
    return themeList.includes(stored!) ? stored! : systemTheme;
  };

  const [theme, setTheme] = useState<Themes>(getStoredTheme());
  const [homeEditing, setHomeEditing] = useState<boolean>(false);

  useEffect(() => {
    storage?.set("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextIndex = (themeList.indexOf(prev) + 1) % themeList.length;
      return themeList[nextIndex];
    });
  };

  const selectTheme = (newTheme: Themes) => {
    if (themeList.includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, homeEditing, setHomeEditing, toggleTheme, selectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};