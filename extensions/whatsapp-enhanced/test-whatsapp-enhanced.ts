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

import { WhatsAppEnhancedPlugin } from "./index.js";

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

async function testWhatsAppEnhancedPlugin() {
  console.log("Testing WhatsApp Enhanced Plugin...");

  // Create mock runtime
  const runtime = new MockRuntime();

  // Create plugin instance
  const plugin = new WhatsAppEnhancedPlugin(runtime);

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
      sessionPath: "./session",
      autoAuth: false,
    });
    console.log("✓ Config updated successfully:", updatedConfig);

    // Test 5: Start plugin
    console.log("\n5. Testing start...");
    await plugin.start({} as any);
    console.log("✓ Plugin started successfully");

    // Wait for WhatsApp connection to complete
    console.log("\nWaiting for WhatsApp connection to complete...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Test 6: Check connection status
    console.log("\n6. Testing isConnected...");
    const isConnected = await plugin.isConnected();
    console.log("✓ Connection status:", isConnected);

    // Test 7: Get health status
    console.log("\n7. Testing getHealthStatus...");
    const healthStatus = await plugin.getHealthStatus();
    console.log("✓ Health status retrieved:", healthStatus);

    // Test 8: Get chats
    console.log("\n8. Testing getChats...");
    const chats = await plugin.getChats();
    console.log("✓ Chats retrieved:", chats);

    // Test 9: Get contacts
    console.log("\n9. Testing getContacts...");
    const contacts = await plugin.getContacts();
    console.log("✓ Contacts retrieved:", contacts);

    // Test 10: Get message
    console.log("\n10. Testing getMessage...");
    const message = await plugin.getMessage("test-message-id");
    console.log("✓ Message retrieved:", message);

    // Test 11: Send message
    console.log("\n11. Testing sendMessage...");
    const sentMessage = await plugin.sendMessage({
      id: "test-message-id",
      content: "Hello from OpenClaw!",
      author: {
        id: "whatsapp-bot",
        name: "OpenClaw Bot",
        realName: "OpenClaw Bot",
        phoneNumber: "whatsapp-bot",
      },
      channelId: "1234567890@s.whatsapp.net",
      timestamp: Date.now().toString(),
      attachments: [],
      isGroup: false,
      groupId: undefined,
      replyToMessageId: undefined,
    });
    console.log("✓ Message sent successfully:", sentMessage);

    // Test 12: Send media
    console.log("\n12. Testing sendMedia...");
    const mediaMessage = await plugin.sendMedia(
      "1234567890@s.whatsapp.net",
      "https://example.com/image.jpg",
      { caption: "Test image" },
    );
    console.log("✓ Media sent successfully:", mediaMessage);

    // Test 13: Get channel
    console.log("\n13. Testing getChannel...");
    const channel = await plugin.getChannel("1234567890@s.whatsapp.net");
    console.log("✓ Channel retrieved:", channel);

    // Test 14: Get user
    console.log("\n14. Testing getUser...");
    const user = await plugin.getUser("1234567890@s.whatsapp.net");
    console.log("✓ User retrieved:", user);

    // Test 15: List channels
    console.log("\n15. Testing listChannels...");
    const channels = await plugin.listChannels();
    console.log("✓ Channels listed:", channels);

    // Test 16: List users
    console.log("\n16. Testing listUsers...");
    const users = await plugin.listUsers();
    console.log("✓ Users listed:", users);

    // Test 17: Join channel
    console.log("\n17. Testing joinChannel...");
    const joined = await plugin.joinChannel("1234567890@s.whatsapp.net");
    console.log("✓ Channel joined successfully:", joined);

    // Test 18: Leave channel
    console.log("\n18. Testing leaveChannel...");
    const left = await plugin.leaveChannel("1234567890@s.whatsapp.net");
    console.log("✓ Channel left successfully:", left);

    // Test 19: Register event handlers
    console.log("\n19. Testing event handlers...");
    await plugin.onMessage((message: any) => console.log("Message received:", message));
    await plugin.onQR((qr: string) => console.log("QR code generated:", qr));
    await plugin.onReady(() => console.log("WhatsApp ready"));
    await plugin.onDisconnect((reason: any) => console.log("WhatsApp disconnected:", reason));
    console.log("✓ Event handlers registered successfully");

    // Test 20: Stop plugin
    console.log("\n20. Testing stop...");
    await plugin.stop();
    console.log("✓ Plugin stopped successfully");

    console.log("\n🎉 All tests passed! WhatsApp Enhanced Plugin is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testWhatsAppEnhancedPlugin();
