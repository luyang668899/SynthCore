import {
  PluginRuntime,
  ChannelPlugin,
  ChannelMessage,
  ChannelUser,
  ChannelConfig,
  ChannelContext,
} from "openclaw/plugin-sdk/core";
import { SlackManager, SlackMessage, SlackConfig } from "./src/slack-manager";

export class SlackEnhancedPlugin implements ChannelPlugin {
  private runtime: PluginRuntime;
  private slackManager: SlackManager;
  private context: ChannelContext | null = null;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.slackManager = new SlackManager(runtime);
  }

  async initialize() {
    this.runtime.log("Slack Enhanced plugin initialized");
    await this.slackManager.init();
  }

  async start(context: ChannelContext) {
    this.runtime.log("Slack Enhanced plugin started");
    this.context = context;

    const config = this.getConfig();
    if (config.enabled) {
      await this.slackManager.connect();
    }
  }

  async stop() {
    this.runtime.log("Slack Enhanced plugin stopped");
    await this.slackManager.disconnect();
  }

  getInfo() {
    return {
      id: "slack-enhanced",
      name: "Slack Enhanced",
      description: "Enhanced Slack message channel plugin for OpenClaw",
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
    const slackConfig = this.slackManager.getConfig();
    return {
      enabled: slackConfig.enabled,
      token: slackConfig.token,
      appToken: slackConfig.appToken,
      signingSecret: slackConfig.signingSecret,
      autoJoinChannels: slackConfig.autoJoinChannels,
      enableCommands: slackConfig.enableCommands,
      commandPrefix: slackConfig.commandPrefix,
      allowedChannels: slackConfig.allowedChannels,
      allowedUsers: slackConfig.allowedUsers,
    };
  }

  updateConfig(config: ChannelConfig): ChannelConfig {
    const updatedConfig = this.slackManager.updateConfig(config);
    return {
      enabled: updatedConfig.enabled,
      token: updatedConfig.token,
      appToken: updatedConfig.appToken,
      signingSecret: updatedConfig.signingSecret,
      autoJoinChannels: updatedConfig.autoJoinChannels,
      enableCommands: updatedConfig.enableCommands,
      commandPrefix: updatedConfig.commandPrefix,
      allowedChannels: updatedConfig.allowedChannels,
      allowedUsers: updatedConfig.allowedUsers,
    };
  }

  async sendMessage(message: ChannelMessage): Promise<ChannelMessage> {
    try {
      const slackMessage = await this.slackManager.sendMessage(message.channelId, message.content, {
        attachments: message.attachments,
        blocks: message.blocks,
      });

      return {
        id: slackMessage.id,
        content: slackMessage.content,
        author: {
          id: slackMessage.author.id,
          name: slackMessage.author.name,
          realName: slackMessage.author.realName,
        },
        channelId: slackMessage.channelId,
        timestamp: slackMessage.timestamp,
        attachments: slackMessage.attachments,
        blocks: slackMessage.blocks,
      };
    } catch (error) {
      this.runtime.log(`Error sending message: ${error}`);
      throw error;
    }
  }

  async sendMessageWithAttachments(
    channelId: string,
    content: string,
    attachments: any[],
  ): Promise<ChannelMessage> {
    try {
      const slackMessage = await this.slackManager.sendMessageWithAttachments(
        channelId,
        content,
        attachments,
      );

      return {
        id: slackMessage.id,
        content: slackMessage.content,
        author: {
          id: slackMessage.author.id,
          name: slackMessage.author.name,
          realName: slackMessage.author.realName,
        },
        channelId: slackMessage.channelId,
        timestamp: slackMessage.timestamp,
        attachments: slackMessage.attachments,
        blocks: slackMessage.blocks,
      };
    } catch (error) {
      this.runtime.log(`Error sending message with attachments: ${error}`);
      throw error;
    }
  }

  async sendMessageWithBlocks(channelId: string, blocks: any[]): Promise<ChannelMessage> {
    try {
      const slackMessage = await this.slackManager.sendMessageWithBlocks(channelId, blocks);

      return {
        id: slackMessage.id,
        content: slackMessage.content,
        author: {
          id: slackMessage.author.id,
          name: slackMessage.author.name,
          realName: slackMessage.author.realName,
        },
        channelId: slackMessage.channelId,
        timestamp: slackMessage.timestamp,
        attachments: slackMessage.attachments,
        blocks: slackMessage.blocks,
      };
    } catch (error) {
      this.runtime.log(`Error sending message with blocks: ${error}`);
      throw error;
    }
  }

  async getChannel(channelId: string): Promise<any> {
    return this.slackManager.getChannel(channelId);
  }

  async getUser(userId: string): Promise<ChannelUser> {
    const user = await this.slackManager.getUser(userId);
    return {
      id: user.id,
      name: user.name,
      realName: user.real_name,
      avatar: user.avatar,
    };
  }

  async listChannels(): Promise<any[]> {
    return this.slackManager.listChannels();
  }

  async listUsers(): Promise<ChannelUser[]> {
    const users = await this.slackManager.listUsers();
    return users.map((user: any) => ({
      id: user.id,
      name: user.name,
      realName: user.real_name,
      avatar: user.avatar,
    }));
  }

  async joinChannel(channelId: string): Promise<boolean> {
    return this.slackManager.joinChannel(channelId);
  }

  async leaveChannel(channelId: string): Promise<boolean> {
    return this.slackManager.leaveChannel(channelId);
  }

  async isConnected(): Promise<boolean> {
    return this.slackManager.isConnectedStatus();
  }

  async getHealthStatus(): Promise<any> {
    const isConnected = await this.isConnected();
    return {
      connected: isConnected,
      status: isConnected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
    };
  }
}

export default {
  name: "slack-enhanced",
  version: "2026.2.17",
  description: "Enhanced Slack message channel plugin for OpenClaw",
  type: "channel" as const,
  main: SlackEnhancedPlugin,
};
