import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import channelSyncPlugin from "./index.js";
import { SyncManager, SyncConfig, Message } from "./src/sync-manager.js";

// 模拟插件API
const mockApi: Partial<OpenClawPluginApi> = {
  registerTool: (tool) => {
    console.log(`Registered tool: ${tool.name}`);
  },
  logger: {
    info: (message: string) => console.log(`[INFO] ${message}`),
    error: (message: string) => console.error(`[ERROR] ${message}`),
    debug: (message: string) => console.log(`[DEBUG] ${message}`),
    warn: (message: string) => console.log(`[WARN] ${message}`),
  },
};

// 测试插件注册
console.log("=== Testing plugin registration ===");
channelSyncPlugin.register(mockApi as OpenClawPluginApi);
console.log("Plugin registered successfully");

// 测试同步管理器
console.log("\n=== Testing sync manager ===");
const config: SyncConfig = {
  syncEnabled: true,
  syncInterval: 5000,
  channels: ["telegram", "discord"],
};

const syncManager = new SyncManager(mockApi as OpenClawPluginApi, config);
syncManager.start();
console.log("Sync manager started");

// 测试同步状态
const state = syncManager.getState();
console.log("Sync state:", JSON.stringify(state, null, 2));

// 测试更新配置
syncManager.updateConfig({ syncInterval: 10000 });
console.log("Config updated");

// 测试停止同步
syncManager.stop();
console.log("Sync manager stopped");

console.log("\n=== All tests completed ===");
