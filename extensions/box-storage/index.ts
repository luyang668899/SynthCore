import { createPlugin } from "openclaw/plugin-sdk";
import { BoxManager } from "./src/box-manager.ts";

export const plugin = createPlugin({
  name: "box-storage",
  version: "1.0.0",
  type: "storage",
  setup: (deps) => {
    const boxManager = new BoxManager();

    deps.tools.registerTool({
      name: "box:upload-file",
      description: "Upload a file to Box",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "File path in Box",
          },
          content: {
            type: "string",
            description: "File content",
          },
          shared: {
            type: "boolean",
            description: "Whether to share the file",
            default: false,
          },
          permissions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: {
                  type: "string",
                  enum: [
                    "owner",
                    "editor",
                    "viewer",
                    "uploader",
                    "previewer",
                    "previewer-uploader",
                  ],
                },
                type: {
                  type: "string",
                  enum: ["user", "group", "anyone", "company"],
                },
                email: {
                  type: "string",
                  description: "User email (for user type)",
                },
              },
              required: ["role", "type"],
            },
            description: "File permissions",
          },
        },
        required: ["path", "content"],
      },
      async execute({ path, content, shared, permissions }) {
        return await boxManager.uploadFile({ path, content, shared, permissions });
      },
    });

    deps.tools.registerTool({
      name: "box:download-file",
      description: "Download a file from Box",
      parameters: {
        type: "object",
        properties: {
          fileId: {
            type: "string",
            description: "Box file ID",
          },
        },
        required: ["fileId"],
      },
      async execute({ fileId }) {
        const content = await boxManager.downloadFile(fileId);
        return { content: content.toString() };
      },
    });

    deps.tools.registerTool({
      name: "box:create-folder",
      description: "Create a folder in Box",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Folder path in Box",
          },
        },
        required: ["path"],
      },
      async execute({ path }) {
        return await boxManager.createFolder(path);
      },
    });

    deps.tools.registerTool({
      name: "box:list-folder",
      description: "List files and folders in a Box folder",
      parameters: {
        type: "object",
        properties: {
          folderId: {
            type: "string",
            description: 'Box folder ID (use "root" for root folder)',
            default: "root",
          },
        },
      },
      async execute({ folderId }) {
        return await boxManager.listFolder(folderId);
      },
    });

    deps.tools.registerTool({
      name: "box:search",
      description: "Search files and folders in Box",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query",
          },
          fileType: {
            type: "string",
            enum: ["file", "folder"],
            description: "File type to search for",
          },
          sortBy: {
            type: "string",
            enum: ["name", "date", "size"],
            description: "Sort by field",
          },
          sortOrder: {
            type: "string",
            enum: ["asc", "desc"],
            description: "Sort order",
          },
          limit: {
            type: "number",
            description: "Maximum number of results",
          },
        },
        required: ["query"],
      },
      async execute({ query, fileType, sortBy, sortOrder, limit }) {
        return await boxManager.search({ query, fileType, sortBy, sortOrder, limit });
      },
    });

    deps.tools.registerTool({
      name: "box:authenticate",
      description: "Authenticate with Box",
      parameters: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            description: "Box access token",
          },
          refreshToken: {
            type: "string",
            description: "Box refresh token",
          },
        },
        required: ["accessToken", "refreshToken"],
      },
      async execute({ accessToken, refreshToken }) {
        return await boxManager.authenticate(accessToken, refreshToken);
      },
    });

    deps.tools.registerTool({
      name: "box:is-authenticated",
      description: "Check if authenticated with Box",
      parameters: {},
      async execute() {
        return await boxManager.isAuthenticated();
      },
    });

    deps.tools.registerTool({
      name: "box:revoke-authentication",
      description: "Revoke Box authentication",
      parameters: {},
      async execute() {
        await boxManager.revokeAuthentication();
        return { success: true };
      },
    });

    return {
      boxManager,
    };
  },
});

export default plugin;
