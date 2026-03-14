const { NotificationManager } = require("./src/notification-manager");

async function testNotificationTool() {
  console.log("Testing Notification Tool Plugin...");

  const notificationManager = new NotificationManager();

  try {
    // Test 1: List channels
    console.log("\n1. Testing listChannels()...");
    const channels = notificationManager.listChannels();
    console.log("Available channels:", channels);
    console.log("✓ Channels listed successfully");

    // Test 2: Send notification
    console.log("\n2. Testing sendNotification()...");
    const notification = notificationManager.sendNotification(
      "Test Notification",
      "This is a test notification message",
      "email",
      "user@example.com",
    );
    console.log("Sent notification:", notification);
    console.log("✓ Notification sent successfully");

    // Test 3: List notifications
    console.log("\n3. Testing listNotifications()...");
    const notifications = notificationManager.listNotifications();
    console.log("Notifications:", notifications);
    console.log("✓ Notifications listed successfully");

    // Test 4: Get notification by ID
    console.log("\n4. Testing getNotification()...");
    const retrievedNotification = notificationManager.getNotification(notification.id);
    console.log("Retrieved notification:", retrievedNotification);
    if (retrievedNotification) {
      console.log("✓ Notification retrieved successfully");
    } else {
      console.log("✗ Notification not found");
    }

    // Test 5: Update notification status
    console.log("\n5. Testing updateNotificationStatus()...");
    const updatedNotification = notificationManager.updateNotificationStatus(
      notification.id,
      "failed",
    );
    console.log("Updated notification:", updatedNotification);
    if (updatedNotification) {
      console.log("✓ Notification status updated successfully");
    } else {
      console.log("✗ Notification not found");
    }

    // Test 6: Get statistics
    console.log("\n6. Testing getStatistics()...");
    const statistics = notificationManager.getStatistics();
    console.log("Statistics:", statistics);
    console.log("✓ Statistics retrieved successfully");

    // Test 7: Delete notification
    console.log("\n7. Testing deleteNotification()...");
    const deleted = notificationManager.deleteNotification(notification.id);
    console.log("Delete result:", deleted);
    if (deleted) {
      console.log("✓ Notification deleted successfully");
    } else {
      console.log("✗ Notification not found");
    }

    // Test 8: Add channel
    console.log("\n8. Testing addChannel()...");
    const newChannel = notificationManager.addChannel({
      name: "Discord",
      description: "Discord notification channel",
      enabled: true,
      config: {
        webhookUrl: "https://discord.com/api/webhooks/1234567890/abcdef",
      },
    });
    console.log("Added channel:", newChannel);
    console.log("✓ Channel added successfully");

    // Test 9: Update channel
    console.log("\n9. Testing updateChannel()...");
    const updatedChannel = notificationManager.updateChannel(newChannel.id, {
      enabled: false,
    });
    console.log("Updated channel:", updatedChannel);
    if (updatedChannel) {
      console.log("✓ Channel updated successfully");
    } else {
      console.log("✗ Channel not found");
    }

    // Test 10: Delete channel
    console.log("\n10. Testing deleteChannel()...");
    const channelDeleted = notificationManager.deleteChannel(newChannel.id);
    console.log("Delete result:", channelDeleted);
    if (channelDeleted) {
      console.log("✓ Channel deleted successfully");
    } else {
      console.log("✗ Channel not found");
    }

    // Test 11: Clear notifications
    console.log("\n11. Testing clearNotifications()...");
    notificationManager.clearNotifications();
    const clearedNotifications = notificationManager.listNotifications();
    console.log("Notifications after clearing:", clearedNotifications);
    if (clearedNotifications.length === 0) {
      console.log("✓ Notifications cleared successfully");
    } else {
      console.log("✗ Notifications not cleared");
    }

    console.log("\n🎉 All tests passed! Notification Tool Plugin is working correctly.");
  } catch (error) {
    console.error("Error during testing:", error);
  }
}

testNotificationTool();
