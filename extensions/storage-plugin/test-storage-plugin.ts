import { OpenClawPlugin, PluginRuntime, Tool, ToolContext } from "../../../dist/plugin-sdk/core.js";
import StoragePlugin from "./index.js";
import { StorageManager } from "./src/storage-manager.js";

// Mock runtime implementation
class MockRuntime implements PluginRuntime {
  log(message: string) {
    console.log(`[INFO] ${message}`);
  }
  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }
  debug(message: string) {
    console.log(`[DEBUG] ${message}`);
  }
  getConfig(key: string) {
    return undefined;
  }
  setConfig(key: string, value: any) {
    // Do nothing
  }
  getSecret(key: string) {
    return undefined;
  }
  setSecret(key: string, value: string) {
    // Do nothing
  }
  async executeTool(name: string, parameters: any) {
    return null;
  }
  async emitEvent(event: string, data: any) {
    // Do nothing
  }
  onEvent(event: string, handler: (data: any) => void) {
    // Do nothing
    return () => {};
  }
  getPluginContext() {
    return {
      pluginId: "storage-plugin",
      version: "2026.2.17",
    };
  }
  getApiClient() {
    return {
      request: async (options: any) => {
        return { data: {} };
      },
    } as any;
  }
}

function createMockRuntime() {
  return new MockRuntime();
}

async function testStoragePlugin() {
  console.log("=== Testing storage plugin ===\n");

  // Create mock runtime
  const runtime = createMockRuntime();

  // Create plugin instance
  const plugin = new StoragePlugin(runtime);

  // Initialize plugin
  await plugin.init();

  // Test plugin registration
  console.log("=== Testing plugin registration ===");
  const tools = plugin.getTools();
  tools.forEach((tool) => {
    console.log(`Registered tool: ${tool.name}`);
  });
  console.log("[INFO] Storage plugin registered");
  console.log("Plugin registered successfully\n");

  // Test storage manager
  console.log("=== Testing storage manager ===");

  // Get storage providers tool
  const getProvidersTool = tools.find((tool) => tool.name === "storage_providers");
  if (getProvidersTool) {
    const providers = await getProvidersTool.handler({ parameters: {} });
    console.log("Enabled providers:", providers);
  }

  // Test file upload
  console.log("\n=== Testing file upload ===");
  const uploadTool = tools.find((tool) => tool.name === "storage_upload");
  if (uploadTool) {
    const testContent = Buffer.from("Hello, World!").toString("base64");
    const uploadResult = await uploadTool.handler({
      parameters: {
        provider: "aws",
        fileName: "test.txt",
        contentType: "text/plain",
        content: testContent,
      },
    });
    console.log("Upload result:", uploadResult);
  }

  // Test file download
  console.log("\n=== Testing file download ===");
  const downloadTool = tools.find((tool) => tool.name === "storage_download");
  if (downloadTool) {
    const downloadResult = await downloadTool.handler({
      parameters: {
        provider: "aws",
        fileName: "test.txt",
      },
    });
    console.log("Download result:", downloadResult);
  }

  // Test list files
  console.log("\n=== Testing list files ===");
  const listTool = tools.find((tool) => tool.name === "storage_list");
  if (listTool) {
    const listResult = await listTool.handler({
      parameters: {
        provider: "aws",
      },
    });
    console.log("List files result:", listResult);
  }

  // Test get file info
  console.log("\n=== Testing get file info ===");
  const getInfoTool = tools.find((tool) => tool.name === "storage_get_info");
  if (getInfoTool) {
    const infoResult = await getInfoTool.handler({
      parameters: {
        provider: "aws",
        fileName: "test.txt",
      },
    });
    console.log("Get file info result:", infoResult);
  }

  // Test delete file
  console.log("\n=== Testing delete file ===");
  const deleteTool = tools.find((tool) => tool.name === "storage_delete");
  if (deleteTool) {
    const deleteResult = await deleteTool.handler({
      parameters: {
        provider: "aws",
        fileName: "test.txt",
      },
    });
    console.log("Delete file result:", deleteResult);
  }

  // Test config update
  console.log("\n=== Testing config update ===");
  const configTool = tools.find((tool) => tool.name === "storage_config");
  if (configTool) {
    // Get current config
    const currentConfig = await configTool.handler({ parameters: {} });
    console.log("Current config:", currentConfig);

    // Update config
    const updatedConfig = await configTool.handler({
      parameters: {
        config: {
          defaultProvider: "azure",
          providers: {
            aws: {
              enabled: true,
              accessKeyId: "test-access-key",
              secretAccessKey: "test-secret-key",
              region: "us-west-2",
              bucket: "test-bucket",
            },
          },
        },
      },
    });
    console.log("Updated config:", updatedConfig);
  }

  console.log("\n=== All tests completed ===");
}

testStoragePlugin().catch(console.error);
