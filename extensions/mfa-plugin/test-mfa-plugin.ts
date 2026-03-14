import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import mfaPlugin from "./index.js";
import { MFAManager, MFAConfig } from "./src/mfa-manager.js";

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
mfaPlugin.register(mockApi as OpenClawPluginApi);
console.log("Plugin registered successfully");

// 测试MFA管理器
console.log("\n=== Testing MFA manager ===");
const config: MFAConfig = {
  enabled: true,
  required: false,
  methods: ["totp", "sms", "email"],
};

const mfaManager = new MFAManager(mockApi as OpenClawPluginApi, config);
console.log("MFA manager created");

// 测试TOTP功能
console.log("\n=== Testing TOTP functionality ===");
const userId = "test-user-123";

mfaManager
  .generateTOTP(userId)
  .then((result) => {
    console.log("Generated TOTP secret:", result.secret);
    console.log("OTP Auth URL:", result.otpauthUrl);

    // 这里应该使用真实的TOTP应用生成代码进行测试
    // 为了演示，我们使用一个模拟的代码
    const mockCode = "123456";
    return mfaManager.verifyTOTP(userId, mockCode);
  })
  .then((verified) => {
    console.log("TOTP verification result:", verified);

    // 测试SMS功能
    console.log("\n=== Testing SMS functionality ===");
    return mfaManager.sendSMSCode(userId, "+1234567890");
  })
  .then((sent) => {
    console.log("SMS sent:", sent);
    return mfaManager.verifySMSCode(userId, "123456");
  })
  .then((verified) => {
    console.log("SMS verification result:", verified);

    // 测试Email功能
    console.log("\n=== Testing Email functionality ===");
    return mfaManager.sendEmailCode(userId, "test@example.com");
  })
  .then((sent) => {
    console.log("Email sent:", sent);
    return mfaManager.verifyEmailCode(userId, "123456");
  })
  .then((verified) => {
    console.log("Email verification result:", verified);

    // 测试用户状态
    console.log("\n=== Testing user status ===");
    return Promise.all([mfaManager.getUserStatus(userId), mfaManager.isVerified(userId)]);
  })
  .then(([status, isVerified]) => {
    console.log("User MFA status:", JSON.stringify(status, null, 2));
    console.log("Is user verified:", isVerified);

    // 测试禁用MFA
    console.log("\n=== Testing MFA disable ===");
    return mfaManager.disableMFA(userId);
  })
  .then((disabled) => {
    console.log("MFA disabled:", disabled);
    return mfaManager.isVerified(userId);
  })
  .then((isVerified) => {
    console.log("Is user verified after disable:", isVerified);
    console.log("\n=== All tests completed ===");
  })
  .catch((error) => {
    console.error("Error during tests:", error);
  });
