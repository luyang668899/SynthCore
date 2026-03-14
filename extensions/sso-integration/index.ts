import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { SSOManager, type SSOConfig } from "./src/sso-manager.js";

let ssoManager: SSOManager | null = null;

const ssoIntegrationPlugin = {
  id: "sso-integration",
  name: "Single Sign-On Integration",
  description: "Single Sign-On (SSO) integration plugin for OpenClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    // 初始化SSO管理器
    const config: SSOConfig = {
      enabled: true,
      providers: {
        google: {
          enabled: false,
        },
        github: {
          enabled: false,
        },
        microsoft: {
          enabled: false,
        },
      },
      callbackUrl: "http://localhost:3000/auth/callback",
      jwtSecret: process.env.SSO_JWT_SECRET || "default-jwt-secret",
    };

    ssoManager = new SSOManager(api, config);

    // 注册工具
    api.registerTool({
      name: "sso_get_auth_url",
      label: "Get SSO Auth URL",
      description: "Get authentication URL for SSO provider",
      parameters: {
        type: "object",
        properties: {
          provider: {
            type: "string",
            enum: ["google", "github", "microsoft"],
            description: "SSO provider",
          },
        },
        required: ["provider"],
      },
      async execute(_toolCallId: string, params: { provider: string }) {
        if (!ssoManager) {
          return {
            content: [{ type: "text" as const, text: "SSO manager not initialized" }],
            details: { error: "SSO manager not initialized" },
          };
        }

        try {
          const authUrl = await ssoManager.getAuthUrl(params.provider);
          return {
            content: [{ type: "text" as const, text: authUrl }],
            details: { authUrl },
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
      name: "sso_handle_callback",
      label: "Handle SSO Callback",
      description: "Handle SSO callback and create session",
      parameters: {
        type: "object",
        properties: {
          provider: {
            type: "string",
            enum: ["google", "github", "microsoft"],
            description: "SSO provider",
          },
          code: { type: "string", description: "Authorization code" },
        },
        required: ["provider", "code"],
      },
      async execute(_toolCallId: string, params: { provider: string; code: string }) {
        if (!ssoManager) {
          return {
            content: [{ type: "text" as const, text: "SSO manager not initialized" }],
            details: { error: "SSO manager not initialized" },
          };
        }

        try {
          const session = await ssoManager.handleCallback(params.provider, params.code);
          return {
            content: [{ type: "text" as const, text: JSON.stringify(session, null, 2) }],
            details: session,
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
      name: "sso_verify_token",
      label: "Verify SSO Token",
      description: "Verify SSO token and get user information",
      parameters: {
        type: "object",
        properties: {
          token: { type: "string", description: "SSO token" },
        },
        required: ["token"],
      },
      async execute(_toolCallId: string, params: { token: string }) {
        if (!ssoManager) {
          return {
            content: [{ type: "text" as const, text: "SSO manager not initialized" }],
            details: { error: "SSO manager not initialized" },
          };
        }

        try {
          const user = await ssoManager.verifyToken(params.token);
          return {
            content: [{ type: "text" as const, text: JSON.stringify(user, null, 2) }],
            details: { user },
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
      name: "sso_logout",
      label: "SSO Logout",
      description: "Logout from SSO session",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
        },
        required: ["userId"],
      },
      async execute(_toolCallId: string, params: { userId: string }) {
        if (!ssoManager) {
          return {
            content: [{ type: "text" as const, text: "SSO manager not initialized" }],
            details: { error: "SSO manager not initialized" },
          };
        }

        try {
          const loggedOut = await ssoManager.logout(params.userId);
          return {
            content: [{ type: "text" as const, text: `Logged out: ${loggedOut}` }],
            details: { loggedOut },
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
      name: "sso_session_status",
      label: "SSO Session Status",
      description: "Get SSO session status",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
        },
        required: ["userId"],
      },
      async execute(_toolCallId: string, params: { userId: string }) {
        if (!ssoManager) {
          return {
            content: [{ type: "text" as const, text: "SSO manager not initialized" }],
            details: { error: "SSO manager not initialized" },
          };
        }

        try {
          const status = await ssoManager.getSessionStatus(params.userId);
          return {
            content: [{ type: "text" as const, text: JSON.stringify(status, null, 2) }],
            details: { status },
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
      name: "sso_config",
      label: "Configure SSO",
      description: "Configure SSO settings",
      parameters: {
        type: "object",
        properties: {
          enabled: { type: "boolean", description: "Enable SSO" },
          providers: {
            type: "object",
            properties: {
              google: {
                type: "object",
                properties: {
                  clientId: { type: "string", description: "Google OAuth client ID" },
                  clientSecret: { type: "string", description: "Google OAuth client secret" },
                  enabled: { type: "boolean", description: "Enable Google SSO" },
                },
              },
              github: {
                type: "object",
                properties: {
                  clientId: { type: "string", description: "GitHub OAuth client ID" },
                  clientSecret: { type: "string", description: "GitHub OAuth client secret" },
                  enabled: { type: "boolean", description: "Enable GitHub SSO" },
                },
              },
              microsoft: {
                type: "object",
                properties: {
                  clientId: { type: "string", description: "Microsoft OAuth client ID" },
                  clientSecret: { type: "string", description: "Microsoft OAuth client secret" },
                  enabled: { type: "boolean", description: "Enable Microsoft SSO" },
                },
              },
            },
          },
          callbackUrl: { type: "string", description: "SSO callback URL" },
          jwtSecret: { type: "string", description: "JWT secret for SSO tokens" },
        },
        required: [],
      },
      async execute(_toolCallId: string, params: Partial<SSOConfig>) {
        if (!ssoManager) {
          return {
            content: [{ type: "text" as const, text: "SSO manager not initialized" }],
            details: { error: "SSO manager not initialized" },
          };
        }

        try {
          ssoManager.updateConfig(params);
          const config = ssoManager.getConfig();
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

    api.logger?.info("SSO integration plugin registered");
  },
  unregister() {
    ssoManager = null;
  },
};

export default ssoIntegrationPlugin;
