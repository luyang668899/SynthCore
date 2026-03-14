import { DropboxManager } from "./src/dropbox-manager";

export default {
  name: "dropbox-storage",
  version: "1.0.0",
  description: "Dropbox storage plugin for OpenClaw",

  async initialize() {
    console.log("Dropbox storage plugin initialized");
  },

  async registerTools(tools: any) {
    const dropboxManager = new DropboxManager();

    // 认证相关工具
    tools.register({
      name: "dropboxAuthenticate",
      description: "Dropbox 认证",
      parameters: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            description: "Dropbox 访问令牌",
          },
        },
        required: ["accessToken"],
      },
      handler: async (args: { accessToken: string }) => {
        const result = await dropboxManager.authenticate(args.accessToken);
        return { success: result };
      },
    });

    tools.register({
      name: "dropboxIsAuthenticated",
      description: "检查 Dropbox 认证状态",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return { authenticated: await dropboxManager.isAuthenticated() };
      },
    });

    tools.register({
      name: "dropboxRevokeAuthentication",
      description: "撤销 Dropbox 认证",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        await dropboxManager.revokeAuthentication();
        return { success: true };
      },
    });

    // 文件操作工具
    tools.register({
      name: "dropboxUploadFile",
      description: "上传文件到 Dropbox",
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
        },
        required: ["path", "content"],
      },
      handler: async (args: {
        path: string;
        content: string;
        overwrite?: boolean;
        shared?: boolean;
      }) => {
        try {
          return await dropboxManager.uploadFile({
            path: args.path,
            content: args.content,
            overwrite: args.overwrite,
            shared: args.shared,
          });
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "dropboxDownloadFile",
      description: "从 Dropbox 下载文件",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "文件路径",
          },
        },
        required: ["path"],
      },
      handler: async (args: { path: string }) => {
        try {
          const content = await dropboxManager.downloadFile(args.path);
          return { content: content.toString() };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "dropboxDeleteFile",
      description: "删除 Dropbox 文件",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "文件路径",
          },
        },
        required: ["path"],
      },
      handler: async (args: { path: string }) => {
        try {
          const result = await dropboxManager.deleteFile(args.path);
          return { success: result };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "dropboxGetFileMetadata",
      description: "获取 Dropbox 文件元数据",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "文件路径",
          },
        },
        required: ["path"],
      },
      handler: async (args: { path: string }) => {
        try {
          const metadata = await dropboxManager.getFileMetadata(args.path);
          if (!metadata) {
            return { error: "文件未找到" };
          }
          return metadata;
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    // 文件夹操作工具
    tools.register({
      name: "dropboxCreateFolder",
      description: "在 Dropbox 创建文件夹",
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
          return await dropboxManager.createFolder(args.path);
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "dropboxListFolder",
      description: "列出 Dropbox 文件夹内容",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "文件夹路径（可选，默认为根目录）",
          },
        },
      },
      handler: async (args: { path?: string }) => {
        try {
          return await dropboxManager.listFolder(args.path);
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "dropboxDeleteFolder",
      description: "删除 Dropbox 文件夹",
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
          const result = await dropboxManager.deleteFolder(args.path);
          return { success: result };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    // 搜索工具
    tools.register({
      name: "dropboxSearch",
      description: "在 Dropbox 中搜索文件",
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
          return await dropboxManager.search({
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
