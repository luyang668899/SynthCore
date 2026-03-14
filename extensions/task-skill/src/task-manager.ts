import { parseISO, isToday, isTomorrow, isThisWeek, addDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

interface TaskConfig {
  defaultDueDays: number;
  defaultPriority: "low" | "medium" | "high";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  dueDate: string; // ISO date string
  tags: string[];
  assignees: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class TaskManager {
  private config: TaskConfig;
  private tasks: Map<string, Task> = new Map();

  constructor(config: TaskConfig) {
    this.config = config;
  }

  createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(newTask.id, newTask);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const task = this.tasks.get(id);
    if (!task) {
      return null;
    }

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  getTask(id: string): Task | null {
    return this.tasks.get(id) || null;
  }

  getTasksByUserId(userId: string): Task[] {
    return Array.from(this.tasks.values()).filter((task) => task.userId === userId);
  }

  getTasksByStatus(status: Task["status"], userId?: string): Task[] {
    return Array.from(this.tasks.values()).filter((task) => {
      const matchesStatus = task.status === status;
      const matchesUser = !userId || task.userId === userId;
      return matchesStatus && matchesUser;
    });
  }

  getTasksByPriority(priority: Task["priority"], userId?: string): Task[] {
    return Array.from(this.tasks.values()).filter((task) => {
      const matchesPriority = task.priority === priority;
      const matchesUser = !userId || task.userId === userId;
      return matchesPriority && matchesUser;
    });
  }

  getTasksByTag(tag: string, userId?: string): Task[] {
    return Array.from(this.tasks.values()).filter((task) => {
      const matchesTag = task.tags.includes(tag);
      const matchesUser = !userId || task.userId === userId;
      return matchesTag && matchesUser;
    });
  }

  getTasksByDueDateRange(startDate: string, endDate: string, userId?: string): Task[] {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    return Array.from(this.tasks.values()).filter((task) => {
      const dueDate = parseISO(task.dueDate);
      const inDateRange = dueDate >= start && dueDate <= end;
      const matchesUser = !userId || task.userId === userId;
      return inDateRange && matchesUser;
    });
  }

  getTodayTasks(userId?: string): Task[] {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    return this.getTasksByDueDateRange(startOfDay.toISOString(), endOfDay.toISOString(), userId);
  }

  getUpcomingTasks(userId?: string, days: number = 7): Task[] {
    const now = new Date();
    const endDate = addDays(now, days);

    return this.getTasksByDueDateRange(now.toISOString(), endDate.toISOString(), userId);
  }

  markAsCompleted(id: string): Task | null {
    return this.updateTask(id, { status: "completed" });
  }

  markAsInProgress(id: string): Task | null {
    return this.updateTask(id, { status: "in_progress" });
  }

  markAsTodo(id: string): Task | null {
    return this.updateTask(id, { status: "todo" });
  }

  markAsCancelled(id: string): Task | null {
    return this.updateTask(id, { status: "cancelled" });
  }

  updateConfig(config: Partial<TaskConfig>) {
    this.config = { ...this.config, ...config };
  }

  getStats(userId?: string): {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    cancelledTasks: number;
    dueToday: number;
    overdue: number;
  } {
    const tasks = userId ? this.getTasksByUserId(userId) : Array.from(this.tasks.values());
    const now = new Date();

    return {
      totalTasks: tasks.length,
      todoTasks: tasks.filter((task) => task.status === "todo").length,
      inProgressTasks: tasks.filter((task) => task.status === "in_progress").length,
      completedTasks: tasks.filter((task) => task.status === "completed").length,
      cancelledTasks: tasks.filter((task) => task.status === "cancelled").length,
      dueToday: tasks.filter((task) => isToday(parseISO(task.dueDate))).length,
      overdue: tasks.filter(
        (task) =>
          parseISO(task.dueDate) < now &&
          task.status !== "completed" &&
          task.status !== "cancelled",
      ).length,
    };
  }
}

// Mock implementation for testing
export class MockTaskManager extends TaskManager {
  constructor() {
    super({
      defaultDueDays: 7,
      defaultPriority: "medium",
    });

    // Add some mock tasks
    this.createTask({
      title: "Complete project proposal",
      description: "Finish the project proposal for the new client",
      status: "todo",
      priority: "high",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      tags: ["work", "project"],
      assignees: ["me@example.com"],
      userId: "user1",
    });

    this.createTask({
      title: "Buy groceries",
      description: "Milk, eggs, bread, and vegetables",
      status: "todo",
      priority: "medium",
      dueDate: new Date().toISOString(), // Today
      tags: ["personal", "shopping"],
      assignees: ["me@example.com"],
      userId: "user1",
    });

    this.createTask({
      title: "Call John",
      description: "Discuss the meeting agenda",
      status: "in_progress",
      priority: "low",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      tags: ["personal", "call"],
      assignees: ["me@example.com"],
      userId: "user1",
    });
  }

  createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    console.log("Creating task:", task.title);
    return super.createTask(task);
  }

  getTodayTasks(userId?: string): Task[] {
    const tasks = super.getTodayTasks(userId);
    console.log(`Found ${tasks.length} tasks due today`);
    return tasks;
  }

  getUpcomingTasks(userId?: string, days: number = 7): Task[] {
    const tasks = super.getUpcomingTasks(userId, days);
    console.log(`Found ${tasks.length} upcoming tasks in the next ${days} days`);
    return tasks;
  }
}
