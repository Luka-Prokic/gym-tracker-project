import { useDisplayedDistance, useDisplayedElevation, useDisplayedEnergy, useDisplayedPace, useDisplayedSpeed, useDisplayedWeight } from "@/components/context/user/hooks/filters";
import { useUser } from "@/components/context/UserZustend";

const unitHooks = {
    distance: useDisplayedDistance(),
    speed: useDisplayedSpeed(),
    energy: useDisplayedEnergy(),
    pace: useDisplayedPace(),
    elevation: useDisplayedElevation(),
};

const currentUnitHook = unitHooks[column as keyof typeof unitHooks];

const toggleUnit = () => {
    const { settings, setSettings } = useUser.getState();
    const newUnits = { ...settings.units };

    const key = column as keyof typeof newUnits;
    if (!newUnits[key]) return;

    switch (key) {
        case "distance":
        case "speed":
            newUnits[key] = newUnits[key] === "km" || newUnits[key] === "kph" ? "mi" : "km";
            break;
        case "energy":
            newUnits[key] = newUnits[key] === "kcal" ? "kJ" : "kcal";
            break;
        case "pace":
            newUnits[key] = newUnits[key] === "min/km" ? "min/mi" : "min/km";
            break;
        case "elevation":
            newUnits[key] = newUnits[key] === "m" ? "ft" : "m";
            break;
    }

    setSettings({ ...settings, units: newUnits });
};