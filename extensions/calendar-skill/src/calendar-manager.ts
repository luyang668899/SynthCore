import { parseISO, addMinutes, isToday } from "date-fns";
import { v4 as uuidv4 } from "uuid";

interface CalendarConfig {
  defaultReminderMinutes: number;
  timezone: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  location: string;
  reminderMinutes: number;
  attendees: string[];
  repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
  userIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface Reminder {
  id: string;
  eventId: string;
  userId: string;
  reminderTime: string;
  sent: boolean;
}

export class CalendarManager {
  private config: CalendarConfig;
  private events: Map<string, CalendarEvent> = new Map();
  private reminders: Map<string, Reminder> = new Map();

  constructor(config: CalendarConfig) {
    this.config = config;
  }

  createEvent(event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.events.set(newEvent.id, newEvent);
    this.scheduleReminders(newEvent);

    return newEvent;
  }

  updateEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const event = this.events.get(id);
    if (!event) {
      return null;
    }

    const updatedEvent: CalendarEvent = {
      ...event,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.events.set(id, updatedEvent);
    this.scheduleReminders(updatedEvent);

    return updatedEvent;
  }

  deleteEvent(id: string): boolean {
    // Remove related reminders
    for (const [reminderId, reminder] of this.reminders.entries()) {
      if (reminder.eventId === id) {
        this.reminders.delete(reminderId);
      }
    }

    return this.events.delete(id);
  }

  getEvent(id: string): CalendarEvent | null {
    return this.events.get(id) || null;
  }

  getEventsByUserId(userId: string): CalendarEvent[] {
    return Array.from(this.events.values()).filter((event) => event.userIds.includes(userId));
  }

  getEventsByDateRange(startDate: string, endDate: string, userId?: string): CalendarEvent[] {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    return Array.from(this.events.values()).filter((event) => {
      const eventStart = parseISO(event.startTime);
      const eventEnd = parseISO(event.endTime);
      const inDateRange = eventStart >= start && eventEnd <= end;
      const forUser = !userId || event.userIds.includes(userId);
      return inDateRange && forUser;
    });
  }

  getTodayEvents(userId?: string): CalendarEvent[] {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    return this.getEventsByDateRange(startOfDay.toISOString(), endOfDay.toISOString(), userId);
  }

  getUpcomingEvents(userId?: string, days: number = 7): CalendarEvent[] {
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.getEventsByDateRange(now.toISOString(), endDate.toISOString(), userId);
  }

  private scheduleReminders(event: CalendarEvent) {
    // Remove existing reminders for this event
    for (const [reminderId, reminder] of this.reminders.entries()) {
      if (reminder.eventId === event.id) {
        this.reminders.delete(reminderId);
      }
    }

    // Schedule new reminders
    event.userIds.forEach((userId) => {
      const eventStart = parseISO(event.startTime);
      const reminderTime = addMinutes(eventStart, -event.reminderMinutes);

      if (reminderTime > new Date()) {
        const reminder: Reminder = {
          id: uuidv4(),
          eventId: event.id,
          userId,
          reminderTime: reminderTime.toISOString(),
          sent: false,
        };
        this.reminders.set(reminder.id, reminder);
      }
    });
  }

  getPendingReminders(): Reminder[] {
    const now = new Date();
    return Array.from(this.reminders.values()).filter((reminder) => {
      const reminderTime = parseISO(reminder.reminderTime);
      return !reminder.sent && reminderTime <= now;
    });
  }

  markReminderAsSent(reminderId: string): boolean {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) {
      return false;
    }

    reminder.sent = true;
    this.reminders.set(reminderId, reminder);
    return true;
  }

  updateConfig(config: Partial<CalendarConfig>) {
    this.config = { ...this.config, ...config };
  }

  getStats(userId?: string): {
    totalEvents: number;
    upcomingEvents: number;
    todayEvents: number;
  } {
    const events = userId ? this.getEventsByUserId(userId) : Array.from(this.events.values());
    const todayEvents = userId ? this.getTodayEvents(userId).length : this.getTodayEvents().length;
    const upcomingEvents = userId
      ? this.getUpcomingEvents(userId).length
      : this.getUpcomingEvents().length;

    return {
      totalEvents: events.length,
      upcomingEvents,
      todayEvents,
    };
  }
}

// Mock implementation for testing
export class MockCalendarManager extends CalendarManager {
  constructor() {
    super({
      defaultReminderMinutes: 15,
      timezone: "Asia/Shanghai",
    });

    // Add some mock events
    this.createEvent({
      title: "Team Meeting",
      description: "Weekly team meeting",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      location: "Conference Room A",
      reminderMinutes: 15,
      attendees: ["alice@example.com", "bob@example.com"],
      repeat: "weekly",
      userIds: ["user1", "user2"],
    });

    this.createEvent({
      title: "Project Deadline",
      description: "Submit project proposal",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
      location: "Online",
      reminderMinutes: 30,
      attendees: ["me@example.com"],
      repeat: "none",
      userIds: ["user1"],
    });
  }

  createEvent(event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">): CalendarEvent {
    console.log("Creating event:", event.title);
    return super.createEvent(event);
  }

  getTodayEvents(userId?: string): CalendarEvent[] {
    const events = super.getTodayEvents(userId);
    console.log(`Found ${events.length} events for today`);
    return events;
  }

  getUpcomingEvents(userId?: string, days: number = 7): CalendarEvent[] {
    const events = super.getUpcomingEvents(userId, days);
    console.log(`Found ${events.length} upcoming events in the next ${days} days`);
    return events;
  }
}
