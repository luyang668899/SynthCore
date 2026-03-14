import {
  OpenClawPlugin,
  PluginRuntime,
  Tool,
  ToolContext,
  ChannelPlugin,
  Message,
} from "openclaw/plugin-sdk/core";
import { DiscordManager, DiscordConfig, DiscordMessage } from "./src/discord-manager";

export class DiscordEnhancedPlugin implements OpenClawPlugin, ChannelPlugin {
  private runtime: PluginRuntime;
  private discordManager: DiscordManager;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.discordManager = new DiscordManager(runtime);
  }

  async init() {
    await this.discordManager.init();
    this.runtime.log("Discord enhanced plugin initialized");
  }

  getTools(): Tool[] {
    return [
      {
        name: "discord_connect",
        description: "Connect to Discord",
        parameters: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "Discord bot token",
            },
          },
          required: ["token"],
        },
        handler: async (ctx: ToolContext) => {
          const { token } = ctx.parameters;
          this.discordManager.updateConfig({ token });
          return await this.discordManager.connect();
        },
      },
      {
        name: "discord_disconnect",
        description: "Disconnect from Discord",
        parameters: {},
        handler: async () => {
          return await this.discordManager.disconnect();
        },
      },
      {
        name: "discord_send_message",
        description: "Send message to Discord channel",
        parameters: {
          type: "object",
          properties: {
            channelId: {
              type: "string",
              description: "Discord channel ID",
            },
            content: {
              type: "string",
              description: "Message content",
            },
          },
          required: ["channelId", "content"],
        },
        handler: async (ctx: ToolContext) => {
          const { channelId, content } = ctx.parameters;
          return await this.discordManager.sendMessage(channelId, content);
        },
      },
      {
        name: "discord_send_embed",
        description: "Send embed to Discord channel",
        parameters: {
          type: "object",
          properties: {
            channelId: {
              type: "string",
              description: "Discord channel ID",
            },
            embed: {
              type: "object",
              description: "Discord embed object",
            },
          },
          required: ["channelId", "embed"],
        },
        handler: async (ctx: ToolContext) => {
          const { channelId, embed } = ctx.parameters;
          return await this.discordManager.sendEmbed(channelId, embed);
        },
      },
      {
        name: "discord_get_channel",
        description: "Get Discord channel information",
        parameters: {
          type: "object",
          properties: {
            channelId: {
              type: "string",
              description: "Discord channel ID",
            },
          },
          required: ["channelId"],
        },
        handler: async (ctx: ToolContext) => {
          const { channelId } = ctx.parameters;
          return await this.discordManager.getChannel(channelId);
        },
      },
      {
        name: "discord_get_guild",
        description: "Get Discord guild information",
        parameters: {
          type: "object",
          properties: {
            guildId: {
              type: "string",
              description: "Discord guild ID",
            },
          },
          required: ["guildId"],
        },
        handler: async (ctx: ToolContext) => {
          const { guildId } = ctx.parameters;
          return await this.discordManager.getGuild(guildId);
        },
      },
      {
        name: "discord_get_user",
        description: "Get Discord user information",
        parameters: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "Discord user ID",
            },
          },
          required: ["userId"],
        },
        handler: async (ctx: ToolContext) => {
          const { userId } = ctx.parameters;
          return await this.discordManager.getUser(userId);
        },
      },
      {
        name: "discord_list_channels",
        description: "List Discord channels in a guild",
        parameters: {
          type: "object",
          properties: {
            guildId: {
              type: "string",
              description: "Discord guild ID",
            },
          },
          required: ["guildId"],
        },
        handler: async (ctx: ToolContext) => {
          const { guildId } = ctx.parameters;
          return await this.discordManager.listChannels(guildId);
        },
      },
      {
        name: "discord_list_guilds",
        description: "List Discord guilds",
        parameters: {},
        handler: async () => {
          return await this.discordManager.listGuilds();
        },
      },
      {
        name: "discord_create_channel",
        description: "Create Discord channel",
        parameters: {
          type: "object",
          properties: {
            guildId: {
              type: "string",
              description: "Discord guild ID",
            },
            name: {
              type: "string",
              description: "Channel name",
            },
            type: {
              type: "number",
              description: "Channel type (0 for text, 2 for voice, etc.)",
            },
          },
          required: ["guildId", "name"],
        },
        handler: async (ctx: ToolContext) => {
          const { guildId, name, type = 0 } = ctx.parameters;
          return await this.discordManager.createChannel(guildId, name, type);
        },
      },
      {
        name: "discord_delete_channel",
        description: "Delete Discord channel",
        parameters: {
          type: "object",
          properties: {
            channelId: {
              type: "string",
              description: "Discord channel ID",
            },
          },
          required: ["channelId"],
        },
        handler: async (ctx: ToolContext) => {
          const { channelId } = ctx.parameters;
          return await this.discordManager.deleteChannel(channelId);
        },
      },
      {
        name: "discord_config",
        description: "Get or update Discord configuration",
        parameters: {
          type: "object",
          properties: {
            config: {
              type: "object",
              description: "Discord configuration (optional)",
            },
          },
        },
        handler: async (ctx: ToolContext) => {
          const { config } = ctx.parameters || {};
          if (config) {
            return this.discordManager.updateConfig(config);
          } else {
            return this.discordManager.getConfig();
          }
        },
      },
      {
        name: "discord_status",
        description: "Get Discord connection status",
        parameters: {},
        handler: async () => {
          return {
            connected: this.discordManager.isConnectedStatus(),
          };
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

  // ChannelPlugin methods
  async sendMessage(message: Message): Promise<boolean> {
    try {
      if (!message.channelId) {
        this.runtime.log("Channel ID is required");
        return false;
      }

      await this.discordManager.sendMessage(message.channelId, message.content || "", {
        attachments: message.attachments || [],
        embeds: message.embeds || [],
      });
      return true;
    } catch (error) {
      this.runtime.log(`Error sending message: ${error}`);
      return false;
    }
  }

  async receiveMessage(message: Message): Promise<boolean> {
    // In a real implementation, we would handle incoming messages
    this.runtime.log(`Received message: ${message.content}`);
    return true;
  }

  async getChannelInfo(channelId: string): Promise<any> {
    return await this.discordManager.getChannel(channelId);
  }

  async listChannels(): Promise<any[]> {
    // In a real implementation, we would list all channels
    return [];
  }

  async connect(): Promise<boolean> {
    return await this.discordManager.connect();
  }

  async disconnect(): Promise<boolean> {
    return await this.discordManager.disconnect();
  }

  isConnected(): boolean {
    return this.discordManager.isConnectedStatus();
  }
}

export default DiscordEnhancedPlugin;
