"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookManager = void 0;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
class WebhookManager {
  constructor() {
    this.webhooks = [];
    this.webhookResponses = [];
  }
  /**
   * Create a webhook
   * @param name Webhook name
   * @param url Webhook URL
   * @param method HTTP method
   * @param headers HTTP headers
   * @param enabled Enable webhook
   * @returns Created webhook
   */
  createWebhook(name, url, method = "POST", headers = {}, enabled = true) {
    const webhook = {
      id: (0, uuid_1.v4)(),
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
  listWebhooks() {
    return this.webhooks;
  }
  /**
   * Get webhook by ID
   * @param id Webhook ID
   * @returns Webhook object or undefined
   */
  getWebhook(id) {
    return this.webhooks.find((w) => w.id === id);
  }
  /**
   * Update webhook
   * @param id Webhook ID
   * @param updates Updates
   * @returns Updated webhook or undefined
   */
  updateWebhook(id, updates) {
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
  deleteWebhook(id) {
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
  enableWebhook(id) {
    return this.updateWebhook(id, { enabled: true });
  }
  /**
   * Disable webhook
   * @param id Webhook ID
   * @returns Updated webhook or undefined
   */
  disableWebhook(id) {
    return this.updateWebhook(id, { enabled: false });
  }
  /**
   * Send webhook
   * @param id Webhook ID
   * @param data Webhook data
   * @returns Webhook response
   */
  async sendWebhook(id, data) {
    const webhook = this.webhooks.find((w) => w.id === id);
    if (!webhook || !webhook.enabled) {
      return undefined;
    }
    try {
      const response = await (0, axios_1.default)({
        method: webhook.method,
        url: webhook.url,
        data,
        headers: webhook.headers,
        timeout: 30000, // 30 seconds timeout
      });
      const webhookResponse = {
        webhookId: id,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
        timestamp: new Date(),
      };
      this.webhookResponses.push(webhookResponse);
      return webhookResponse;
    } catch (error) {
      const webhookResponse = {
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
  getWebhookResponses(webhookId) {
    if (webhookId) {
      return this.webhookResponses.filter((response) => response.webhookId === webhookId);
    }
    return this.webhookResponses;
  }
  /**
   * Clear webhook responses
   * @param webhookId Optional webhook ID to clear responses for
   */
  clearWebhookResponses(webhookId) {
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
  async testWebhookConnection(url) {
    try {
      const response = await (0, axios_1.default)({
        method: "GET",
        url,
        timeout: 10000, // 10 seconds timeout
      });
      return {
        success: true,
        message: `Connection successful: ${response.status} ${response.statusText}`,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        status: error.response?.status,
      };
    }
  }
}
exports.WebhookManager = WebhookManager;
