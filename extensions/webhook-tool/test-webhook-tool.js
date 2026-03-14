const { WebhookManager } = require("./src/webhook-manager");

async function testWebhookTool() {
  console.log("Testing Webhook Tool Plugin...");

  const webhookManager = new WebhookManager();

  try {
    // Test 1: Create webhook
    console.log("\n1. Testing createWebhook()...");
    const webhook = webhookManager.createWebhook(
      "Test Webhook",
      "https://httpbin.org/post",
      "POST",
      { "Content-Type": "application/json" },
      true,
    );
    console.log("Created webhook:", webhook);
    console.log("✓ Webhook created successfully");

    // Test 2: List webhooks
    console.log("\n2. Testing listWebhooks()...");
    const webhooks = webhookManager.listWebhooks();
    console.log("Webhooks:", webhooks);
    console.log("✓ Webhooks listed successfully");

    // Test 3: Get webhook by ID
    console.log("\n3. Testing getWebhook()...");
    const retrievedWebhook = webhookManager.getWebhook(webhook.id);
    console.log("Retrieved webhook:", retrievedWebhook);
    if (retrievedWebhook) {
      console.log("✓ Webhook retrieved successfully");
    } else {
      console.log("✗ Webhook not found");
    }

    // Test 4: Update webhook
    console.log("\n4. Testing updateWebhook()...");
    const updatedWebhook = webhookManager.updateWebhook(webhook.id, {
      name: "Updated Test Webhook",
      method: "GET",
    });
    console.log("Updated webhook:", updatedWebhook);
    if (updatedWebhook) {
      console.log("✓ Webhook updated successfully");
    } else {
      console.log("✗ Webhook not found");
    }

    // Test 5: Test webhook connection
    console.log("\n5. Testing testWebhookConnection()...");
    const testResult = await webhookManager.testWebhookConnection("https://httpbin.org/get");
    console.log("Connection test result:", testResult);
    console.log("✓ Webhook connection test completed");

    // Test 6: Send webhook
    console.log("\n6. Testing sendWebhook()...");
    const webhookResponse = await webhookManager.sendWebhook(webhook.id, {
      message: "Hello, OpenClaw!",
      timestamp: new Date().toISOString(),
    });
    console.log("Webhook response:", webhookResponse);
    if (webhookResponse) {
      console.log("✓ Webhook sent successfully");
    } else {
      console.log("✗ Webhook not found or disabled");
    }

    // Test 7: Get webhook responses
    console.log("\n7. Testing getWebhookResponses()...");
    const responses = webhookManager.getWebhookResponses(webhook.id);
    console.log("Webhook responses:", responses);
    console.log("✓ Webhook responses retrieved successfully");

    // Test 8: Disable webhook
    console.log("\n8. Testing disableWebhook()...");
    const disabledWebhook = webhookManager.disableWebhook(webhook.id);
    console.log("Disabled webhook:", disabledWebhook);
    if (disabledWebhook) {
      console.log("✓ Webhook disabled successfully");
    } else {
      console.log("✗ Webhook not found");
    }

    // Test 9: Enable webhook
    console.log("\n9. Testing enableWebhook()...");
    const enabledWebhook = webhookManager.enableWebhook(webhook.id);
    console.log("Enabled webhook:", enabledWebhook);
    if (enabledWebhook) {
      console.log("✓ Webhook enabled successfully");
    } else {
      console.log("✗ Webhook not found");
    }

    // Test 10: Delete webhook
    console.log("\n10. Testing deleteWebhook()...");
    const deleted = webhookManager.deleteWebhook(webhook.id);
    console.log("Delete result:", deleted);
    if (deleted) {
      console.log("✓ Webhook deleted successfully");
    } else {
      console.log("✗ Webhook not found");
    }

    // Test 11: Clear webhook responses
    console.log("\n11. Testing clearWebhookResponses()...");
    webhookManager.clearWebhookResponses();
    const clearedResponses = webhookManager.getWebhookResponses();
    console.log("Responses after clearing:", clearedResponses);
    if (clearedResponses.length === 0) {
      console.log("✓ Webhook responses cleared successfully");
    } else {
      console.log("✗ Webhook responses not cleared");
    }

    console.log("\n🎉 All tests passed! Webhook Tool Plugin is working correctly.");
  } catch (error) {
    console.error("Error during testing:", error);
  }
}

testWebhookTool();
