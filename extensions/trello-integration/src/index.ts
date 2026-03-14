import { TrelloManager, TrelloConfig } from "./trello-manager";

interface OpenClawPluginContext {
  registerCommand: (command: string, handler: (args: any, options: any) => Promise<any>) => void;
  config: { get: (key: string) => any };
  logger: { info: (message: string) => void; error: (message: string) => void };
}

let trelloManager: TrelloManager | null = null;

export function initialize(context: OpenClawPluginContext) {
  const apiKey = context.config.get("trello.apiKey");
  const token = context.config.get("trello.token");

  if (!apiKey || !token) {
    context.logger.error(
      "Trello integration plugin: Missing required configuration (apiKey and token)",
    );
    return;
  }

  const config: TrelloConfig = {
    apiKey,
    token,
  };

  trelloManager = new TrelloManager(config);
  context.logger.info("Trello integration plugin initialized");

  // Register commands
  context.registerCommand("trello:list-boards", async (args, options) => {
    if (!trelloManager) {
      throw new Error("Trello manager not initialized");
    }
    return await trelloManager.listBoards();
  });

  context.registerCommand("trello:list-lists", async (args, options) => {
    if (!trelloManager) {
      throw new Error("Trello manager not initialized");
    }
    const { boardId } = args;
    if (!boardId) {
      throw new Error("Missing required parameter: boardId");
    }
    return await trelloManager.listLists(boardId);
  });

  context.registerCommand("trello:list-cards", async (args, options) => {
    if (!trelloManager) {
      throw new Error("Trello manager not initialized");
    }
    const { listId } = args;
    if (!listId) {
      throw new Error("Missing required parameter: listId");
    }
    return await trelloManager.listCards(listId);
  });

  context.registerCommand("trello:create-card", async (args, options) => {
    if (!trelloManager) {
      throw new Error("Trello manager not initialized");
    }
    const { listId, name, desc, due } = args;
    if (!listId || !name) {
      throw new Error("Missing required parameters: listId and name");
    }
    return await trelloManager.createCard(listId, name, desc || "", due);
  });

  context.registerCommand("trello:update-card", async (args, options) => {
    if (!trelloManager) {
      throw new Error("Trello manager not initialized");
    }
    const { cardId, updates } = args;
    if (!cardId || !updates) {
      throw new Error("Missing required parameters: cardId and updates");
    }
    return await trelloManager.updateCard(cardId, updates);
  });

  context.registerCommand("trello:comment-card", async (args, options) => {
    if (!trelloManager) {
      throw new Error("Trello manager not initialized");
    }
    const { cardId, text } = args;
    if (!cardId || !text) {
      throw new Error("Missing required parameters: cardId and text");
    }
    return await trelloManager.commentCard(cardId, text);
  });

  context.registerCommand("trello:list-notifications", async (args, options) => {
    if (!trelloManager) {
      throw new Error("Trello manager not initialized");
    }
    return await trelloManager.listNotifications();
  });
}

export function getTrelloManager(): TrelloManager | null {
  return trelloManager;
}

export default {
  initialize,
};
