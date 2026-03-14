import { GitLabManager, GitLabProject } from "./gitlab-manager";

const gitlabManager = new GitLabManager();

export const plugin = {
  id: "gitlab-integration",
  name: "GitLab Integration",
  description: "GitLab repository management and notifications plugin for OpenClaw",
  version: "1.0.0",
  type: "integration",
  commands: [
    {
      name: "gitlab:initialize",
      description: "Initialize GitLab integration with token and URL",
      args: [
        { name: "token", description: "GitLab personal access token", required: true },
        { name: "url", description: "GitLab instance URL", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const gitlabUrl = args.url || "https://gitlab.com";
          gitlabManager.initialize(args.token as string, gitlabUrl);

          return {
            success: true,
            message: "GitLab integration initialized successfully",
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
      name: "gitlab:add-project",
      description: "Add a project to monitor",
      args: [
        { name: "project-id", description: "Project ID", required: true },
        { name: "name", description: "Project name", required: true },
        { name: "namespace", description: "Project namespace", required: true },
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
          : ["push", "merge_request", "issues"];
        const project = gitlabManager.addProject(
          parseInt(args["project-id"] as string),
          args.name as string,
          args.namespace as string,
          events,
        );

        return {
          success: true,
          message: `Project ${args.namespace}/${args.name} added successfully`,
          data: project,
        };
      },
    },
    {
      name: "gitlab:remove-project",
      description: "Remove a project from monitoring",
      args: [{ name: "id", description: "Project ID", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        const deleted = gitlabManager.removeProject(args.id as string);

        if (!deleted) {
          return {
            success: false,
            message: `Project with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: "Project removed successfully",
        };
      },
    },
    {
      name: "gitlab:list-projects",
      description: "List all monitored projects",
      args: [],
      handler: async () => {
        const projects = gitlabManager.getProjects();

        return {
          success: true,
          message: `Found ${projects.length} projects`,
          data: projects,
        };
      },
    },
    {
      name: "gitlab:get-project",
      description: "Get a project by ID",
      args: [{ name: "id", description: "Project ID", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const project = gitlabManager.getProject(args.id as string);

        if (!project) {
          return {
            success: false,
            message: `Project with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: "Project found",
          data: project,
        };
      },
    },
    {
      name: "gitlab:update-project",
      description: "Update a project",
      args: [
        { name: "id", description: "Project ID", required: true },
        { name: "enabled", description: "Enable or disable project", required: false },
        {
          name: "events",
          description: "Comma-separated list of events to monitor",
          required: false,
        },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const updates: Partial<GitLabProject> = {};

        if (args.enabled !== undefined) {
          updates.enabled = args.enabled === "true";
        }
        if (args.events) {
          updates.events = (args.events as string).split(",");
        }

        const project = gitlabManager.updateProject(args.id as string, updates);

        if (!project) {
          return {
            success: false,
            message: `Project with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: "Project updated successfully",
          data: project,
        };
      },
    },
    {
      name: "gitlab:get-notifications",
      description: "Get GitLab notifications",
      args: [{ name: "unread-only", description: "Only unread notifications", required: false }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const unreadOnly = args["unread-only"] !== "false";
          const notifications = await gitlabManager.getNotifications(unreadOnly);

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
      name: "gitlab:mark-notification-read",
      description: "Mark a notification as read",
      args: [{ name: "id", description: "Notification ID", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          await gitlabManager.markNotificationAsRead(parseInt(args.id as string));

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
      name: "gitlab:mark-all-notifications-read",
      description: "Mark all notifications as read",
      args: [],
      handler: async () => {
        try {
          await gitlabManager.markAllNotificationsAsRead();

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
      name: "gitlab:get-issues",
      description: "Get project issues",
      args: [
        { name: "project-id", description: "Project ID", required: true },
        { name: "state", description: "Issue state (opened, closed, all)", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const state = (args.state as "opened" | "closed" | "all") || "opened";

        try {
          const issues = await gitlabManager.getIssues(
            parseInt(args["project-id"] as string),
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
      name: "gitlab:get-merge-requests",
      description: "Get project merge requests",
      args: [
        { name: "project-id", description: "Project ID", required: true },
        { name: "state", description: "MR state (opened, closed, merged, all)", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const state = (args.state as "opened" | "closed" | "merged" | "all") || "opened";

        try {
          const mrs = await gitlabManager.getMergeRequests(
            parseInt(args["project-id"] as string),
            state,
          );

          return {
            success: true,
            message: `Found ${mrs.length} merge requests`,
            data: mrs,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to get merge requests: ${error.message}`,
          };
        }
      },
    },
    {
      name: "gitlab:get-commits",
      description: "Get project commits",
      args: [
        { name: "project-id", description: "Project ID", required: true },
        { name: "per-page", description: "Number of commits to return", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const perPage = args["per-page"] ? parseInt(args["per-page"] as string) : 100;

        try {
          const commits = await gitlabManager.getCommits(
            parseInt(args["project-id"] as string),
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
      name: "gitlab:create-webhook",
      description: "Create a webhook for a project",
      args: [
        { name: "project-id", description: "Project ID", required: true },
        { name: "url", description: "Webhook URL", required: true },
        { name: "events", description: "Comma-separated list of events", required: false },
        { name: "token", description: "Webhook token", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const events = args.events
          ? (args.events as string).split(",")
          : ["push", "merge_request", "issues"];
        const token = args.token || "";

        try {
          const webhook = await gitlabManager.createWebhook(
            parseInt(args["project-id"] as string),
            args.url as string,
            events,
            token,
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
      name: "gitlab:list-webhooks",
      description: "List webhooks for a project",
      args: [{ name: "project-id", description: "Project ID", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const webhooks = await gitlabManager.listWebhooks(parseInt(args["project-id"] as string));

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
      name: "gitlab:delete-webhook",
      description: "Delete a webhook",
      args: [
        { name: "project-id", description: "Project ID", required: true },
        { name: "id", description: "Webhook ID", required: true },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          await gitlabManager.deleteWebhook(
            parseInt(args["project-id"] as string),
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
      name: "gitlab:get-project-info",
      description: "Get project information",
      args: [{ name: "project-id", description: "Project ID", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const info = await gitlabManager.getProjectInfo(parseInt(args["project-id"] as string));

          return {
            success: true,
            message: "Project information retrieved successfully",
            data: info,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to get project information: ${error.message}`,
          };
        }
      },
    },
    {
      name: "gitlab:get-user-info",
      description: "Get authenticated user information",
      args: [],
      handler: async () => {
        try {
          const info = await gitlabManager.getUserInfo();

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
      name: "gitlab:import-projects",
      description: "Import projects from GitLab",
      args: [],
      handler: async () => {
        try {
          const importedProjects = await gitlabManager.importProjects();

          return {
            success: true,
            message: `Imported ${importedProjects.length} projects from GitLab`,
            data: importedProjects,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Failed to import projects: ${error.message}`,
          };
        }
      },
    },
    {
      name: "gitlab:export-projects",
      description: "Export projects to JSON",
      args: [],
      handler: async () => {
        const projects = gitlabManager.exportProjects();

        return {
          success: true,
          message: `Exported ${projects.length} projects`,
          data: projects,
        };
      },
    },
    {
      name: "gitlab:import-projects-from-json",
      description: "Import projects from JSON",
      args: [{ name: "projects", description: "Projects as JSON string", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const projects = JSON.parse(args.projects as string);
          const count = gitlabManager.importProjectsFromJson(projects);

          return {
            success: true,
            message: `Imported ${count} projects`,
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
      console.log("GitLab Integration plugin loaded");
    },
    onUnload: async () => {
      console.log("GitLab Integration plugin unloaded");
    },
  },
};

export default plugin;
