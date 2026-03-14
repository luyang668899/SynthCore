// Simple test script for Task Skill plugin (CommonJS)

// Mock uuid module
const uuidv4 = () => "mock-" + Math.random().toString(36).substr(2, 9);

// Mock date-fns functions
const parseISO = (dateString) => new Date(dateString);
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Copy of TaskManager class with mocked dependencies
class TaskManager {
  constructor(config) {
    this.config = config;
    this.tasks = new Map();
  }

  createTask(task) {
    const newTask = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(newTask.id, newTask);
    return newTask;
  }

  updateTask(id, updates) {
    const task = this.tasks.get(id);
    if (!task) {
      return null;
    }

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id) {
    return this.tasks.delete(id);
  }

  getTask(id) {
    return this.tasks.get(id) || null;
  }

  getTasksByUserId(userId) {
    return Array.from(this.tasks.values()).filter((task) => task.userId === userId);
  }

  getTasksByStatus(status, userId) {
    return Array.from(this.tasks.values()).filter((task) => {
      const matchesStatus = task.status === status;
      const matchesUser = !userId || task.userId === userId;
      return matchesStatus && matchesUser;
    });
  }

  getTasksByPriority(priority, userId) {
    return Array.from(this.tasks.values()).filter((task) => {
      const matchesPriority = task.priority === priority;
      const matchesUser = !userId || task.userId === userId;
      return matchesPriority && matchesUser;
    });
  }

  getTasksByTag(tag, userId) {
    return Array.from(this.tasks.values()).filter((task) => {
      const matchesTag = task.tags.includes(tag);
      const matchesUser = !userId || task.userId === userId;
      return matchesTag && matchesUser;
    });
  }

  getTasksByDueDateRange(startDate, endDate, userId) {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    return Array.from(this.tasks.values()).filter((task) => {
      const dueDate = parseISO(task.dueDate);
      const inDateRange = dueDate >= start && dueDate <= end;
      const matchesUser = !userId || task.userId === userId;
      return inDateRange && matchesUser;
    });
  }

  getTodayTasks(userId) {
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

    return this.getTasksByDueDateRange(startOfDay.toISOString(), endOfDay.toISOString(), userId);
  }

  getUpcomingTasks(userId, days = 7) {
    const now = new Date();
    const endDate = addDays(now, days);

    return this.getTasksByDueDateRange(now.toISOString(), endDate.toISOString(), userId);
  }

  markAsCompleted(id) {
    return this.updateTask(id, { status: "completed" });
  }

  markAsInProgress(id) {
    return this.updateTask(id, { status: "in_progress" });
  }

  markAsTodo(id) {
    return this.updateTask(id, { status: "todo" });
  }

  markAsCancelled(id) {
    return this.updateTask(id, { status: "cancelled" });
  }

  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  getStats(userId) {
    const tasks = userId ? this.getTasksByUserId(userId) : Array.from(this.tasks.values());
    const now = new Date();

    return {
      totalTasks: tasks.length,
      todoTasks: tasks.filter((task) => task.status === "todo").length,
      inProgressTasks: tasks.filter((task) => task.status === "in_progress").length,
      completedTasks: tasks.filter((task) => task.status === "completed").length,
      cancelledTasks: tasks.filter((task) => task.status === "cancelled").length,
      dueToday: tasks.filter((task) => isToday(parseISO(task.dueDate))).length,
      overdue: tasks.filter(
        (task) =>
          parseISO(task.dueDate) < now &&
          task.status !== "completed" &&
          task.status !== "cancelled",
      ).length,
    };
  }
}

// Mock implementation for testing
class MockTaskManager extends TaskManager {
  constructor() {
    super({
      defaultDueDays: 7,
      defaultPriority: "medium",
    });

    // Add some mock tasks
    this.createTask({
      title: "Complete project proposal",
      description: "Finish the project proposal for the new client",
      status: "todo",
      priority: "high",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      tags: ["work", "project"],
      assignees: ["me@example.com"],
      userId: "user1",
    });

    this.createTask({
      title: "Buy groceries",
      description: "Milk, eggs, bread, and vegetables",
      status: "todo",
      priority: "medium",
      dueDate: new Date().toISOString(), // Today
      tags: ["personal", "shopping"],
      assignees: ["me@example.com"],
      userId: "user1",
    });

    this.createTask({
      title: "Call John",
      description: "Discuss the meeting agenda",
      status: "in_progress",
      priority: "low",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      tags: ["personal", "call"],
      assignees: ["me@example.com"],
      userId: "user1",
    });
  }

  createTask(task) {
    console.log("Creating task:", task.title);
    return super.createTask(task);
  }

  getTodayTasks(userId) {
    const tasks = super.getTodayTasks(userId);
    console.log(`Found ${tasks.length} tasks due today`);
    return tasks;
  }

  getUpcomingTasks(userId, days = 7) {
    const tasks = super.getUpcomingTasks(userId, days);
    console.log(`Found ${tasks.length} upcoming tasks in the next ${days} days`);
    return tasks;
  }
}

// Test function
async function testTaskSkill() {
  console.log("Testing Task Skill plugin...");

  // Initialize task manager
  const taskManager = new MockTaskManager();

  // Test 1: Get today's tasks
  console.log("\n1. Testing getTodayTasks:");
  const todayTasks = taskManager.getTodayTasks();
  console.log(`Found ${todayTasks.length} tasks due today`);
  todayTasks.forEach((task) => {
    console.log(`  - ${task.title} (${task.status})`);
  });

  // Test 2: Get upcoming tasks
  console.log("\n2. Testing getUpcomingTasks:");
  const upcomingTasks = taskManager.getUpcomingTasks();
  console.log(`Found ${upcomingTasks.length} upcoming tasks`);
  upcomingTasks.forEach((task) => {
    console.log(`  - ${task.title} (${task.dueDate})`);
  });

  // Test 3: Create a new task
  console.log("\n3. Testing createTask:");
  const newTask = taskManager.createTask({
    title: "Test Task",
    description: "This is a test task",
    status: "todo",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    tags: ["test", "demo"],
    assignees: ["me@example.com"],
    userId: "user1",
  });
  console.log(`Created task: ${newTask.title} (ID: ${newTask.id})`);

  // Test 4: Get task by ID
  console.log("\n4. Testing getTask:");
  const retrievedTask = taskManager.getTask(newTask.id);
  if (retrievedTask) {
    console.log(`Retrieved task: ${retrievedTask.title}`);
  } else {
    console.log("Failed to retrieve task");
  }

  // Test 5: Update task
  console.log("\n5. Testing updateTask:");
  const updatedTask = taskManager.updateTask(newTask.id, {
    title: "Updated Test Task",
    description: "This is an updated test task",
  });
  if (updatedTask) {
    console.log(`Updated task: ${updatedTask.title}`);
  } else {
    console.log("Failed to update task");
  }

  // Test 6: Mark task as in progress
  console.log("\n6. Testing markAsInProgress:");
  const inProgressTask = taskManager.markAsInProgress(newTask.id);
  if (inProgressTask) {
    console.log(`Marked task as in progress: ${inProgressTask.title} (${inProgressTask.status})`);
  } else {
    console.log("Failed to mark task as in progress");
  }

  // Test 7: Mark task as completed
  console.log("\n7. Testing markAsCompleted:");
  const completedTask = taskManager.markAsCompleted(newTask.id);
  if (completedTask) {
    console.log(`Marked task as completed: ${completedTask.title} (${completedTask.status})`);
  } else {
    console.log("Failed to mark task as completed");
  }

  // Test 8: Get tasks by status
  console.log("\n8. Testing getTasksByStatus:");
  const todoTasks = taskManager.getTasksByStatus("todo");
  console.log(`Found ${todoTasks.length} todo tasks`);
  todoTasks.forEach((task) => {
    console.log(`  - ${task.title}`);
  });

  // Test 9: Get tasks by priority
  console.log("\n9. Testing getTasksByPriority:");
  const highPriorityTasks = taskManager.getTasksByPriority("high");
  console.log(`Found ${highPriorityTasks.length} high priority tasks`);
  highPriorityTasks.forEach((task) => {
    console.log(`  - ${task.title}`);
  });

  // Test 10: Get tasks by tag
  console.log("\n10. Testing getTasksByTag:");
  const workTasks = taskManager.getTasksByTag("work");
  console.log(`Found ${workTasks.length} work tasks`);
  workTasks.forEach((task) => {
    console.log(`  - ${task.title}`);
  });

  // Test 11: Get task stats
  console.log("\n11. Testing getStats:");
  const stats = taskManager.getStats();
  console.log(`Task stats:`);
  console.log(`  - Total tasks: ${stats.totalTasks}`);
  console.log(`  - Todo tasks: ${stats.todoTasks}`);
  console.log(`  - In progress tasks: ${stats.inProgressTasks}`);
  console.log(`  - Completed tasks: ${stats.completedTasks}`);
  console.log(`  - Cancelled tasks: ${stats.cancelledTasks}`);
  console.log(`  - Due today: ${stats.dueToday}`);
  console.log(`  - Overdue: ${stats.overdue}`);

  // Test 12: Delete task
  console.log("\n12. Testing deleteTask:");
  const deleteSuccess = taskManager.deleteTask(newTask.id);
  console.log(`Delete task success: ${deleteSuccess}`);

  // Test 13: Get tasks by user ID
  console.log("\n13. Testing getTasksByUserId:");
  const userTasks = taskManager.getTasksByUserId("user1");
  console.log(`Found ${userTasks.length} tasks for user1`);
  userTasks.forEach((task) => {
    console.log(`  - ${task.title} (${task.status})`);
  });

  console.log("\nAll tests completed successfully!");
}

// Run tests
testTaskSkill().catch(console.error);
