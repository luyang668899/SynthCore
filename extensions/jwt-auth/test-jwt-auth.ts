import { JwtAuthPlugin } from "./index";

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

async function testJwtAuthPlugin() {
  console.log("=== Testing JWT Auth Plugin ===\n");

  // Create mock API
  const api = new MockOpenClawPluginApi();

  // Register plugin
  await JwtAuthPlugin.register(api as any);
  console.log("\n");

  try {
    const testUser = {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    };

    // Test 1: Generate token
    console.log("Test 1: Generate JWT Token");
    const generateResult = await api.callTool("jwt_generate_token", { user: testUser });
    console.log("Generated token:", generateResult.token.substring(0, 50) + "...");
    console.log("✓ Token generated successfully");
    console.log("\n");

    const token = generateResult.token;

    // Test 2: Verify token
    console.log("Test 2: Verify JWT Token");
    const verifyResult = await api.callTool("jwt_verify_token", { token });
    console.log("Verified user:", verifyResult.user);
    console.log("✓ Token verified successfully");
    console.log("\n");

    // Test 3: Decode token
    console.log("Test 3: Decode JWT Token");
    const decodeResult = await api.callTool("jwt_decode_token", { token });
    console.log("Decoded claims:", decodeResult.claims);
    console.log("✓ Token decoded successfully");
    console.log("\n");

    // Test 4: Get user tokens
    console.log("Test 4: Get User Tokens");
    const getUserTokensResult = await api.callTool("jwt_get_user_tokens", { userId: testUser.id });
    console.log("User tokens count:", getUserTokensResult.tokens.length);
    console.log("✓ User tokens retrieved successfully");
    console.log("\n");

    // Test 5: Update JWT config
    console.log("Test 5: Update JWT Configuration");
    const configResult = await api.callTool("jwt_config", {
      jwt: {
        secret: "updated-secret-key",
        expiresIn: "2h",
        algorithm: "HS256",
      },
    });
    console.log("Config update result:", configResult);
    console.log("✓ Configuration updated successfully");
    console.log("\n");

    // Test 6: Generate another token with new config
    console.log("Test 6: Generate Another Token with New Config");
    const generateResult2 = await api.callTool("jwt_generate_token", { user: testUser });
    console.log("Generated token 2:", generateResult2.token.substring(0, 50) + "...");
    console.log("✓ Token generated successfully with new config");
    console.log("\n");

    const token2 = generateResult2.token;

    // Test 7: Revoke single token
    console.log("Test 7: Revoke Single Token");
    const revokeResult = await api.callTool("jwt_revoke_token", { token });
    console.log("Revoke result:", revokeResult);
    console.log("✓ Token revoked successfully");
    console.log("\n");

    // Test 8: Get user tokens after revocation
    console.log("Test 8: Get User Tokens After Revocation");
    const getUserTokensResult2 = await api.callTool("jwt_get_user_tokens", { userId: testUser.id });
    console.log("User tokens count after revocation:", getUserTokensResult2.tokens.length);
    console.log("✓ User tokens retrieved successfully after revocation");
    console.log("\n");

    // Test 9: Revoke all user tokens
    console.log("Test 9: Revoke All User Tokens");
    const revokeUserTokensResult = await api.callTool("jwt_revoke_user_tokens", {
      userId: testUser.id,
    });
    console.log("Revoke user tokens result:", revokeUserTokensResult);
    console.log("✓ All user tokens revoked successfully");
    console.log("\n");

    // Test 10: Get user tokens after all revocation
    console.log("Test 10: Get User Tokens After All Revocation");
    const getUserTokensResult3 = await api.callTool("jwt_get_user_tokens", { userId: testUser.id });
    console.log("User tokens count after all revocation:", getUserTokensResult3.tokens.length);
    console.log("✓ User tokens retrieved successfully after all revocation");
    console.log("\n");

    console.log("=== All JWT Auth Plugin Tests Passed! ===");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Unregister plugin
    await JwtAuthPlugin.unregister(api as any);
  }
}

// Run tests
testJwtAuthPlugin();
