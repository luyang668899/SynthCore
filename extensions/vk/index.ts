import { VKManager, VKManagerOptions } from "./src/vk-manager.js";

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
  token: string;
  groupId: string;
  webhookUrl: string;
  webhookPort: number;
  enableCommands: boolean;
  commandPrefix: string;
  allowedUsers: string[];
  messageDelay: number;
  maxMessages: number;
}

class VKPlugin {
  private runtime: PluginRuntime;
  private vkManager: VKManager;
  private config: PluginConfig;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.config = this.getDefaultConfig();
    this.vkManager = new VKManager({
      token: this.config.token,
      groupId: this.config.groupId,
      webhookPort: this.config.webhookPort,
      messageDelay: this.config.messageDelay,
      maxMessages: this.config.maxMessages,
    });
  }

  private getDefaultConfig(): PluginConfig {
    return {
      enabled: true,
      token: "",
      groupId: "",
      webhookUrl: "",
      webhookPort: 3000,
      enableCommands: true,
      commandPrefix: "/",
      allowedUsers: [],
      messageDelay: 1000,
      maxMessages: 100,
    };
  }

  async initialize(): Promise<void> {
    this.runtime.log("VK plugin initialized");
    await this.vkManager.initialize();
  }

  async start(options?: any): Promise<void> {
    this.runtime.log("VK plugin started");
    await this.vkManager.start();
  }

  async stop(): Promise<void> {
    this.runtime.log("VK plugin stopped");
    await this.vkManager.stop();
  }

  async isConnected(): Promise<boolean> {
    return this.vkManager.isConnected();
  }

  async getHealthStatus(): Promise<HealthStatus> {
    return this.vkManager.getHealthStatus();
  }

  async sendMessage(message: Message): Promise<Message> {
    this.runtime.log(`Sending message to ${message.channelId}: ${message.content}`);
    const result = await this.vkManager.sendMessage(message.channelId, message.content);
    return {
      ...message,
      id: result.message_id.toString(),
      timestamp: new Date().toISOString(),
    };
  }

  async sendMedia(
    channelId: string,
    mediaUrl: string,
    options?: { caption?: string },
  ): Promise<Message> {
    this.runtime.log(`Sending media to ${channelId}: ${mediaUrl}`);
    const result = await this.vkManager.sendMedia(channelId, mediaUrl, options);
    return {
      id: result.message_id.toString(),
      content: options?.caption || "Media message",
      author: {
        id: "vk-bot",
        name: "OpenClaw Bot",
        realName: "OpenClaw Bot",
        phoneNumber: "vk-bot",
      },
      channelId,
      timestamp: new Date().toISOString(),
      attachments: [{ id: "1", type: "media", url: mediaUrl }],
      isGroup: channelId.startsWith("-"),
      groupId: channelId.startsWith("-") ? channelId : undefined,
    };
  }

  async getMessage(messageId: string): Promise<Message | null> {
    this.runtime.log(`Getting message ${messageId}`);
    // VK API doesn't provide a way to get message by ID directly
    return null;
  }

  async getChannel(channelId: string): Promise<Channel | null> {
    if (channelId.startsWith("-")) {
      const group = await this.vkManager.getGroup(channelId.replace("-", ""));
      if (group) {
        return {
          id: channelId,
          name: group.name,
          type: "group",
        };
      }
    }
    return {
      id: channelId,
      name: "VK Chat",
      type: "contact",
    };
  }

  async getUser(userId: string): Promise<User | null> {
    const user = await this.vkManager.getUser(userId);
    if (!user) return null;
    return {
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      realName: `${user.first_name} ${user.last_name}`,
      phoneNumber: userId,
    };
  }

  async listChannels(): Promise<Channel[]> {
    const conversations = await this.vkManager.getConversations();
    return conversations.map((item: any) => ({
      id: item.conversation.peer.id.toString(),
      name: "VK Chat",
      type: item.conversation.peer.type,
    }));
  }

  async listUsers(): Promise<User[]> {
    // VK API doesn't provide a way to list all users
    return [];
  }

  async joinChannel(channelId: string): Promise<boolean> {
    // VK API doesn't provide a way to join channels programmatically
    return false;
  }

  async leaveChannel(channelId: string): Promise<boolean> {
    // VK API doesn't provide a way to leave channels programmatically
    return false;
  }

  async onMessage(callback: (message: Message) => void): Promise<void> {
    await this.vkManager.onMessage((vkMessage: any) => {
      const message: Message = {
        id: vkMessage.id.toString(),
        content: vkMessage.text || "",
        author: {
          id: vkMessage.from_id.toString(),
          name: "Unknown User",
          realName: "Unknown User",
          phoneNumber: vkMessage.from_id.toString(),
        },
        channelId: vkMessage.peer_id.toString(),
        timestamp: new Date(vkMessage.date * 1000).toISOString(),
        attachments: [],
        isGroup: vkMessage.peer_id < 0,
        groupId: vkMessage.peer_id < 0 ? vkMessage.peer_id.toString() : undefined,
      };
      callback(message);
    });
  }

  async onReady(callback: () => void): Promise<void> {
    await this.vkManager.onReady(callback);
  }

  async onDisconnect(callback: (reason: string) => void): Promise<void> {
    await this.vkManager.onDisconnect(callback);
  }

  getInfo(): PluginInfo {
    return {
      id: "vk",
      name: "VK",
      description: "VK message channel plugin for OpenClaw",
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
      name: "VK",
      description: "VK message channel support",
    };
  }
}

export { VKPlugin };
export default VKPlugin;
