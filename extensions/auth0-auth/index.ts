import { OpenClawPluginApi, OpenClawPlugin } from "openclaw/plugin-sdk";
import { MockAuth0Manager } from "./src/auth0-manager";

export const Auth0AuthPlugin: OpenClawPlugin = {
  id: "auth0-auth",
  name: "Auth0 Authentication",
  version: "2026.2.17",
  description: "Auth0 authentication plugin for OpenClaw",
  author: "OpenClaw Team",
  license: "MIT",

  register: async (api: OpenClawPluginApi) => {
    console.log("Registering Auth0 Auth plugin...");

    // Initialize Auth0 manager with mock implementation for testing
    const auth0Manager = new MockAuth0Manager();
    await auth0Manager.initialize();

    // Register Auth0 auth tools
    api.registerTool({
      id: "auth0_get_auth_url",
      name: "Get Auth0 Auth URL",
      description: "Get the Auth0 authentication URL",
      parameters: {
        state: {
          type: "string",
          description: "State parameter for OAuth flow",
          optional: true,
        },
      },
      handler: async (params) => {
        const state = params.state as string;
        const authUrl = auth0Manager.getAuthUrl(state);
        return { authUrl };
      },
    });

    api.registerTool({
      id: "auth0_handle_callback",
      name: "Handle Auth0 Callback",
      description: "Handle Auth0 OAuth callback and create session",
      parameters: {
        code: {
          type: "string",
          description: "Authorization code from Auth0",
          required: true,
        },
      },
      handler: async (params) => {
        const code = params.code as string;
        const result = await auth0Manager.handleCallback(code);
        return result;
      },
    });

    api.registerTool({
      id: "auth0_verify_token",
      name: "Verify Auth0 Token",
      description: "Verify Auth0 session token and return user info",
      parameters: {
        token: {
          type: "string",
          description: "Auth0 session token",
          required: true,
        },
      },
      handler: async (params) => {
        const token = params.token as string;
        const user = auth0Manager.verifyToken(token);
        return { user };
      },
    });

    api.registerTool({
      id: "auth0_logout",
      name: "Auth0 Logout",
      description: "Logout user from Auth0 session",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to logout",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        auth0Manager.logout(userId);
        return { success: true };
      },
    });

    api.registerTool({
      id: "auth0_session_status",
      name: "Auth0 Session Status",
      description: "Get Auth0 session status for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to check",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const session = auth0Manager.getSessionStatus(userId);
        return { session };
      },
    });

    api.registerTool({
      id: "auth0_config",
      name: "Auth0 Config",
      description: "Update Auth0 configuration",
      parameters: {
        auth0: {
          type: "object",
          description: "Auth0 configuration",
          optional: true,
        },
        jwt: {
          type: "object",
          description: "JWT configuration",
          optional: true,
        },
      },
      handler: async (params) => {
        if (params.auth0) {
          auth0Manager.updateConfig(params.auth0 as any);
        }
        if (params.jwt) {
          auth0Manager.updateJWTConfig(params.jwt as any);
        }
        return { success: true };
      },
    });

    console.log("Auth0 Auth plugin registered successfully");
  },

  unregister: async (api: OpenClawPluginApi) => {
    console.log("Unregistering Auth0 Auth plugin...");
    // Cleanup resources if needed
    console.log("Auth0 Auth plugin unregistered successfully");
  },
};

export default Auth0AuthPlugin;
