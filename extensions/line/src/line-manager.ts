import {
  Client,
  ClientConfig,
  Message,
  TextMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  FileMessage,
  LocationMessage,
  StickerMessage,
  FlexMessage,
  TemplateMessage,
} from "@line/bot-sdk";
import express from "express";

interface LineManagerOptions {
  channelAccessToken: string;
  channelSecret: string;
  webhookPort?: number;
  messageDelay?: number;
  maxMessages?: number;
}

class LineManager {
  private client: any;
  private options: LineManagerOptions;
  private connected = false;
  private app: express.Application;
  private server: any;
  private messages: any[] = [];
  private onMessageCallbacks: ((message: any) => void)[] = [];
  private onReadyCallbacks: (() => void)[] = [];
  private onDisconnectCallbacks: ((reason: string) => void)[] = [];

  constructor(options: LineManagerOptions) {
    this.options = {
      channelAccessToken: "",
      channelSecret: "",
      webhookPort: 3000,
      messageDelay: 1000,
      maxMessages: 100,
      ...options,
    };

    this.app = express();
    this.client = this.createMockClient();
  }

  private createMockClient(): any {
    return {
      pushMessage: async (to: string, message: any) => {
        console.log(`Line message sent to ${to}: ${message.text || "Media message"}`);
        return { messageId: Date.now().toString() };
      },
      replyMessage: async (replyToken: string, message: any) => {
        console.log(`Line message replied: ${message.text || "Media message"}`);
        return { messageId: Date.now().toString() };
      },
      getProfile: async (userId: string) => {
        return {
          userId,
          displayName: "Test User",
          pictureUrl: "https://example.com/avatar.jpg",
          statusMessage: "Hello, Line!",
        };
      },
      getGroupMemberProfile: async (groupId: string, userId: string) => {
        return {
          userId,
          displayName: "Test User",
          pictureUrl: "https://example.com/avatar.jpg",
        };
      },
      getGroupMemberIds: async (groupId: string) => {
        return ["user1", "user2", "user3"];
      },
      leaveGroup: async (groupId: string) => {
        return { success: true };
      },
      leaveRoom: async (roomId: string) => {
        return { success: true };
      },
    };
  }

  async initialize(): Promise<void> {
    console.log("Line manager initialized");
    this.setupWebhook();
  }

  private setupWebhook(): void {
    this.app.post("/webhook", express.json(), (req, res) => {
      const events = req.body.events;
      events.forEach((event: any) => {
        if (event.type === "message") {
          this.onMessageCallbacks.forEach((callback) => callback(event.message));
        }
      });
      res.json({ success: true });
    });
  }

  async start(): Promise<void> {
    console.log("Connecting to Line...");
    this.server = this.app.listen(this.options.webhookPort, () => {
      console.log(`Line webhook server running on port ${this.options.webhookPort}`);
    });
    this.connected = true;
    this.onReadyCallbacks.forEach((callback) => callback());
  }

  async stop(): Promise<void> {
    console.log("Disconnecting from Line...");
    if (this.server) {
      this.server.close();
    }
    this.connected = false;
    this.onDisconnectCallbacks.forEach((callback) => callback("User logged out"));
  }

  async isConnected(): Promise<boolean> {
    return this.connected;
  }

  async sendMessage(to: string, message: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, this.options.messageDelay));
    return this.client.pushMessage(to, { type: "text", text: message });
  }

  async sendMedia(to: string, mediaUrl: string, options?: { caption?: string }): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, this.options.messageDelay));
    const message: any = {
      type: "image",
      originalContentUrl: mediaUrl,
      previewImageUrl: mediaUrl,
    };
    return this.client.pushMessage(to, message);
  }

  async getProfile(userId: string): Promise<any> {
    return this.client.getProfile(userId);
  }

  async getGroupMembers(groupId: string): Promise<any[]> {
    const memberIds = await this.client.getGroupMemberIds(groupId);
    const members = [];
    for (const id of memberIds) {
      const profile = await this.client.getGroupMemberProfile(groupId, id);
      members.push(profile);
    }
    return members;
  }

  async leaveGroup(groupId: string): Promise<boolean> {
    const result = await this.client.leaveGroup(groupId);
    return result.success;
  }

  async leaveRoom(roomId: string): Promise<boolean> {
    const result = await this.client.leaveRoom(roomId);
    return result.success;
  }

  async onMessage(callback: (message: any) => void): Promise<void> {
    this.onMessageCallbacks.push(callback);
  }

  async onReady(callback: () => void): Promise<void> {
    this.onReadyCallbacks.push(callback);
  }

  async onDisconnect(callback: (reason: string) => void): Promise<void> {
    this.onDisconnectCallbacks.push(callback);
  }

  async getHealthStatus(): Promise<{
    connected: boolean;
    status: string;
    timestamp: string;
  }> {
    return {
      connected: this.connected,
      status: this.connected ? "healthy" : "disconnected",
      timestamp: new Date().toISOString(),
    };
  }
}

export { LineManager };
export type { LineManagerOptions };
