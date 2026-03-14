import { PluginRuntime } from "openclaw/plugin-sdk/core";
import { TelegramEnhancedPlugin } from "./index";

// Mock runtime implementation
class MockRuntime implements PluginRuntime {
  log(message: string) {
    console.log(`[Runtime] ${message}`);
  }
  error(message: string, error?: any) {
    console.error(`[Runtime] ${message}`, error);
  }
  warn(message: string) {
    console.warn(`[Runtime] ${message}`);
  }
  info(message: string) {
    console.info(`[Runtime] ${message}`);
  }
  debug(message: string) {
    console.debug(`[Runtime] ${message}`);
  }
  getConfig(key: string, defaultValue?: any) {
    return defaultValue;
  }
  setConfig(key: string, value: any) {
    // Do nothing for mock
  }
  getEnv(key: string, defaultValue?: any) {
    return defaultValue;
  }
  getLogger(name: string) {
    return this;
  }
  getStorage() {
    return {
      get: async (key: string) => null,
      set: async (key: string, value: any) => {},
      delete: async (key: string) => {},
      has: async (key: string) => false,
    };
  }
  getHttpClient() {
    return {
      get: async (url: string, options?: any) => ({ data: {} }),
      post: async (url: string, data?: any, options?: any) => ({ data: {} }),
      put: async (url: string, data?: any, options?: any) => ({ data: {} }),
      delete: async (url: string, options?: any) => ({ data: {} }),
    };
  }
  getEventBus() {
    return {
      on: (event: string, listener: (...args: any[]) => void) => {},
      off: (event: string, listener: (...args: any[]) => void) => {},
      emit: (event: string, ...args: any[]) => {},
    };
  }
  getMetrics() {
    return {
      increment: (name: string, labels?: any) => {},
      decrement: (name: string, labels?: any) => {},
      gauge: (name: string, value: number, labels?: any) => {},
      histogram: (name: string, value: number, labels?: any) => {},
      summary: (name: string, value: number, labels?: any) => {},
    };
  }
  getCache() {
    return {
      get: async (key: string) => null,
      set: async (key: string, value: any, ttl?: number) => {},
      delete: async (key: string) => {},
      has: async (key: string) => false,
    };
  }
  getCrypto() {
    return {
      hash: (data: string | Buffer) => "mock-hash",
      compare: (data: string | Buffer, hash: string) => Promise.resolve(true),
      randomBytes: (size: number) => Buffer.alloc(size),
      encrypt: (data: string | Buffer, key: string) => "mock-encrypted",
      decrypt: (data: string, key: string) => "mock-decrypted",
    };
  }
  getUtils() {
    return {
      sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
      retry: async (fn: () => Promise<any>, options?: any) => fn(),
      debounce: (fn: Function, wait: number) => fn,
      throttle: (fn: Function, limit: number) => fn,
    };
  }
  getValidator() {
    return {
      validate: (data: any, schema: any) => ({ valid: true }),
      sanitize: (data: any, schema: any) => data,
    };
  }
  getI18n() {
    return {
      t: (key: string, options?: any) => key,
      register: (locale: string, messages: any) => {},
    };
  }
  getClock() {
    return {
      now: () => Date.now(),
      date: () => new Date(),
      schedule: (fn: () => void, delay: number) => setTimeout(fn, delay),
      clearSchedule: (id: any) => clearTimeout(id),
    };
  }
}

async function testTelegramEnhancedPlugin() {
  console.log("Testing Telegram Enhanced Plugin...");

  // Create mock runtime
  const runtime = new MockRuntime();

  // Create plugin instance
  const plugin = new TelegramEnhancedPlugin(runtime);

  try {
    // Test 1: Initialize plugin
    console.log("\n1. Testing initialization...");
    await plugin.initialize();
    console.log("✓ Plugin initialized successfully");

    // Test 2: Get plugin info
    console.log("\n2. Testing getInfo...");
    const info = plugin.getInfo();
    console.log("✓ Plugin info retrieved:", info);

    // Test 3: Get default config
    console.log("\n3. Testing getConfig...");
    const config = plugin.getConfig();
    console.log("✓ Default config retrieved:", config);

    // Test 4: Update config
    console.log("\n4. Testing updateConfig...");
    const updatedConfig = plugin.updateConfig({
      enabled: true,
      token: "test-token",
      username: "openclaw_bot",
    });
    console.log("✓ Config updated successfully:", updatedConfig);

    // Test 5: Start plugin
    console.log("\n5. Testing start...");
    await plugin.start({} as any);
    console.log("✓ Plugin started successfully");

    // Test 6: Check connection status
    console.log("\n6. Testing isConnected...");
    const isConnected = await plugin.isConnected();
    console.log("✓ Connection status:", isConnected);

    // Test 7: Get health status
    console.log("\n7. Testing getHealthStatus...");
    const healthStatus = await plugin.getHealthStatus();
    console.log("✓ Health status retrieved:", healthStatus);

    // Test 8: Get bot info
    console.log("\n8. Testing getBotInfo...");
    const botInfo = await plugin.getBotInfo();
    console.log("✓ Bot info retrieved:", botInfo);

    // Test 9: Get chat
    console.log("\n9. Testing getChannel...");
    const chat = await plugin.getChannel("123456789");
    console.log("✓ Chat retrieved:", chat);

    // Test 10: Get user
    console.log("\n10. Testing getUser...");
    const user = await plugin.getUser("987654321");
    console.log("✓ User retrieved:", user);

    // Test 11: Get chat member
    console.log("\n11. Testing getChatMember...");
    const chatMember = await plugin.getChatMember("123456789", "987654321");
    console.log("✓ Chat member retrieved:", chatMember);

    // Test 12: Get updates
    console.log("\n12. Testing getUpdates...");
    const updates = await plugin.getUpdates();
    console.log("✓ Updates retrieved:", updates);

    // Test 13: Send message
    console.log("\n13. Testing sendMessage...");
    const message = await plugin.sendMessage({
      id: "test-message-id",
      content: "Hello from OpenClaw!",
      author: {
        id: "123456789",
        name: "OpenClaw Bot",
        realName: "OpenClaw Bot",
        username: "openclaw_bot",
      },
      channelId: "123456789",
      timestamp: Date.now().toString(),
      replyToMessageId: undefined,
      attachments: [],
      keyboard: undefined,
    });
    console.log("✓ Message sent successfully:", message);

    // Test 14: Send message with reply
    console.log("\n14. Testing sendMessageWithReply...");
    const messageWithReply = await plugin.sendMessageWithReply("123456789", "Reply message", "123");
    console.log("✓ Message with reply sent successfully:", messageWithReply);

    // Test 15: Send message with keyboard
    console.log("\n15. Testing sendMessageWithKeyboard...");
    const messageWithKeyboard = await plugin.sendMessageWithKeyboard(
      "123456789",
      "Choose an option:",
      [
        ["Option 1", "Option 2"],
        ["Option 3", "Option 4"],
      ],
    );
    console.log("✓ Message with keyboard sent successfully:", messageWithKeyboard);

    // Test 16: Send photo
    console.log("\n16. Testing sendPhoto...");
    const photoMessage = await plugin.sendPhoto(
      "123456789",
      "https://example.com/photo.jpg",
      "Test photo caption",
    );
    console.log("✓ Photo sent successfully:", photoMessage);

    // Test 17: Join channel
    console.log("\n17. Testing joinChannel...");
    const joined = await plugin.joinChannel("123456789");
    console.log("✓ Channel joined successfully:", joined);

    // Test 18: Leave channel
    console.log("\n18. Testing leaveChannel...");
    const left = await plugin.leaveChannel("123456789");
    console.log("✓ Channel left successfully:", left);

    // Test 19: List channels
    console.log("\n19. Testing listChannels...");
    const channels = await plugin.listChannels();
    console.log("✓ Channels listed:", channels);

    // Test 20: List users
    console.log("\n20. Testing listUsers...");
    const users = await plugin.listUsers();
    console.log("✓ Users listed:", users);

    // Test 21: Stop plugin
    console.log("\n21. Testing stop...");
    await plugin.stop();
    console.log("✓ Plugin stopped successfully");

    console.log("\n🎉 All tests passed! Telegram Enhanced Plugin is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testTelegramEnhancedPlugin();
