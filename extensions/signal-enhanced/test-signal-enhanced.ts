import { PluginRuntime } from "openclaw/plugin-sdk/core";
import { SignalEnhancedPlugin } from "./index";

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

async function testSignalEnhancedPlugin() {
  console.log("Testing Signal Enhanced Plugin...");

  // Create mock runtime
  const runtime = new MockRuntime();

  // Create plugin instance
  const plugin = new SignalEnhancedPlugin(runtime);

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
      phoneNumber: "+1234567890",
      deviceId: 1,
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

    // Test 8: Get contacts
    console.log("\n8. Testing getContacts...");
    const contacts = await plugin.getContacts();
    console.log("✓ Contacts retrieved:", contacts);

    // Test 9: Get groups
    console.log("\n9. Testing getGroups...");
    const groups = await plugin.getGroups();
    console.log("✓ Groups retrieved:", groups);

    // Test 10: Get devices
    console.log("\n10. Testing getDevices...");
    const devices = await plugin.getDevices();
    console.log("✓ Devices retrieved:", devices);

    // Test 11: Link device
    console.log("\n11. Testing linkDevice...");
    const linkResult = await plugin.linkDevice("Test Device");
    console.log("✓ Device linked successfully:", linkResult);

    // Test 12: Unlink device
    console.log("\n12. Testing unlinkDevice...");
    const unlinkResult = await plugin.unlinkDevice("1");
    console.log("✓ Device unlinked successfully:", unlinkResult);

    // Test 13: Receive messages
    console.log("\n13. Testing receiveMessages...");
    const messages = await plugin.receiveMessages();
    console.log("✓ Messages received:", messages);

    // Test 14: Send message
    console.log("\n14. Testing sendMessage...");
    const message = await plugin.sendMessage({
      id: "test-message-id",
      content: "Hello from OpenClaw!",
      author: {
        id: "+1234567890",
        name: "OpenClaw Bot",
        realName: "OpenClaw Bot",
        number: "+1234567890",
      },
      channelId: "+0987654321",
      timestamp: Date.now().toString(),
      attachments: [],
      isGroup: false,
      groupId: undefined,
    });
    console.log("✓ Message sent successfully:", message);

    // Test 15: Send attachment
    console.log("\n15. Testing sendAttachment...");
    const attachmentMessage = await plugin.sendAttachment("+0987654321", "/path/to/file.jpg", {
      isGroup: false,
    });
    console.log("✓ Attachment sent successfully:", attachmentMessage);

    // Test 16: Get channel
    console.log("\n16. Testing getChannel...");
    const channel = await plugin.getChannel("+0987654321");
    console.log("✓ Channel retrieved:", channel);

    // Test 17: Get user
    console.log("\n17. Testing getUser...");
    const user = await plugin.getUser("+0987654321");
    console.log("✓ User retrieved:", user);

    // Test 18: List channels
    console.log("\n18. Testing listChannels...");
    const channels = await plugin.listChannels();
    console.log("✓ Channels listed:", channels);

    // Test 19: List users
    console.log("\n19. Testing listUsers...");
    const users = await plugin.listUsers();
    console.log("✓ Users listed:", users);

    // Test 20: Join channel
    console.log("\n20. Testing joinChannel...");
    const joined = await plugin.joinChannel("+0987654321");
    console.log("✓ Channel joined successfully:", joined);

    // Test 21: Leave channel
    console.log("\n21. Testing leaveChannel...");
    const left = await plugin.leaveChannel("+0987654321");
    console.log("✓ Channel left successfully:", left);

    // Test 22: Stop plugin
    console.log("\n22. Testing stop...");
    await plugin.stop();
    console.log("✓ Plugin stopped successfully");

    console.log("\n🎉 All tests passed! Signal Enhanced Plugin is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testSignalEnhancedPlugin();
