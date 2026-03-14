import {
  formatISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import { v4 as uuidv4 } from "uuid";

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  timestamp: string;
  userId: string;
  sessionId: string;
  data: Record<string, any>;
}

export interface AnalyticsFilter {
  startDate?: string;
  endDate?: string;
  eventTypes?: string[];
  userIds?: string[];
  sessionIds?: string[];
}

export interface AnalyticsMetric {
  name: string;
  value: number;
  unit?: string;
}

export interface AnalyticsReport {
  id: string;
  title: string;
  generatedAt: string;
  filters: AnalyticsFilter;
  metrics: AnalyticsMetric[];
  data: any[];
  summary: string;
}

export class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private sessions: Record<string, { start: string; end: string; userId: string }> = {};

  constructor() {
    // 初始化模拟数据
    this.initializeMockData();
  }

  private initializeMockData() {
    const now = new Date();
    const mockEvents: AnalyticsEvent[] = [
      {
        id: uuidv4(),
        eventType: "message_sent",
        timestamp: formatISO(new Date(now.getTime() - 3600000)),
        userId: "user-1",
        sessionId: "session-1",
        data: { channel: "discord", messageLength: 120, attachments: 0 },
      },
      {
        id: uuidv4(),
        eventType: "message_received",
        timestamp: formatISO(new Date(now.getTime() - 3000000)),
        userId: "user-1",
        sessionId: "session-1",
        data: { channel: "discord", messageLength: 80, attachments: 1 },
      },
      {
        id: uuidv4(),
        eventType: "command_executed",
        timestamp: formatISO(new Date(now.getTime() - 2400000)),
        userId: "user-1",
        sessionId: "session-1",
        data: { command: "weather", parameters: { location: "Beijing" } },
      },
      {
        id: uuidv4(),
        eventType: "message_sent",
        timestamp: formatISO(new Date(now.getTime() - 1800000)),
        userId: "user-2",
        sessionId: "session-2",
        data: { channel: "telegram", messageLength: 50, attachments: 0 },
      },
      {
        id: uuidv4(),
        eventType: "message_received",
        timestamp: formatISO(new Date(now.getTime() - 1200000)),
        userId: "user-2",
        sessionId: "session-2",
        data: { channel: "telegram", messageLength: 200, attachments: 2 },
      },
    ];

    this.events = mockEvents;

    // 初始化会话数据
    this.sessions = {
      "session-1": {
        start: formatISO(new Date(now.getTime() - 3600000)),
        end: formatISO(new Date(now.getTime() - 2400000)),
        userId: "user-1",
      },
      "session-2": {
        start: formatISO(new Date(now.getTime() - 1800000)),
        end: formatISO(new Date(now.getTime() - 1200000)),
        userId: "user-2",
      },
    };
  }

  async trackEvent(event: Omit<AnalyticsEvent, "id" | "timestamp">): Promise<AnalyticsEvent> {
    const newEvent: AnalyticsEvent = {
      ...event,
      id: uuidv4(),
      timestamp: formatISO(new Date()),
    };

    this.events.push(newEvent);
    return newEvent;
  }

  async getEvents(filter?: AnalyticsFilter): Promise<AnalyticsEvent[]> {
    let filteredEvents = [...this.events];

    if (filter) {
      if (filter.startDate) {
        filteredEvents = filteredEvents.filter((event) => event.timestamp >= filter.startDate);
      }

      if (filter.endDate) {
        filteredEvents = filteredEvents.filter((event) => event.timestamp <= filter.endDate);
      }

      if (filter.eventTypes && filter.eventTypes.length > 0) {
        filteredEvents = filteredEvents.filter((event) =>
          filter.eventTypes!.includes(event.eventType),
        );
      }

      if (filter.userIds && filter.userIds.length > 0) {
        filteredEvents = filteredEvents.filter((event) => filter.userIds!.includes(event.userId));
      }

      if (filter.sessionIds && filter.sessionIds.length > 0) {
        filteredEvents = filteredEvents.filter((event) =>
          filter.sessionIds!.includes(event.sessionId),
        );
      }
    }

    return filteredEvents;
  }

  async getMetrics(filter?: AnalyticsFilter): Promise<AnalyticsMetric[]> {
    const events = await this.getEvents(filter);
    const metrics: AnalyticsMetric[] = [];

    // 计算事件总数
    metrics.push({
      name: "Total Events",
      value: events.length,
    });

    // 计算唯一用户数
    const uniqueUsers = new Set(events.map((event) => event.userId));
    metrics.push({
      name: "Unique Users",
      value: uniqueUsers.size,
    });

    // 计算唯一会话数
    const uniqueSessions = new Set(events.map((event) => event.sessionId));
    metrics.push({
      name: "Unique Sessions",
      value: uniqueSessions.size,
    });

    // 计算消息平均长度
    const messageEvents = events.filter(
      (event) => event.eventType === "message_sent" || event.eventType === "message_received",
    );
    if (messageEvents.length > 0) {
      const totalMessageLength = messageEvents.reduce(
        (sum, event) => sum + (event.data.messageLength || 0),
        0,
      );
      metrics.push({
        name: "Average Message Length",
        value: Math.round(totalMessageLength / messageEvents.length),
        unit: "characters",
      });
    }

    // 计算附件总数
    const totalAttachments = events.reduce((sum, event) => sum + (event.data.attachments || 0), 0);
    metrics.push({
      name: "Total Attachments",
      value: totalAttachments,
    });

    return metrics;
  }

  async generateReport(title: string, filter?: AnalyticsFilter): Promise<AnalyticsReport> {
    const events = await this.getEvents(filter);
    const metrics = await this.getMetrics(filter);

    // 生成摘要
    const summary = this.generateSummary(events, metrics);

    const report: AnalyticsReport = {
      id: uuidv4(),
      title,
      generatedAt: formatISO(new Date()),
      filters: filter || {},
      metrics,
      data: events,
      summary,
    };

    return report;
  }

  async getSessionStats(): Promise<Record<string, any>> {
    const stats = {
      totalSessions: Object.keys(this.sessions).length,
      averageSessionDuration: 0,
      sessionsPerUser: {} as Record<string, number>,
    };

    // 计算平均会话时长
    let totalDuration = 0;
    Object.values(this.sessions).forEach((session) => {
      const start = new Date(session.start);
      const end = new Date(session.end);
      totalDuration += end.getTime() - start.getTime();

      // 计算每个用户的会话数
      stats.sessionsPerUser[session.userId] = (stats.sessionsPerUser[session.userId] || 0) + 1;
    });

    if (stats.totalSessions > 0) {
      stats.averageSessionDuration = Math.round(totalDuration / stats.totalSessions / 1000); // 转换为秒
    }

    return stats;
  }

  async getEventTrends(
    interval: "day" | "week" | "month",
    filter?: AnalyticsFilter,
  ): Promise<Record<string, number>> {
    const events = await this.getEvents(filter);
    const trends: Record<string, number> = {};

    events.forEach((event) => {
      const date = new Date(event.timestamp);
      let key: string;

      switch (interval) {
        case "day":
          key = formatISO(startOfDay(date)).split("T")[0];
          break;
        case "week":
          key = `${formatISO(startOfWeek(date)).split("T")[0]} to ${formatISO(endOfWeek(date)).split("T")[0]}`;
          break;
        case "month":
          key = formatISO(startOfMonth(date)).split("T")[0].slice(0, 7); // YYYY-MM
          break;
      }

      trends[key] = (trends[key] || 0) + 1;
    });

    return trends;
  }

  async getTopEventTypes(limit: number = 10): Promise<Array<{ eventType: string; count: number }>> {
    const eventCounts: Record<string, number> = {};

    this.events.forEach((event) => {
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;
    });

    return Object.entries(eventCounts)
      .map(([eventType, count]) => ({ eventType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async getTopUsers(
    limit: number = 10,
  ): Promise<Array<{ userId: string; eventCount: number; sessionCount: number }>> {
    const userEventCounts: Record<string, number> = {};
    const userSessionCounts: Record<string, Set<string>> = {};

    this.events.forEach((event) => {
      userEventCounts[event.userId] = (userEventCounts[event.userId] || 0) + 1;

      if (!userSessionCounts[event.userId]) {
        userSessionCounts[event.userId] = new Set();
      }
      userSessionCounts[event.userId].add(event.sessionId);
    });

    return Object.entries(userEventCounts)
      .map(([userId, eventCount]) => ({
        userId,
        eventCount,
        sessionCount: userSessionCounts[userId] ? userSessionCounts[userId].size : 0,
      }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, limit);
  }

  private generateSummary(events: AnalyticsEvent[], metrics: AnalyticsMetric[]): string {
    const totalEvents = metrics.find((m) => m.name === "Total Events")?.value || 0;
    const uniqueUsers = metrics.find((m) => m.name === "Unique Users")?.value || 0;
    const uniqueSessions = metrics.find((m) => m.name === "Unique Sessions")?.value || 0;

    let summary = `This report contains ${totalEvents} events from ${uniqueUsers} unique users across ${uniqueSessions} sessions.`;

    if (events.length > 0) {
      const firstEvent = events.sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0];
      const lastEvent = events.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
      const timeRange = `${firstEvent.timestamp.split("T")[0]} to ${lastEvent.timestamp.split("T")[0]}`;
      summary += ` The data spans from ${timeRange}.`;
    }

    const topEventTypes = this.getTopEventTypes(3);
    if (topEventTypes.length > 0) {
      summary += ` The most common event types were: ${topEventTypes.map((t) => `${t.eventType} (${t.count})`).join(", ")}.`;
    }

    return summary;
  }
}
