import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface Webhook {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers: Record<string, string>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface WebhookResponse {
  webhookId: string;
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  timestamp: Date;
}

export class WebhookManager {
  private webhooks: Webhook[] = [];
  private webhookResponses: WebhookResponse[] = [];

  /**
   * Create a webhook
   * @param name Webhook name
   * @param url Webhook URL
   * @param method HTTP method
   * @param headers HTTP headers
   * @param enabled Enable webhook
   * @returns Created webhook
   */
  createWebhook(
    name: string,
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "POST",
    headers: Record<string, string> = {},
    enabled: boolean = true,
  ): Webhook {
    const webhook: Webhook = {
      id: uuidv4(),
      name,
      url,
      method,
      headers,
      enabled,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.webhooks.push(webhook);
    return webhook;
  }

  /**
   * List all webhooks
   * @returns List of webhooks
   */
  listWebhooks(): Webhook[] {
    return this.webhooks;
  }

  /**
   * Get webhook by ID
   * @param id Webhook ID
   * @returns Webhook object or undefined
   */
  getWebhook(id: string): Webhook | undefined {
    return this.webhooks.find((w) => w.id === id);
  }

  /**
   * Update webhook
   * @param id Webhook ID
   * @param updates Updates
   * @returns Updated webhook or undefined
   */
  updateWebhook(id: string, updates: Partial<Webhook>): Webhook | undefined {
    const index = this.webhooks.findIndex((w) => w.id === id);
    if (index !== -1) {
      const webhook = this.webhooks[index];
      const updatedWebhook = {
        ...webhook,
        ...updates,
        updatedAt: new Date(),
      };

      this.webhooks[index] = updatedWebhook;
      return updatedWebhook;
    }
    return undefined;
  }

  /**
   * Delete webhook
   * @param id Webhook ID
   * @returns True if deleted
   */
  deleteWebhook(id: string): boolean {
    const index = this.webhooks.findIndex((w) => w.id === id);
    if (index !== -1) {
      this.webhooks.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Enable webhook
   * @param id Webhook ID
   * @returns Updated webhook or undefined
   */
  enableWebhook(id: string): Webhook | undefined {
    return this.updateWebhook(id, { enabled: true });
  }

  /**
   * Disable webhook
   * @param id Webhook ID
   * @returns Updated webhook or undefined
   */
  disableWebhook(id: string): Webhook | undefined {
    return this.updateWebhook(id, { enabled: false });
  }

  /**
   * Send webhook
   * @param id Webhook ID
   * @param data Webhook data
   * @returns Webhook response
   */
  async sendWebhook(id: string, data?: any): Promise<WebhookResponse | undefined> {
    const webhook = this.webhooks.find((w) => w.id === id);
    if (!webhook || !webhook.enabled) {
      return undefined;
    }

    try {
      const response = await axios({
        method: webhook.method,
        url: webhook.url,
        data,
        headers: webhook.headers,
        timeout: 30000, // 30 seconds timeout
      });

      const webhookResponse: WebhookResponse = {
        webhookId: id,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers as Record<string, string>,
        timestamp: new Date(),
      };

      this.webhookResponses.push(webhookResponse);
      return webhookResponse;
    } catch (error: any) {
      const webhookResponse: WebhookResponse = {
        webhookId: id,
        status: error.response?.status || 500,
        statusText: error.response?.statusText || error.message,
        data: error.response?.data || {},
        headers: error.response?.headers || {},
        timestamp: new Date(),
      };

      this.webhookResponses.push(webhookResponse);
      return webhookResponse;
    }
  }

  /**
   * Get webhook responses
   * @param webhookId Optional webhook ID to filter by
   * @returns Webhook responses
   */
  getWebhookResponses(webhookId?: string): WebhookResponse[] {
    if (webhookId) {
      return this.webhookResponses.filter((response) => response.webhookId === webhookId);
    }
    return this.webhookResponses;
  }

  /**
   * Clear webhook responses
   * @param webhookId Optional webhook ID to clear responses for
   */
  clearWebhookResponses(webhookId?: string): void {
    if (webhookId) {
      this.webhookResponses = this.webhookResponses.filter(
        (response) => response.webhookId !== webhookId,
      );
    } else {
      this.webhookResponses = [];
    }
  }

  /**
   * Test webhook connection
   * @param url Webhook URL
   * @returns Test result
   */
  async testWebhookConnection(
    url: string,
  ): Promise<{ success: boolean; message: string; status?: number }> {
    try {
      const response = await axios({
        method: "GET",
        url,
        timeout: 10000, // 10 seconds timeout
      });

      return {
        success: true,
        message: `Connection successful: ${response.status} ${response.statusText}`,
        status: response.status,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        status: error.response?.status,
      };
    }
  }
}
