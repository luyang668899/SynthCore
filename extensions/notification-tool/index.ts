import { NotificationManager } from "./src/notification-manager";

export function register() {
  const notificationManager = new NotificationManager();

  return {
    commands: {
      "send-notification": async (args: {
        title: string;
        message: string;
        channel: string;
        recipient?: string;
      }) => {
        try {
          const notification = notificationManager.sendNotification(
            args.title,
            args.message,
            args.channel,
            args.recipient,
          );
          return {
            success: true,
            message: "Notification sent successfully",
            data: notification,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to send notification: ${(error as Error).message}`,
          };
        }
      },
      "list-channels": async () => {
        try {
          const channels = notificationManager.listChannels();
          return {
            success: true,
            message: "Channels listed successfully",
            data: channels,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to list channels: ${(error as Error).message}`,
          };
        }
      },
      "list-notifications": async (args?: {
        status?: string;
        channel?: string;
        recipient?: string;
      }) => {
        try {
          const notifications = notificationManager.listNotifications(args);
          return {
            success: true,
            message: "Notifications listed successfully",
            data: notifications,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to list notifications: ${(error as Error).message}`,
          };
        }
      },
      "get-notification": async (args: { id: string }) => {
        try {
          const notification = notificationManager.getNotification(args.id);
          if (notification) {
            return {
              success: true,
              message: "Notification retrieved successfully",
              data: notification,
            };
          } else {
            return {
              success: false,
              message: "Notification not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to get notification: ${(error as Error).message}`,
          };
        }
      },
      "delete-notification": async (args: { id: string }) => {
        try {
          const deleted = notificationManager.deleteNotification(args.id);
          if (deleted) {
            return {
              success: true,
              message: "Notification deleted successfully",
            };
          } else {
            return {
              success: false,
              message: "Notification not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to delete notification: ${(error as Error).message}`,
          };
        }
      },
      "update-notification-status": async (args: { id: string; status: string }) => {
        try {
          const validStatuses: Array<"pending" | "sent" | "delivered" | "failed"> = [
            "pending",
            "sent",
            "delivered",
            "failed",
          ];
          if (!validStatuses.includes(args.status as any)) {
            return {
              success: false,
              message: "Invalid status. Valid statuses are: pending, sent, delivered, failed",
            };
          }

          const notification = notificationManager.updateNotificationStatus(
            args.id,
            args.status as "pending" | "sent" | "delivered" | "failed",
          );

          if (notification) {
            return {
              success: true,
              message: "Notification status updated successfully",
              data: notification,
            };
          } else {
            return {
              success: false,
              message: "Notification not found",
            };
          }
        } catch (error) {
          return {
            success: false,
            message: `Failed to update notification status: ${(error as Error).message}`,
          };
        }
      },
    },
  };
}
