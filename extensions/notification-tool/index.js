"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const notification_manager_1 = require("./src/notification-manager");
function register() {
  const notificationManager = new notification_manager_1.NotificationManager();
  return {
    commands: {
      "send-notification": async (args) => {
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
            message: `Failed to send notification: ${error.message}`,
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
            message: `Failed to list channels: ${error.message}`,
          };
        }
      },
      "list-notifications": async (args) => {
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
            message: `Failed to list notifications: ${error.message}`,
          };
        }
      },
      "get-notification": async (args) => {
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
            message: `Failed to get notification: ${error.message}`,
          };
        }
      },
      "delete-notification": async (args) => {
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
            message: `Failed to delete notification: ${error.message}`,
          };
        }
      },
      "update-notification-status": async (args) => {
        try {
          const validStatuses = ["pending", "sent", "delivered", "failed"];
          if (!validStatuses.includes(args.status)) {
            return {
              success: false,
              message: "Invalid status. Valid statuses are: pending, sent, delivered, failed",
            };
          }
          const notification = notificationManager.updateNotificationStatus(args.id, args.status);
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
            message: `Failed to update notification status: ${error.message}`,
          };
        }
      },
    },
  };
}
