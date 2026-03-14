import jwt from "jsonwebtoken";
import { Issuer, Strategy } from "openid-client";

interface OktaConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
}

interface OktaUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  [key: string]: any;
}

interface OktaSession {
  userId: string;
  token: string;
  expiresAt: number;
  user: OktaUser;
}

export class OktaManager {
  private config: OktaConfig;
  private jwtConfig: JWTConfig;
  private client: any;
  private sessions: Map<string, OktaSession> = new Map();

  constructor(config: OktaConfig, jwtConfig: JWTConfig) {
    this.config = config;
    this.jwtConfig = jwtConfig;
  }

  async initialize() {
    try {
      const issuer = await Issuer.discover(this.config.issuer);
      this.client = new issuer.Client({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uris: [this.config.redirectUri],
        response_types: ["code"],
      });
      console.log("Okta client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Okta client:", error);
      throw error;
    }
  }

  getAuthUrl(state?: string) {
    const url = this.client.authorizationUrl({
      scope: this.config.scope,
      state: state || Math.random().toString(36).substring(2, 15),
    });
    return url;
  }

  async handleCallback(code: string) {
    try {
      const tokenSet = await this.client.callback(this.config.redirectUri, { code });
      const userInfo = await this.client.userinfo(tokenSet.access_token);

      const user: OktaUser = {
        id: userInfo.sub,
        name: userInfo.name || userInfo.preferred_username,
        email: userInfo.email,
        picture: userInfo.picture,
        ...userInfo,
      };

      const sessionToken = this.generateSessionToken(user);
      const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

      const session: OktaSession = {
        userId: user.id,
        token: sessionToken,
        expiresAt,
        user,
      };

      this.sessions.set(user.id, session);

      return {
        user,
        token: sessionToken,
        expiresAt,
      };
    } catch (error) {
      console.error("Failed to handle Okta callback:", error);
      throw error;
    }
  }

  private generateSessionToken(user: OktaUser): string {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60, // 1 hour
    };

    return jwt.sign(payload, this.jwtConfig.secret);
  }

  verifyToken(token: string): OktaUser | null {
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
    this.sessions.delete(userId);
  }

  getSessionStatus(userId: string): OktaSession | null {
    const session = this.sessions.get(userId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  }

  updateConfig(config: Partial<OktaConfig>) {
    this.config = { ...this.config, ...config };
  }

  updateJWTConfig(config: Partial<JWTConfig>) {
    this.jwtConfig = { ...this.jwtConfig, ...config };
  }
}

// Mock implementation for testing
export class MockOktaManager extends OktaManager {
  constructor() {
    super(
      {
        issuer: "https://mock-okta-domain.okta.com/oauth2/default",
        clientId: "mock-client-id",
        clientSecret: "mock-client-secret",
        redirectUri: "http://localhost:3000/auth/okta/callback",
        scope: "openid profile email",
      },
      {
        secret: "mock-jwt-secret",
        expiresIn: "1h",
      },
    );
  }

  async initialize() {
    console.log("Mock Okta client initialized");
  }

  getAuthUrl(state?: string) {
    return `https://mock-okta-domain.okta.com/oauth2/default/v1/authorize?client_id=mock-client-id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fokta%2Fcallback&scope=openid%20profile%20email&response_type=code&state=${state || "mock-state"}`;
  }

  async handleCallback(code: string) {
    const user: OktaUser = {
      id: "mock-user-id",
      name: "Mock User",
      email: "mock@example.com",
      picture: "https://example.com/avatar.jpg",
    };

    const sessionToken = this.generateSessionToken(user);
    const expiresAt = Date.now() + 1000 * 60 * 60;

    const session: OktaSession = {
      userId: user.id,
      token: sessionToken,
      expiresAt,
      user,
    };

    this.sessions.set(user.id, session);

    return {
      user,
      token: sessionToken,
      expiresAt,
    };
  }
}
