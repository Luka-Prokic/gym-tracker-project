# Corrupt – Gym Workout Logger (WIP)
  
A sleek, **iOS-inspired React Native app** for tracking gym workouts.  
Built with **TypeScript**, the app allows users to customize routines, log exercises, and track progress completely offline.  

---

## Features (Current Progress)
   
### ✅ Implemented
-  **Routine customization** – add and organize exercises  
-  **Workout timer** with automatic rest tracking  
-  **Widget-based layout** for flexible home screen organization   
-  **Multiple themes** (light, dark, + 4 custom themes)  
-  **Offline-first** – no internet required  

### 🚧 In Progress
-  **Graphs and visual stats** for tracking performance  
-  **Data syncing** and export options  
-  **Online features** – profile sharing and copying workouts  

---

## App Screenshots

### Themes
The app includes 3 light and 3 dark themes:

| Light | Peachy | Oldschool |
|-------|--------|-----------|
| ![Light](./screenshots/theme-light.png) | ![Peachy](./screenshots/theme-peachy.png) | ![Oldschool](./screenshots/theme-old-school.png) |

| Dark | Preworkout | Corrupted |
|------|------------|-----------|
| ![Dark](./screenshots/theme-dark.png) | ![Preworkout](./screenshots/theme-preworkout.png) | ![Corrupted](./screenshots/theme-corrupted.png) |


### Core Features
| Add Exercise to Routine | Superset Input Table | Exercise Input Table |
|--------------------------|---------------------|----------------------|
| ![Add Exercise](./screenshots/add-exercise.png) | ![Superset](./screenshots/superset-input.png) | ![Exercise Input](./screenshots/exercise-input.png) |


### Home Screen
| Edit Home Mode | Long Press on Widget | Active Routine (Timer) |
|----------------|----------------------|------------------------|
| ![Edit Home](./screenshots/edit-home.png) | ![Long Press](./screenshots/long-press-widget.png) | ![Routine Timer](./screenshots/routine-timer.png) |

---

## Tech Stack

- [React Native](https://reactnative.dev/) + TypeScript  
- [Expo](https://expo.dev/)  
- [Zustand](https://github.com/pmndrs/zustand) for state management  
- [MMKV](https://github.com/mrousavy/react-native-mmkv) for fast offline storage  

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Luka-Prokic/gym-tracker-project.git
cd gym-tracker-project
