import express from "express";
import { VK } from "vk-io";

interface VKManagerOptions {
  token: string;
  groupId?: string;
  webhookPort?: number;
  messageDelay?: number;
  maxMessages?: number;
}

class VKManager {
  private vk: any;
  private options: VKManagerOptions;
  private connected = false;
  private app: express.Application;
  private server: any;
  private messages: any[] = [];
  private onMessageCallbacks: ((message: any) => void)[] = [];
  private onReadyCallbacks: (() => void)[] = [];
  private onDisconnectCallbacks: ((reason: string) => void)[] = [];

  constructor(options: VKManagerOptions) {
    this.options = {
      token: "",
      groupId: "",
      webhookPort: 3000,
      messageDelay: 1000,
      maxMessages: 100,
      ...options,
    };

    this.app = express();
    this.vk = this.createMockVK();
  }

  private createMockVK(): any {
    return {
      upload: {
        photoMessages: async (params: any) => {
          return [{ id: "123", owner_id: "-123456789" }];
        },
      },
      api: {
        messages: {
          send: async (params: any) => {
            console.log(
              `VK message sent to ${params.peer_id}: ${params.message || "Media message"}`,
            );
            return { message_id: Date.now() };
          },
          getConversations: async (params: any) => {
            return {
              items: [
                {
                  conversation: {
                    peer: {
                      id: 123456789,
                      type: "user",
                    },
                    last_message: {
                      text: "Test message",
                      date: Math.floor(Date.now() / 1000),
                    },
                  },
                },
              ],
            };
          },
        },
        users: {
          get: async (params: any) => {
            return [
              {
                id: params.user_ids.split(","),
                first_name: "Test",
                last_name: "User",
              },
            ];
          },
        },
        groups: {
          getById: async (params: any) => {
            return [
              {
                id: params.group_id,
                name: "Test Group",
              },
            ];
          },
        },
      },
      on: (event: string, callback: any) => {
        if (event === "message_new") {
          this.onMessageCallbacks.push(callback);
        } else if (event === "ready") {
          this.onReadyCallbacks.push(callback);
        } else if (event === "error") {
          this.onDisconnectCallbacks.push(callback);
        }
      },
      start: async () => {
        console.log("VK client initialized");
        this.connected = true;
        this.onReadyCallbacks.forEach((callback) => callback());
      },
      stop: async () => {
        console.log("VK client stopped");
        this.connected = false;
        this.onDisconnectCallbacks.forEach((callback) => callback("User logged out"));
      },
    };
  }

  async initialize(): Promise<void> {
    console.log("VK manager initialized");
    this.setupWebhook();
  }

  private setupWebhook(): void {
    this.app.post("/webhook", express.json(), (req, res) => {
      const update = req.body;
      if (update.type === "message_new") {
        this.onMessageCallbacks.forEach((callback) => callback(update.object));
      }
      res.json({ success: true });
    });
  }

  async start(): Promise<void> {
    console.log("Connecting to VK...");
    this.server = this.app.listen(this.options.webhookPort, () => {
      console.log(`VK webhook server running on port ${this.options.webhookPort}`);
    });
    await this.vk.start();
  }

  async stop(): Promise<void> {
    console.log("Disconnecting from VK...");
    if (this.server) {
      this.server.close();
    }
    await this.vk.stop();
  }

  async isConnected(): Promise<boolean> {
    return this.connected;
  }

  async sendMessage(to: string, message: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, this.options.messageDelay));
    return this.vk.api.messages.send({
      peer_id: to,
      message: message,
      random_id: Date.now(),
    });
  }

  async sendMedia(to: string, mediaUrl: string, options?: { caption?: string }): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, this.options.messageDelay));
    const photo = await this.vk.upload.photoMessages({ source: { url: mediaUrl } });
    return this.vk.api.messages.send({
      peer_id: to,
      message: options?.caption || "",
      attachment: `photo${photo[0].owner_id}_${photo[0].id}`,
      random_id: Date.now(),
    });
  }

  async getConversations(): Promise<any[]> {
    const result = await this.vk.api.messages.getConversations();
    return result.items;
  }

  async getUser(userId: string): Promise<any> {
    const result = await this.vk.api.users.get({ user_ids: userId });
    return result[0];
  }

  async getGroup(groupId: string): Promise<any> {
    const result = await this.vk.api.groups.getById({ group_id: groupId });
    return result[0];
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

export { VKManager };
export type { VKManagerOptions };
