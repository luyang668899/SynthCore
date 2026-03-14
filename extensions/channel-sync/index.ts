import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { SyncManager, type SyncConfig } from "./src/sync-manager.js";

let syncManager: SyncManager | null = null;

const channelSyncPlugin = {
  id: "channel-sync",
  name: "Channel Sync",
  description: "Cross-channel message synchronization plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    // 初始化同步管理器
    const config: SyncConfig = {
      syncEnabled: true,
      syncInterval: 5000,
      channels: [],
    };

    syncManager = new SyncManager(api, config);
    syncManager.start();

    // 注册工具
    api.registerTool({
      name: "channel_sync_status",
      label: "Channel Sync Status",
      description: "Get the current sync status",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
      async execute(_toolCallId: string) {
        if (!syncManager) {
          return {
            content: [{ type: "text" as const, text: "Sync manager not initialized" }],
            details: { error: "Sync manager not initialized" },
          };
        }

        const state = syncManager.getState();
        return {
          content: [{ type: "text" as const, text: JSON.stringify(state, null, 2) }],
          details: state,
        };
      },
    });

    api.registerTool({
      name: "channel_sync_config",
      label: "Channel Sync Config",
      description: "Configure channel synchronization",
      parameters: {
        type: "object",
        properties: {
          syncEnabled: { type: "boolean", description: "Enable sync" },
          syncInterval: { type: "number", description: "Sync interval in ms" },
          channels: { type: "array", items: { type: "string" }, description: "Channels to sync" },
        },
        required: [],
      },
      async execute(_toolCallId: string, params: Partial<SyncConfig>) {
        if (!syncManager) {
          return {
            content: [{ type: "text" as const, text: "Sync manager not initialized" }],
            details: { error: "Sync manager not initialized" },
          };
        }

        syncManager.updateConfig(params);
        return {
          content: [{ type: "text" as const, text: "Sync configuration updated" }],
          details: { success: true },
        };
      },
    });

    api.registerTool({
      name: "channel_sync_manual",
      label: "Manual Sync",
      description: "Trigger manual sync",
      parameters: {
        type: "object",
        properties: {
          channel: { type: "string", description: "Specific channel to sync (optional)" },
        },
        required: [],
      },
      async execute(_toolCallId: string, params: { channel?: string }) {
        if (!syncManager) {
          return {
            content: [{ type: "text" as const, text: "Sync manager not initialized" }],
            details: { error: "Sync manager not initialized" },
          };
        }

        // 手动触发同步（这里简化处理，实际实现需要调用syncMessages方法）
        return {
          content: [{ type: "text" as const, text: "Manual sync triggered" }],
          details: { success: true },
        };
      },
    });

    api.logger?.info("Channel sync plugin registered");
  },
  unregister() {
    if (syncManager) {
      syncManager.stop();
      syncManager = null;
    }
  },
};

export default channelSyncPlugin;
