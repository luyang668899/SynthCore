import { JiraManager, JiraConfig } from "./jira-manager";

interface OpenClawPluginContext {
  registerCommand: (command: string, handler: (args: any, options: any) => Promise<any>) => void;
  config: { get: (key: string) => any };
  logger: { info: (message: string) => void; error: (message: string) => void };
}

let jiraManager: JiraManager | null = null;

export function initialize(context: OpenClawPluginContext) {
  const apiToken = context.config.get("jira.apiToken");
  const email = context.config.get("jira.email");
  const baseUrl = context.config.get("jira.baseUrl");

  if (!apiToken || !email || !baseUrl) {
    context.logger.error(
      "Jira integration plugin: Missing required configuration (apiToken, email, and baseUrl)",
    );
    return;
  }

  const config: JiraConfig = {
    apiToken,
    email,
    baseUrl,
  };

  jiraManager = new JiraManager(config);
  context.logger.info("Jira integration plugin initialized");

  // Register commands
  context.registerCommand("jira:list-projects", async (args, options) => {
    if (!jiraManager) {
      throw new Error("Jira manager not initialized");
    }
    return await jiraManager.listProjects();
  });

  context.registerCommand("jira:list-issues", async (args, options) => {
    if (!jiraManager) {
      throw new Error("Jira manager not initialized");
    }
    const { projectKey } = args;
    if (!projectKey) {
      throw new Error("Missing required parameter: projectKey");
    }
    return await jiraManager.listIssues(projectKey);
  });

  context.registerCommand("jira:create-issue", async (args, options) => {
    if (!jiraManager) {
      throw new Error("Jira manager not initialized");
    }
    const { projectKey, summary, description, issueType } = args;
    if (!projectKey || !summary) {
      throw new Error("Missing required parameters: projectKey and summary");
    }
    return await jiraManager.createIssue(
      projectKey,
      summary,
      description || "",
      issueType || "Task",
    );
  });

  context.registerCommand("jira:update-issue", async (args, options) => {
    if (!jiraManager) {
      throw new Error("Jira manager not initialized");
    }
    const { issueKey, updates } = args;
    if (!issueKey || !updates) {
      throw new Error("Missing required parameters: issueKey and updates");
    }
    return await jiraManager.updateIssue(issueKey, updates);
  });

  context.registerCommand("jira:comment-issue", async (args, options) => {
    if (!jiraManager) {
      throw new Error("Jira manager not initialized");
    }
    const { issueKey, comment } = args;
    if (!issueKey || !comment) {
      throw new Error("Missing required parameters: issueKey and comment");
    }
    return await jiraManager.commentIssue(issueKey, comment);
  });

  context.registerCommand("jira:list-notifications", async (args, options) => {
    if (!jiraManager) {
      throw new Error("Jira manager not initialized");
    }
    return await jiraManager.listNotifications();
  });
}

export function getJiraManager(): JiraManager | null {
  return jiraManager;
}

export default {
  initialize,
};
