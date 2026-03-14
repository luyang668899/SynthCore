"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockCalendarManager = exports.CalendarManager = void 0;
var uuid_1 = require("uuid");
var date_fns_1 = require("date-fns");
var CalendarManager = /** @class */ (function () {
  function CalendarManager(config) {
    this.events = new Map();
    this.reminders = new Map();
    this.config = config;
  }
  CalendarManager.prototype.createEvent = function (event) {
    var newEvent = __assign(__assign({}, event), {
      id: (0, uuid_1.v4)(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.events.set(newEvent.id, newEvent);
    this.scheduleReminders(newEvent);
    return newEvent;
  };
  CalendarManager.prototype.updateEvent = function (id, updates) {
    var event = this.events.get(id);
    if (!event) {
      return null;
    }
    var updatedEvent = __assign(__assign(__assign({}, event), updates), {
      updatedAt: new Date().toISOString(),
    });
    this.events.set(id, updatedEvent);
    this.scheduleReminders(updatedEvent);
    return updatedEvent;
  };
  CalendarManager.prototype.deleteEvent = function (id) {
    // Remove related reminders
    for (var _i = 0, _a = this.reminders.entries(); _i < _a.length; _i++) {
      var _b = _a[_i],
        reminderId = _b[0],
        reminder = _b[1];
      if (reminder.eventId === id) {
        this.reminders.delete(reminderId);
      }
    }
    return this.events.delete(id);
  };
  CalendarManager.prototype.getEvent = function (id) {
    return this.events.get(id) || null;
  };
  CalendarManager.prototype.getEventsByUserId = function (userId) {
    return Array.from(this.events.values()).filter(function (event) {
      return event.userIds.includes(userId);
    });
  };
  CalendarManager.prototype.getEventsByDateRange = function (startDate, endDate, userId) {
    var start = (0, date_fns_1.parseISO)(startDate);
    var end = (0, date_fns_1.parseISO)(endDate);
    return Array.from(this.events.values()).filter(function (event) {
      var eventStart = (0, date_fns_1.parseISO)(event.startTime);
      var eventEnd = (0, date_fns_1.parseISO)(event.endTime);
      var inDateRange = eventStart >= start && eventEnd <= end;
      var forUser = !userId || event.userIds.includes(userId);
      return inDateRange && forUser;
    });
  };
  CalendarManager.prototype.getTodayEvents = function (userId) {
    var today = new Date();
    var startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );
    return this.getEventsByDateRange(startOfDay.toISOString(), endOfDay.toISOString(), userId);
  };
  CalendarManager.prototype.getUpcomingEvents = function (userId, days) {
    if (days === void 0) {
      days = 7;
    }
    var now = new Date();
    var endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return this.getEventsByDateRange(now.toISOString(), endDate.toISOString(), userId);
  };
  CalendarManager.prototype.scheduleReminders = function (event) {
    var _this = this;
    // Remove existing reminders for this event
    for (var _i = 0, _a = this.reminders.entries(); _i < _a.length; _i++) {
      var _b = _a[_i],
        reminderId = _b[0],
        reminder = _b[1];
      if (reminder.eventId === event.id) {
        this.reminders.delete(reminderId);
      }
    }
    // Schedule new reminders
    event.userIds.forEach(function (userId) {
      var eventStart = (0, date_fns_1.parseISO)(event.startTime);
      var reminderTime = (0, date_fns_1.addMinutes)(eventStart, -event.reminderMinutes);
      if (reminderTime > new Date()) {
        var reminder = {
          id: (0, uuid_1.v4)(),
          eventId: event.id,
          userId: userId,
          reminderTime: reminderTime.toISOString(),
          sent: false,
        };
        _this.reminders.set(reminder.id, reminder);
      }
    });
  };
  CalendarManager.prototype.getPendingReminders = function () {
    var now = new Date();
    return Array.from(this.reminders.values()).filter(function (reminder) {
      var reminderTime = (0, date_fns_1.parseISO)(reminder.reminderTime);
      return !reminder.sent && reminderTime <= now;
    });
  };
  CalendarManager.prototype.markReminderAsSent = function (reminderId) {
    var reminder = this.reminders.get(reminderId);
    if (!reminder) {
      return false;
    }
    reminder.sent = true;
    this.reminders.set(reminderId, reminder);
    return true;
  };
  CalendarManager.prototype.updateConfig = function (config) {
    this.config = __assign(__assign({}, this.config), config);
  };
  CalendarManager.prototype.getStats = function (userId) {
    var events = userId ? this.getEventsByUserId(userId) : Array.from(this.events.values());
    var todayEvents = userId ? this.getTodayEvents(userId).length : this.getTodayEvents().length;
    var upcomingEvents = userId
      ? this.getUpcomingEvents(userId).length
      : this.getUpcomingEvents().length;
    return {
      totalEvents: events.length,
      upcomingEvents: upcomingEvents,
      todayEvents: todayEvents,
    };
  };
  return CalendarManager;
})();
exports.CalendarManager = CalendarManager;
// Mock implementation for testing
var MockCalendarManager = /** @class */ (function (_super) {
  __extends(MockCalendarManager, _super);
  function MockCalendarManager() {
    var _this =
      _super.call(this, {
        defaultReminderMinutes: 15,
        timezone: "Asia/Shanghai",
      }) || this;
    // Add some mock events
    _this.createEvent({
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
    _this.createEvent({
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
    return _this;
  }
  MockCalendarManager.prototype.createEvent = function (event) {
    console.log("Creating event:", event.title);
    return _super.prototype.createEvent.call(this, event);
  };
  MockCalendarManager.prototype.getTodayEvents = function (userId) {
    var events = _super.prototype.getTodayEvents.call(this, userId);
    console.log("Found ".concat(events.length, " events for today"));
    return events;
  };
  MockCalendarManager.prototype.getUpcomingEvents = function (userId, days) {
    if (days === void 0) {
      days = 7;
    }
    var events = _super.prototype.getUpcomingEvents.call(this, userId, days);
    console.log(
      "Found ".concat(events.length, " upcoming events in the next ").concat(days, " days"),
    );
    return events;
  };
  return MockCalendarManager;
})(CalendarManager);
exports.MockCalendarManager = MockCalendarManager;
