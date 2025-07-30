import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { Mode } from "../../assets/hooks/useMode";
import { useEffect } from "react";
import { defaultWidgetLayout, defaultWidgets } from "../../constants/Defaults";

export const storage = typeof window !== "undefined" ? new MMKV() : null;

export type ResizeOptions = true | "two" | false;


export interface WidgetSettings {
  hidden?: boolean;
  resize?: true | "two" | false;
  rename?: boolean;
}

export interface WidgetBlueprint {
  id: string;
  label: string;
  labelPressed?: () => void;
  children?: React.ReactNode;
  childrenPressed?: () => void;
  color?: string;
  loading?: boolean;
  arrow?: boolean;
  opacity?: number;
  mode?: Mode;
  widgetSettings: WidgetSettings;
  hidden?: boolean;
  key: number;
}

export interface CakaAppState {
  widgetLayout: WidgetBlueprint[];
  widgetsDefault: string[];
  widgetsCustom: string[];
  isReady: boolean;

  setWidgetLayout: (widgetLayout: WidgetBlueprint[]) => void;
  updateWidget: (id: string, newSettings: Partial<WidgetBlueprint>) => void;
  setReady: (isReady: boolean) => void;
  addToHome: (id: string) => void;
  removeFromHome: (id: string) => void;
}

export const useCaka = create<CakaAppState>((set, get) => ({
  widgetLayout: JSON.parse(
    storage?.getString("widgetLayout") ||
    JSON.stringify(defaultWidgetLayout)
  ),
  widgetsDefault: JSON.parse(JSON.stringify(defaultWidgets)),
  widgetsCustom: JSON.parse("[]"),
  isReady: false,


  setWidgetLayout: (layout) => {
    storage?.set("widgetLayout", JSON.stringify(layout));
    set({ widgetLayout: layout });
  },

  updateWidget: (id, newSettings) => {
    set((state) => {
      const updatedLayout = state.widgetLayout.map((widget) =>
        widget.id === id ? { ...widget, ...newSettings } : widget
      );
      storage?.set("widgetLayout", JSON.stringify(updatedLayout));
      return { widgetLayout: updatedLayout };
    });
  },



  setReady: (isReady) => {
    set({ isReady });
  },

  addToHome: (id) => {
    set((state) => {
      const updatedWidgets = [...state.widgetLayout];
      const lastVisibleIndex = updatedWidgets.findIndex(widget => widget.hidden === false);
      const widgetIndex = updatedWidgets.findIndex(widget => widget.id === id);
      if (widgetIndex === -1) return state;

      const [widget] = updatedWidgets.splice(widgetIndex, 1);
      widget.hidden = false;
      updatedWidgets.splice(lastVisibleIndex + 1, 0, widget);

      storage?.set("widgetLayout", JSON.stringify(updatedWidgets));
      return { widgetLayout: updatedWidgets };
    });
  },

  removeFromHome: (id) => {
    set((state) => {
      const updatedWidgets = [...state.widgetLayout];
      const widgetIndex = updatedWidgets.findIndex(widget => widget.id === id);
      if (widgetIndex === -1) return state;

      const [widget] = updatedWidgets.splice(widgetIndex, 1);
      widget.hidden = true;
      updatedWidgets.push(widget);

      storage?.set("widgetLayout", JSON.stringify(updatedWidgets));
      return { widgetLayout: updatedWidgets };
    });
  },
}));


export const useInitializeApp = () => {
  const setReady = useCaka((state) => state.setReady);

  useEffect(() => {
    if (storage) {
      setReady(true);
    }
  }, [setReady]);

  return {};
};