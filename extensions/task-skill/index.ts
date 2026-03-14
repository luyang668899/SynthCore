import { OpenClawPluginApi, OpenClawPlugin } from "openclaw/plugin-sdk";
import { MockTaskManager } from "./src/task-manager";

export const TaskSkillPlugin: OpenClawPlugin = {
  id: "task-skill",
  name: "Task Skill",
  version: "2026.2.17",
  description: "Task management and to-do list skill for OpenClaw",
  author: "OpenClaw Team",
  license: "MIT",

  register: async (api: OpenClawPluginApi) => {
    console.log("Registering Task Skill plugin...");

    // Initialize task manager with mock implementation for testing
    const taskManager = new MockTaskManager();

    // Register task tools
    api.registerTool({
      id: "task_create",
      name: "Create Task",
      description: "Create a new task",
      parameters: {
        task: {
          type: "object",
          description: "Task details",
          required: true,
        },
      },
      handler: async (params) => {
        const task = params.task as any;
        const newTask = taskManager.createTask(task);
        return { task: newTask };
      },
    });

    api.registerTool({
      id: "task_update",
      name: "Update Task",
      description: "Update an existing task",
      parameters: {
        id: {
          type: "string",
          description: "Task ID",
          required: true,
        },
        updates: {
          type: "object",
          description: "Task updates",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const updates = params.updates as any;
        const updatedTask = taskManager.updateTask(id, updates);
        return { task: updatedTask };
      },
    });

    api.registerTool({
      id: "task_delete",
      name: "Delete Task",
      description: "Delete a task",
      parameters: {
        id: {
          type: "string",
          description: "Task ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const success = taskManager.deleteTask(id);
        return { success };
      },
    });

    api.registerTool({
      id: "task_get",
      name: "Get Task",
      description: "Get a task by ID",
      parameters: {
        id: {
          type: "string",
          description: "Task ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const task = taskManager.getTask(id);
        return { task };
      },
    });

    api.registerTool({
      id: "task_get_by_user",
      name: "Get Tasks by User",
      description: "Get all tasks for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const tasks = taskManager.getTasksByUserId(userId);
        return { tasks };
      },
    });

    api.registerTool({
      id: "task_get_by_status",
      name: "Get Tasks by Status",
      description: "Get tasks by status",
      parameters: {
        status: {
          type: "string",
          description: "Task status",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const status = params.status as string;
        const userId = params.userId as string;
        const tasks = taskManager.getTasksByStatus(status as any, userId);
        return { tasks };
      },
    });

    api.registerTool({
      id: "task_get_by_priority",
      name: "Get Tasks by Priority",
      description: "Get tasks by priority",
      parameters: {
        priority: {
          type: "string",
          description: "Task priority",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const priority = params.priority as string;
        const userId = params.userId as string;
        const tasks = taskManager.getTasksByPriority(priority as any, userId);
        return { tasks };
      },
    });

    api.registerTool({
      id: "task_get_by_tag",
      name: "Get Tasks by Tag",
      description: "Get tasks by tag",
      parameters: {
        tag: {
          type: "string",
          description: "Tag",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const tag = params.tag as string;
        const userId = params.userId as string;
        const tasks = taskManager.getTasksByTag(tag, userId);
        return { tasks };
      },
    });

    api.registerTool({
      id: "task_get_by_date_range",
      name: "Get Tasks by Date Range",
      description: "Get tasks within a date range",
      parameters: {
        startDate: {
          type: "string",
          description: "Start date (ISO format)",
          required: true,
        },
        endDate: {
          type: "string",
          description: "End date (ISO format)",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const startDate = params.startDate as string;
        const endDate = params.endDate as string;
        const userId = params.userId as string;
        const tasks = taskManager.getTasksByDueDateRange(startDate, endDate, userId);
        return { tasks };
      },
    });

    api.registerTool({
      id: "task_get_today",
      name: "Get Today Tasks",
      description: "Get tasks due today",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const tasks = taskManager.getTodayTasks(userId);
        return { tasks };
      },
    });

    api.registerTool({
      id: "task_get_upcoming",
      name: "Get Upcoming Tasks",
      description: "Get upcoming tasks",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
        days: {
          type: "number",
          description: "Number of days to look ahead",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const days = (params.days as number) || 7;
        const tasks = taskManager.getUpcomingTasks(userId, days);
        return { tasks };
      },
    });

    api.registerTool({
      id: "task_mark_completed",
      name: "Mark Task as Completed",
      description: "Mark a task as completed",
      parameters: {
        id: {
          type: "string",
          description: "Task ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const task = taskManager.markAsCompleted(id);
        return { task };
      },
    });

    api.registerTool({
      id: "task_mark_in_progress",
      name: "Mark Task as In Progress",
      description: "Mark a task as in progress",
      parameters: {
        id: {
          type: "string",
          description: "Task ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const task = taskManager.markAsInProgress(id);
        return { task };
      },
    });

    api.registerTool({
      id: "task_mark_todo",
      name: "Mark Task as Todo",
      description: "Mark a task as todo",
      parameters: {
        id: {
          type: "string",
          description: "Task ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const task = taskManager.markAsTodo(id);
        return { task };
      },
    });

    api.registerTool({
      id: "task_mark_cancelled",
      name: "Mark Task as Cancelled",
      description: "Mark a task as cancelled",
      parameters: {
        id: {
          type: "string",
          description: "Task ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const task = taskManager.markAsCancelled(id);
        return { task };
      },
    });

    api.registerTool({
      id: "task_get_stats",
      name: "Get Task Stats",
      description: "Get task statistics",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const stats = taskManager.getStats(userId);
        return { stats };
      },
    });

    api.registerTool({
      id: "task_config",
      name: "Task Config",
      description: "Update task configuration",
      parameters: {
        task: {
          type: "object",
          description: "Task configuration",
          required: true,
        },
      },
      handler: async (params) => {
        const taskConfig = params.task as any;
        taskManager.updateConfig(taskConfig);
        return { success: true };
      },
    });

    console.log("Task Skill plugin registered successfully");
  },

  unregister: async (api: OpenClawPluginApi) => {
    console.log("Unregistering Task Skill plugin...");
    // Cleanup resources if needed
    console.log("Task Skill plugin unregistered successfully");
  },
};

export default TaskSkillPlugin;
