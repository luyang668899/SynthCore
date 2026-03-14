import type { ChannelPlugin } from "openclaw/plugin-sdk/core";
import { getRedditRuntime } from "./runtime.js";

export const redditPlugin: Partial<ChannelPlugin> = {
  id: "reddit",
  meta: {
    id: "reddit",
    label: "Reddit",
    selectionLabel: "Reddit",
    docsPath: "/channels/reddit",
    blurb: "Reddit messaging integration",
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
      const runtime = getRedditRuntime();
      const logger = runtime.logging.getChildLogger({ channel: "reddit" });
      logger.info("Reddit channel sendText called");
      return {
        channel: "reddit",
        success: true,
        messageId: "reddit-message-1",
      };
    },
  },
};
