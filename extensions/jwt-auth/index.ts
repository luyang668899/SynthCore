import { OpenClawPluginApi, OpenClawPlugin } from "openclaw/plugin-sdk";
import { MockJWTManager } from "./src/jwt-manager";

export const JwtAuthPlugin: OpenClawPlugin = {
  id: "jwt-auth",
  name: "JWT Authentication",
  version: "2026.2.17",
  description: "JWT authentication plugin for OpenClaw",
  author: "OpenClaw Team",
  license: "MIT",

  register: async (api: OpenClawPluginApi) => {
    console.log("Registering JWT Auth plugin...");

    // Initialize JWT manager with mock implementation for testing
    const jwtManager = new MockJWTManager();

    // Register JWT auth tools
    api.registerTool({
      id: "jwt_generate_token",
      name: "Generate JWT Token",
      description: "Generate a JWT token for a user",
      parameters: {
        user: {
          type: "object",
          description: "User information",
          required: true,
        },
      },
      handler: async (params) => {
        const user = params.user as any;
        const token = jwtManager.generateToken(user);
        return { token };
      },
    });

    api.registerTool({
      id: "jwt_verify_token",
      name: "Verify JWT Token",
      description: "Verify a JWT token and return user info",
      parameters: {
        token: {
          type: "string",
          description: "JWT token to verify",
          required: true,
        },
      },
      handler: async (params) => {
        const token = params.token as string;
        const user = jwtManager.verifyToken(token);
        return { user };
      },
    });

    api.registerTool({
      id: "jwt_decode_token",
      name: "Decode JWT Token",
      description: "Decode a JWT token without verification",
      parameters: {
        token: {
          type: "string",
          description: "JWT token to decode",
          required: true,
        },
      },
      handler: async (params) => {
        const token = params.token as string;
        const claims = jwtManager.decodeToken(token);
        return { claims };
      },
    });

    api.registerTool({
      id: "jwt_revoke_token",
      name: "Revoke JWT Token",
      description: "Revoke a JWT token",
      parameters: {
        token: {
          type: "string",
          description: "JWT token to revoke",
          required: true,
        },
      },
      handler: async (params) => {
        const token = params.token as string;
        const success = jwtManager.revokeToken(token);
        return { success };
      },
    });

    api.registerTool({
      id: "jwt_revoke_user_tokens",
      name: "Revoke User Tokens",
      description: "Revoke all tokens for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to revoke tokens for",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const count = jwtManager.revokeTokensByUserId(userId);
        return { count };
      },
    });

    api.registerTool({
      id: "jwt_get_user_tokens",
      name: "Get User Tokens",
      description: "Get all active tokens for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID to get tokens for",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const tokens = jwtManager.getTokensByUserId(userId);
        return { tokens };
      },
    });

    api.registerTool({
      id: "jwt_config",
      name: "JWT Config",
      description: "Update JWT configuration",
      parameters: {
        jwt: {
          type: "object",
          description: "JWT configuration",
          required: true,
        },
      },
      handler: async (params) => {
        const jwtConfig = params.jwt as any;
        jwtManager.updateConfig(jwtConfig);
        return { success: true };
      },
    });

    console.log("JWT Auth plugin registered successfully");
  },

  unregister: async (api: OpenClawPluginApi) => {
    console.log("Unregistering JWT Auth plugin...");
    // Cleanup resources if needed
    console.log("JWT Auth plugin unregistered successfully");
  },
};

export default JwtAuthPlugin;
