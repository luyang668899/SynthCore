import { createPlugin } from "openclaw/plugin-sdk";
import { AnalyticsManager, AnalyticsEvent, AnalyticsFilter } from "./src/analytics-manager.ts";

export const plugin = createPlugin({
  name: "analytics-tool",
  version: "1.0.0",
  type: "tool",
  setup: (deps) => {
    const analyticsManager = new AnalyticsManager();

    deps.tools.registerTool({
      name: "analytics:track-event",
      description: "Track an analytics event",
      parameters: {
        type: "object",
        properties: {
          eventType: {
            type: "string",
            description: "Type of the event",
          },
          userId: {
            type: "string",
            description: "User ID",
          },
          sessionId: {
            type: "string",
            description: "Session ID",
          },
          data: {
            type: "object",
            description: "Additional event data",
            additionalProperties: true,
          },
        },
        required: ["eventType", "userId", "sessionId"],
      },
      async execute({ eventType, userId, sessionId, data }) {
        return await analyticsManager.trackEvent({
          eventType,
          userId,
          sessionId,
          data: data || {},
        });
      },
    });

    deps.tools.registerTool({
      name: "analytics:get-events",
      description: "Get analytics events with filters",
      parameters: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description: "Start date for filtering (ISO format)",
          },
          endDate: {
            type: "string",
            description: "End date for filtering (ISO format)",
          },
          eventTypes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Event types to filter",
          },
          userIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "User IDs to filter",
          },
          sessionIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Session IDs to filter",
          },
        },
      },
      async execute({ startDate, endDate, eventTypes, userIds, sessionIds }) {
        return await analyticsManager.getEvents({
          startDate,
          endDate,
          eventTypes,
          userIds,
          sessionIds,
        });
      },
    });

    deps.tools.registerTool({
      name: "analytics:get-metrics",
      description: "Get analytics metrics",
      parameters: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description: "Start date for filtering (ISO format)",
          },
          endDate: {
            type: "string",
            description: "End date for filtering (ISO format)",
          },
          eventTypes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Event types to filter",
          },
          userIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "User IDs to filter",
          },
          sessionIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Session IDs to filter",
          },
        },
      },
      async execute({ startDate, endDate, eventTypes, userIds, sessionIds }) {
        return await analyticsManager.getMetrics({
          startDate,
          endDate,
          eventTypes,
          userIds,
          sessionIds,
        });
      },
    });

    deps.tools.registerTool({
      name: "analytics:generate-report",
      description: "Generate an analytics report",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Report title",
          },
          startDate: {
            type: "string",
            description: "Start date for filtering (ISO format)",
          },
          endDate: {
            type: "string",
            description: "End date for filtering (ISO format)",
          },
          eventTypes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Event types to filter",
          },
          userIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "User IDs to filter",
          },
          sessionIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Session IDs to filter",
          },
        },
        required: ["title"],
      },
      async execute({ title, startDate, endDate, eventTypes, userIds, sessionIds }) {
        return await analyticsManager.generateReport(title, {
          startDate,
          endDate,
          eventTypes,
          userIds,
          sessionIds,
        });
      },
    });

    deps.tools.registerTool({
      name: "analytics:get-session-stats",
      description: "Get session statistics",
      parameters: {},
      async execute() {
        return await analyticsManager.getSessionStats();
      },
    });

    deps.tools.registerTool({
      name: "analytics:get-event-trends",
      description: "Get event trends over time",
      parameters: {
        type: "object",
        properties: {
          interval: {
            type: "string",
            enum: ["day", "week", "month"],
            description: "Time interval for trends",
            default: "day",
          },
          startDate: {
            type: "string",
            description: "Start date for filtering (ISO format)",
          },
          endDate: {
            type: "string",
            description: "End date for filtering (ISO format)",
          },
          eventTypes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Event types to filter",
          },
          userIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "User IDs to filter",
          },
          sessionIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Session IDs to filter",
          },
        },
        required: ["interval"],
      },
      async execute({ interval, startDate, endDate, eventTypes, userIds, sessionIds }) {
        return await analyticsManager.getEventTrends(interval, {
          startDate,
          endDate,
          eventTypes,
          userIds,
          sessionIds,
        });
      },
    });

    deps.tools.registerTool({
      name: "analytics:get-top-event-types",
      description: "Get top event types by count",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of results",
            default: 10,
          },
        },
      },
      async execute({ limit }) {
        return await analyticsManager.getTopEventTypes(limit);
      },
    });

    deps.tools.registerTool({
      name: "analytics:get-top-users",
      description: "Get top users by event count",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of results",
            default: 10,
          },
        },
      },
      async execute({ limit }) {
        return await analyticsManager.getTopUsers(limit);
      },
    });

    return {
      analyticsManager,
    };
  },
});

export default plugin;
