import jsforce from "jsforce";
import jwt from "jsonwebtoken";

interface SalesforceConfig {
  loginUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
}

interface SalesforceUser {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

interface SalesforceSession {
  userId: string;
  token: string;
  expiresAt: number;
  user: SalesforceUser;
  connection: any;
}

export class SalesforceManager {
  private config: SalesforceConfig;
  private jwtConfig: JWTConfig;
  private oauth2: jsforce.OAuth2;
  private sessions: Map<string, SalesforceSession> = new Map();

  constructor(config: SalesforceConfig, jwtConfig: JWTConfig) {
    this.config = config;
    this.jwtConfig = jwtConfig;
    this.oauth2 = new jsforce.OAuth2({
      loginUrl: config.loginUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
    });
  }

  getAuthUrl(state?: string) {
    return this.oauth2.getAuthorizationUrl({
      scope: this.config.scope,
      state: state || Math.random().toString(36).substring(2, 15),
    });
  }

  async handleCallback(code: string) {
    try {
      const connection = new jsforce.Connection({ oauth2: this.oauth2 });
      const userInfo = await connection.authorize(code);

      const user: SalesforceUser = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        ...userInfo,
      };

      const sessionToken = this.generateSessionToken(user);
      const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

      const session: SalesforceSession = {
        userId: user.id,
        token: sessionToken,
        expiresAt,
        user,
        connection,
      };

      this.sessions.set(user.id, session);

      return {
        user,
        token: sessionToken,
        expiresAt,
      };
    } catch (error) {
      console.error("Failed to handle Salesforce callback:", error);
      throw error;
    }
  }

  private generateSessionToken(user: SalesforceUser): string {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60, // 1 hour
    };

    return jwt.sign(payload, this.jwtConfig.secret);
  }

  verifyToken(token: string): SalesforceUser | null {
    try {
      const decoded = jwt.verify(token, this.jwtConfig.secret) as any;

      // Check if session exists
      const session = Array.from(this.sessions.values()).find((s) => s.token === token);

      if (!session || session.expiresAt < Date.now()) {
        return null;
      }

      return session.user;
    } catch (error) {
      console.error("Failed to verify token:", error);
      return null;
    }
  }

  logout(userId: string) {
    const session = this.sessions.get(userId);
    if (session) {
      // Revoke token if needed
      this.sessions.delete(userId);
    }
  }

  getSessionStatus(userId: string): SalesforceSession | null {
    const session = this.sessions.get(userId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  }

  getConnection(userId: string) {
    const session = this.sessions.get(userId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session.connection;
  }

  updateConfig(config: Partial<SalesforceConfig>) {
    this.config = { ...this.config, ...config };
    this.oauth2 = new jsforce.OAuth2({
      loginUrl: this.config.loginUrl,
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      redirectUri: this.config.redirectUri,
    });
  }

  updateJWTConfig(config: Partial<JWTConfig>) {
    this.jwtConfig = { ...this.jwtConfig, ...config };
  }
}

// Mock implementation for testing
export class MockSalesforceManager extends SalesforceManager {
  constructor() {
    super(
      {
        loginUrl: "https://login.salesforce.com",
        clientId: "mock-client-id",
        clientSecret: "mock-client-secret",
        redirectUri: "http://localhost:3000/auth/salesforce/callback",
        scope: "api web",
      },
      {
        secret: "mock-jwt-secret",
        expiresIn: "1h",
      },
    );
  }

  getAuthUrl(state?: string) {
    return `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=mock-client-id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fsalesforce%2Fcallback&scope=api%20web&state=${state || "mock-state"}`;
  }

  async handleCallback(code: string) {
    const user: SalesforceUser = {
      id: "mock-user-id",
      name: "Mock User",
      email: "mock@example.com",
      organizationId: "mock-org-id",
      username: "mock@example.com",
    };

    const sessionToken = this.generateSessionToken(user);
    const expiresAt = Date.now() + 1000 * 60 * 60;

    const session: SalesforceSession = {
      userId: user.id,
      token: sessionToken,
      expiresAt,
      user,
      connection: {},
    };

    this.sessions.set(user.id, session);

    return {
      user,
      token: sessionToken,
      expiresAt,
    };
  }

  getConnection(userId: string) {
    return {
      query: async (soql: string) => {
        return {
          records: [],
          totalSize: 0,
        };
      },
      sobject: (objectName: string) => {
        return {
          create: async (record: any) => record,
          update: async (record: any) => record,
          delete: async (id: string) => true,
        };
      },
    };
  }
}
