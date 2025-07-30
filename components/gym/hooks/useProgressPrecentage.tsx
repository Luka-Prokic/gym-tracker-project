export function useProgressPercentage(current: number, max: number): number {
    if (max <= 0) return 0;
    return Math.min(current / max, 1);
}