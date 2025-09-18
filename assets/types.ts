import { NavigatorScreenParams } from "@react-navigation/native";
import { GymExercise, Layout, SuperSet } from "../components/context/ExerciseLayoutZustand";

export type RootStackParamList = {
    Main: NavigatorScreenParams<HomeParamList>;
    Modals: NavigatorScreenParams<ModalParamList>;
    Settings: NavigatorScreenParams<SettingsParamList>;
};

export type ModalParamList = {
    All: undefined;
    EditProfile: undefined;
    AddExercise: { layoutId: Layout["id"] };
    SwapExercise: { layoutId: Layout["id"], exId: GymExercise["id"] };
    SuperSet: { layoutId: Layout["id"], exId?: GymExercise["id"], superSetId?: SuperSet["id"] };
    WorkoutRecap: { routineId: string; layoutId: string };
};

export type CorruptParamList = {
    Home: undefined;
    Routine: undefined;
    Routines: undefined;
    Stats: undefined;
};

export type HomeParamList = {
    Corrupt: NavigatorScreenParams<CorruptParamList>;
    Profile: undefined;
};

export type SettingsParamList = {
    Settings: undefined;
    Account: undefined;
    Measurements: undefined;
    Notifications: undefined;
    Goals: undefined;
    Awards: undefined;
    Units: undefined;
    Privacy: undefined;
};