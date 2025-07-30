export type WeightUnit = 'kg' | 'lbs';
export type DistanceUnit = 'km' | 'mi';
export type SpeedUnit = 'km/h' | 'mph';
export type PaceUnit = 'min/km' | 'min/mi';
export type ElevationUnit = 'm' | 'ft';
export type TemperatureUnit = 'C' | 'F';
export type EnergyUnit = 'kcal' | 'kJ';

export interface UnitsSettings {
  weight: WeightUnit;
  distance: DistanceUnit;
  pace: PaceUnit;
  elevation: ElevationUnit;
  temperature: TemperatureUnit;
  energy: EnergyUnit;
}


export interface GymSettings {
  showRIR: boolean;
  showRPE: boolean;
  showPreviousStats: boolean;
}

export interface CardioSettings {
  showCalories: boolean;
  showHeartRate: boolean;
  showExercises: boolean;
}

export interface UserSettings {
  gym: GymSettings;
  cardio: CardioSettings;
  units: UnitsSettings;
  defaultRestLength: number;
  autoRest: boolean;
}