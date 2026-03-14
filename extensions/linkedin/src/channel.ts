import type { ChannelPlugin } from "openclaw/plugin-sdk/core";
import { getLinkedInRuntime } from "./runtime.js";

export const linkedInPlugin: Partial<ChannelPlugin> = {
  id: "linkedin",
  meta: {
    id: "linkedin",
    label: "LinkedIn",
    selectionLabel: "LinkedIn",
    docsPath: "/channels/linkedin",
    blurb: "LinkedIn messaging integration",
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
      const runtime = getLinkedInRuntime();
      const logger = runtime.logging.getChildLogger({ channel: "linkedin" });
      logger.info("LinkedIn channel sendText called");
      return {
        channel: "linkedin",
        success: true,
        messageId: "linkedin-message-1",
      };
    },
  },
};
