import { useMemo } from 'react';
import { Layout } from '@/assets/types';
import { isGymExercise } from '../components/context/utils/GymUtils';
import { useExercise } from '../components/context/ExerciseZustand';

export interface BodyPart {
    name: string;
    count: number;
}

export const useBodyParts = (layout: Layout | null): BodyPart[] => {
    const { getExercise } = useExercise();
    
    return useMemo(() => {
        if (!layout) return [];

        const bodyPartCounts: { [key: string]: number } = {};
        
        // Go through each exercise in the layout
        layout.layout.forEach(exercise => {
            if (isGymExercise(exercise)) {
                // Get the exercise description using exId
                const exerciseDesc = getExercise(exercise.exId);
                
                if (exerciseDesc && exerciseDesc.bodypart) {
                    // Handle both single bodypart and array of bodyparts
                    const bodyParts = Array.isArray(exerciseDesc.bodypart) 
                        ? exerciseDesc.bodypart 
                        : [exerciseDesc.bodypart];
                    
                    bodyParts.forEach(bodyPart => {
                        if (bodyPart && bodyPart.trim()) {
                            const normalizedBodyPart = bodyPart.toLowerCase().trim();
                            bodyPartCounts[normalizedBodyPart] = (bodyPartCounts[normalizedBodyPart] || 0) + 1;
                        }
                    });
                }
            }
        });

        // Convert to array and sort by count (most worked body parts first)
        return Object.entries(bodyPartCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4); // Limit to top 4 body parts
    }, [layout, getExercise]);
};
