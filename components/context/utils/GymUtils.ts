import { CardioExercise, GymExercise, LayoutItem, SuperSet } from "../ExerciseLayoutZustand";

export function findExercise(layoutItems: LayoutItem[], exId: string): { parent: LayoutItem[]; index: number; exercise: LayoutItem } | undefined {
    const topIndex = layoutItems.findIndex(
        item => item.id === exId && item.type !== "superset"
    );
    if (topIndex !== -1) {
        return {
            parent: layoutItems,
            index: topIndex,
            exercise: layoutItems[topIndex] as GymExercise | CardioExercise
        };
    }

    for (const item of layoutItems) {
        if (item.type === "superset") {
            const ss = item as SuperSet;
            const i = ss.layout.findIndex(e => e.id === exId);
            if (i !== -1) {
                return { parent: ss.layout, index: i, exercise: ss.layout[i] };
            }
        }
    }
    return undefined;
}


export function makeId(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}

export function isGymExercise(item: LayoutItem): item is GymExercise {
    return (item as LayoutItem).type === 'gym';
}

export function isSuperSet(item: LayoutItem): item is SuperSet {
    return (item as LayoutItem).type === 'superset';
}

export function isCardioExercise(item: LayoutItem): item is CardioExercise {
    return (item as LayoutItem).type === 'cardio';
}

export function findAndUpdate(
    items: LayoutItem[],
    targetId: string,
    updater: (node: LayoutItem) => LayoutItem
): LayoutItem[] {
    return items.map(item => {
        if (item.id === targetId) {
            return updater(item);
        }
        if (isSuperSet(item)) {
            return {
                ...item,
                layout: findAndUpdate(item.layout, targetId, updater),
            };
        }
        return item;
    });
}