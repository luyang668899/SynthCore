import {
  PluginRuntime,
  ChannelPlugin,
  ChannelMessage,
  ChannelUser,
  ChannelConfig,
  ChannelContext,
} from "openclaw/plugin-sdk/core";
import { WhatsAppManager, WhatsAppMessage, WhatsAppConfig } from "./src/whatsapp-manager";

export class WhatsAppEnhancedPlugin implements ChannelPlugin {
  private runtime: PluginRuntime;
  private whatsappManager: WhatsAppManager;
  private context: ChannelContext | null = null;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.whatsappManager = new WhatsAppManager(runtime);
  }

  async initialize() {
    this.runtime.log("WhatsApp Enhanced plugin initialized");
    await this.whatsappManager.init();
  }

  async start(context: ChannelContext) {
    this.runtime.log("WhatsApp Enhanced plugin started");
    this.context = context;

    const config = this.getConfig();
    if (config.enabled) {
      await this.whatsappManager.connect();
    }
  }

  async stop() {
    this.runtime.log("WhatsApp Enhanced plugin stopped");
    await this.whatsappManager.disconnect();
  }

  getInfo() {
    return {
      id: "whatsapp-enhanced",
      name: "WhatsApp Enhanced",
      description: "Enhanced WhatsApp message channel plugin for OpenClaw",
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

  getConfig(): ChannelConfig {
    const whatsappConfig = this.whatsappManager.getConfig();
    return {
      enabled: whatsappConfig.enabled,
      sessionPath: whatsappConfig.sessionPath,
      puppeteerOptions: whatsappConfig.puppeteerOptions,
      autoAuth: whatsappConfig.autoAuth,
      enableCommands: whatsappConfig.enableCommands,
      commandPrefix: whatsappConfig.commandPrefix,
      allowedChats: whatsappConfig.allowedChats,
      allowedGroups: whatsappConfig.allowedGroups,
      messageDelay: whatsappConfig.messageDelay,
      maxMessages: whatsappConfig.maxMessages,
      webhookUrl: whatsappConfig.webhookUrl,
      webhookEvents: whatsappConfig.webhookEvents,
    };
  }

  updateConfig(config: ChannelConfig): ChannelConfig {
    const updatedConfig = this.whatsappManager.updateConfig(config);
    return {
      enabled: updatedConfig.enabled,
      sessionPath: updatedConfig.sessionPath,
      puppeteerOptions: updatedConfig.puppeteerOptions,
      autoAuth: updatedConfig.autoAuth,
      enableCommands: updatedConfig.enableCommands,
      commandPrefix: updatedConfig.commandPrefix,
      allowedChats: updatedConfig.allowedChats,
      allowedGroups: updatedConfig.allowedGroups,
      messageDelay: updatedConfig.messageDelay,
      maxMessages: updatedConfig.maxMessages,
      webhookUrl: updatedConfig.webhookUrl,
      webhookEvents: updatedConfig.webhookEvents,
    };
  }

  async sendMessage(message: ChannelMessage): Promise<ChannelMessage> {
    try {
      const whatsappMessage = await this.whatsappManager.sendMessage(
        message.channelId,
        message.content,
        {
          attachments: message.attachments,
          replyTo: message.replyToMessageId ? { id: message.replyToMessageId } : undefined,
        },
      );

      return {
        id: whatsappMessage.id,
        content: whatsappMessage.content,
        author: {
          id: whatsappMessage.author.id,
          name: whatsappMessage.author.name,
          realName: whatsappMessage.author.name,
          phoneNumber: whatsappMessage.author.phoneNumber,
        },
        channelId: whatsappMessage.chatId,
        timestamp: whatsappMessage.timestamp,
        attachments: whatsappMessage.attachments,
        isGroup: whatsappMessage.isGroup,
        groupId: whatsappMessage.groupId,
        replyToMessageId: whatsappMessage.replyToMessageId,
      };
    } catch (error) {
      this.runtime.log(`Error sending message: ${error}`);
      throw error;
    }
  }

  async sendMedia(channelId: string, media: string, options?: any): Promise<ChannelMessage> {
    try {
      const whatsappMessage = await this.whatsappManager.sendMedia(channelId, media, options);

      return {
        id: whatsappMessage.id,
        content: whatsappMessage.content,
        author: {
          id: whatsappMessage.author.id,
          name: whatsappMessage.author.name,
          realName: whatsappMessage.author.name,
          phoneNumber: whatsappMessage.author.phoneNumber,
        },
        channelId: whatsappMessage.chatId,
        timestamp: whatsappMessage.timestamp,
        attachments: whatsappMessage.attachments,
        isGroup: whatsappMessage.isGroup,
        groupId: whatsappMessage.groupId,
      };
    } catch (error) {
      this.runtime.log(`Error sending media: ${error}`);
      throw error;
    }
  }

  async getChannel(channelId: string): Promise<any> {
    // In a real implementation, we would get channel info from WhatsApp
    return {
      id: channelId,
      name: "WhatsApp Chat/Group",
      type: "whatsapp",
    };
  }

  async getUser(userId: string): Promise<ChannelUser> {
    // In a real implementation, we would get user info from WhatsApp
    return {
      id: userId,
      name: "Test User",
      realName: "Test User",
      phoneNumber: userId.split("@")[0],
    };
  }

  async listChannels(): Promise<any[]> {
    // In a real implementation, we would get channels from WhatsApp
    const chats = await this.whatsappManager.getChats();
    return chats.map((chat: any) => ({
      id: chat.id._serialized,
      name: chat.name,
      type: chat.isGroup ? "group" : "contact",
    }));
  }

  async listUsers(): Promise<ChannelUser[]> {
    // In a real implementation, we would get users from WhatsApp
    const contacts = await this.whatsappManager.getContacts();
    return contacts.map((contact: any) => ({
      id: contact.id._serialized,
      name: contact.name,
      realName: contact.name,
      phoneNumber: contact.phoneNumber,
    }));
  }

  async joinChannel(channelId: string): Promise<boolean> {
    // In a real implementation, we would join the channel
    return true;
  }

  async leaveChannel(channelId: string): Promise<boolean> {
    // In a real implementation, we would leave the channel
    return true;
  }

  async isConnected(): Promise<boolean> {
    return this.whatsappManager.isConnectedStatus();
  }

  async getHealthStatus(): Promise<any> {
    const isConnected = await this.isConnected();
    return {
      connected: isConnected,
      status: isConnected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
    };
  }

  async getChats(): Promise<any[]> {
    return this.whatsappManager.getChats();
  }

  async getContacts(): Promise<any[]> {
    return this.whatsappManager.getContacts();
  }

  async getMessage(messageId: string): Promise<any> {
    return this.whatsappManager.getMessage(messageId);
  }

  async onMessage(handler: (message: any) => void) {
    return this.whatsappManager.onMessage(handler);
  }

  async onQR(handler: (qr: string) => void) {
    return this.whatsappManager.onQR(handler);
  }

  async onReady(handler: () => void) {
    return this.whatsappManager.onReady(handler);
  }

  async onDisconnect(handler: (reason: any) => void) {
    return this.whatsappManager.onDisconnect(handler);
  }
}

export default {
  name: "whatsapp-enhanced",
  version: "2026.2.17",
  description: "Enhanced WhatsApp message channel plugin for OpenClaw",
  type: "channel" as const,
  main: WhatsAppEnhancedPlugin,
};
