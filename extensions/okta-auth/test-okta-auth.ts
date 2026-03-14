import { OktaAuthPlugin } from "./index";

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

async function testOktaAuthPlugin() {
  console.log("=== Testing Okta Auth Plugin ===\n");

  // Create mock API
  const api = new MockOpenClawPluginApi();

  // Register plugin
  await OktaAuthPlugin.register(api as any);
  console.log("\n");

  try {
    // Test 1: Get auth URL
    console.log("Test 1: Get Okta Auth URL");
    const authUrlResult = await api.callTool("okta_get_auth_url", { state: "test-state-123" });
    console.log("Auth URL:", authUrlResult.authUrl);
    console.log("✓ Auth URL generated successfully");
    console.log("\n");

    // Test 2: Handle callback
    console.log("Test 2: Handle Okta Callback");
    const callbackResult = await api.callTool("okta_handle_callback", { code: "test-code-123" });
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
    console.log("Test 3: Verify Okta Token");
    const verifyResult = await api.callTool("okta_verify_token", { token });
    console.log("Verified user:", verifyResult.user);
    console.log("✓ Token verified successfully");
    console.log("\n");

    // Test 4: Get session status
    console.log("Test 4: Get Okta Session Status");
    const sessionResult = await api.callTool("okta_session_status", { userId });
    console.log("Session status:", {
      userId: sessionResult.session?.userId,
      expiresAt: sessionResult.session
        ? new Date(sessionResult.session.expiresAt).toISOString()
        : null,
    });
    console.log("✓ Session status retrieved successfully");
    console.log("\n");

    // Test 5: Update config
    console.log("Test 5: Update Okta Configuration");
    const configResult = await api.callTool("okta_config", {
      okta: {
        issuer: "https://updated-okta-domain.okta.com/oauth2/default",
      },
      jwt: {
        secret: "updated-jwt-secret",
      },
    });
    console.log("Config update result:", configResult);
    console.log("✓ Configuration updated successfully");
    console.log("\n");

    // Test 6: Logout
    console.log("Test 6: Okta Logout");
    const logoutResult = await api.callTool("okta_logout", { userId });
    console.log("Logout result:", logoutResult);
    console.log("✓ User logged out successfully");
    console.log("\n");

    // Test 7: Get session status after logout
    console.log("Test 7: Get Session Status After Logout");
    const sessionAfterLogoutResult = await api.callTool("okta_session_status", { userId });
    console.log("Session status after logout:", sessionAfterLogoutResult.session);
    console.log("✓ Session status correctly shows as null after logout");
    console.log("\n");

    console.log("=== All Okta Auth Plugin Tests Passed! ===");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Unregister plugin
    await OktaAuthPlugin.unregister(api as any);
  }
}

// Run tests
testOktaAuthPlugin();
