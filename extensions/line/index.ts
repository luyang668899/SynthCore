import { LineManager, LineManagerOptions } from "./src/line-manager.js";

interface PluginRuntime {
  log(message: string): void;
  error(message: string, error?: any): void;
  warn(message: string): void;
  info(message: string): void;
  debug(message: string): void;
  getConfig(key: string, defaultValue?: any): any;
  setConfig(key: string, value: any): void;
  getEnv(key: string, defaultValue?: any): any;
  getLogger(name: string): any;
  getStorage(): any;
  getHttpClient(): any;
  getEventBus(): any;
  getMetrics(): any;
  getCache(): any;
  getCrypto(): any;
  getUtils(): any;
  getValidator(): any;
  getI18n(): any;
  getClock(): any;
}

interface Message {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    realName: string;
    phoneNumber: string;
  };
  channelId: string;
  timestamp: string;
  attachments: Array<{
    id: string;
    type: string;
    url: string;
    name?: string;
    size?: number;
  }>;
  isGroup: boolean;
  groupId?: string;
  replyToMessageId?: string;
}

interface Channel {
  id: string;
  name: string;
  type: string;
}

interface User {
  id: string;
  name: string;
  realName: string;
  phoneNumber: string;
}

interface HealthStatus {
  connected: boolean;
  status: string;
  timestamp: string;
}

interface PluginInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  capabilities: {
    sendMessages: boolean;
    receiveMessages: boolean;
    sendFiles: boolean;
    receiveFiles: boolean;
    sendRichMessages: boolean;
    receiveRichMessages: boolean;
    userManagement: boolean;
    channelManagement: boolean;
  };
}

interface PluginConfig {
  enabled: boolean;
  channelAccessToken: string;
  channelSecret: string;
  webhookUrl: string;
  webhookPort: number;
  enableCommands: boolean;
  commandPrefix: string;
  allowedUsers: string[];
  allowedGroups: string[];
  messageDelay: number;
  maxMessages: number;
}

class LinePlugin {
  private runtime: PluginRuntime;
  private lineManager: LineManager;
  private config: PluginConfig;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.config = this.getDefaultConfig();
    this.lineManager = new LineManager({
      channelAccessToken: this.config.channelAccessToken,
      channelSecret: this.config.channelSecret,
      webhookPort: this.config.webhookPort,
      messageDelay: this.config.messageDelay,
      maxMessages: this.config.maxMessages,
    });
  }

  private getDefaultConfig(): PluginConfig {
    return {
      enabled: true,
      channelAccessToken: "",
      channelSecret: "",
      webhookUrl: "",
      webhookPort: 3000,
      enableCommands: true,
      commandPrefix: "/",
      allowedUsers: [],
      allowedGroups: [],
      messageDelay: 1000,
      maxMessages: 100,
    };
  }

  async initialize(): Promise<void> {
    this.runtime.log("Line plugin initialized");
    await this.lineManager.initialize();
  }

  async start(options?: any): Promise<void> {
    this.runtime.log("Line plugin started");
    await this.lineManager.start();
  }

  async stop(): Promise<void> {
    this.runtime.log("Line plugin stopped");
    await this.lineManager.stop();
  }

  async isConnected(): Promise<boolean> {
    return this.lineManager.isConnected();
  }

  async getHealthStatus(): Promise<HealthStatus> {
    return this.lineManager.getHealthStatus();
  }

  async sendMessage(message: Message): Promise<Message> {
    this.runtime.log(`Sending message to ${message.channelId}: ${message.content}`);
    const result = await this.lineManager.sendMessage(message.channelId, message.content);
    return {
      ...message,
      id: result.messageId,
      timestamp: new Date().toISOString(),
    };
  }

  async sendMedia(
    channelId: string,
    mediaUrl: string,
    options?: { caption?: string },
  ): Promise<Message> {
    this.runtime.log(`Sending media to ${channelId}: ${mediaUrl}`);
    const result = await this.lineManager.sendMedia(channelId, mediaUrl, options);
    return {
      id: result.messageId,
      content: options?.caption || "Media message",
      author: {
        id: "line-bot",
        name: "OpenClaw Bot",
        realName: "OpenClaw Bot",
        phoneNumber: "line-bot",
      },
      channelId,
      timestamp: new Date().toISOString(),
      attachments: [{ id: "1", type: "media", url: mediaUrl }],
      isGroup: channelId.startsWith("C"),
      groupId: channelId.startsWith("C") ? channelId : undefined,
    };
  }

  async getMessage(messageId: string): Promise<Message | null> {
    this.runtime.log(`Getting message ${messageId}`);
    // Line API doesn't provide a way to get message by ID
    return null;
  }

  async getChannel(channelId: string): Promise<Channel | null> {
    return {
      id: channelId,
      name: "Line Chat/Group",
      type: channelId.startsWith("C") ? "group" : "contact",
    };
  }

  async getUser(userId: string): Promise<User | null> {
    const profile = await this.lineManager.getProfile(userId);
    if (!profile) return null;
    return {
      id: profile.userId,
      name: profile.displayName,
      realName: profile.displayName,
      phoneNumber: userId,
    };
  }

  async listChannels(): Promise<Channel[]> {
    // Line API doesn't provide a way to list channels
    return [];
  }

  async listUsers(): Promise<User[]> {
    // Line API doesn't provide a way to list users
    return [];
  }

  async joinChannel(channelId: string): Promise<boolean> {
    // Line API doesn't provide a way to join channels programmatically
    return false;
  }

  async leaveChannel(channelId: string): Promise<boolean> {
    if (channelId.startsWith("C")) {
      return this.lineManager.leaveGroup(channelId);
    } else if (channelId.startsWith("R")) {
      return this.lineManager.leaveRoom(channelId);
    }
    return false;
  }

  async onMessage(callback: (message: Message) => void): Promise<void> {
    await this.lineManager.onMessage((lineMessage: any) => {
      const message: Message = {
        id: lineMessage.id || Date.now().toString(),
        content: lineMessage.text || lineMessage.originalContentUrl || "",
        author: {
          id: lineMessage.userId || "unknown",
          name: "Unknown User",
          realName: "Unknown User",
          phoneNumber: lineMessage.userId || "unknown",
        },
        channelId: lineMessage.userId || "unknown",
        timestamp: new Date().toISOString(),
        attachments: [],
        isGroup: false,
      };
      callback(message);
    });
  }

  async onReady(callback: () => void): Promise<void> {
    await this.lineManager.onReady(callback);
  }

  async onDisconnect(callback: (reason: string) => void): Promise<void> {
    await this.lineManager.onDisconnect(callback);
  }

  getInfo(): PluginInfo {
    return {
      id: "line",
      name: "Line",
      description: "Line message channel plugin for OpenClaw",
      version: "2026.2.17",
      author: "OpenClaw Team",
      capabilities: {
        sendMessages: true,
        receiveMessages: true,
        sendFiles: true,
        receiveFiles: true,
        sendRichMessages: true,
        receiveRichMessages: true,
        userManagement: true,
        channelManagement: true,
      },
    };
  }

  getConfig(): PluginConfig {
    return this.config;
  }

  updateConfig(config: Partial<PluginConfig>): PluginConfig {
    this.config = { ...this.config, ...config };
    return this.config;
  }

  getChannelInfo(): { name: string; description: string } {
    return {
      name: "Line",
      description: "Line message channel support",
    };
  }
}

export { LinePlugin };
export default LinePlugin;
