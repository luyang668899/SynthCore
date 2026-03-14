import {
  PluginRuntime,
  ChannelPlugin,
  ChannelMessage,
  ChannelUser,
  ChannelConfig,
  ChannelContext,
} from "openclaw/plugin-sdk/core";
import { TelegramManager, TelegramMessage, TelegramConfig } from "./src/telegram-manager";

export class TelegramEnhancedPlugin implements ChannelPlugin {
  private runtime: PluginRuntime;
  private telegramManager: TelegramManager;
  private context: ChannelContext | null = null;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.telegramManager = new TelegramManager(runtime);
  }

  async initialize() {
    this.runtime.log("Telegram Enhanced plugin initialized");
    await this.telegramManager.init();
  }

  async start(context: ChannelContext) {
    this.runtime.log("Telegram Enhanced plugin started");
    this.context = context;

    const config = this.getConfig();
    if (config.enabled) {
      await this.telegramManager.connect();
    }
  }

  async stop() {
    this.runtime.log("Telegram Enhanced plugin stopped");
    await this.telegramManager.disconnect();
  }

  getInfo() {
    return {
      id: "telegram-enhanced",
      name: "Telegram Enhanced",
      description: "Enhanced Telegram message channel plugin for OpenClaw",
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
    const telegramConfig = this.telegramManager.getConfig();
    return {
      enabled: telegramConfig.enabled,
      token: telegramConfig.token,
      username: telegramConfig.username,
      autoJoinGroups: telegramConfig.autoJoinGroups,
      enableCommands: telegramConfig.enableCommands,
      commandPrefix: telegramConfig.commandPrefix,
      allowedChats: telegramConfig.allowedChats,
      allowedUsers: telegramConfig.allowedUsers,
      webhook: telegramConfig.webhook,
    };
  }

  updateConfig(config: ChannelConfig): ChannelConfig {
    const updatedConfig = this.telegramManager.updateConfig(config);
    return {
      enabled: updatedConfig.enabled,
      token: updatedConfig.token,
      username: updatedConfig.username,
      autoJoinGroups: updatedConfig.autoJoinGroups,
      enableCommands: updatedConfig.enableCommands,
      commandPrefix: updatedConfig.commandPrefix,
      allowedChats: updatedConfig.allowedChats,
      allowedUsers: updatedConfig.allowedUsers,
      webhook: updatedConfig.webhook,
    };
  }

  async sendMessage(message: ChannelMessage): Promise<ChannelMessage> {
    try {
      const telegramMessage = await this.telegramManager.sendMessage(
        message.channelId,
        message.content,
        {
          reply_to_message_id: message.replyToMessageId
            ? parseInt(message.replyToMessageId)
            : undefined,
          attachments: message.attachments,
          reply_markup: message.keyboard ? { keyboard: message.keyboard } : undefined,
        },
      );

      return {
        id: telegramMessage.id,
        content: telegramMessage.content,
        author: {
          id: telegramMessage.author.id.toString(),
          name: telegramMessage.author.name,
          realName: telegramMessage.author.name,
          username: telegramMessage.author.username,
        },
        channelId: telegramMessage.chatId.toString(),
        timestamp: telegramMessage.timestamp,
        replyToMessageId: telegramMessage.replyToMessageId,
        attachments: telegramMessage.attachments,
        keyboard: telegramMessage.keyboard,
      };
    } catch (error) {
      this.runtime.log(`Error sending message: ${error}`);
      throw error;
    }
  }

  async sendMessageWithReply(
    channelId: string,
    content: string,
    replyToMessageId: string,
  ): Promise<ChannelMessage> {
    try {
      const telegramMessage = await this.telegramManager.sendMessageWithReply(
        channelId,
        content,
        replyToMessageId,
      );

      return {
        id: telegramMessage.id,
        content: telegramMessage.content,
        author: {
          id: telegramMessage.author.id.toString(),
          name: telegramMessage.author.name,
          realName: telegramMessage.author.name,
          username: telegramMessage.author.username,
        },
        channelId: telegramMessage.chatId.toString(),
        timestamp: telegramMessage.timestamp,
        replyToMessageId: telegramMessage.replyToMessageId,
        attachments: telegramMessage.attachments,
        keyboard: telegramMessage.keyboard,
      };
    } catch (error) {
      this.runtime.log(`Error sending message with reply: ${error}`);
      throw error;
    }
  }

  async sendMessageWithKeyboard(
    channelId: string,
    content: string,
    keyboard: any[],
  ): Promise<ChannelMessage> {
    try {
      const telegramMessage = await this.telegramManager.sendMessageWithKeyboard(
        channelId,
        content,
        keyboard,
      );

      return {
        id: telegramMessage.id,
        content: telegramMessage.content,
        author: {
          id: telegramMessage.author.id.toString(),
          name: telegramMessage.author.name,
          realName: telegramMessage.author.name,
          username: telegramMessage.author.username,
        },
        channelId: telegramMessage.chatId.toString(),
        timestamp: telegramMessage.timestamp,
        replyToMessageId: telegramMessage.replyToMessageId,
        attachments: telegramMessage.attachments,
        keyboard: telegramMessage.keyboard,
      };
    } catch (error) {
      this.runtime.log(`Error sending message with keyboard: ${error}`);
      throw error;
    }
  }

  async sendPhoto(channelId: string, photo: string, caption?: string): Promise<ChannelMessage> {
    try {
      const telegramMessage = await this.telegramManager.sendPhoto(channelId, photo, caption);

      return {
        id: telegramMessage.id,
        content: telegramMessage.content,
        author: {
          id: telegramMessage.author.id.toString(),
          name: telegramMessage.author.name,
          realName: telegramMessage.author.name,
          username: telegramMessage.author.username,
        },
        channelId: telegramMessage.chatId.toString(),
        timestamp: telegramMessage.timestamp,
        replyToMessageId: telegramMessage.replyToMessageId,
        attachments: telegramMessage.attachments,
        keyboard: telegramMessage.keyboard,
      };
    } catch (error) {
      this.runtime.log(`Error sending photo: ${error}`);
      throw error;
    }
  }

  async getChannel(channelId: string): Promise<any> {
    return this.telegramManager.getChat(channelId);
  }

  async getUser(userId: string): Promise<ChannelUser> {
    // In a real implementation, we would get user info from Telegram API
    return {
      id: userId,
      name: "Test User",
      realName: "Test User",
      username: "testuser",
    };
  }

  async listChannels(): Promise<any[]> {
    // In a real implementation, we would get channels from Telegram API
    return [];
  }

  async listUsers(): Promise<ChannelUser[]> {
    // In a real implementation, we would get users from Telegram API
    return [];
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
    return this.telegramManager.isConnectedStatus();
  }

  async getHealthStatus(): Promise<any> {
    const isConnected = await this.isConnected();
    return {
      connected: isConnected,
      status: isConnected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
    };
  }

  async getBotInfo(): Promise<any> {
    return this.telegramManager.getBotInfo();
  }

  async getChatMember(chatId: string, userId: string): Promise<any> {
    return this.telegramManager.getChatMember(chatId, parseInt(userId));
  }

  async getUpdates(): Promise<any[]> {
    return this.telegramManager.getUpdates();
  }
}

export default {
  name: "telegram-enhanced",
  version: "2026.2.17",
  description: "Enhanced Telegram message channel plugin for OpenClaw",
  type: "channel" as const,
  main: TelegramEnhancedPlugin,
};
