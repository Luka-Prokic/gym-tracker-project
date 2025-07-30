import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllScreen from "../screens/corrupt/AllScreen";
import { ModalParamList } from "../assets/types";
import EditProfileScreen from "../screens/settings/account/EditProfileScreen";
import ITopBar from "../components/headers/ITopBar";
import AddExerciseScreen from "../screens/routine/gym/AddExerciseScreen";
import SwapExerciseScreen from "@/screens/routine/gym/SwapExerciseScreen";
import SuperSetScreen from "@/screens/routine/gym/SuperSetScreen";
import { Ionicons } from "@expo/vector-icons";
import ExerciseCreateButton from "@/components/gym/selector/ExerciseCreateButton";

const ModalStack = createNativeStackNavigator<ModalParamList>();

const ModalNavigator = () => {
    return (
        <ModalStack.Navigator
            screenOptions={{
                header: (props) => <ITopBar {...props} />,
            }}
        >
            <ModalStack.Screen
                name="All"
                component={AllScreen}
                options={{ presentation: "modal" }}
            />

            <ModalStack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ presentation: "modal" }}
            />

            <ModalStack.Screen
                name="AddExercise"
                component={AddExerciseScreen}
                options={{
                    presentation: "modal",
                    headerRight: () => <ExerciseCreateButton />,
                }}
            />

            <ModalStack.Screen
                name="SwapExercise"
                component={SwapExerciseScreen}
                options={{ presentation: "modal" }}
            />

            <ModalStack.Screen
                name="SuperSet"
                component={SuperSetScreen}
                options={{ presentation: "modal" }}
            />
        </ModalStack.Navigator>
    );
};

export default ModalNavigator;