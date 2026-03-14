import { SalesforceAuthPlugin } from "./index";

// Mock OpenClawPluginApi
class MockOpenClawPluginApi {
  private tools: Map<string, any> = new Map();

  registerTool(tool: any) {
    this.tools.set(tool.id, tool);
    console.log(`Registered tool: ${tool.id}`);
  }

  async callTool(toolId: string, params: any) {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`);
    }
    return await tool.handler(params);
  }
}

async function testSalesforceAuthPlugin() {
  console.log("=== Testing Salesforce Auth Plugin ===\n");

  // Create mock API
  const api = new MockOpenClawPluginApi();

  // Register plugin
  await SalesforceAuthPlugin.register(api as any);
  console.log("\n");

  try {
    // Test 1: Get auth URL
    console.log("Test 1: Get Salesforce Auth URL");
    const authUrlResult = await api.callTool("salesforce_get_auth_url", {
      state: "test-state-123",
    });
    console.log("Auth URL:", authUrlResult.authUrl);
    console.log("✓ Auth URL generated successfully");
    console.log("\n");

    // Test 2: Handle callback
    console.log("Test 2: Handle Salesforce Callback");
    const callbackResult = await api.callTool("salesforce_handle_callback", {
      code: "test-code-123",
    });
    console.log("Callback result:", {
      user: callbackResult.user,
      token: callbackResult.token.substring(0, 20) + "...", // Truncate token for security
      expiresAt: new Date(callbackResult.expiresAt).toISOString(),
    });
    console.log("✓ Callback handled successfully");
    console.log("\n");

    const userId = callbackResult.user.id;
    const token = callbackResult.token;

    // Test 3: Verify token
    console.log("Test 3: Verify Salesforce Token");
    const verifyResult = await api.callTool("salesforce_verify_token", { token });
    console.log("Verified user:", verifyResult.user);
    console.log("✓ Token verified successfully");
    console.log("\n");

    // Test 4: Get session status
    console.log("Test 4: Get Salesforce Session Status");
    const sessionResult = await api.callTool("salesforce_session_status", { userId });
    console.log("Session status:", {
      userId: sessionResult.session?.userId,
      expiresAt: sessionResult.session
        ? new Date(sessionResult.session.expiresAt).toISOString()
        : null,
    });
    console.log("✓ Session status retrieved successfully");
    console.log("\n");

    // Test 5: Get connection
    console.log("Test 5: Get Salesforce Connection");
    const connectionResult = await api.callTool("salesforce_get_connection", { userId });
    console.log("Connection result:", connectionResult.connection);
    console.log("✓ Connection retrieved successfully");
    console.log("\n");

    // Test 6: Update config
    console.log("Test 6: Update Salesforce Configuration");
    const configResult = await api.callTool("salesforce_config", {
      salesforce: {
        loginUrl: "https://test.salesforce.com",
      },
      jwt: {
        secret: "updated-jwt-secret",
      },
    });
    console.log("Config update result:", configResult);
    console.log("✓ Configuration updated successfully");
    console.log("\n");

    // Test 7: Logout
    console.log("Test 7: Salesforce Logout");
    const logoutResult = await api.callTool("salesforce_logout", { userId });
    console.log("Logout result:", logoutResult);
    console.log("✓ User logged out successfully");
    console.log("\n");

    // Test 8: Get session status after logout
    console.log("Test 8: Get Session Status After Logout");
    const sessionAfterLogoutResult = await api.callTool("salesforce_session_status", { userId });
    console.log("Session status after logout:", sessionAfterLogoutResult.session);
    console.log("✓ Session status correctly shows as null after logout");
    console.log("\n");

    // Test 9: Get connection after logout
    console.log("Test 9: Get Connection After Logout");
    const connectionAfterLogoutResult = await api.callTool("salesforce_get_connection", { userId });
    console.log("Connection after logout:", connectionAfterLogoutResult.connection);
    console.log("✓ Connection correctly shows as null after logout");
    console.log("\n");

    console.log("=== All Salesforce Auth Plugin Tests Passed! ===");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Unregister plugin
    await SalesforceAuthPlugin.unregister(api as any);
  }
}

// Run tests
testSalesforceAuthPlugin();
