import { AsanaManager, AsanaConfig } from "./asana-manager";

interface OpenClawPluginContext {
  registerCommand: (command: string, handler: (args: any, options: any) => Promise<any>) => void;
  config: { get: (key: string) => any };
  logger: { info: (message: string) => void; error: (message: string) => void };
}

let asanaManager: AsanaManager | null = null;

export function initialize(context: OpenClawPluginContext) {
  const personalAccessToken = context.config.get("asana.personalAccessToken");

  if (!personalAccessToken) {
    context.logger.error(
      "Asana integration plugin: Missing required configuration (personalAccessToken)",
    );
    return;
  }

  const config: AsanaConfig = {
    personalAccessToken,
  };

  asanaManager = new AsanaManager(config);
  context.logger.info("Asana integration plugin initialized");

  // Register commands
  context.registerCommand("asana:list-workspaces", async (args, options) => {
    if (!asanaManager) {
      throw new Error("Asana manager not initialized");
    }
    return await asanaManager.listWorkspaces();
  });

  context.registerCommand("asana:list-projects", async (args, options) => {
    if (!asanaManager) {
      throw new Error("Asana manager not initialized");
    }
    const { workspaceId } = args;
    if (!workspaceId) {
      throw new Error("Missing required parameter: workspaceId");
    }
    return await asanaManager.listProjects(workspaceId);
  });

  context.registerCommand("asana:list-tasks", async (args, options) => {
    if (!asanaManager) {
      throw new Error("Asana manager not initialized");
    }
    const { projectId } = args;
    if (!projectId) {
      throw new Error("Missing required parameter: projectId");
    }
    return await asanaManager.listTasks(projectId);
  });

  context.registerCommand("asana:create-task", async (args, options) => {
    if (!asanaManager) {
      throw new Error("Asana manager not initialized");
    }
    const { projectId, name, notes, dueAt, assigneeId } = args;
    if (!projectId || !name) {
      throw new Error("Missing required parameters: projectId and name");
    }
    return await asanaManager.createTask(projectId, name, notes || "", dueAt, assigneeId);
  });

  context.registerCommand("asana:update-task", async (args, options) => {
    if (!asanaManager) {
      throw new Error("Asana manager not initialized");
    }
    const { taskId, updates } = args;
    if (!taskId || !updates) {
      throw new Error("Missing required parameters: taskId and updates");
    }
    return await asanaManager.updateTask(taskId, updates);
  });

  context.registerCommand("asana:comment-task", async (args, options) => {
    if (!asanaManager) {
      throw new Error("Asana manager not initialized");
    }
    const { taskId, text } = args;
    if (!taskId || !text) {
      throw new Error("Missing required parameters: taskId and text");
    }
    return await asanaManager.commentTask(taskId, text);
  });

  context.registerCommand("asana:list-notifications", async (args, options) => {
    if (!asanaManager) {
      throw new Error("Asana manager not initialized");
    }
    return await asanaManager.listNotifications();
  });
}

export function getAsanaManager(): AsanaManager | null {
  return asanaManager;
}

export default {
  initialize,
};
