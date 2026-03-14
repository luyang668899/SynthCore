import { OpenClawPluginApi, OpenClawPlugin } from "openclaw/plugin-sdk";
import { MockCalendarManager } from "./src/calendar-manager";

export const CalendarSkillPlugin: OpenClawPlugin = {
  id: "calendar-skill",
  name: "Calendar Skill",
  version: "2026.2.17",
  description: "Calendar management and event reminder skill for OpenClaw",
  author: "OpenClaw Team",
  license: "MIT",

  register: async (api: OpenClawPluginApi) => {
    console.log("Registering Calendar Skill plugin...");

    // Initialize calendar manager with mock implementation for testing
    const calendarManager = new MockCalendarManager();

    // Register calendar tools
    api.registerTool({
      id: "calendar_create_event",
      name: "Create Calendar Event",
      description: "Create a new calendar event",
      parameters: {
        event: {
          type: "object",
          description: "Event details",
          required: true,
        },
      },
      handler: async (params) => {
        const event = params.event as any;
        const newEvent = calendarManager.createEvent(event);
        return { event: newEvent };
      },
    });

    api.registerTool({
      id: "calendar_update_event",
      name: "Update Calendar Event",
      description: "Update an existing calendar event",
      parameters: {
        id: {
          type: "string",
          description: "Event ID",
          required: true,
        },
        updates: {
          type: "object",
          description: "Event updates",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const updates = params.updates as any;
        const updatedEvent = calendarManager.updateEvent(id, updates);
        return { event: updatedEvent };
      },
    });

    api.registerTool({
      id: "calendar_delete_event",
      name: "Delete Calendar Event",
      description: "Delete a calendar event",
      parameters: {
        id: {
          type: "string",
          description: "Event ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const success = calendarManager.deleteEvent(id);
        return { success };
      },
    });

    api.registerTool({
      id: "calendar_get_event",
      name: "Get Calendar Event",
      description: "Get a calendar event by ID",
      parameters: {
        id: {
          type: "string",
          description: "Event ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const event = calendarManager.getEvent(id);
        return { event };
      },
    });

    api.registerTool({
      id: "calendar_get_events_by_user",
      name: "Get Events by User",
      description: "Get all events for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const events = calendarManager.getEventsByUserId(userId);
        return { events };
      },
    });

    api.registerTool({
      id: "calendar_get_events_by_date_range",
      name: "Get Events by Date Range",
      description: "Get events within a date range",
      parameters: {
        startDate: {
          type: "string",
          description: "Start date (ISO format)",
          required: true,
        },
        endDate: {
          type: "string",
          description: "End date (ISO format)",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const startDate = params.startDate as string;
        const endDate = params.endDate as string;
        const userId = params.userId as string;
        const events = calendarManager.getEventsByDateRange(startDate, endDate, userId);
        return { events };
      },
    });

    api.registerTool({
      id: "calendar_get_today_events",
      name: "Get Today Events",
      description: "Get events for today",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const events = calendarManager.getTodayEvents(userId);
        return { events };
      },
    });

    api.registerTool({
      id: "calendar_get_upcoming_events",
      name: "Get Upcoming Events",
      description: "Get upcoming events",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
        days: {
          type: "number",
          description: "Number of days to look ahead",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const days = (params.days as number) || 7;
        const events = calendarManager.getUpcomingEvents(userId, days);
        return { events };
      },
    });

    api.registerTool({
      id: "calendar_get_pending_reminders",
      name: "Get Pending Reminders",
      description: "Get pending event reminders",
      parameters: {},
      handler: async () => {
        const reminders = calendarManager.getPendingReminders();
        return { reminders };
      },
    });

    api.registerTool({
      id: "calendar_mark_reminder_sent",
      name: "Mark Reminder as Sent",
      description: "Mark a reminder as sent",
      parameters: {
        reminderId: {
          type: "string",
          description: "Reminder ID",
          required: true,
        },
      },
      handler: async (params) => {
        const reminderId = params.reminderId as string;
        const success = calendarManager.markReminderAsSent(reminderId);
        return { success };
      },
    });

    api.registerTool({
      id: "calendar_get_stats",
      name: "Get Calendar Stats",
      description: "Get calendar statistics",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const stats = calendarManager.getStats(userId);
        return { stats };
      },
    });

    api.registerTool({
      id: "calendar_config",
      name: "Calendar Config",
      description: "Update calendar configuration",
      parameters: {
        calendar: {
          type: "object",
          description: "Calendar configuration",
          required: true,
        },
      },
      handler: async (params) => {
        const calendarConfig = params.calendar as any;
        calendarManager.updateConfig(calendarConfig);
        return { success: true };
      },
    });

    console.log("Calendar Skill plugin registered successfully");
  },

  unregister: async (api: OpenClawPluginApi) => {
    console.log("Unregistering Calendar Skill plugin...");
    // Cleanup resources if needed
    console.log("Calendar Skill plugin unregistered successfully");
  },
};

export default CalendarSkillPlugin;
