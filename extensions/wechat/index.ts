import { WeChatManager, WeChatManagerOptions } from "./src/wechat-manager.js";

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
  puppet: string;
  autoAuth: boolean;
  enableCommands: boolean;
  commandPrefix: string;
  allowedUsers: string[];
  allowedRooms: string[];
  messageDelay: number;
  maxMessages: number;
  webhookUrl: string;
  webhookEvents: string[];
}

class WeChatPlugin {
  private runtime: PluginRuntime;
  private wechatManager: WeChatManager;
  private config: PluginConfig;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.config = this.getDefaultConfig();
    this.wechatManager = new WeChatManager({
      puppet: this.config.puppet,
      autoAuth: this.config.autoAuth,
      messageDelay: this.config.messageDelay,
      maxMessages: this.config.maxMessages,
      webhookUrl: this.config.webhookUrl,
      webhookEvents: this.config.webhookEvents,
    });
  }

  private getDefaultConfig(): PluginConfig {
    return {
      enabled: true,
      puppet: "wechat4u",
      autoAuth: false,
      enableCommands: true,
      commandPrefix: "/",
      allowedUsers: [],
      allowedRooms: [],
      messageDelay: 1000,
      maxMessages: 100,
      webhookUrl: "",
      webhookEvents: [],
    };
  }

  async initialize(): Promise<void> {
    this.runtime.log("WeChat plugin initialized");
    await this.wechatManager.initialize();
  }

  async start(options?: any): Promise<void> {
    this.runtime.log("WeChat plugin started");
    await this.wechatManager.start();
  }

  async stop(): Promise<void> {
    this.runtime.log("WeChat plugin stopped");
    await this.wechatManager.stop();
  }

  async isConnected(): Promise<boolean> {
    return this.wechatManager.isConnected();
  }

  async getHealthStatus(): Promise<HealthStatus> {
    return this.wechatManager.getHealthStatus();
  }

  async sendMessage(message: Message): Promise<Message> {
    this.runtime.log(`Sending message to ${message.channelId}: ${message.content}`);
    const result = await this.wechatManager.sendMessage(message.channelId, message.content);
    return {
      ...message,
      id: result.id,
      timestamp: new Date().toISOString(),
    };
  }

  async sendMedia(
    channelId: string,
    mediaUrl: string,
    options?: { caption?: string },
  ): Promise<Message> {
    this.runtime.log(`Sending media to ${channelId}: ${mediaUrl}`);
    const result = await this.wechatManager.sendMedia(channelId, mediaUrl, options);
    return {
      id: result.id,
      content: options?.caption || "Media message",
      author: {
        id: "wechat-bot",
        name: "OpenClaw Bot",
        realName: "OpenClaw Bot",
        phoneNumber: "wechat-bot",
      },
      channelId,
      timestamp: new Date().toISOString(),
      attachments: [{ id: "1", type: "media", url: mediaUrl }],
      isGroup: channelId.startsWith("room"),
      groupId: channelId.startsWith("room") ? channelId : undefined,
    };
  }

  async getMessage(messageId: string): Promise<Message | null> {
    this.runtime.log(`Getting message ${messageId}`);
    const message = await this.wechatManager.getMessage(messageId);
    if (!message) return null;
    return {
      id: message.id,
      content: message.text,
      author: {
        id: message.from,
        name: "Unknown User",
        realName: "Unknown User",
        phoneNumber: message.from,
      },
      channelId: message.to,
      timestamp: new Date(message.timestamp).toISOString(),
      attachments: [],
      isGroup: false,
    };
  }

  async getChannel(channelId: string): Promise<Channel | null> {
    const channel = await this.wechatManager.getChannel(channelId);
    if (!channel) return null;
    return {
      id: channel.id,
      name: channel.name,
      type: channelId.startsWith("room") ? "group" : "contact",
    };
  }

  async getUser(userId: string): Promise<User | null> {
    const user = await this.wechatManager.getUser(userId);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      realName: user.name,
      phoneNumber: user.phone || userId,
    };
  }

  async listChannels(): Promise<Channel[]> {
    this.runtime.log("Getting chats");
    const channels = await this.wechatManager.listChannels();
    return channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
    }));
  }

  async listUsers(): Promise<User[]> {
    this.runtime.log("Getting contacts");
    const contacts = await this.wechatManager.getContacts();
    return contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      realName: contact.name,
      phoneNumber: contact.phone || contact.id,
    }));
  }

  async joinChannel(channelId: string): Promise<boolean> {
    return this.wechatManager.joinChannel(channelId);
  }

  async leaveChannel(channelId: string): Promise<boolean> {
    return this.wechatManager.leaveChannel(channelId);
  }

  async onMessage(callback: (message: Message) => void): Promise<void> {
    await this.wechatManager.onMessage((wechatMessage: any) => {
      const message: Message = {
        id: wechatMessage.id || Date.now().toString(),
        content: wechatMessage.text || wechatMessage.content || "",
        author: {
          id: wechatMessage.from || "unknown",
          name: wechatMessage.fromName || "Unknown User",
          realName: wechatMessage.fromName || "Unknown User",
          phoneNumber: wechatMessage.from || "unknown",
        },
        channelId: wechatMessage.to || wechatMessage.roomId || "unknown",
        timestamp: new Date(wechatMessage.timestamp || Date.now()).toISOString(),
        attachments: [],
        isGroup: !!wechatMessage.roomId,
        groupId: wechatMessage.roomId,
      };
      callback(message);
    });
  }

  async onQR(callback: (qr: string) => void): Promise<void> {
    await this.wechatManager.onQR(callback);
  }

  async onReady(callback: () => void): Promise<void> {
    await this.wechatManager.onReady(callback);
  }

  async onDisconnect(callback: (reason: string) => void): Promise<void> {
    await this.wechatManager.onDisconnect(callback);
  }

  getInfo(): PluginInfo {
    return {
      id: "wechat",
      name: "WeChat",
      description: "WeChat message channel plugin for OpenClaw",
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
      name: "WeChat",
      description: "WeChat message channel support",
    };
  }
}

export { WeChatPlugin };
export default WeChatPlugin;
