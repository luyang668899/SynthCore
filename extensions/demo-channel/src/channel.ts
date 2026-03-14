import type { ChannelPlugin } from "openclaw/plugin-sdk/telegram";
import { getDemoRuntime } from "./runtime.js";

export const demoPlugin: Partial<ChannelPlugin> = {
  id: "demo",
  meta: {
    id: "demo",
    label: "Demo Channel",
    selectionLabel: "Demo",
    docsPath: "/channels/demo",
    blurb: "Demo channel for testing",
  },
  capabilities: {
    chatTypes: ["direct"],
  },
  config: {
    listAccountIds: () => [],
    resolveAccount: () => ({ accountId: "default", enabled: true, config: {} }),
    inspectAccount: () => ({ accountId: "default", enabled: true, config: {} }),
    defaultAccountId: () => "default",
    setAccountEnabled: () => ({}),
    deleteAccount: () => ({}),
    isConfigured: () => true,
    unconfiguredReason: () => "",
    describeAccount: () => ({ accountId: "default", configured: true, enabled: true }),
  },
  outbound: {
    deliveryMode: "direct",
    sendText: async () => {
      const runtime = getDemoRuntime();
      const logger = runtime.logging.getChildLogger({ channel: "demo" });
      logger.info("Demo channel sendText called");
      return {
        channel: "demo",
        success: true,
        messageId: "demo-message-1",
      };
    },
  },
};
