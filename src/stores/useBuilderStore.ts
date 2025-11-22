import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Types for the System Builder Store
 */
export type GrowthPhase = "planning" | "execution" | "analysis" | "improvement";
export type BuilderTab = "details" | "planning" | "execution" | "reflection";

export interface DraftSystem {
  name: string;
  description: string;
  domain: string;
  goals: string[];
  tasks: string[];
  currentPhase: GrowthPhase;
  progress: number;
  createdAt: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface BuilderState {
  // UI State
  activeTab: BuilderTab;

  // Draft System Data
  draftSystem: DraftSystem;

  // Actions
  setActiveTab: (tab: BuilderTab) => void;

  // System Details Actions
  setSystemName: (name: string) => void;
  setSystemDescription: (description: string) => void;
  setDomain: (domain: string) => void;

  // Goals Actions
  addGoal: () => void;
  removeGoal: (index: number) => void;
  updateGoal: (index: number, value: string) => void;

  // Tasks Actions
  addTask: () => void;
  removeTask: (index: number) => void;
  updateTask: (index: number, value: string) => void;

  // System Actions
  resetSystem: () => void;
  validateSystem: () => ValidationResult;
  getSystemData: () => DraftSystem;
}

/**
 * Initial state for a new draft system
 */
const initialDraftSystem: DraftSystem = {
  name: "",
  description: "",
  domain: "personal",
  goals: [""],
  tasks: [""],
  currentPhase: "planning",
  progress: 0,
  createdAt: null,
};

/**
 * Zustand store for System Builder
 * Manages the draft system state and UI interactions
 * Uses persist middleware to save draft to localStorage
 */
export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      // Initial UI State
      activeTab: "details",

      // Initial Draft System
      draftSystem: initialDraftSystem,

      // UI Actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      // System Details Actions
      setSystemName: (name) =>
        set((state) => ({
          draftSystem: { ...state.draftSystem, name },
        })),

      setSystemDescription: (description) =>
        set((state) => ({
          draftSystem: { ...state.draftSystem, description },
        })),

      setDomain: (domain) =>
        set((state) => ({
          draftSystem: { ...state.draftSystem, domain },
        })),

      // Goals Actions
      addGoal: () =>
        set((state) => ({
          draftSystem: {
            ...state.draftSystem,
            goals: [...state.draftSystem.goals, ""],
          },
        })),

      removeGoal: (index) =>
        set((state) => {
          // Don't allow removing the last goal
          if (state.draftSystem.goals.length === 1) return state;

          const newGoals = [...state.draftSystem.goals];
          newGoals.splice(index, 1);

          return {
            draftSystem: {
              ...state.draftSystem,
              goals: newGoals,
            },
          };
        }),

      updateGoal: (index, value) =>
        set((state) => {
          const newGoals = [...state.draftSystem.goals];
          newGoals[index] = value;

          return {
            draftSystem: {
              ...state.draftSystem,
              goals: newGoals,
            },
          };
        }),

      // Tasks Actions
      addTask: () =>
        set((state) => ({
          draftSystem: {
            ...state.draftSystem,
            tasks: [...state.draftSystem.tasks, ""],
          },
        })),

      removeTask: (index) =>
        set((state) => {
          // Don't allow removing the last task
          if (state.draftSystem.tasks.length === 1) return state;

          const newTasks = [...state.draftSystem.tasks];
          newTasks.splice(index, 1);

          return {
            draftSystem: {
              ...state.draftSystem,
              tasks: newTasks,
            },
          };
        }),

      updateTask: (index, value) =>
        set((state) => {
          const newTasks = [...state.draftSystem.tasks];
          newTasks[index] = value;

          return {
            draftSystem: {
              ...state.draftSystem,
              tasks: newTasks,
            },
          };
        }),

      // System Actions
      resetSystem: () =>
        set({
          activeTab: "details",
          draftSystem: initialDraftSystem,
        }),

      validateSystem: () => {
        const { draftSystem } = get();
        const errors: ValidationError[] = [];

        // Validate system name
        if (!draftSystem.name.trim()) {
          errors.push({
            field: "name",
            message: "System name is required",
          });
        }

        // Validate that at least one non-empty goal exists
        const validGoals = draftSystem.goals.filter(
          (goal) => goal.trim() !== "",
        );
        if (validGoals.length === 0) {
          errors.push({
            field: "goals",
            message: "At least one goal is required",
          });
        }

        // Validate that at least one non-empty task exists
        const validTasks = draftSystem.tasks.filter(
          (task) => task.trim() !== "",
        );
        if (validTasks.length === 0) {
          errors.push({
            field: "tasks",
            message: "At least one task is required",
          });
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      },

      getSystemData: () => {
        const { draftSystem } = get();

        return {
          ...draftSystem,
          goals: draftSystem.goals.filter((goal) => goal.trim() !== ""),
          tasks: draftSystem.tasks.filter((task) => task.trim() !== ""),
          createdAt: new Date().toISOString(),
        };
      },
    }),
    {
      name: "builder-draft-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the draftSystem, not UI state like activeTab
      partialize: (state) => ({
        draftSystem: state.draftSystem,
      }),
    },
  ),
);
