import { BitbucketManager, BitbucketConfig } from "./bitbucket-manager";

interface OpenClawPluginContext {
  registerCommand: (command: string, handler: (args: any, options: any) => Promise<any>) => void;
  config: { get: (key: string) => any };
  logger: { info: (message: string) => void; error: (message: string) => void };
}

let bitbucketManager: BitbucketManager | null = null;

export function initialize(context: OpenClawPluginContext) {
  const apiToken = context.config.get("bitbucket.apiToken");
  const username = context.config.get("bitbucket.username");

  if (!apiToken || !username) {
    context.logger.error(
      "Bitbucket integration plugin: Missing required configuration (apiToken and username)",
    );
    return;
  }

  const config: BitbucketConfig = {
    apiToken,
    username,
  };

  bitbucketManager = new BitbucketManager(config);
  context.logger.info("Bitbucket integration plugin initialized");

  // Register commands
  context.registerCommand("bitbucket:list-repos", async (args, options) => {
    if (!bitbucketManager) {
      throw new Error("Bitbucket manager not initialized");
    }
    return await bitbucketManager.listRepositories();
  });

  context.registerCommand("bitbucket:list-pull-requests", async (args, options) => {
    if (!bitbucketManager) {
      throw new Error("Bitbucket manager not initialized");
    }
    const { owner, repo } = args;
    if (!owner || !repo) {
      throw new Error("Missing required parameters: owner and repo");
    }
    return await bitbucketManager.listPullRequests(owner, repo);
  });

  context.registerCommand("bitbucket:list-issues", async (args, options) => {
    if (!bitbucketManager) {
      throw new Error("Bitbucket manager not initialized");
    }
    const { owner, repo } = args;
    if (!owner || !repo) {
      throw new Error("Missing required parameters: owner and repo");
    }
    return await bitbucketManager.listIssues(owner, repo);
  });

  context.registerCommand("bitbucket:create-issue", async (args, options) => {
    if (!bitbucketManager) {
      throw new Error("Bitbucket manager not initialized");
    }
    const { owner, repo, title, description } = args;
    if (!owner || !repo || !title) {
      throw new Error("Missing required parameters: owner, repo, and title");
    }
    return await bitbucketManager.createIssue(owner, repo, title, description || "");
  });

  context.registerCommand("bitbucket:comment-issue", async (args, options) => {
    if (!bitbucketManager) {
      throw new Error("Bitbucket manager not initialized");
    }
    const { owner, repo, issueId, comment } = args;
    if (!owner || !repo || !issueId || !comment) {
      throw new Error("Missing required parameters: owner, repo, issueId, and comment");
    }
    return await bitbucketManager.commentIssue(owner, repo, issueId, comment);
  });

  context.registerCommand("bitbucket:list-notifications", async (args, options) => {
    if (!bitbucketManager) {
      throw new Error("Bitbucket manager not initialized");
    }
    return await bitbucketManager.listNotifications();
  });
}

export function getBitbucketManager(): BitbucketManager | null {
  return bitbucketManager;
}

export default {
  initialize,
};
