"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const webhook_manager_1 = require("./src/webhook-manager");
function register() {
  const webhookManager = new webhook_manager_1.WebhookManager();
  return {
    commands: {
      "create-webhook": async (args) => {
        try {
          const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
          const method = args.method && validMethods.includes(args.method) ? args.method : "POST";
          const webhook = webhookManager.createWebhook(
            args.name,
            args.url,
            method,
            args.headers || {},
            args.enabled !== undefined ? args.enabled : true,
          );
          return {
            success: true,
            message: "Webhook created successfully",
            data: webhook,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to create webhook: ${error.message}`,
          };
        }
      },
      "list-webhooks": async () => {
        try {
          const webhooks = webhookManager.listWebhooks();
          return {
            success: true,
            message: "Webhooks listed successfully",
            data: webhooks,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to list webhooks: ${error.message}`,
          };
        }
      },
      "get-webhook": async (args) => {
        try {
          const webhook = webhookManager.getWebhook(args.id);
          if (webhook) {
            return {
              success: true,
              message: "Webhook retrieved successfully",
              data: webhook,
            };
          } else {
            return {
              success: false,
              message: "Webhook not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to get webhook: ${error.message}`,
          };
        }
      },
      "update-webhook": async (args) => {
        try {
          const updates = {};
          if (args.name !== undefined) updates.name = args.name;
          if (args.url !== undefined) updates.url = args.url;
          if (args.method !== undefined) {
            const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
            if (validMethods.includes(args.method)) {
              updates.method = args.method;
            } else {
              return {
                success: false,
                message: "Invalid method. Valid methods are: GET, POST, PUT, DELETE, PATCH",
              };
            }
          }
          if (args.headers !== undefined) updates.headers = args.headers;
          if (args.enabled !== undefined) updates.enabled = args.enabled;
          const webhook = webhookManager.updateWebhook(args.id, updates);
          if (webhook) {
            return {
              success: true,
              message: "Webhook updated successfully",
              data: webhook,
            };
          } else {
            return {
              success: false,
              message: "Webhook not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to update webhook: ${error.message}`,
          };
        }
      },
      "delete-webhook": async (args) => {
        try {
          const deleted = webhookManager.deleteWebhook(args.id);
          if (deleted) {
            return {
              success: true,
              message: "Webhook deleted successfully",
            };
          } else {
            return {
              success: false,
              message: "Webhook not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to delete webhook: ${error.message}`,
          };
        }
      },
      "enable-webhook": async (args) => {
        try {
          const webhook = webhookManager.enableWebhook(args.id);
          if (webhook) {
            return {
              success: true,
              message: "Webhook enabled successfully",
              data: webhook,
            };
          } else {
            return {
              success: false,
              message: "Webhook not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to enable webhook: ${error.message}`,
          };
        }
      },
      "disable-webhook": async (args) => {
        try {
          const webhook = webhookManager.disableWebhook(args.id);
          if (webhook) {
            return {
              success: true,
              message: "Webhook disabled successfully",
              data: webhook,
            };
          } else {
            return {
              success: false,
              message: "Webhook not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to disable webhook: ${error.message}`,
          };
        }
      },
      "send-webhook": async (args) => {
        try {
          const response = await webhookManager.sendWebhook(args.id, args.data);
          if (response) {
            return {
              success: true,
              message: "Webhook sent successfully",
              data: response,
            };
          } else {
            return {
              success: false,
              message: "Webhook not found or disabled",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to send webhook: ${error.message}`,
          };
        }
      },
    },
  };
}
