import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import ssoIntegrationPlugin from "./index.js";
import { SSOManager, SSOConfig } from "./src/sso-manager.js";

// 模拟插件API
const mockApi: Partial<OpenClawPluginApi> = {
  registerTool: (tool) => {
    console.log(`Registered tool: ${tool.name}`);
  },
  logger: {
    info: (message: string) => console.log(`[INFO] ${message}`),
    error: (message: string) => console.error(`[ERROR] ${message}`),
    debug: (message: string) => console.log(`[DEBUG] ${message}`),
    warn: (message: string) => console.log(`[WARN] ${message}`),
  },
};

// 测试插件注册
console.log("=== Testing plugin registration ===");
ssoIntegrationPlugin.register(mockApi as OpenClawPluginApi);
console.log("Plugin registered successfully");

// 测试SSO管理器
console.log("\n=== Testing SSO manager ===");
const config: SSOConfig = {
  enabled: true,
  providers: {
    google: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      enabled: true,
    },
    github: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      enabled: true,
    },
    microsoft: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      enabled: true,
    },
  },
  callbackUrl: "http://localhost:3000/auth/callback",
  jwtSecret: "test-jwt-secret",
};

const ssoManager = new SSOManager(mockApi as OpenClawPluginApi, config);
console.log("SSO manager created");

// 测试认证URL生成
console.log("\n=== Testing auth URL generation ===");
Promise.all([
  ssoManager.getAuthUrl("google"),
  ssoManager.getAuthUrl("github"),
  ssoManager.getAuthUrl("microsoft"),
])
  .then(([googleUrl, githubUrl, microsoftUrl]) => {
    console.log("Google auth URL:", googleUrl);
    console.log("GitHub auth URL:", githubUrl);
    console.log("Microsoft auth URL:", microsoftUrl);

    // 测试回调处理
    console.log("\n=== Testing callback handling ===");
    return ssoManager.handleCallback("google", "test-code");
  })
  .then((session) => {
    console.log("Session created:", JSON.stringify(session, null, 2));

    // 测试令牌验证
    console.log("\n=== Testing token verification ===");
    return ssoManager.verifyToken(session.token);
  })
  .then((user) => {
    console.log("Verified user:", JSON.stringify(user, null, 2));

    // 测试会话状态
    console.log("\n=== Testing session status ===");
    return ssoManager.getSessionStatus(user!.id);
  })
  .then((status) => {
    console.log("Session status:", JSON.stringify(status, null, 2));

    // 测试注销
    console.log("\n=== Testing logout ===");
    return ssoManager.logout(status!.userId);
  })
  .then((loggedOut) => {
    console.log("Logged out:", loggedOut);

    // 测试注销后的会话状态
    return ssoManager.getSessionStatus("google:test-user");
  })
  .then((status) => {
    console.log("Session status after logout:", status);
    console.log("\n=== All tests completed ===");
  })
  .catch((error) => {
    console.error("Error during tests:", error);
  });
