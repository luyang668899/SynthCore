import { v4 as uuidv4 } from "uuid";

interface Notification {
  id: string;
  title: string;
  message: string;
  channel: string;
  recipient?: string;
  status: "pending" | "sent" | "delivered" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
}

export class NotificationManager {
  private notifications: Notification[] = [];
  private channels: NotificationChannel[] = [
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

  /**
   * Send notification
   * @param title Notification title
   * @param message Notification message
   * @param channel Notification channel
   * @param recipient Notification recipient
   * @returns Notification object
   */
  sendNotification(
    title: string,
    message: string,
    channel: string,
    recipient?: string,
  ): Notification {
    const notification: Notification = {
      id: uuidv4(),
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
  private simulateSend(notification: Notification): void {
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
  listChannels(): NotificationChannel[] {
    return this.channels;
  }

  /**
   * List notifications
   * @param filters Optional filters
   * @returns List of notifications
   */
  listNotifications(filters?: {
    status?: string;
    channel?: string;
    recipient?: string;
  }): Notification[] {
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
  getNotification(id: string): Notification | undefined {
    return this.notifications.find((n) => n.id === id);
  }

  /**
   * Delete notification
   * @param id Notification ID
   * @returns True if deleted
   */
  deleteNotification(id: string): boolean {
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
  updateNotificationStatus(
    id: string,
    status: "pending" | "sent" | "delivered" | "failed",
  ): Notification | undefined {
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
  addChannel(channel: Omit<NotificationChannel, "id">): NotificationChannel {
    const newChannel: NotificationChannel = {
      ...channel,
      id: uuidv4(),
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
  updateChannel(
    id: string,
    updates: Partial<NotificationChannel>,
  ): NotificationChannel | undefined {
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
  deleteChannel(id: string): boolean {
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
  getStatistics(): {
    total: number;
    byStatus: Record<string, number>;
    byChannel: Record<string, number>;
  } {
    const total = this.notifications.length;
    const byStatus: Record<string, number> = {};
    const byChannel: Record<string, number> = {};

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
  clearNotifications(): void {
    this.notifications = [];
  }
}
