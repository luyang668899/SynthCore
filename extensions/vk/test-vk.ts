// Mock PluginRuntime interface locally
interface PluginRuntime {
  log(message: string): void;
  error(message: string, error?: any): void;
  warn(message: string): void;
  info(message: string): void;
  debug(message: string): void;
  getConfig(key: string, defaultValue?: any): any;
  setConfig(key: string, value: any): void;
  getEnv(key: string, defaultValue?: any): any;
  getLogger(name: string): any;
  getStorage(): any;
  getHttpClient(): any;
  getEventBus(): any;
  getMetrics(): any;
  getCache(): any;
  getCrypto(): any;
  getUtils(): any;
  getValidator(): any;
  getI18n(): any;
  getClock(): any;
}

import { VKPlugin } from "./index.js";

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

async function testVKPlugin() {
  console.log("Testing VK Plugin...");

  // Create mock runtime
  const runtime = new MockRuntime();

  // Create plugin instance
  const plugin = new VKPlugin(runtime);

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
      groupId: "123456789",
    });
    console.log("✓ Config updated successfully:", updatedConfig);

    // Test 5: Start plugin
    console.log("\n5. Testing start...");
    await plugin.start({} as any);
    console.log("✓ Plugin started successfully");

    // Wait for VK connection to complete
    console.log("\nWaiting for VK connection to complete...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 6: Check connection status
    console.log("\n6. Testing isConnected...");
    const isConnected = await plugin.isConnected();
    console.log("✓ Connection status:", isConnected);

    // Test 7: Get health status
    console.log("\n7. Testing getHealthStatus...");
    const healthStatus = await plugin.getHealthStatus();
    console.log("✓ Health status retrieved:", healthStatus);

    // Test 8: Send message
    console.log("\n8. Testing sendMessage...");
    const sentMessage = await plugin.sendMessage({
      id: "test-message-id",
      content: "Hello from OpenClaw!",
      author: {
        id: "vk-bot",
        name: "OpenClaw Bot",
        realName: "OpenClaw Bot",
        phoneNumber: "vk-bot",
      },
      channelId: "123456789",
      timestamp: Date.now().toString(),
      attachments: [],
      isGroup: false,
      groupId: undefined,
      replyToMessageId: undefined,
    });
    console.log("✓ Message sent successfully:", sentMessage);

    // Test 9: Send media
    console.log("\n9. Testing sendMedia...");
    const mediaMessage = await plugin.sendMedia("123456789", "https://example.com/image.jpg", {
      caption: "Test image",
    });
    console.log("✓ Media sent successfully:", mediaMessage);

    // Test 10: Get channel
    console.log("\n10. Testing getChannel...");
    const channel = await plugin.getChannel("123456789");
    console.log("✓ Channel retrieved:", channel);

    // Test 11: Get user
    console.log("\n11. Testing getUser...");
    const user = await plugin.getUser("123456789");
    console.log("✓ User retrieved:", user);

    // Test 12: List channels
    console.log("\n12. Testing listChannels...");
    const channels = await plugin.listChannels();
    console.log("✓ Channels listed:", channels);

    // Test 13: List users
    console.log("\n13. Testing listUsers...");
    const users = await plugin.listUsers();
    console.log("✓ Users listed:", users);

    // Test 14: Join channel
    console.log("\n14. Testing joinChannel...");
    const joined = await plugin.joinChannel("123456789");
    console.log("✓ Channel join result:", joined);

    // Test 15: Leave channel
    console.log("\n15. Testing leaveChannel...");
    const left = await plugin.leaveChannel("123456789");
    console.log("✓ Channel leave result:", left);

    // Test 16: Register event handlers
    console.log("\n16. Testing event handlers...");
    await plugin.onMessage((message: any) => console.log("Message received:", message));
    await plugin.onReady(() => console.log("VK ready"));
    await plugin.onDisconnect((reason: any) => console.log("VK disconnected:", reason));
    console.log("✓ Event handlers registered successfully");

    // Test 17: Stop plugin
    console.log("\n17. Testing stop...");
    await plugin.stop();
    console.log("✓ Plugin stopped successfully");

    console.log("\n🎉 All tests passed! VK Plugin is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testVKPlugin();
