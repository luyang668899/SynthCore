"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationManager = void 0;
const uuid_1 = require("uuid");
class NotificationManager {
  constructor() {
    this.notifications = [];
    this.channels = [
      {
        id: "email",
        name: "Email",
        description: "Email notification channel",
        enabled: true,
        config: {
          smtpServer: "smtp.example.com",
          port: 587,
          secure: false,
        },
      },
      {
        id: "sms",
        name: "SMS",
        description: "SMS notification channel",
        enabled: true,
        config: {
          apiKey: "your-sms-api-key",
          provider: "twilio",
        },
      },
      {
        id: "push",
        name: "Push",
        description: "Push notification channel",
        enabled: true,
        config: {
          apiKey: "your-push-api-key",
          provider: "firebase",
        },
      },
      {
        id: "webhook",
        name: "Webhook",
        description: "Webhook notification channel",
        enabled: true,
        config: {
          url: "https://example.com/webhook",
        },
      },
    ];
  }
  /**
   * Send notification
   * @param title Notification title
   * @param message Notification message
   * @param channel Notification channel
   * @param recipient Notification recipient
   * @returns Notification object
   */
  sendNotification(title, message, channel, recipient) {
    const notification = {
      id: (0, uuid_1.v4)(),
      title,
      message,
      channel,
      recipient,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notifications.push(notification);
    // Simulate sending notification
    this.simulateSend(notification);
    return notification;
  }
  /**
   * Simulate sending notification
   * @param notification Notification object
   */
  simulateSend(notification) {
    // Simulate network delay
    setTimeout(() => {
      const index = this.notifications.findIndex((n) => n.id === notification.id);
      if (index !== -1) {
        this.notifications[index].status = "sent";
        this.notifications[index].updatedAt = new Date();
        // Simulate delivery
        setTimeout(() => {
          const index = this.notifications.findIndex((n) => n.id === notification.id);
          if (index !== -1) {
            this.notifications[index].status = "delivered";
            this.notifications[index].updatedAt = new Date();
          }
        }, 1000);
      }
    }, 500);
  }
  /**
   * List available notification channels
   * @returns List of channels
   */
  listChannels() {
    return this.channels;
  }
  /**
   * List notifications
   * @param filters Optional filters
   * @returns List of notifications
   */
  listNotifications(filters) {
    let result = [...this.notifications];
    if (filters) {
      if (filters.status) {
        result = result.filter((n) => n.status === filters.status);
      }
      if (filters.channel) {
        result = result.filter((n) => n.channel === filters.channel);
      }
      if (filters.recipient) {
        result = result.filter((n) => n.recipient === filters.recipient);
      }
    }
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  /**
   * Get notification by ID
   * @param id Notification ID
   * @returns Notification object or undefined
   */
  getNotification(id) {
    return this.notifications.find((n) => n.id === id);
  }
  /**
   * Delete notification
   * @param id Notification ID
   * @returns True if deleted
   */
  deleteNotification(id) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * Update notification status
   * @param id Notification ID
   * @param status New status
   * @returns Updated notification or undefined
   */
  updateNotificationStatus(id, status) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications[index].status = status;
      this.notifications[index].updatedAt = new Date();
      return this.notifications[index];
    }
    return undefined;
  }
  /**
   * Add notification channel
   * @param channel Channel object
   * @returns Added channel
   */
  addChannel(channel) {
    const newChannel = {
      ...channel,
      id: (0, uuid_1.v4)(),
    };
    this.channels.push(newChannel);
    return newChannel;
  }
  /**
   * Update notification channel
   * @param id Channel ID
   * @param updates Updates
   * @returns Updated channel or undefined
   */
  updateChannel(id, updates) {
    const index = this.channels.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.channels[index] = {
        ...this.channels[index],
        ...updates,
      };
      return this.channels[index];
    }
    return undefined;
  }
  /**
   * Delete notification channel
   * @param id Channel ID
   * @returns True if deleted
   */
  deleteChannel(id) {
    const index = this.channels.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.channels.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * Get notification statistics
   * @returns Statistics
   */
  getStatistics() {
    const total = this.notifications.length;
    const byStatus = {};
    const byChannel = {};
    this.notifications.forEach((notification) => {
      byStatus[notification.status] = (byStatus[notification.status] || 0) + 1;
      byChannel[notification.channel] = (byChannel[notification.channel] || 0) + 1;
    });
    return {
      total,
      byStatus,
      byChannel,
    };
  }
  /**
   * Clear all notifications
   */
  clearNotifications() {
    this.notifications = [];
  }
}
exports.NotificationManager = NotificationManager;
