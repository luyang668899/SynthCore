import { OpenClawPlugin, PluginRuntime, Tool, ToolContext } from "../../../dist/plugin-sdk/core.js";
import MonitoringPlugin from "./index.js";
import { MonitoringManager } from "./src/monitoring-manager.js";

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
      pluginId: "monitoring-plugin",
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

async function testMonitoringPlugin() {
  console.log("=== Testing monitoring plugin ===\n");

  // Create mock runtime
  const runtime = createMockRuntime();

  // Create plugin instance
  const plugin = new MonitoringPlugin(runtime);

  // Initialize plugin
  await plugin.init();

  // Test plugin registration
  console.log("=== Testing plugin registration ===");
  const tools = plugin.getTools();
  tools.forEach((tool) => {
    console.log(`Registered tool: ${tool.name}`);
  });
  console.log("[INFO] Monitoring plugin registered");
  console.log("Plugin registered successfully\n");

  // Test system info
  console.log("=== Testing system info ===");
  const systemInfoTool = tools.find((tool) => tool.name === "monitoring_system_info");
  if (systemInfoTool) {
    const systemInfo = await systemInfoTool.handler({ parameters: {} });
    console.log("System info:", {
      system: systemInfo.system,
      cpu: systemInfo.cpu,
      memory: systemInfo.memory,
      disk: systemInfo.disk,
      network: systemInfo.network,
      load: systemInfo.load,
      processes: systemInfo.processes,
    });
  }

  // Test health check
  console.log("\n=== Testing health check ===");
  const healthCheckTool = tools.find((tool) => tool.name === "monitoring_health_check");
  if (healthCheckTool) {
    const healthCheckResult = await healthCheckTool.handler({ parameters: {} });
    console.log("Health check result:", healthCheckResult);
  }

  // Test diagnostics
  console.log("\n=== Testing diagnostics ===");
  const diagnosticsTool = tools.find((tool) => tool.name === "monitoring_diagnostics");
  if (diagnosticsTool) {
    const diagnosticResult = await diagnosticsTool.handler({ parameters: {} });
    console.log("Diagnostic result:", diagnosticResult);
  }

  // Test add metric
  console.log("\n=== Testing add metric ===");
  const addMetricTool = tools.find((tool) => tool.name === "monitoring_add_metric");
  if (addMetricTool) {
    const addMetricResult = await addMetricTool.handler({
      parameters: {
        name: "cpu_usage",
        value: 35.5,
      },
    });
    console.log("Add metric result:", addMetricResult);
  }

  // Test get metrics
  console.log("\n=== Testing get metrics ===");
  const getMetricsTool = tools.find((tool) => tool.name === "monitoring_get_metrics");
  if (getMetricsTool) {
    const getMetricsResult = await getMetricsTool.handler({ parameters: {} });
    console.log("Get metrics result:", getMetricsResult);
  }

  // Test config update
  console.log("\n=== Testing config update ===");
  const configTool = tools.find((tool) => tool.name === "monitoring_config");
  if (configTool) {
    // Get current config
    const currentConfig = await configTool.handler({ parameters: {} });
    console.log("Current config:", currentConfig);

    // Update config
    const updatedConfig = await configTool.handler({
      parameters: {
        config: {
          interval: 30,
          thresholds: {
            cpu: 70,
            memory: 70,
            disk: 70,
          },
        },
      },
    });
    console.log("Updated config:", updatedConfig);
  }

  console.log("\n=== All tests completed ===");
}

testMonitoringPlugin().catch(console.error);
