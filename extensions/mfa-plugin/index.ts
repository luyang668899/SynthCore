import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { MFAManager, type MFAConfig } from "./src/mfa-manager.js";

let mfaManager: MFAManager | null = null;

const mfaPlugin = {
  id: "mfa-plugin",
  name: "Multi-factor Authentication",
  description: "Multi-factor authentication plugin for OpenClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    // 初始化MFA管理器
    const config: MFAConfig = {
      enabled: true,
      required: false,
      methods: ["totp"],
      smsProvider: undefined,
      emailProvider: undefined,
    };

    mfaManager = new MFAManager(api, config);

    // 注册工具
    api.registerTool({
      name: "mfa_generate_totp",
      label: "Generate TOTP Secret",
      description: "Generate a TOTP secret for MFA",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
        },
        required: ["userId"],
      },
      async execute(_toolCallId: string, params: { userId: string }) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          const result = await mfaManager.generateTOTP(params.userId);
          return {
            content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            details: result,
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.registerTool({
      name: "mfa_verify_totp",
      label: "Verify TOTP Code",
      description: "Verify a TOTP code for MFA",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
          code: { type: "string", description: "TOTP code" },
        },
        required: ["userId", "code"],
      },
      async execute(_toolCallId: string, params: { userId: string; code: string }) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          const verified = await mfaManager.verifyTOTP(params.userId, params.code);
          return {
            content: [{ type: "text" as const, text: `Verified: ${verified}` }],
            details: { verified },
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.registerTool({
      name: "mfa_send_sms",
      label: "Send SMS Code",
      description: "Send an SMS verification code",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
          phone: { type: "string", description: "Phone number" },
        },
        required: ["userId", "phone"],
      },
      async execute(_toolCallId: string, params: { userId: string; phone: string }) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          const sent = await mfaManager.sendSMSCode(params.userId, params.phone);
          return {
            content: [{ type: "text" as const, text: `SMS sent: ${sent}` }],
            details: { sent },
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.registerTool({
      name: "mfa_verify_sms",
      label: "Verify SMS Code",
      description: "Verify an SMS verification code",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
          code: { type: "string", description: "SMS code" },
        },
        required: ["userId", "code"],
      },
      async execute(_toolCallId: string, params: { userId: string; code: string }) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          const verified = await mfaManager.verifySMSCode(params.userId, params.code);
          return {
            content: [{ type: "text" as const, text: `Verified: ${verified}` }],
            details: { verified },
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.registerTool({
      name: "mfa_send_email",
      label: "Send Email Code",
      description: "Send an email verification code",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
          email: { type: "string", description: "Email address" },
        },
        required: ["userId", "email"],
      },
      async execute(_toolCallId: string, params: { userId: string; email: string }) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          const sent = await mfaManager.sendEmailCode(params.userId, params.email);
          return {
            content: [{ type: "text" as const, text: `Email sent: ${sent}` }],
            details: { sent },
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.registerTool({
      name: "mfa_verify_email",
      label: "Verify Email Code",
      description: "Verify an email verification code",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
          code: { type: "string", description: "Email code" },
        },
        required: ["userId", "code"],
      },
      async execute(_toolCallId: string, params: { userId: string; code: string }) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          const verified = await mfaManager.verifyEmailCode(params.userId, params.code);
          return {
            content: [{ type: "text" as const, text: `Verified: ${verified}` }],
            details: { verified },
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.registerTool({
      name: "mfa_status",
      label: "MFA Status",
      description: "Get MFA status for a user",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
        },
        required: ["userId"],
      },
      async execute(_toolCallId: string, params: { userId: string }) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          const status = await mfaManager.getUserStatus(params.userId);
          const isVerified = await mfaManager.isVerified(params.userId);
          return {
            content: [
              { type: "text" as const, text: JSON.stringify({ status, isVerified }, null, 2) },
            ],
            details: { status, isVerified },
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.registerTool({
      name: "mfa_disable",
      label: "Disable MFA",
      description: "Disable MFA for a user",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
        },
        required: ["userId"],
      },
      async execute(_toolCallId: string, params: { userId: string }) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          const disabled = await mfaManager.disableMFA(params.userId);
          return {
            content: [{ type: "text" as const, text: `MFA disabled: ${disabled}` }],
            details: { disabled },
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.registerTool({
      name: "mfa_config",
      label: "Configure MFA",
      description: "Configure MFA settings",
      parameters: {
        type: "object",
        properties: {
          enabled: { type: "boolean", description: "Enable MFA" },
          required: { type: "boolean", description: "Require MFA for all users" },
          methods: { type: "array", items: { type: "string" }, description: "Enabled MFA methods" },
          smsProvider: { type: "string", description: "SMS provider" },
          emailProvider: { type: "string", description: "Email provider" },
        },
        required: [],
      },
      async execute(_toolCallId: string, params: Partial<MFAConfig>) {
        if (!mfaManager) {
          return {
            content: [{ type: "text" as const, text: "MFA manager not initialized" }],
            details: { error: "MFA manager not initialized" },
          };
        }

        try {
          mfaManager.updateConfig(params);
          const config = mfaManager.getConfig();
          return {
            content: [{ type: "text" as const, text: JSON.stringify(config, null, 2) }],
            details: config,
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.logger?.info("MFA plugin registered");
  },
  unregister() {
    mfaManager = null;
  },
};

export default mfaPlugin;
