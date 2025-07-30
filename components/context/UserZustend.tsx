import { create } from "zustand";
import { useEffect } from "react";
import { createUserSettingsZustand } from "./user/UserSettingsZustand";
import { createUnitSettingsZustand } from "./user/UnitsSettingsZustand";

type State =
  & ReturnType<typeof createUserSettingsZustand>
  & ReturnType<typeof createUnitSettingsZustand>;

export const useUser = create<State>((set, get) => ({

  ...createUserSettingsZustand(set, get),
  ...createUnitSettingsZustand(set, get),

}));

export const useInitializeUserSettings = () => {
  const setReady = useUser((s) => s.setReady);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReady(true);
    }
  }, [setReady]);
  return {};
};
