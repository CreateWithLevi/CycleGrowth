import { useBuilderStore } from "../useBuilderStore";
import type { DraftSystem, ValidationError } from "../useBuilderStore";

/**
 * Tests for the Builder Store
 * These tests verify the store logic without requiring UI rendering
 */
describe("useBuilderStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { resetSystem } = useBuilderStore.getState();
    resetSystem();

    // Clear localStorage to avoid persistence interference
    localStorage.clear();
  });

  describe("Initial State", () => {
    it("should initialize with correct default values", () => {
      const state = useBuilderStore.getState();

      expect(state.activeTab).toBe("details");
      expect(state.draftSystem).toEqual({
        name: "",
        description: "",
        domain: "personal",
        goals: [""],
        tasks: [""],
        currentPhase: "planning",
        progress: 0,
        createdAt: null,
      });
    });
  });

  describe("UI State Management", () => {
    it("should update active tab", () => {
      const { setActiveTab } = useBuilderStore.getState();

      setActiveTab("planning");
      expect(useBuilderStore.getState().activeTab).toBe("planning");

      setActiveTab("execution");
      expect(useBuilderStore.getState().activeTab).toBe("execution");

      setActiveTab("reflection");
      expect(useBuilderStore.getState().activeTab).toBe("reflection");
    });
  });

  describe("System Details Actions", () => {
    it("should update system name", () => {
      const { setSystemName } = useBuilderStore.getState();

      setSystemName("My Growth System");
      expect(useBuilderStore.getState().draftSystem.name).toBe(
        "My Growth System",
      );
    });

    it("should update system description", () => {
      const { setSystemDescription } = useBuilderStore.getState();

      setSystemDescription("This is a test description");
      expect(useBuilderStore.getState().draftSystem.description).toBe(
        "This is a test description",
      );
    });

    it("should update domain", () => {
      const { setDomain } = useBuilderStore.getState();

      setDomain("professional");
      expect(useBuilderStore.getState().draftSystem.domain).toBe(
        "professional",
      );

      setDomain("health");
      expect(useBuilderStore.getState().draftSystem.domain).toBe("health");
    });
  });

  describe("Goals Management", () => {
    it("should add a new goal", () => {
      const { addGoal } = useBuilderStore.getState();

      const initialGoalsCount =
        useBuilderStore.getState().draftSystem.goals.length;
      addGoal();

      const newGoalsCount = useBuilderStore.getState().draftSystem.goals.length;
      expect(newGoalsCount).toBe(initialGoalsCount + 1);
      expect(useBuilderStore.getState().draftSystem.goals[newGoalsCount - 1]).toBe(
        "",
      );
    });

    it("should update a goal at specific index", () => {
      const { updateGoal, addGoal } = useBuilderStore.getState();

      addGoal();
      updateGoal(0, "Learn TypeScript");
      updateGoal(1, "Master React");

      const goals = useBuilderStore.getState().draftSystem.goals;
      expect(goals[0]).toBe("Learn TypeScript");
      expect(goals[1]).toBe("Master React");
    });

    it("should remove a goal at specific index", () => {
      const { addGoal, removeGoal, updateGoal } = useBuilderStore.getState();

      addGoal();
      addGoal();
      updateGoal(0, "Goal 1");
      updateGoal(1, "Goal 2");
      updateGoal(2, "Goal 3");

      removeGoal(1);

      const goals = useBuilderStore.getState().draftSystem.goals;
      expect(goals.length).toBe(2);
      expect(goals[0]).toBe("Goal 1");
      expect(goals[1]).toBe("Goal 3");
    });

    it("should not remove the last goal", () => {
      const { removeGoal } = useBuilderStore.getState();

      // Start with one goal
      const initialGoals = useBuilderStore.getState().draftSystem.goals;
      expect(initialGoals.length).toBe(1);

      removeGoal(0);

      // Should still have one goal
      const goalsAfterRemove = useBuilderStore.getState().draftSystem.goals;
      expect(goalsAfterRemove.length).toBe(1);
    });
  });

  describe("Tasks Management", () => {
    it("should add a new task", () => {
      const { addTask } = useBuilderStore.getState();

      const initialTasksCount =
        useBuilderStore.getState().draftSystem.tasks.length;
      addTask();

      const newTasksCount = useBuilderStore.getState().draftSystem.tasks.length;
      expect(newTasksCount).toBe(initialTasksCount + 1);
      expect(useBuilderStore.getState().draftSystem.tasks[newTasksCount - 1]).toBe(
        "",
      );
    });

    it("should update a task at specific index", () => {
      const { updateTask, addTask } = useBuilderStore.getState();

      addTask();
      updateTask(0, "Complete module 1");
      updateTask(1, "Complete module 2");

      const tasks = useBuilderStore.getState().draftSystem.tasks;
      expect(tasks[0]).toBe("Complete module 1");
      expect(tasks[1]).toBe("Complete module 2");
    });

    it("should remove a task at specific index", () => {
      const { addTask, removeTask, updateTask } = useBuilderStore.getState();

      addTask();
      addTask();
      updateTask(0, "Task 1");
      updateTask(1, "Task 2");
      updateTask(2, "Task 3");

      removeTask(1);

      const tasks = useBuilderStore.getState().draftSystem.tasks;
      expect(tasks.length).toBe(2);
      expect(tasks[0]).toBe("Task 1");
      expect(tasks[1]).toBe("Task 3");
    });

    it("should not remove the last task", () => {
      const { removeTask } = useBuilderStore.getState();

      // Start with one task
      const initialTasks = useBuilderStore.getState().draftSystem.tasks;
      expect(initialTasks.length).toBe(1);

      removeTask(0);

      // Should still have one task
      const tasksAfterRemove = useBuilderStore.getState().draftSystem.tasks;
      expect(tasksAfterRemove.length).toBe(1);
    });
  });

  describe("System Validation", () => {
    it("should fail validation when name is empty", () => {
      const { validateSystem, updateGoal, updateTask } =
        useBuilderStore.getState();

      updateGoal(0, "Valid Goal");
      updateTask(0, "Valid Task");

      const result = validateSystem();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: "name",
        message: "System name is required",
      });
    });

    it("should fail validation when all goals are empty", () => {
      const { validateSystem, setSystemName, updateTask } =
        useBuilderStore.getState();

      setSystemName("Test System");
      updateTask(0, "Valid Task");

      const result = validateSystem();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: "goals",
        message: "At least one goal is required",
      });
    });

    it("should fail validation when all tasks are empty", () => {
      const { validateSystem, setSystemName, updateGoal } =
        useBuilderStore.getState();

      setSystemName("Test System");
      updateGoal(0, "Valid Goal");

      const result = validateSystem();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: "tasks",
        message: "At least one task is required",
      });
    });

    it("should pass validation with valid data", () => {
      const { validateSystem, setSystemName, updateGoal, updateTask } =
        useBuilderStore.getState();

      setSystemName("Test System");
      updateGoal(0, "Learn TypeScript");
      updateTask(0, "Complete TypeScript tutorial");

      const result = validateSystem();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should ignore empty goals and tasks in validation", () => {
      const {
        validateSystem,
        setSystemName,
        updateGoal,
        updateTask,
        addGoal,
        addTask,
      } = useBuilderStore.getState();

      setSystemName("Test System");
      updateGoal(0, "Valid Goal");
      addGoal(); // Add empty goal
      updateTask(0, "Valid Task");
      addTask(); // Add empty task

      const result = validateSystem();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("Get System Data", () => {
    it("should return filtered system data", () => {
      const {
        getSystemData,
        setSystemName,
        setSystemDescription,
        setDomain,
        updateGoal,
        updateTask,
        addGoal,
        addTask,
      } = useBuilderStore.getState();

      setSystemName("Professional Development");
      setSystemDescription("A system for professional growth");
      setDomain("professional");
      updateGoal(0, "Master React");
      addGoal();
      updateGoal(1, ""); // Empty goal
      updateTask(0, "Complete React course");
      addTask();
      updateTask(1, ""); // Empty task

      const systemData = getSystemData();

      expect(systemData.name).toBe("Professional Development");
      expect(systemData.description).toBe("A system for professional growth");
      expect(systemData.domain).toBe("professional");
      expect(systemData.goals).toEqual(["Master React"]); // Empty goal filtered
      expect(systemData.tasks).toEqual(["Complete React course"]); // Empty task filtered
      expect(systemData.createdAt).toBeTruthy();
      expect(typeof systemData.createdAt).toBe("string");
    });

    it("should trim whitespace when filtering", () => {
      const { getSystemData, updateGoal, updateTask, addGoal, addTask } =
        useBuilderStore.getState();

      updateGoal(0, "Valid Goal");
      addGoal();
      updateGoal(1, "   "); // Whitespace only
      updateTask(0, "Valid Task");
      addTask();
      updateTask(1, "  \t\n  "); // Various whitespace

      const systemData = getSystemData();

      expect(systemData.goals).toEqual(["Valid Goal"]);
      expect(systemData.tasks).toEqual(["Valid Task"]);
    });
  });

  describe("Reset System", () => {
    it("should reset to initial state", () => {
      const {
        resetSystem,
        setSystemName,
        setSystemDescription,
        setDomain,
        setActiveTab,
        updateGoal,
        updateTask,
        addGoal,
        addTask,
      } = useBuilderStore.getState();

      // Make changes
      setActiveTab("execution");
      setSystemName("Test System");
      setSystemDescription("Test Description");
      setDomain("professional");
      updateGoal(0, "Test Goal");
      addGoal();
      updateTask(0, "Test Task");
      addTask();

      // Reset
      resetSystem();

      const state = useBuilderStore.getState();
      expect(state.activeTab).toBe("details");
      expect(state.draftSystem).toEqual({
        name: "",
        description: "",
        domain: "personal",
        goals: [""],
        tasks: [""],
        currentPhase: "planning",
        progress: 0,
        createdAt: null,
      });
    });
  });

  describe("State Immutability", () => {
    it("should not mutate state when updating goals", () => {
      const { updateGoal } = useBuilderStore.getState();

      const stateBefore = useBuilderStore.getState().draftSystem;
      updateGoal(0, "New Goal");
      const stateAfter = useBuilderStore.getState().draftSystem;

      // Objects should be different (immutable update)
      expect(stateBefore).not.toBe(stateAfter);
    });

    it("should not mutate state when updating tasks", () => {
      const { updateTask } = useBuilderStore.getState();

      const stateBefore = useBuilderStore.getState().draftSystem;
      updateTask(0, "New Task");
      const stateAfter = useBuilderStore.getState().draftSystem;

      // Objects should be different (immutable update)
      expect(stateBefore).not.toBe(stateAfter);
    });

    it("should not mutate state when adding goals", () => {
      const { addGoal } = useBuilderStore.getState();

      const stateBefore = useBuilderStore.getState().draftSystem;
      addGoal();
      const stateAfter = useBuilderStore.getState().draftSystem;

      // Objects should be different (immutable update)
      expect(stateBefore).not.toBe(stateAfter);
    });

    it("should not mutate state when adding tasks", () => {
      const { addTask } = useBuilderStore.getState();

      const stateBefore = useBuilderStore.getState().draftSystem;
      addTask();
      const stateAfter = useBuilderStore.getState().draftSystem;

      // Objects should be different (immutable update)
      expect(stateBefore).not.toBe(stateAfter);
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple rapid updates", () => {
      const { updateGoal } = useBuilderStore.getState();

      updateGoal(0, "Goal 1");
      updateGoal(0, "Goal 2");
      updateGoal(0, "Goal 3");
      updateGoal(0, "Final Goal");

      expect(useBuilderStore.getState().draftSystem.goals[0]).toBe(
        "Final Goal",
      );
    });

    it("should handle adding and removing goals in sequence", () => {
      const { addGoal, removeGoal } = useBuilderStore.getState();

      addGoal();
      addGoal();
      addGoal();
      expect(useBuilderStore.getState().draftSystem.goals.length).toBe(4);

      removeGoal(3);
      removeGoal(2);
      expect(useBuilderStore.getState().draftSystem.goals.length).toBe(2);
    });

    it("should handle special characters in system name", () => {
      const { setSystemName } = useBuilderStore.getState();

      const specialName = 'Test <script>alert("xss")</script>';
      setSystemName(specialName);

      expect(useBuilderStore.getState().draftSystem.name).toBe(specialName);
    });

    it("should handle very long strings", () => {
      const { setSystemDescription } = useBuilderStore.getState();

      const longDescription = "a".repeat(10000);
      setSystemDescription(longDescription);

      expect(useBuilderStore.getState().draftSystem.description).toBe(
        longDescription,
      );
    });

    it("should handle unicode characters", () => {
      const { updateGoal } = useBuilderStore.getState();

      updateGoal(0, "学习中文 🎯");

      expect(useBuilderStore.getState().draftSystem.goals[0]).toBe(
        "学习中文 🎯",
      );
    });
  });
});
