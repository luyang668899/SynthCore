import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";

// 同步配置接口
export interface SyncConfig {
  syncEnabled: boolean;
  syncInterval: number;
  channels: string[];
}

// 消息接口
export interface Message {
  id: string;
  channel: string;
  content: any;
  metadata?: Record<string, any>;
}

// 同步状态接口
export interface SyncState {
  lastSyncTime: number;
  syncedMessages: Set<string>;
  pendingMessages: Message[];
}

// 消息同步管理器
export class SyncManager {
  private api: OpenClawPluginApi;
  private config: SyncConfig;
  private state: SyncState;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(api: OpenClawPluginApi, config: SyncConfig) {
    this.api = api;
    this.config = config;
    this.state = {
      lastSyncTime: Date.now(),
      syncedMessages: new Set(),
      pendingMessages: [],
    };
  }

  // 启动同步服务
  start() {
    if (!this.config.syncEnabled) {
      this.api.logger?.info("Channel sync is disabled");
      return;
    }

    this.api.logger?.info("Starting channel sync service");

    // 启动同步定时器
    this.syncInterval = setInterval(() => {
      this.syncMessages();
    }, this.config.syncInterval);
  }

  // 停止同步服务
  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.api.logger?.info("Channel sync service stopped");
  }

  // 同步消息到其他渠道
  private async syncMessages() {
    if (this.state.pendingMessages.length === 0) {
      return;
    }

    const messagesToSync = [...this.state.pendingMessages];
    this.state.pendingMessages = [];

    for (const message of messagesToSync) {
      await this.syncMessage(message);
    }

    this.state.lastSyncTime = Date.now();
  }

  // 同步单个消息
  private async syncMessage(message: Message) {
    if (this.isMessageSynced(message.id)) {
      return;
    }

    try {
      // 同步到所有配置的渠道（除了消息来源渠道）
      for (const channel of this.config.channels) {
        if (channel === message.channel) {
          continue;
        }

        // 构建同步消息
        const syncMessage = {
          ...message,
          channel,
          metadata: {
            ...message.metadata,
            sync: {
              originalChannel: message.channel,
              originalMessageId: message.id,
              syncTime: Date.now(),
            },
          },
        };

        // 这里简化处理，实际发送消息需要通过正确的API
        if (this.api.logger?.debug) {
          this.api.logger.debug(
            `Would sync message ${message.id} from ${message.channel} to ${channel}`,
          );
        }
      }

      // 标记消息为已同步
      this.state.syncedMessages.add(message.id);

      // 清理旧的同步记录（保留最近1000条）
      if (this.state.syncedMessages.size > 1000) {
        const oldMessages = Array.from(this.state.syncedMessages).slice(0, 500);
        oldMessages.forEach((msgId) => this.state.syncedMessages.delete(msgId));
      }
    } catch (error) {
      this.api.logger?.error(
        `Error syncing message ${message.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      // 将消息重新加入待处理队列
      this.state.pendingMessages.push(message);
    }
  }

  // 检查消息是否已同步
  private isMessageSynced(messageId: string): boolean {
    return this.state.syncedMessages.has(messageId);
  }

  // 获取同步状态
  getState(): SyncState {
    return { ...this.state };
  }

  // 更新配置
  updateConfig(config: Partial<SyncConfig>) {
    this.config = { ...this.config, ...config };

    // 重启同步服务以应用新配置
    if (this.syncInterval) {
      this.stop();
      this.start();
    }
  }
}
