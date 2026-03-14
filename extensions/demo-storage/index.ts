import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";

// 模拟存储数据
const demoStorage: Record<string, string> = {};

const demoStoragePlugin = {
  id: "demo-storage",
  name: "Demo Storage",
  description: "Demo storage plugin for testing",
  kind: "memory",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    // 注册存储写入工具
    api.registerTool({
      name: "demo_storage_write",
      label: "Demo Storage Write",
      description: "Write data to demo storage",
      parameters: Type.Object({
        key: Type.String({ description: "Storage key" }),
        value: Type.String({ description: "Storage value" }),
      }),
      async execute(_toolCallId, params) {
        const key = String(params.key || "").trim();
        const value = String(params.value || "").trim();

        if (!key) {
          return {
            content: [{ type: "text" as const, text: "Error: key is required" }],
            details: { error: "key is required" },
          };
        }

        demoStorage[key] = value;

        return {
          content: [{ type: "text" as const, text: `Data written to key: ${key}` }],
          details: { success: true, key, value },
        };
      },
    });

    // 注册存储读取工具
    api.registerTool({
      name: "demo_storage_read",
      label: "Demo Storage Read",
      description: "Read data from demo storage",
      parameters: Type.Object({
        key: Type.String({ description: "Storage key" }),
      }),
      async execute(_toolCallId, params) {
        const key = String(params.key || "").trim();

        if (!key) {
          return {
            content: [{ type: "text" as const, text: "Error: key is required" }],
            details: { error: "key is required" },
          };
        }

        const value = demoStorage[key];

        if (value === undefined) {
          return {
            content: [{ type: "text" as const, text: `Key not found: ${key}` }],
            details: { found: false, key },
          };
        }

        return {
          content: [{ type: "text" as const, text: `Value for key ${key}: ${value}` }],
          details: { found: true, key, value },
        };
      },
    });

    // 注册存储列表工具
    api.registerTool({
      name: "demo_storage_list",
      label: "Demo Storage List",
      description: "List all keys in demo storage",
      parameters: Type.Object({}),
      async execute(_toolCallId) {
        const keys = Object.keys(demoStorage);

        return {
          content: [{ type: "text" as const, text: `Storage keys: ${keys.join(", ")}` }],
          details: { keys },
        };
      },
    });

    // 注册 CLI 命令
    api.registerCli(
      ({ program }) => {
        const demoStorageCmd = program.command("demo-storage").description("Demo storage commands");

        demoStorageCmd
          .command("write <key> <value>")
          .description("Write data to demo storage")
          .action((key, value) => {
            demoStorage[key] = value;
            console.log(`Wrote ${value} to ${key}`);
          });

        demoStorageCmd
          .command("read <key>")
          .description("Read data from demo storage")
          .action((key) => {
            const value = demoStorage[key];
            if (value !== undefined) {
              console.log(`${key}: ${value}`);
            } else {
              console.log(`Key not found: ${key}`);
            }
          });

        demoStorageCmd
          .command("list")
          .description("List all keys")
          .action(() => {
            const keys = Object.keys(demoStorage);
            console.log("Storage keys:");
            keys.forEach((key) => console.log(`- ${key}`));
          });
      },
      { commands: ["demo-storage"] },
    );
  },
};

export default demoStoragePlugin;
