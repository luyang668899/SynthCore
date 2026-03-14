import { createPlugin } from "openclaw/plugin-sdk";
import {
  BackupManager,
  BackupOptions,
  RestoreOptions,
  BackupCleanupOptions,
} from "./src/backup-manager.ts";

export const plugin = createPlugin({
  name: "backup-tool",
  version: "1.0.0",
  type: "tool",
  setup: (deps) => {
    const backupManager = new BackupManager();

    deps.tools.registerTool({
      name: "backup:create",
      description: "Create a new backup",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Backup name",
          },
          type: {
            type: "string",
            enum: ["full", "incremental"],
            description: "Backup type",
            default: "full",
          },
          location: {
            type: "string",
            description: "Backup location",
          },
          include: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Directories to include in backup",
          },
          exclude: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Directories to exclude from backup",
          },
          metadata: {
            type: "object",
            description: "Additional backup metadata",
            additionalProperties: true,
          },
        },
      },
      async execute({ name, type, location, include, exclude, metadata }) {
        return await backupManager.createBackup({
          name,
          type,
          location,
          include,
          exclude,
          metadata,
        });
      },
    });

    deps.tools.registerTool({
      name: "backup:restore",
      description: "Restore a backup",
      parameters: {
        type: "object",
        properties: {
          backupId: {
            type: "string",
            description: "Backup ID to restore",
          },
          targetLocation: {
            type: "string",
            description: "Target location for restoration",
          },
          overwrite: {
            type: "boolean",
            description: "Overwrite existing files",
            default: false,
          },
          include: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Files/directories to include in restoration",
          },
          exclude: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Files/directories to exclude from restoration",
          },
        },
        required: ["backupId"],
      },
      async execute({ backupId, targetLocation, overwrite, include, exclude }) {
        return await backupManager.restoreBackup({
          backupId,
          targetLocation,
          overwrite,
          include,
          exclude,
        });
      },
    });

    deps.tools.registerTool({
      name: "backup:list",
      description: "List all backups",
      parameters: {},
      async execute() {
        return await backupManager.listBackups();
      },
    });

    deps.tools.registerTool({
      name: "backup:get",
      description: "Get backup details",
      parameters: {
        type: "object",
        properties: {
          backupId: {
            type: "string",
            description: "Backup ID",
          },
        },
        required: ["backupId"],
      },
      async execute({ backupId }) {
        return await backupManager.getBackup(backupId);
      },
    });

    deps.tools.registerTool({
      name: "backup:delete",
      description: "Delete a backup",
      parameters: {
        type: "object",
        properties: {
          backupId: {
            type: "string",
            description: "Backup ID to delete",
          },
        },
        required: ["backupId"],
      },
      async execute({ backupId }) {
        return await backupManager.deleteBackup(backupId);
      },
    });

    deps.tools.registerTool({
      name: "backup:cleanup",
      description: "Clean up old backups",
      parameters: {
        type: "object",
        properties: {
          keepLast: {
            type: "number",
            description: "Keep last N backups",
          },
          keepDaily: {
            type: "number",
            description: "Keep daily backups for N days",
          },
          keepWeekly: {
            type: "number",
            description: "Keep weekly backups for N weeks",
          },
          keepMonthly: {
            type: "number",
            description: "Keep monthly backups for N months",
          },
        },
      },
      async execute({ keepLast, keepDaily, keepWeekly, keepMonthly }) {
        return await backupManager.cleanupBackups({ keepLast, keepDaily, keepWeekly, keepMonthly });
      },
    });

    deps.tools.registerTool({
      name: "backup:stats",
      description: "Get backup statistics",
      parameters: {},
      async execute() {
        return await backupManager.getBackupStats();
      },
    });

    deps.tools.registerTool({
      name: "backup:validate",
      description: "Validate a backup",
      parameters: {
        type: "object",
        properties: {
          backupId: {
            type: "string",
            description: "Backup ID to validate",
          },
        },
        required: ["backupId"],
      },
      async execute({ backupId }) {
        return await backupManager.validateBackup(backupId);
      },
    });

    return {
      backupManager,
    };
  },
});

export default plugin;
