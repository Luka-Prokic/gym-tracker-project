import React, { createContext, useState, ReactNode } from "react";
import { SettingsParamList } from "../../assets/types";

interface SettingsNavigationContextProps {
  currentScreen: keyof SettingsParamList;
  prevScreen: keyof SettingsParamList;
  isModalVisible: boolean;
  setCurrentScreen: (screen: keyof SettingsParamList) => void;
  setPrevScreen: (screen: keyof SettingsParamList) => void;
  exitModal: () => void;
  openModal: () => void;
}

export const SettingsNavigationContext = createContext<SettingsNavigationContextProps>({
  currentScreen: "Settings",
  prevScreen: "Settings",
  isModalVisible: false,
  setCurrentScreen: () => { },
  setPrevScreen: () => { },
  exitModal: () => { },
  openModal: () => { },
});

interface SettingsNavigationProviderProps {
  children: ReactNode;
}

export const SettingsNavigationProvider: React.FC<SettingsNavigationProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<keyof SettingsParamList>("Settings");
  const [prevScreen, setPrevScreen] = useState<keyof SettingsParamList>("Settings");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const exitModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  return (
    <SettingsNavigationContext.Provider value={{ currentScreen, prevScreen, isModalVisible, setCurrentScreen, setPrevScreen, exitModal, openModal }}>
      {children}
    </SettingsNavigationContext.Provider>
  );
};