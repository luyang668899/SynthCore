import { NotionManager, NotionConfig } from "./notion-manager";

interface OpenClawPluginContext {
  registerCommand: (command: string, handler: (args: any, options: any) => Promise<any>) => void;
  config: { get: (key: string) => any };
  logger: { info: (message: string) => void; error: (message: string) => void };
}

let notionManager: NotionManager | null = null;

export function initialize(context: OpenClawPluginContext) {
  const apiKey = context.config.get("notion.apiKey");

  if (!apiKey) {
    context.logger.error("Notion integration plugin: Missing required configuration (apiKey)");
    return;
  }

  const config: NotionConfig = {
    apiKey,
  };

  notionManager = new NotionManager(config);
  context.logger.info("Notion integration plugin initialized");

  // Register commands
  context.registerCommand("notion:list-workspaces", async (args, options) => {
    if (!notionManager) {
      throw new Error("Notion manager not initialized");
    }
    return await notionManager.listWorkspaces();
  });

  context.registerCommand("notion:list-pages", async (args, options) => {
    if (!notionManager) {
      throw new Error("Notion manager not initialized");
    }
    const { workspaceId } = args;
    return await notionManager.listPages(workspaceId);
  });

  context.registerCommand("notion:create-page", async (args, options) => {
    if (!notionManager) {
      throw new Error("Notion manager not initialized");
    }
    const { parentId, title, content } = args;
    if (!parentId || !title) {
      throw new Error("Missing required parameters: parentId and title");
    }
    return await notionManager.createPage(parentId, title, content || []);
  });

  context.registerCommand("notion:update-page", async (args, options) => {
    if (!notionManager) {
      throw new Error("Notion manager not initialized");
    }
    const { pageId, updates } = args;
    if (!pageId || !updates) {
      throw new Error("Missing required parameters: pageId and updates");
    }
    return await notionManager.updatePage(pageId, updates);
  });

  context.registerCommand("notion:list-databases", async (args, options) => {
    if (!notionManager) {
      throw new Error("Notion manager not initialized");
    }
    return await notionManager.listDatabases();
  });

  context.registerCommand("notion:query-database", async (args, options) => {
    if (!notionManager) {
      throw new Error("Notion manager not initialized");
    }
    const { databaseId, filter, sorts } = args;
    if (!databaseId) {
      throw new Error("Missing required parameter: databaseId");
    }
    return await notionManager.queryDatabase(databaseId, filter, sorts);
  });

  context.registerCommand("notion:list-notifications", async (args, options) => {
    if (!notionManager) {
      throw new Error("Notion manager not initialized");
    }
    return await notionManager.listNotifications();
  });
}

export function getNotionManager(): NotionManager | null {
  return notionManager;
}

export default {
  initialize,
};
