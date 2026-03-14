import { PluginRuntime } from "openclaw/plugin-sdk/core";

// Mock systeminformation import for demo purposes
// In a real implementation, we would import the actual systeminformation package
const si = {
  system: async () => ({
    manufacturer: "OpenClaw Inc.",
    model: "Development Machine",
    version: "1.0.0",
    serial: "DEV-12345",
    uuid: "12345678-1234-1234-1234-123456789012",
  }),
  cpu: async () => ({
    manufacturer: "Intel",
    brand: "Core i7",
    speed: 3.6,
    cores: 8,
    physicalCores: 4,
  }),
  memory: async () => ({
    total: 16 * 1024 * 1024 * 1024,
    free: 8 * 1024 * 1024 * 1024,
    used: 8 * 1024 * 1024 * 1024,
  }),
  diskLayout: async () => [
    {
      device: "/dev/sda",
      type: "SSD",
      size: 512 * 1024 * 1024 * 1024,
      mount: "/",
    },
  ],
  networkInterfaces: async () => ({
    eth0: {
      iface: "eth0",
      ip4: "192.168.1.100",
      ip6: "fe80::1",
      mac: "00:11:22:33:44:55",
    },
  }),
  currentLoad: async () => ({
    currentload: 30,
    cpus: [{ load: 25 }, { load: 30 }, { load: 20 }, { load: 35 }],
  }),
  processes: async () => ({
    all: 120,
    running: 10,
    sleeping: 110,
    list: [
      {
        pid: 1,
        name: "systemd",
        cpu: 0.1,
        memory: 0.5,
      },
      {
        pid: 1000,
        name: "openclaw",
        cpu: 5.0,
        memory: 2.0,
      },
    ],
  }),
};

export interface MonitoringConfig {
  enabled: boolean;
  interval: number; // in seconds
  thresholds: {
    cpu: number; // percentage
    memory: number; // percentage
    disk: number; // percentage
  };
  logLevel: "info" | "warn" | "error";
}

export interface SystemInfo {
  system: any;
  cpu: any;
  memory: any;
  disk: any;
  network: any;
  load: any;
  processes: any;
}

export interface HealthCheckResult {
  status: "healthy" | "warning" | "critical";
  message: string;
  details: {
    cpu: {
      usage: number;
      status: "healthy" | "warning" | "critical";
    };
    memory: {
      usage: number;
      status: "healthy" | "warning" | "critical";
    };
    disk: {
      usage: number;
      status: "healthy" | "warning" | "critical";
    };
  };
}

export interface DiagnosticResult {
  success: boolean;
  message: string;
  issues: string[];
  recommendations: string[];
}

export class MonitoringManager {
  private runtime: PluginRuntime;
  private config: MonitoringConfig;
  private metrics: Map<string, number[]> = new Map();

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.config = {
      enabled: true,
      interval: 60,
      thresholds: {
        cpu: 80,
        memory: 80,
        disk: 80,
      },
      logLevel: "info",
    };
  }

  async init() {
    this.runtime.log("Monitoring manager initialized");
    // In a real implementation, we would start periodic monitoring
  }

  getConfig(): MonitoringConfig {
    return this.config;
  }

  updateConfig(config: Partial<MonitoringConfig>): MonitoringConfig {
    this.config = { ...this.config, ...config };
    return this.config;
  }

  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const [system, cpu, memory, diskLayout, networkInterfaces, currentLoad, processes] =
        await Promise.all([
          si.system(),
          si.cpu(),
          si.memory(),
          si.diskLayout(),
          si.networkInterfaces(),
          si.currentLoad(),
          si.processes(),
        ]);

      return {
        system,
        cpu,
        memory,
        disk: diskLayout,
        network: networkInterfaces,
        load: currentLoad,
        processes,
      };
    } catch (error) {
      this.runtime.log(`Error getting system info: ${error}`);
      throw error;
    }
  }

  async runHealthCheck(): Promise<HealthCheckResult> {
    try {
      const systemInfo = await this.getSystemInfo();

      // Calculate usage percentages
      const cpuUsage = systemInfo.load.currentload;
      const memoryUsage =
        ((systemInfo.memory.total - systemInfo.memory.free) / systemInfo.memory.total) * 100;
      const diskUsage = 0; // Simplified for demo

      // Determine statuses
      const cpuStatus = this.getStatus(cpuUsage, this.config.thresholds.cpu);
      const memoryStatus = this.getStatus(memoryUsage, this.config.thresholds.memory);
      const diskStatus = this.getStatus(diskUsage, this.config.thresholds.disk);

      // Overall status
      let overallStatus: "healthy" | "warning" | "critical" = "healthy";
      if (cpuStatus === "critical" || memoryStatus === "critical" || diskStatus === "critical") {
        overallStatus = "critical";
      } else if (
        cpuStatus === "warning" ||
        memoryStatus === "warning" ||
        diskStatus === "warning"
      ) {
        overallStatus = "warning";
      }

      return {
        status: overallStatus,
        message: `System health check ${overallStatus}`,
        details: {
          cpu: {
            usage: cpuUsage,
            status: cpuStatus,
          },
          memory: {
            usage: memoryUsage,
            status: memoryStatus,
          },
          disk: {
            usage: diskUsage,
            status: diskStatus,
          },
        },
      };
    } catch (error) {
      this.runtime.log(`Error running health check: ${error}`);
      return {
        status: "critical",
        message: `Error running health check: ${error}`,
        details: {
          cpu: {
            usage: 0,
            status: "critical",
          },
          memory: {
            usage: 0,
            status: "critical",
          },
          disk: {
            usage: 0,
            status: "critical",
          },
        },
      };
    }
  }

  async runDiagnostics(): Promise<DiagnosticResult> {
    try {
      const systemInfo = await this.getSystemInfo();
      const healthCheck = await this.runHealthCheck();

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check CPU
      if (healthCheck.details.cpu.status === "critical") {
        issues.push(`CPU usage is high: ${healthCheck.details.cpu.usage.toFixed(2)}%`);
        recommendations.push("Consider reducing the number of running processes or upgrading CPU");
      } else if (healthCheck.details.cpu.status === "warning") {
        issues.push(`CPU usage is elevated: ${healthCheck.details.cpu.usage.toFixed(2)}%`);
        recommendations.push(
          "Monitor CPU usage and consider optimizing resource-intensive processes",
        );
      }

      // Check memory
      if (healthCheck.details.memory.status === "critical") {
        issues.push(`Memory usage is high: ${healthCheck.details.memory.usage.toFixed(2)}%`);
        recommendations.push("Consider closing unnecessary applications or upgrading memory");
      } else if (healthCheck.details.memory.status === "warning") {
        issues.push(`Memory usage is elevated: ${healthCheck.details.memory.usage.toFixed(2)}%`);
        recommendations.push(
          "Monitor memory usage and consider optimizing memory-intensive processes",
        );
      }

      // Check disk
      if (healthCheck.details.disk.status === "critical") {
        issues.push(`Disk usage is high: ${healthCheck.details.disk.usage.toFixed(2)}%`);
        recommendations.push("Consider cleaning up disk space or upgrading storage");
      } else if (healthCheck.details.disk.status === "warning") {
        issues.push(`Disk usage is elevated: ${healthCheck.details.disk.usage.toFixed(2)}%`);
        recommendations.push("Monitor disk usage and consider cleaning up unnecessary files");
      }

      // Check processes
      if (systemInfo.processes.all > 200) {
        issues.push(`High number of processes: ${systemInfo.processes.all}`);
        recommendations.push("Consider closing unnecessary processes");
      }

      return {
        success: true,
        message: `Diagnostics completed with ${issues.length} issue(s)`,
        issues,
        recommendations,
      };
    } catch (error) {
      this.runtime.log(`Error running diagnostics: ${error}`);
      return {
        success: false,
        message: `Error running diagnostics: ${error}`,
        issues: [`Diagnostic error: ${error}`],
        recommendations: ["Check system logs for more details"],
      };
    }
  }

  private getStatus(usage: number, threshold: number): "healthy" | "warning" | "critical" {
    if (usage >= threshold) {
      return "critical";
    } else if (usage >= threshold * 0.8) {
      return "warning";
    } else {
      return "healthy";
    }
  }

  addMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    // Keep only the last 100 values
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetrics(name?: string): Map<string, number[]> | number[] {
    if (name) {
      return this.metrics.get(name) || [];
    }
    return this.metrics;
  }
}
