import { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useProgressAnim } from '../animations/useProgressAnim';
import { GymExercise, useExerciseLayout } from '@/components/context/ExerciseLayoutZustand';
import { useRoutine } from '@/components/context/RoutineZustand';
import useWobbleAnim from '@/components/widgets/animations/useWobbleAnim';
import useWidgetScaleAnim from '@/components/widgets/animations/useWidgetScaleAnim';
import { useUser } from '@/components/context/UserZustend';

export interface UseRestStopwatchActionsReturn {
  exercise: GymExercise | undefined;
  minutes: string;
  seconds: string;
  animatedStyle: ViewStyle;
  heightAnim: any;
  progressWidth: Animated.AnimatedInterpolation<string>;
  handleAddTime: (bonus: number) => void;
  handleRemoveTime: (bonus: number) => void;
  handleEndRest: () => void;
}

export function useRestStopwatchActions(
  exerciseId: GymExercise['id'],
  endRest: () => void
): UseRestStopwatchActionsReturn {
  const { activeRoutine } = useRoutine();
  const { getGymExercise, restTime, rest, updateRestTime } = useExerciseLayout();
  const { settings } = useUser();
  const autoRest = settings.autoRest;

  const exercise = getGymExercise(activeRoutine.layoutId, exerciseId);

  const wobbleAnim = useWobbleAnim();
  const scaleAnim = useWidgetScaleAnim(restTime === 0);
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (rest >= 1)
      Animated.timing(heightAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 300,
      }).start();
    if (restTime === 0 && autoRest) {
      handleEndRest();
    }
  }, [rest, restTime, autoRest]);

  const animatedStyle: ViewStyle = {
    transform: [
      { scale: scaleAnim },
      {
        rotate: wobbleAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-3deg', '3deg'],
        }),
      },
    ],
  };

  const handleAddTime = (bonus: number) => updateRestTime(restTime + bonus);
  const handleRemoveTime = (bonus: number) =>
    updateRestTime(restTime > bonus ? restTime - bonus : 0);

  const minutes = String(Math.floor(restTime / 60)).padStart(2, '0');
  const seconds = String(restTime % 60).padStart(2, '0');

  const handleEndRest = () => {
    setTimeout(() => { endRest(); }, 300);
    Animated.timing(heightAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 300,
    }).start();
  };

  const progressWidth = useProgressAnim(rest, restTime + rest);

  return {
    exercise,
    minutes,
    seconds,
    animatedStyle,
    heightAnim,
    progressWidth,
    handleAddTime,
    handleRemoveTime,
    handleEndRest,
  };
}
