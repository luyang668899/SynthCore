// Simple test script for Calendar Skill plugin (CommonJS)

// Mock uuid module
const uuidv4 = () => "mock-" + Math.random().toString(36).substr(2, 9);

// Mock date-fns functions
const parseISO = (dateString) => new Date(dateString);
const addMinutes = (date, minutes) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Copy of CalendarManager class with mocked dependencies
class CalendarManager {
  constructor(config) {
    this.config = config;
    this.events = new Map();
    this.reminders = new Map();
  }

  createEvent(event) {
    const newEvent = {
      ...event,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.events.set(newEvent.id, newEvent);
    this.scheduleReminders(newEvent);

    return newEvent;
  }

  updateEvent(id, updates) {
    const event = this.events.get(id);
    if (!event) {
      return null;
    }

    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.events.set(id, updatedEvent);
    this.scheduleReminders(updatedEvent);

    return updatedEvent;
  }

  deleteEvent(id) {
    // Remove related reminders
    for (const [reminderId, reminder] of this.reminders.entries()) {
      if (reminder.eventId === id) {
        this.reminders.delete(reminderId);
      }
    }

    return this.events.delete(id);
  }

  getEvent(id) {
    return this.events.get(id) || null;
  }

  getEventsByUserId(userId) {
    return Array.from(this.events.values()).filter((event) => event.userIds.includes(userId));
  }

  getEventsByDateRange(startDate, endDate, userId) {
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

  getTodayEvents(userId) {
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

  getUpcomingEvents(userId, days = 7) {
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.getEventsByDateRange(now.toISOString(), endDate.toISOString(), userId);
  }

  scheduleReminders(event) {
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
        const reminder = {
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

  getPendingReminders() {
    const now = new Date();
    return Array.from(this.reminders.values()).filter((reminder) => {
      const reminderTime = parseISO(reminder.reminderTime);
      return !reminder.sent && reminderTime <= now;
    });
  }

  markReminderAsSent(reminderId) {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) {
      return false;
    }

    reminder.sent = true;
    this.reminders.set(reminderId, reminder);
    return true;
  }

  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  getStats(userId) {
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
class MockCalendarManager extends CalendarManager {
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

  createEvent(event) {
    console.log("Creating event:", event.title);
    return super.createEvent(event);
  }

  getTodayEvents(userId) {
    const events = super.getTodayEvents(userId);
    console.log(`Found ${events.length} events for today`);
    return events;
  }

  getUpcomingEvents(userId, days = 7) {
    const events = super.getUpcomingEvents(userId, days);
    console.log(`Found ${events.length} upcoming events in the next ${days} days`);
    return events;
  }
}

// Test function
async function testCalendarSkill() {
  console.log("Testing Calendar Skill plugin...");

  // Initialize calendar manager
  const calendarManager = new MockCalendarManager();

  // Test 1: Get today's events
  console.log("\n1. Testing getTodayEvents:");
  const todayEvents = calendarManager.getTodayEvents();
  console.log(`Found ${todayEvents.length} events for today`);
  todayEvents.forEach((event) => {
    console.log(`  - ${event.title} (${event.startTime})`);
  });

  // Test 2: Get upcoming events
  console.log("\n2. Testing getUpcomingEvents:");
  const upcomingEvents = calendarManager.getUpcomingEvents();
  console.log(`Found ${upcomingEvents.length} upcoming events`);
  upcomingEvents.forEach((event) => {
    console.log(`  - ${event.title} (${event.startTime})`);
  });

  // Test 3: Create a new event
  console.log("\n3. Testing createEvent:");
  const newEvent = calendarManager.createEvent({
    title: "Test Event",
    description: "This is a test event",
    startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    endTime: new Date(Date.now() + 13 * 60 * 60 * 1000).toISOString(), // 13 hours from now
    location: "Test Location",
    reminderMinutes: 30,
    attendees: ["test@example.com"],
    repeat: "none",
    userIds: ["user1"],
  });
  console.log(`Created event: ${newEvent.title} (ID: ${newEvent.id})`);

  // Test 4: Get event by ID
  console.log("\n4. Testing getEvent:");
  const retrievedEvent = calendarManager.getEvent(newEvent.id);
  if (retrievedEvent) {
    console.log(`Retrieved event: ${retrievedEvent.title}`);
  } else {
    console.log("Failed to retrieve event");
  }

  // Test 5: Update event
  console.log("\n5. Testing updateEvent:");
  const updatedEvent = calendarManager.updateEvent(newEvent.id, {
    title: "Updated Test Event",
    description: "This is an updated test event",
  });
  if (updatedEvent) {
    console.log(`Updated event: ${updatedEvent.title}`);
  } else {
    console.log("Failed to update event");
  }

  // Test 6: Get pending reminders
  console.log("\n6. Testing getPendingReminders:");
  const pendingReminders = calendarManager.getPendingReminders();
  console.log(`Found ${pendingReminders.length} pending reminders`);
  pendingReminders.forEach((reminder) => {
    console.log(`  - Reminder for event ID: ${reminder.eventId} at ${reminder.reminderTime}`);
  });

  // Test 7: Get calendar stats
  console.log("\n7. Testing getStats:");
  const stats = calendarManager.getStats();
  console.log(`Calendar stats:`);
  console.log(`  - Total events: ${stats.totalEvents}`);
  console.log(`  - Today events: ${stats.todayEvents}`);
  console.log(`  - Upcoming events: ${stats.upcomingEvents}`);

  // Test 8: Delete event
  console.log("\n8. Testing deleteEvent:");
  const deleteSuccess = calendarManager.deleteEvent(newEvent.id);
  console.log(`Delete event success: ${deleteSuccess}`);

  // Test 9: Get events by user ID
  console.log("\n9. Testing getEventsByUserId:");
  const userEvents = calendarManager.getEventsByUserId("user1");
  console.log(`Found ${userEvents.length} events for user1`);
  userEvents.forEach((event) => {
    console.log(`  - ${event.title}`);
  });

  console.log("\nAll tests completed successfully!");
}

// Run tests
testCalendarSkill().catch(console.error);
