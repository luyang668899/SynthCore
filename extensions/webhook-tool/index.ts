import { WebhookManager } from "./src/webhook-manager";

export function register() {
  const webhookManager = new WebhookManager();

  return {
    commands: {
      "create-webhook": async (args: {
        name: string;
        url: string;
        method?: string;
        headers?: Record<string, string>;
        enabled?: boolean;
      }) => {
        try {
          const validMethods: Array<"GET" | "POST" | "PUT" | "DELETE" | "PATCH"> = [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
          ];
          const method =
            args.method && validMethods.includes(args.method as any)
              ? (args.method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH")
              : "POST";

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
            message: `Failed to create webhook: ${(error as Error).message}`,
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
            message: `Failed to list webhooks: ${(error as Error).message}`,
          };
        }
      },
      "get-webhook": async (args: { id: string }) => {
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
            message: `Failed to get webhook: ${(error as Error).message}`,
          };
        }
      },
      "update-webhook": async (args: {
        id: string;
        name?: string;
        url?: string;
        method?: string;
        headers?: Record<string, string>;
        enabled?: boolean;
      }) => {
        try {
          const updates: any = {};
          if (args.name !== undefined) updates.name = args.name;
          if (args.url !== undefined) updates.url = args.url;
          if (args.method !== undefined) {
            const validMethods: Array<"GET" | "POST" | "PUT" | "DELETE" | "PATCH"> = [
              "GET",
              "POST",
              "PUT",
              "DELETE",
              "PATCH",
            ];
            if (validMethods.includes(args.method as any)) {
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
            message: `Failed to update webhook: ${(error as Error).message}`,
          };
        }
      },
      "delete-webhook": async (args: { id: string }) => {
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
            message: `Failed to delete webhook: ${(error as Error).message}`,
          };
        }
      },
      "enable-webhook": async (args: { id: string }) => {
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
            message: `Failed to enable webhook: ${(error as Error).message}`,
          };
        }
      },
      "disable-webhook": async (args: { id: string }) => {
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
            message: `Failed to disable webhook: ${(error as Error).message}`,
          };
        }
      },
      "send-webhook": async (args: { id: string; data?: any }) => {
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
            message: `Failed to send webhook: ${(error as Error).message}`,
          };
        }
      },
    },
  };
}
