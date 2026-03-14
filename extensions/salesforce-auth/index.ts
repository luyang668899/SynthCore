import { OpenClawPluginApi, OpenClawPlugin } from "openclaw/plugin-sdk";
import { MockSalesforceManager } from "./src/salesforce-manager";

export const SalesforceAuthPlugin: OpenClawPlugin = {
  id: "salesforce-auth",
  name: "Salesforce Authentication",
  version: "2026.2.17",
  description: "Salesforce authentication plugin for OpenClaw",
  author: "OpenClaw Team",
  license: "MIT",

  register: async (api: OpenClawPluginApi) => {
    console.log("Registering Salesforce Auth plugin...");

    // Initialize Salesforce manager with mock implementation for testing
    const salesforceManager = new MockSalesforceManager();

    // Register Salesforce auth tools
    api.registerTool({
      id: "salesforce_get_auth_url",
      name: "Get Salesforce Auth URL",
      description: "Get the Salesforce authentication URL",
      parameters: {
        state: {
          type: "string",
          description: "State parameter for OAuth flow",
          optional: true,
        },
      },
      handler: async (params) => {
        const state = params.state as string;
        const authUrl = salesforceManager.getAuthUrl(state);
        return { authUrl };
      },
    });

    api.registerTool({
      id: "salesforce_handle_callback",
      name: "Handle Salesforce Callback",
      description: "Handle Salesforce OAuth callback and create session",
      parameters: {
        code: {
          type: "string",
          description: "Authorization code from Salesforce",
          required: true,
        },
      },
      handler: async (params) => {
        const code = params.code as string;
        const result = await salesforceManager.handleCallback(code);
        return result;
      },
    });

    api.registerTool({
      id: "salesforce_verify_token",
      name: "Verify Salesforce Token",
      description: "Verify Salesforce session token and return user info",
      parameters: {
        token: {
          type: "string",
          description: "Salesforce session token",
          required: true,
        },
      },
      handler: async (params) => {
        const token = params.token as string;
        const user = salesforceManager.verifyToken(token);
        return { user };
      },
    });

    api.registerTool({
      id: "salesforce_logout",
      name: "Salesforce Logout",
      description: "Logout user from Salesforce session",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to logout",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        salesforceManager.logout(userId);
        return { success: true };
      },
    });

    api.registerTool({
      id: "salesforce_session_status",
      name: "Salesforce Session Status",
      description: "Get Salesforce session status for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to check",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const session = salesforceManager.getSessionStatus(userId);
        return { session };
      },
    });

    api.registerTool({
      id: "salesforce_get_connection",
      name: "Get Salesforce Connection",
      description: "Get Salesforce connection for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to get connection for",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const connection = salesforceManager.getConnection(userId);
        return { connection: connection ? "Salesforce connection available" : null };
      },
    });

    api.registerTool({
      id: "salesforce_config",
      name: "Salesforce Config",
      description: "Update Salesforce configuration",
      parameters: {
        salesforce: {
          type: "object",
          description: "Salesforce configuration",
          optional: true,
        },
        jwt: {
          type: "object",
          description: "JWT configuration",
          optional: true,
        },
      },
      handler: async (params) => {
        if (params.salesforce) {
          salesforceManager.updateConfig(params.salesforce as any);
        }
        if (params.jwt) {
          salesforceManager.updateJWTConfig(params.jwt as any);
        }
        return { success: true };
      },
    });

    console.log("Salesforce Auth plugin registered successfully");
  },

  unregister: async (api: OpenClawPluginApi) => {
    console.log("Unregistering Salesforce Auth plugin...");
    // Cleanup resources if needed
    console.log("Salesforce Auth plugin unregistered successfully");
  },
};

export default SalesforceAuthPlugin;
