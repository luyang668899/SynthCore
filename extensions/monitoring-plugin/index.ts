import { OpenClawPlugin, PluginRuntime, Tool, ToolContext } from "openclaw/plugin-sdk/core";
import {
  MonitoringManager,
  SystemInfo,
  HealthCheckResult,
  DiagnosticResult,
} from "./src/monitoring-manager";

export class MonitoringPlugin implements OpenClawPlugin {
  private runtime: PluginRuntime;
  private monitoringManager: MonitoringManager;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.monitoringManager = new MonitoringManager(runtime);
  }

  async init() {
    await this.monitoringManager.init();
    this.runtime.log("Monitoring plugin initialized");
  }

  getTools(): Tool[] {
    return [
      {
        name: "monitoring_system_info",
        description: "Get system information",
        parameters: {},
        handler: async () => {
          return await this.monitoringManager.getSystemInfo();
        },
      },
      {
        name: "monitoring_health_check",
        description: "Run health check",
        parameters: {},
        handler: async () => {
          return await this.monitoringManager.runHealthCheck();
        },
      },
      {
        name: "monitoring_diagnostics",
        description: "Run diagnostics",
        parameters: {},
        handler: async () => {
          return await this.monitoringManager.runDiagnostics();
        },
      },
      {
        name: "monitoring_config",
        description: "Get or update monitoring configuration",
        parameters: {
          type: "object",
          properties: {
            config: {
              type: "object",
              description: "Monitoring configuration (optional)",
            },
          },
        },
        handler: async (ctx: ToolContext) => {
          const { config } = ctx.parameters || {};
          if (config) {
            return this.monitoringManager.updateConfig(config);
          } else {
            return this.monitoringManager.getConfig();
          }
        },
      },
      {
        name: "monitoring_add_metric",
        description: "Add a metric",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Metric name",
            },
            value: {
              type: "number",
              description: "Metric value",
            },
          },
          required: ["name", "value"],
        },
        handler: async (ctx: ToolContext) => {
          const { name, value } = ctx.parameters;
          this.monitoringManager.addMetric(name, value);
          return { success: true, message: `Metric ${name} added with value ${value}` };
        },
      },
      {
        name: "monitoring_get_metrics",
        description: "Get metrics",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Metric name (optional, leave empty to get all metrics)",
            },
          },
        },
        handler: async (ctx: ToolContext) => {
          const { name } = ctx.parameters || {};
          return this.monitoringManager.getMetrics(name);
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

export default MonitoringPlugin;
