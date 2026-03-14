import { formatISO, differenceInDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export interface Backup {
  id: string;
  name: string;
  timestamp: string;
  size: number;
  type: "full" | "incremental";
  status: "completed" | "failed" | "in_progress";
  location: string;
  metadata: Record<string, any>;
}

export interface BackupOptions {
  name?: string;
  type?: "full" | "incremental";
  location?: string;
  include?: string[];
  exclude?: string[];
  metadata?: Record<string, any>;
}

export interface RestoreOptions {
  backupId: string;
  targetLocation?: string;
  overwrite?: boolean;
  include?: string[];
  exclude?: string[];
}

export interface BackupCleanupOptions {
  keepLast?: number;
  keepDaily?: number;
  keepWeekly?: number;
  keepMonthly?: number;
}

export class BackupManager {
  private backups: Backup[] = [];

  constructor() {
    // 初始化模拟数据
    this.initializeMockData();
  }

  private initializeMockData() {
    const now = new Date();
    const mockBackups: Backup[] = [
      {
        id: uuidv4(),
        name: "Full Backup - March 2026",
        timestamp: formatISO(new Date(now.getTime() - 86400000)), // 1 day ago
        size: 1024 * 1024 * 100, // 100 MB
        type: "full",
        status: "completed",
        location: "/backups/full-2026-03-07",
        metadata: {
          version: "1.0.0",
          includedDirectories: ["/config", "/data"],
          excludedDirectories: ["/temp", "/logs"],
        },
      },
      {
        id: uuidv4(),
        name: "Incremental Backup - March 2026",
        timestamp: formatISO(new Date(now.getTime() - 3600000)), // 1 hour ago
        size: 1024 * 1024 * 20, // 20 MB
        type: "incremental",
        status: "completed",
        location: "/backups/incremental-2026-03-08-1",
        metadata: {
          version: "1.0.0",
          baseBackupId: "base-backup-id",
          includedDirectories: ["/data"],
          excludedDirectories: ["/temp", "/logs"],
        },
      },
    ];

    this.backups = mockBackups;
  }

  async createBackup(options: BackupOptions): Promise<Backup> {
    const backup: Backup = {
      id: uuidv4(),
      name: options.name || `Backup - ${formatISO(new Date()).split("T")[0]}`,
      timestamp: formatISO(new Date()),
      size: options.type === "full" ? 1024 * 1024 * 100 : 1024 * 1024 * 20,
      type: options.type || "full",
      status: "in_progress",
      location:
        options.location ||
        `/backups/${options.type === "incremental" ? "incremental" : "full"}-${formatISO(new Date()).split("T")[0]}`,
      metadata: {
        version: "1.0.0",
        includedDirectories: options.include || ["/config", "/data"],
        excludedDirectories: options.exclude || ["/temp", "/logs"],
        ...options.metadata,
      },
    };

    // 模拟备份过程
    await new Promise((resolve) => setTimeout(resolve, 1000));

    backup.status = "completed";
    this.backups.push(backup);
    return backup;
  }

  async restoreBackup(options: RestoreOptions): Promise<{ success: boolean; message: string }> {
    const backup = this.backups.find((b) => b.id === options.backupId);
    if (!backup) {
      throw new Error("Backup not found");
    }

    if (backup.status !== "completed") {
      throw new Error("Cannot restore from incomplete backup");
    }

    // 模拟恢复过程
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: `Successfully restored backup ${backup.name} to ${options.targetLocation || "original location"}`,
    };
  }

  async listBackups(): Promise<Backup[]> {
    return this.backups.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  async getBackup(backupId: string): Promise<Backup> {
    const backup = this.backups.find((b) => b.id === backupId);
    if (!backup) {
      throw new Error("Backup not found");
    }
    return backup;
  }

  async deleteBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    const index = this.backups.findIndex((b) => b.id === backupId);
    if (index === -1) {
      throw new Error("Backup not found");
    }

    this.backups.splice(index, 1);
    return {
      success: true,
      message: "Backup deleted successfully",
    };
  }

  async cleanupBackups(
    options: BackupCleanupOptions,
  ): Promise<{ success: boolean; deleted: string[]; message: string }> {
    const sortedBackups = [...this.backups].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const toDelete: string[] = [];

    // 保留最近的备份
    if (options.keepLast && sortedBackups.length > options.keepLast) {
      toDelete.push(...sortedBackups.slice(options.keepLast).map((b) => b.id));
    }

    // 保留每日备份
    if (options.keepDaily) {
      const dailyBackups = new Map<string, Backup>();
      for (const backup of sortedBackups) {
        const date = backup.timestamp.split("T")[0];
        if (!dailyBackups.has(date)) {
          dailyBackups.set(date, backup);
        }
      }

      const sortedDaily = Array.from(dailyBackups.values()).sort((a, b) =>
        b.timestamp.localeCompare(a.timestamp),
      );
      if (sortedDaily.length > options.keepDaily) {
        toDelete.push(...sortedDaily.slice(options.keepDaily).map((b) => b.id));
      }
    }

    // 实际删除备份
    this.backups = this.backups.filter((b) => !toDelete.includes(b.id));

    return {
      success: true,
      deleted: toDelete,
      message: `Cleaned up ${toDelete.length} backups`,
    };
  }

  async getBackupStats(): Promise<{
    totalBackups: number;
    totalSize: number;
    fullBackups: number;
    incrementalBackups: number;
    lastBackup: Backup | null;
  }> {
    const totalSize = this.backups.reduce((sum, backup) => sum + backup.size, 0);
    const fullBackups = this.backups.filter((b) => b.type === "full").length;
    const incrementalBackups = this.backups.filter((b) => b.type === "incremental").length;
    const lastBackup =
      this.backups.length > 0
        ? [...this.backups].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
        : null;

    return {
      totalBackups: this.backups.length,
      totalSize,
      fullBackups,
      incrementalBackups,
      lastBackup,
    };
  }

  async validateBackup(backupId: string): Promise<{
    valid: boolean;
    message: string;
    details?: Record<string, any>;
  }> {
    const backup = this.backups.find((b) => b.id === backupId);
    if (!backup) {
      throw new Error("Backup not found");
    }

    // 模拟验证过程
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 简单的验证逻辑
    const valid = backup.status === "completed" && backup.size > 0;

    return {
      valid,
      message: valid ? "Backup is valid" : "Backup is invalid",
      details: {
        size: backup.size,
        status: backup.status,
        age: differenceInDays(new Date(), new Date(backup.timestamp)),
      },
    };
  }
}
