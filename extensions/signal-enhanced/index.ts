import {
  PluginRuntime,
  ChannelPlugin,
  ChannelMessage,
  ChannelUser,
  ChannelConfig,
  ChannelContext,
} from "openclaw/plugin-sdk/core";
import { SignalManager, SignalMessage, SignalConfig } from "./src/signal-manager";

export class SignalEnhancedPlugin implements ChannelPlugin {
  private runtime: PluginRuntime;
  private signalManager: SignalManager;
  private context: ChannelContext | null = null;

  constructor(runtime: PluginRuntime) {
    this.runtime = runtime;
    this.signalManager = new SignalManager(runtime);
  }

  async initialize() {
    this.runtime.log("Signal Enhanced plugin initialized");
    await this.signalManager.init();
  }

  async start(context: ChannelContext) {
    this.runtime.log("Signal Enhanced plugin started");
    this.context = context;

    const config = this.getConfig();
    if (config.enabled) {
      await this.signalManager.connect();
    }
  }

  async stop() {
    this.runtime.log("Signal Enhanced plugin stopped");
    await this.signalManager.disconnect();
  }

  getInfo() {
    return {
      id: "signal-enhanced",
      name: "Signal Enhanced",
      description: "Enhanced Signal message channel plugin for OpenClaw",
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
    const signalConfig = this.signalManager.getConfig();
    return {
      enabled: signalConfig.enabled,
      phoneNumber: signalConfig.phoneNumber,
      deviceId: signalConfig.deviceId,
      dataPath: signalConfig.dataPath,
      autoLinkDevice: signalConfig.autoLinkDevice,
      enableCommands: signalConfig.enableCommands,
      commandPrefix: signalConfig.commandPrefix,
      allowedContacts: signalConfig.allowedContacts,
      allowedGroups: signalConfig.allowedGroups,
      useSystemSignal: signalConfig.useSystemSignal,
      systemSignalPath: signalConfig.systemSignalPath,
    };
  }

  updateConfig(config: ChannelConfig): ChannelConfig {
    const updatedConfig = this.signalManager.updateConfig(config);
    return {
      enabled: updatedConfig.enabled,
      phoneNumber: updatedConfig.phoneNumber,
      deviceId: updatedConfig.deviceId,
      dataPath: updatedConfig.dataPath,
      autoLinkDevice: updatedConfig.autoLinkDevice,
      enableCommands: updatedConfig.enableCommands,
      commandPrefix: updatedConfig.commandPrefix,
      allowedContacts: updatedConfig.allowedContacts,
      allowedGroups: updatedConfig.allowedGroups,
      useSystemSignal: updatedConfig.useSystemSignal,
      systemSignalPath: updatedConfig.systemSignalPath,
    };
  }

  async sendMessage(message: ChannelMessage): Promise<ChannelMessage> {
    try {
      const signalMessage = await this.signalManager.sendMessage(
        message.channelId,
        message.content,
        {
          attachments: message.attachments,
          isGroup: message.isGroup,
          groupId: message.groupId,
        },
      );

      return {
        id: signalMessage.id,
        content: signalMessage.content,
        author: {
          id: signalMessage.author.id,
          name: signalMessage.author.name,
          realName: signalMessage.author.name,
          number: signalMessage.author.number,
        },
        channelId: signalMessage.recipient,
        timestamp: signalMessage.timestamp,
        attachments: signalMessage.attachments,
        isGroup: signalMessage.isGroup,
        groupId: signalMessage.groupId,
      };
    } catch (error) {
      this.runtime.log(`Error sending message: ${error}`);
      throw error;
    }
  }

  async sendAttachment(
    channelId: string,
    filePath: string,
    options?: any,
  ): Promise<ChannelMessage> {
    try {
      const signalMessage = await this.signalManager.sendAttachment(channelId, filePath, options);

      return {
        id: signalMessage.id,
        content: signalMessage.content,
        author: {
          id: signalMessage.author.id,
          name: signalMessage.author.name,
          realName: signalMessage.author.name,
          number: signalMessage.author.number,
        },
        channelId: signalMessage.recipient,
        timestamp: signalMessage.timestamp,
        attachments: signalMessage.attachments,
        isGroup: signalMessage.isGroup,
        groupId: signalMessage.groupId,
      };
    } catch (error) {
      this.runtime.log(`Error sending attachment: ${error}`);
      throw error;
    }
  }

  async getChannel(channelId: string): Promise<any> {
    // In a real implementation, we would get channel info from Signal
    return {
      id: channelId,
      name: "Signal Contact/Group",
      type: "signal",
    };
  }

  async getUser(userId: string): Promise<ChannelUser> {
    // In a real implementation, we would get user info from Signal
    return {
      id: userId,
      name: "Test User",
      realName: "Test User",
      number: userId,
    };
  }

  async listChannels(): Promise<any[]> {
    // In a real implementation, we would get channels from Signal
    const contacts = await this.signalManager.getContacts();
    const groups = await this.signalManager.getGroups();
    return [...contacts, ...groups];
  }

  async listUsers(): Promise<ChannelUser[]> {
    // In a real implementation, we would get users from Signal
    const contacts = await this.signalManager.getContacts();
    return contacts.map((contact: any) => ({
      id: contact.id,
      name: contact.name,
      realName: contact.name,
      number: contact.number,
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
    return this.signalManager.isConnectedStatus();
  }

  async getHealthStatus(): Promise<any> {
    const isConnected = await this.isConnected();
    return {
      connected: isConnected,
      status: isConnected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
    };
  }

  async getContacts(): Promise<any[]> {
    return this.signalManager.getContacts();
  }

  async getGroups(): Promise<any[]> {
    return this.signalManager.getGroups();
  }

  async receiveMessages(): Promise<any[]> {
    return this.signalManager.receiveMessages();
  }

  async linkDevice(deviceName: string): Promise<any> {
    return this.signalManager.linkDevice(deviceName);
  }

  async unlinkDevice(deviceId: string): Promise<boolean> {
    return this.signalManager.unlinkDevice(deviceId);
  }

  async getDevices(): Promise<any[]> {
    return this.signalManager.getDevices();
  }
}

export default {
  name: "signal-enhanced",
  version: "2026.2.17",
  description: "Enhanced Signal message channel plugin for OpenClaw",
  type: "channel" as const,
  main: SignalEnhancedPlugin,
};
