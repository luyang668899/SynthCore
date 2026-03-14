// Simple test script for Calendar Skill plugin
import { MockCalendarManager } from "./src/calendar-manager";

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

testCalendarSkill().catch(console.error);
