import jwt from "jsonwebtoken";
import { Issuer } from "openid-client";

interface Auth0Config {
  domain: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

interface JWTConfig {
  secret: string;
  expiresIn: string;
}

interface Auth0User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  [key: string]: any;
}

interface Auth0Session {
  userId: string;
  token: string;
  expiresAt: number;
  user: Auth0User;
}

export class Auth0Manager {
  private config: Auth0Config;
  private jwtConfig: JWTConfig;
  private client: any;
  private sessions: Map<string, Auth0Session> = new Map();

  constructor(config: Auth0Config, jwtConfig: JWTConfig) {
    this.config = config;
    this.jwtConfig = jwtConfig;
  }

  async initialize() {
    try {
      const issuer = await Issuer.discover(`https://${this.config.domain}/`);
      this.client = new issuer.Client({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uris: [this.config.redirectUri],
        response_types: ["code"],
      });
      console.log("Auth0 client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Auth0 client:", error);
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

      const user: Auth0User = {
        id: userInfo.sub,
        name: userInfo.name || userInfo.preferred_username,
        email: userInfo.email,
        picture: userInfo.picture,
        ...userInfo,
      };

      const sessionToken = this.generateSessionToken(user);
      const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

      const session: Auth0Session = {
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
      console.error("Failed to handle Auth0 callback:", error);
      throw error;
    }
  }

  private generateSessionToken(user: Auth0User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60, // 1 hour
    };

    return jwt.sign(payload, this.jwtConfig.secret);
  }

  verifyToken(token: string): Auth0User | null {
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

  getSessionStatus(userId: string): Auth0Session | null {
    const session = this.sessions.get(userId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  }

  updateConfig(config: Partial<Auth0Config>) {
    this.config = { ...this.config, ...config };
  }

  updateJWTConfig(config: Partial<JWTConfig>) {
    this.jwtConfig = { ...this.jwtConfig, ...config };
  }
}

// Mock implementation for testing
export class MockAuth0Manager extends Auth0Manager {
  constructor() {
    super(
      {
        domain: "mock-domain.auth0.com",
        clientId: "mock-client-id",
        clientSecret: "mock-client-secret",
        redirectUri: "http://localhost:3000/auth/auth0/callback",
        scope: "openid profile email",
      },
      {
        secret: "mock-jwt-secret",
        expiresIn: "1h",
      },
    );
  }

  async initialize() {
    console.log("Mock Auth0 client initialized");
  }

  getAuthUrl(state?: string) {
    return `https://mock-domain.auth0.com/authorize?client_id=mock-client-id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fauth0%2Fcallback&scope=openid%20profile%20email&response_type=code&state=${state || "mock-state"}`;
  }

  async handleCallback(code: string) {
    const user: Auth0User = {
      id: "mock-user-id",
      name: "Mock User",
      email: "mock@example.com",
      picture: "https://example.com/avatar.jpg",
    };

    const sessionToken = this.generateSessionToken(user);
    const expiresAt = Date.now() + 1000 * 60 * 60;

    const session: Auth0Session = {
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
