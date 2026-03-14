import { GitHubManager, GitHubRepository } from "./github-manager";

const githubManager = new GitHubManager();

export const plugin = {
  id: "github-integration",
  name: "GitHub Integration",
  description: "GitHub repository management and notifications plugin for OpenClaw",
  version: "1.0.0",
  type: "integration",
  commands: [
    {
      name: "github:initialize",
      description: "Initialize GitHub integration with token and webhook secret",
      args: [
        { name: "token", description: "GitHub personal access token", required: true },
        { name: "webhook-secret", description: "GitHub webhook secret", required: true },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          githubManager.initialize(args.token as string, args["webhook-secret"] as string);

          return {
            success: true,
            message: "GitHub integration initialized successfully",
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Initialization failed: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:add-repo",
      description: "Add a repository to monitor",
      args: [
        { name: "owner", description: "Repository owner", required: true },
        { name: "repo", description: "Repository name", required: true },
        {
          name: "events",
          description: "Comma-separated list of events to monitor",
          required: false,
        },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        const events = args.events
          ? (args.events as string).split(",")
          : ["push", "pull_request", "issues"];
        const repository = githubManager.addRepository(
          args.owner as string,
          args.repo as string,
          events,
        );

        return {
          success: true,
          message: `Repository ${args.owner}/${args.repo} added successfully`,
          data: repository,
        };
      },
    },
    {
      name: "github:remove-repo",
      description: "Remove a repository from monitoring",
      args: [{ name: "id", description: "Repository ID", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        const deleted = githubManager.removeRepository(args.id as string);

        if (!deleted) {
          return {
            success: false,
            message: `Repository with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: "Repository removed successfully",
        };
      },
    },
    {
      name: "github:list-repos",
      description: "List all monitored repositories",
      args: [],
      handler: async () => {
        const repositories = githubManager.getRepositories();

        return {
          success: true,
          message: `Found ${repositories.length} repositories`,
          data: repositories,
        };
      },
    },
    {
      name: "github:get-repo",
      description: "Get a repository by ID",
      args: [{ name: "id", description: "Repository ID", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const repository = githubManager.getRepository(args.id as string);

        if (!repository) {
          return {
            success: false,
            message: `Repository with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: "Repository found",
          data: repository,
        };
      },
    },
    {
      name: "github:update-repo",
      description: "Update a repository",
      args: [
        { name: "id", description: "Repository ID", required: true },
        { name: "enabled", description: "Enable or disable repository", required: false },
        {
          name: "events",
          description: "Comma-separated list of events to monitor",
          required: false,
        },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const updates: Partial<GitHubRepository> = {};

        if (args.enabled !== undefined) {
          updates.enabled = args.enabled === "true";
        }
        if (args.events) {
          updates.events = (args.events as string).split(",");
        }

        const repository = githubManager.updateRepository(args.id as string, updates);

        if (!repository) {
          return {
            success: false,
            message: `Repository with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: "Repository updated successfully",
          data: repository,
        };
      },
    },
    {
      name: "github:get-notifications",
      description: "Get GitHub notifications",
      args: [
        {
          name: "all",
          description: "Include all notifications (not just unread)",
          required: false,
        },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const all = args.all === "true";
          const notifications = await githubManager.getNotifications(all);

          return {
            success: true,
            message: `Found ${notifications.length} notifications`,
            data: notifications,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to get notifications: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:mark-notification-read",
      description: "Mark a notification as read",
      args: [{ name: "id", description: "Notification ID", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          await githubManager.markNotificationAsRead(args.id as string);

          return {
            success: true,
            message: "Notification marked as read",
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to mark notification as read: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:mark-all-notifications-read",
      description: "Mark all notifications as read",
      args: [],
      handler: async () => {
        try {
          await githubManager.markAllNotificationsAsRead();

          return {
            success: true,
            message: "All notifications marked as read",
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to mark all notifications as read: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:get-issues",
      description: "Get repository issues",
      args: [
        { name: "owner", description: "Repository owner", required: true },
        { name: "repo", description: "Repository name", required: true },
        { name: "state", description: "Issue state (open, closed, all)", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const state = (args.state as "open" | "closed" | "all") || "open";

        try {
          const issues = await githubManager.getIssues(
            args.owner as string,
            args.repo as string,
            state,
          );

          return {
            success: true,
            message: `Found ${issues.length} issues`,
            data: issues,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to get issues: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:get-pull-requests",
      description: "Get repository pull requests",
      args: [
        { name: "owner", description: "Repository owner", required: true },
        { name: "repo", description: "Repository name", required: true },
        { name: "state", description: "PR state (open, closed, all)", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const state = (args.state as "open" | "closed" | "all") || "open";

        try {
          const prs = await githubManager.getPullRequests(
            args.owner as string,
            args.repo as string,
            state,
          );

          return {
            success: true,
            message: `Found ${prs.length} pull requests`,
            data: prs,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to get pull requests: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:get-commits",
      description: "Get repository commits",
      args: [
        { name: "owner", description: "Repository owner", required: true },
        { name: "repo", description: "Repository name", required: true },
        { name: "per-page", description: "Number of commits to return", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const perPage = args["per-page"] ? parseInt(args["per-page"] as string) : 100;

        try {
          const commits = await githubManager.getCommits(
            args.owner as string,
            args.repo as string,
            perPage,
          );

          return {
            success: true,
            message: `Found ${commits.length} commits`,
            data: commits,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to get commits: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:create-webhook",
      description: "Create a webhook for a repository",
      args: [
        { name: "owner", description: "Repository owner", required: true },
        { name: "repo", description: "Repository name", required: true },
        { name: "url", description: "Webhook URL", required: true },
        { name: "events", description: "Comma-separated list of events", required: false },
        { name: "secret", description: "Webhook secret", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const events = args.events
          ? (args.events as string).split(",")
          : ["push", "pull_request", "issues"];
        const secret = args.secret || "";

        try {
          const webhook = await githubManager.createWebhook(
            args.owner as string,
            args.repo as string,
            args.url as string,
            events,
            secret,
          );

          return {
            success: true,
            message: "Webhook created successfully",
            data: webhook,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to create webhook: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:list-webhooks",
      description: "List webhooks for a repository",
      args: [
        { name: "owner", description: "Repository owner", required: true },
        { name: "repo", description: "Repository name", required: true },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const webhooks = await githubManager.listWebhooks(
            args.owner as string,
            args.repo as string,
          );

          return {
            success: true,
            message: `Found ${webhooks.length} webhooks`,
            data: webhooks,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to list webhooks: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:delete-webhook",
      description: "Delete a webhook",
      args: [
        { name: "owner", description: "Repository owner", required: true },
        { name: "repo", description: "Repository name", required: true },
        { name: "id", description: "Webhook ID", required: true },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          await githubManager.deleteWebhook(
            args.owner as string,
            args.repo as string,
            parseInt(args.id as string),
          );

          return {
            success: true,
            message: "Webhook deleted successfully",
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to delete webhook: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:get-repo-info",
      description: "Get repository information",
      args: [
        { name: "owner", description: "Repository owner", required: true },
        { name: "repo", description: "Repository name", required: true },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const info = await githubManager.getRepositoryInfo(
            args.owner as string,
            args.repo as string,
          );

          return {
            success: true,
            message: "Repository information retrieved successfully",
            data: info,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to get repository information: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:get-user-info",
      description: "Get authenticated user information",
      args: [],
      handler: async () => {
        try {
          const info = await githubManager.getUserInfo();

          return {
            success: true,
            message: "User information retrieved successfully",
            data: info,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to get user information: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:import-repos",
      description: "Import repositories from GitHub",
      args: [],
      handler: async () => {
        try {
          const importedRepos = await githubManager.importRepositories();

          return {
            success: true,
            message: `Imported ${importedRepos.length} repositories from GitHub`,
            data: importedRepos,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to import repositories: ${error.message}`,
          };
        }
      },
    },
    {
      name: "github:export-repos",
      description: "Export repositories to JSON",
      args: [],
      handler: async () => {
        const repositories = githubManager.exportRepositories();

        return {
          success: true,
          message: `Exported ${repositories.length} repositories`,
          data: repositories,
        };
      },
    },
    {
      name: "github:import-repos-from-json",
      description: "Import repositories from JSON",
      args: [{ name: "repositories", description: "Repositories as JSON string", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const repositories = JSON.parse(args.repositories as string);
          const count = githubManager.importRepositoriesFromJson(repositories);

          return {
            success: true,
            message: `Imported ${count} repositories`,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Import failed: ${error.message}`,
          };
        }
      },
    },
  ],
  hooks: {
    onLoad: async () => {
      console.log("GitHub Integration plugin loaded");
    },
    onUnload: async () => {
      console.log("GitHub Integration plugin unloaded");
    },
  },
};

export default plugin;
