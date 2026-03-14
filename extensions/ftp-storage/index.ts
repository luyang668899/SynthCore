import { createPlugin } from "openclaw/plugin-sdk";
import { FtpManager, FtpConnectionOptions } from "./src/ftp-manager.ts";

export const plugin = createPlugin({
  name: "ftp-storage",
  version: "1.0.0",
  type: "storage",
  setup: (deps) => {
    const ftpManager = new FtpManager();

    deps.tools.registerTool({
      name: "ftp:connect",
      description: "Connect to FTP/SFTP server",
      parameters: {
        type: "object",
        properties: {
          host: {
            type: "string",
            description: "Server hostname or IP address",
          },
          port: {
            type: "number",
            description: "Server port (default: 21 for FTP, 22 for SFTP)",
            default: 21,
          },
          username: {
            type: "string",
            description: "Username for authentication",
          },
          password: {
            type: "string",
            description: "Password for authentication (optional if using private key)",
          },
          privateKey: {
            type: "string",
            description: "Private key for SFTP authentication (optional)",
          },
          type: {
            type: "string",
            enum: ["ftp", "sftp"],
            description: "Connection type",
            default: "ftp",
          },
          secure: {
            type: "boolean",
            description: "Use secure connection (FTPS)",
            default: false,
          },
        },
        required: ["host", "username"],
      },
      async execute({ host, port, username, password, privateKey, type, secure }) {
        return await ftpManager.connect({
          host,
          port,
          username,
          password,
          privateKey,
          type,
          secure,
        });
      },
    });

    deps.tools.registerTool({
      name: "ftp:disconnect",
      description: "Disconnect from FTP/SFTP server",
      parameters: {},
      async execute() {
        await ftpManager.disconnect();
        return { success: true };
      },
    });

    deps.tools.registerTool({
      name: "ftp:is-connected",
      description: "Check if connected to FTP/SFTP server",
      parameters: {},
      async execute() {
        return await ftpManager.isConnected();
      },
    });

    deps.tools.registerTool({
      name: "ftp:upload-file",
      description: "Upload a file to FTP/SFTP server",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "File path on the server",
          },
          content: {
            type: "string",
            description: "File content",
          },
          permissions: {
            type: "string",
            description: 'File permissions (e.g., "-rw-r--r--")',
          },
        },
        required: ["path", "content"],
      },
      async execute({ path, content, permissions }) {
        return await ftpManager.uploadFile({ path, content, permissions });
      },
    });

    deps.tools.registerTool({
      name: "ftp:download-file",
      description: "Download a file from FTP/SFTP server",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "File path on the server",
          },
        },
        required: ["path"],
      },
      async execute({ path }) {
        const content = await ftpManager.downloadFile(path);
        return { content: content.toString() };
      },
    });

    deps.tools.registerTool({
      name: "ftp:create-folder",
      description: "Create a folder on FTP/SFTP server",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Folder path on the server",
          },
        },
        required: ["path"],
      },
      async execute({ path }) {
        return await ftpManager.createFolder(path);
      },
    });

    deps.tools.registerTool({
      name: "ftp:list-folder",
      description: "List files and folders on FTP/SFTP server",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Folder path on the server",
            default: "/",
          },
        },
      },
      async execute({ path }) {
        return await ftpManager.listFolder(path);
      },
    });

    deps.tools.registerTool({
      name: "ftp:delete-file",
      description: "Delete a file on FTP/SFTP server",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "File path on the server",
          },
        },
        required: ["path"],
      },
      async execute({ path }) {
        return await ftpManager.deleteFile(path);
      },
    });

    deps.tools.registerTool({
      name: "ftp:rename-file",
      description: "Rename a file on FTP/SFTP server",
      parameters: {
        type: "object",
        properties: {
          oldPath: {
            type: "string",
            description: "Old file path on the server",
          },
          newPath: {
            type: "string",
            description: "New file path on the server",
          },
        },
        required: ["oldPath", "newPath"],
      },
      async execute({ oldPath, newPath }) {
        return await ftpManager.renameFile(oldPath, newPath);
      },
    });

    deps.tools.registerTool({
      name: "ftp:change-permissions",
      description: "Change permissions of a file on FTP/SFTP server",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "File path on the server",
          },
          permissions: {
            type: "string",
            description: 'New permissions (e.g., "-rw-r--r--")',
          },
        },
        required: ["path", "permissions"],
      },
      async execute({ path, permissions }) {
        return await ftpManager.changePermissions(path, permissions);
      },
    });

    deps.tools.registerTool({
      name: "ftp:search",
      description: "Search files and folders on FTP/SFTP server",
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
        return await ftpManager.search({ query, fileType, sortBy, sortOrder, limit });
      },
    });

    return {
      ftpManager,
    };
  },
});

export default plugin;
