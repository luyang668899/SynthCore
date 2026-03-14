import { OpenClawPluginApi, OpenClawPlugin } from "openclaw/plugin-sdk";
import { MockOktaManager } from "./src/okta-manager";

export const OktaAuthPlugin: OpenClawPlugin = {
  id: "okta-auth",
  name: "Okta Authentication",
  version: "2026.2.17",
  description: "Okta authentication plugin for OpenClaw",
  author: "OpenClaw Team",
  license: "MIT",

  register: async (api: OpenClawPluginApi) => {
    console.log("Registering Okta Auth plugin...");

    // Initialize Okta manager with mock implementation for testing
    const oktaManager = new MockOktaManager();
    await oktaManager.initialize();

    // Register Okta auth tools
    api.registerTool({
      id: "okta_get_auth_url",
      name: "Get Okta Auth URL",
      description: "Get the Okta authentication URL",
      parameters: {
        state: {
          type: "string",
          description: "State parameter for OAuth flow",
          optional: true,
        },
      },
      handler: async (params) => {
        const state = params.state as string;
        const authUrl = oktaManager.getAuthUrl(state);
        return { authUrl };
      },
    });

    api.registerTool({
      id: "okta_handle_callback",
      name: "Handle Okta Callback",
      description: "Handle Okta OAuth callback and create session",
      parameters: {
        code: {
          type: "string",
          description: "Authorization code from Okta",
          required: true,
        },
      },
      handler: async (params) => {
        const code = params.code as string;
        const result = await oktaManager.handleCallback(code);
        return result;
      },
    });

    api.registerTool({
      id: "okta_verify_token",
      name: "Verify Okta Token",
      description: "Verify Okta session token and return user info",
      parameters: {
        token: {
          type: "string",
          description: "Okta session token",
          required: true,
        },
      },
      handler: async (params) => {
        const token = params.token as string;
        const user = oktaManager.verifyToken(token);
        return { user };
      },
    });

    api.registerTool({
      id: "okta_logout",
      name: "Okta Logout",
      description: "Logout user from Okta session",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to logout",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        oktaManager.logout(userId);
        return { success: true };
      },
    });

    api.registerTool({
      id: "okta_session_status",
      name: "Okta Session Status",
      description: "Get Okta session status for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to check",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const session = oktaManager.getSessionStatus(userId);
        return { session };
      },
    });

    api.registerTool({
      id: "okta_config",
      name: "Okta Config",
      description: "Update Okta configuration",
      parameters: {
        okta: {
          type: "object",
          description: "Okta configuration",
          optional: true,
        },
        jwt: {
          type: "object",
          description: "JWT configuration",
          optional: true,
        },
      },
      handler: async (params) => {
        if (params.okta) {
          oktaManager.updateConfig(params.okta as any);
        }
        if (params.jwt) {
          oktaManager.updateJWTConfig(params.jwt as any);
        }
        return { success: true };
      },
    });

    console.log("Okta Auth plugin registered successfully");
  },

  unregister: async (api: OpenClawPluginApi) => {
    console.log("Unregistering Okta Auth plugin...");
    // Cleanup resources if needed
    console.log("Okta Auth plugin unregistered successfully");
  },
};

export default OktaAuthPlugin;
