import { OneDriveManager } from "./src/onedrive-manager";

export default {
  name: "onedrive-storage",
  version: "1.0.0",
  description: "OneDrive storage plugin for OpenClaw",

  async initialize() {
    console.log("OneDrive storage plugin initialized");
  },

  async registerTools(tools: any) {
    const oneDriveManager = new OneDriveManager();

    // 认证相关工具
    tools.register({
      name: "oneDriveAuthenticate",
      description: "OneDrive 认证",
      parameters: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            description: "OneDrive 访问令牌",
          },
          refreshToken: {
            type: "string",
            description: "OneDrive 刷新令牌（可选）",
          },
        },
        required: ["accessToken"],
      },
      handler: async (args: { accessToken: string; refreshToken?: string }) => {
        const result = await oneDriveManager.authenticate(args.accessToken, args.refreshToken);
        return { success: result };
      },
    });

    tools.register({
      name: "oneDriveIsAuthenticated",
      description: "检查 OneDrive 认证状态",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return { authenticated: await oneDriveManager.isAuthenticated() };
      },
    });

    tools.register({
      name: "oneDriveRevokeAuthentication",
      description: "撤销 OneDrive 认证",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        await oneDriveManager.revokeAuthentication();
        return { success: true };
      },
    });

    tools.register({
      name: "oneDriveRefreshAccessToken",
      description: "刷新 OneDrive 访问令牌",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        const newToken = await oneDriveManager.refreshAccessToken();
        return { accessToken: newToken };
      },
    });

    // 文件操作工具
    tools.register({
      name: "oneDriveUploadFile",
      description: "上传文件到 OneDrive",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "文件路径",
          },
          content: {
            type: "string",
            description: "文件内容",
          },
          overwrite: {
            type: "boolean",
            description: "是否覆盖现有文件（可选）",
          },
          shared: {
            type: "boolean",
            description: "是否共享（可选）",
          },
          permissions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: {
                  type: "string",
                  enum: ["owner", "writer", "reader"],
                  description: "权限角色",
                },
                type: {
                  type: "string",
                  enum: ["user", "group", "organization", "anyone"],
                  description: "权限类型",
                },
                email: {
                  type: "string",
                  description: "邮箱地址（可选）",
                },
              },
              required: ["role", "type"],
            },
            description: "权限列表（可选）",
          },
        },
        required: ["path", "content"],
      },
      handler: async (args: {
        path: string;
        content: string;
        overwrite?: boolean;
        shared?: boolean;
        permissions?: any[];
      }) => {
        try {
          return await oneDriveManager.uploadFile({
            path: args.path,
            content: args.content,
            overwrite: args.overwrite,
            shared: args.shared,
            permissions: args.permissions,
          });
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "oneDriveDownloadFile",
      description: "从 OneDrive 下载文件",
      parameters: {
        type: "object",
        properties: {
          fileId: {
            type: "string",
            description: "文件 ID",
          },
        },
        required: ["fileId"],
      },
      handler: async (args: { fileId: string }) => {
        try {
          const content = await oneDriveManager.downloadFile(args.fileId);
          return { content: content.toString() };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "oneDriveDeleteFile",
      description: "删除 OneDrive 文件",
      parameters: {
        type: "object",
        properties: {
          fileId: {
            type: "string",
            description: "文件 ID",
          },
        },
        required: ["fileId"],
      },
      handler: async (args: { fileId: string }) => {
        try {
          const result = await oneDriveManager.deleteFile(args.fileId);
          return { success: result };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "oneDriveGetFileMetadata",
      description: "获取 OneDrive 文件元数据",
      parameters: {
        type: "object",
        properties: {
          fileId: {
            type: "string",
            description: "文件 ID",
          },
        },
        required: ["fileId"],
      },
      handler: async (args: { fileId: string }) => {
        try {
          const metadata = await oneDriveManager.getFileMetadata(args.fileId);
          if (!metadata) {
            return { error: "文件未找到" };
          }
          return metadata;
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "oneDriveUpdateFilePermissions",
      description: "更新 OneDrive 文件权限",
      parameters: {
        type: "object",
        properties: {
          fileId: {
            type: "string",
            description: "文件 ID",
          },
          permissions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: {
                  type: "string",
                  enum: ["owner", "writer", "reader"],
                  description: "权限角色",
                },
                type: {
                  type: "string",
                  enum: ["user", "group", "organization", "anyone"],
                  description: "权限类型",
                },
                email: {
                  type: "string",
                  description: "邮箱地址（可选）",
                },
              },
              required: ["role", "type"],
            },
            description: "权限列表",
          },
        },
        required: ["fileId", "permissions"],
      },
      handler: async (args: { fileId: string; permissions: any[] }) => {
        try {
          const file = await oneDriveManager.updateFilePermissions(args.fileId, args.permissions);
          if (!file) {
            return { error: "文件未找到" };
          }
          return file;
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    // 文件夹操作工具
    tools.register({
      name: "oneDriveCreateFolder",
      description: "在 OneDrive 创建文件夹",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "文件夹路径",
          },
        },
        required: ["path"],
      },
      handler: async (args: { path: string }) => {
        try {
          return await oneDriveManager.createFolder(args.path);
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "oneDriveListFolder",
      description: "列出 OneDrive 文件夹内容",
      parameters: {
        type: "object",
        properties: {
          folderId: {
            type: "string",
            description: "文件夹 ID（可选，默认为 root）",
          },
        },
      },
      handler: async (args: { folderId?: string }) => {
        try {
          return await oneDriveManager.listFolder(args.folderId);
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "oneDriveDeleteFolder",
      description: "删除 OneDrive 文件夹",
      parameters: {
        type: "object",
        properties: {
          folderId: {
            type: "string",
            description: "文件夹 ID",
          },
        },
        required: ["folderId"],
      },
      handler: async (args: { folderId: string }) => {
        try {
          const result = await oneDriveManager.deleteFolder(args.folderId);
          return { success: result };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    // 搜索工具
    tools.register({
      name: "oneDriveSearch",
      description: "在 OneDrive 中搜索文件",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词",
          },
          path: {
            type: "string",
            description: "搜索路径（可选，默认为根目录）",
          },
          fileType: {
            type: "string",
            enum: ["file", "folder", "all"],
            description: "文件类型（可选，默认为所有类型）",
          },
          maxResults: {
            type: "number",
            description: "最大结果数（可选，默认为 10）",
          },
        },
        required: ["query"],
      },
      handler: async (args: {
        query: string;
        path?: string;
        fileType?: "file" | "folder" | "all";
        maxResults?: number;
      }) => {
        try {
          return await oneDriveManager.search({
            query: args.query,
            path: args.path,
            fileType: args.fileType,
            maxResults: args.maxResults,
          });
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });
  },
};
