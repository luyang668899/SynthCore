import { OpenClawPlugin, PluginRuntime, Tool, ToolContext } from "openclaw/plugin-sdk/core";
import { StorageManager, StorageOperationResult } from "./src/storage-manager";

export class StoragePlugin implements OpenClawPlugin {
  private runtime: PluginRuntime;
  private storageManager: StorageManager;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.storageManager = new StorageManager(runtime);
  }

  async init() {
    await this.storageManager.init();
    this.runtime.log("Storage plugin initialized");
  }

  getTools(): Tool[] {
    return [
      {
        name: "storage_upload",
        description: "Upload a file to storage",
        parameters: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "Storage provider (aws, azure, gcp)",
            },
            fileName: {
              type: "string",
              description: "File name",
            },
            contentType: {
              type: "string",
              description: "Content type",
            },
            content: {
              type: "string",
              description: "File content (base64 encoded)",
            },
          },
          required: ["provider", "fileName", "contentType", "content"],
        },
        handler: async (ctx: ToolContext) => {
          const { provider, fileName, contentType, content } = ctx.parameters;
          const fileBuffer = Buffer.from(content, "base64");

          const result = await this.storageManager.uploadFile(
            provider,
            fileBuffer,
            fileName,
            contentType,
          );
          return result;
        },
      },
      {
        name: "storage_download",
        description: "Download a file from storage",
        parameters: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "Storage provider (aws, azure, gcp)",
            },
            fileName: {
              type: "string",
              description: "File name",
            },
          },
          required: ["provider", "fileName"],
        },
        handler: async (ctx: ToolContext) => {
          const { provider, fileName } = ctx.parameters;
          const result = await this.storageManager.downloadFile(provider, fileName);

          if (result.success && result.data) {
            result.data.content = result.data.content.toString("base64");
          }

          return result;
        },
      },
      {
        name: "storage_list",
        description: "List files in storage",
        parameters: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "Storage provider (aws, azure, gcp)",
            },
            prefix: {
              type: "string",
              description: "File prefix (optional)",
            },
          },
          required: ["provider"],
        },
        handler: async (ctx: ToolContext) => {
          const { provider, prefix } = ctx.parameters;
          return await this.storageManager.listFiles(provider, prefix);
        },
      },
      {
        name: "storage_delete",
        description: "Delete a file from storage",
        parameters: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "Storage provider (aws, azure, gcp)",
            },
            fileName: {
              type: "string",
              description: "File name",
            },
          },
          required: ["provider", "fileName"],
        },
        handler: async (ctx: ToolContext) => {
          const { provider, fileName } = ctx.parameters;
          return await this.storageManager.deleteFile(provider, fileName);
        },
      },
      {
        name: "storage_get_info",
        description: "Get file information",
        parameters: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              description: "Storage provider (aws, azure, gcp)",
            },
            fileName: {
              type: "string",
              description: "File name",
            },
          },
          required: ["provider", "fileName"],
        },
        handler: async (ctx: ToolContext) => {
          const { provider, fileName } = ctx.parameters;
          return await this.storageManager.getFileInfo(provider, fileName);
        },
      },
      {
        name: "storage_config",
        description: "Get or update storage configuration",
        parameters: {
          type: "object",
          properties: {
            config: {
              type: "object",
              description: "Storage configuration (optional)",
            },
          },
        },
        handler: async (ctx: ToolContext) => {
          const { config } = ctx.parameters || {};
          if (config) {
            return this.storageManager.updateConfig(config);
          } else {
            return this.storageManager.getConfig();
          }
        },
      },
      {
        name: "storage_providers",
        description: "Get enabled storage providers",
        parameters: {},
        handler: async () => {
          return this.storageManager.getEnabledProviders();
        },
      },
    ];
  }

  getCommands() {
    return [];
  }

  getEventHandlers() {
    return [];
  }
}

export default StoragePlugin;
