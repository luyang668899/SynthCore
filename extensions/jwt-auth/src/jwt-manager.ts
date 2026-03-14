import jwt from "jsonwebtoken";

interface JWTConfig {
  secret: string;
  expiresIn: string;
  algorithm: string;
}

interface JWTUser {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

interface JWTClaims {
  userId: string;
  email: string;
  name: string;
  [key: string]: any;
}

export class JWTManager {
  private config: JWTConfig;
  private tokens: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor(config: JWTConfig) {
    this.config = config;
  }

  generateToken(user: JWTUser): string {
    const claims: JWTClaims = {
      userId: user.id,
      email: user.email,
      name: user.name,
      ...user,
    };

    const token = jwt.sign(claims, this.config.secret, {
      expiresIn: this.config.expiresIn,
      algorithm: this.config.algorithm as any,
    });

    const expiresAt = Date.now() + this.getExpirationTimeMs();
    this.tokens.set(token, { userId: user.id, expiresAt });

    return token;
  }

  verifyToken(token: string): JWTUser | null {
    try {
      const decoded = jwt.verify(token, this.config.secret, {
        algorithms: [this.config.algorithm],
      }) as JWTClaims;

      // Check if token is in our store
      const tokenInfo = this.tokens.get(token);
      if (!tokenInfo) {
        return null;
      }

      // Check if token is expired
      if (tokenInfo.expiresAt < Date.now()) {
        this.tokens.delete(token);
        return null;
      }

      return {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        ...decoded,
      };
    } catch (error) {
      console.error("Failed to verify token:", error);
      return null;
    }
  }

  decodeToken(token: string): JWTClaims | null {
    try {
      return jwt.decode(token) as JWTClaims;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }

  revokeToken(token: string): boolean {
    return this.tokens.delete(token);
  }

  revokeTokensByUserId(userId: string): number {
    let count = 0;
    for (const [token, info] of this.tokens.entries()) {
      if (info.userId === userId) {
        this.tokens.delete(token);
        count++;
      }
    }
    return count;
  }

  getTokensByUserId(userId: string): string[] {
    const userTokens: string[] = [];
    for (const [token, info] of this.tokens.entries()) {
      if (info.userId === userId && info.expiresAt > Date.now()) {
        userTokens.push(token);
      }
    }
    return userTokens;
  }

  updateConfig(config: Partial<JWTConfig>) {
    this.config = { ...this.config, ...config };
  }

  private getExpirationTimeMs(): number {
    const expiresIn = this.config.expiresIn;
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 3600000; // Default to 1 hour
    }

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case "s":
        return numValue * 1000;
      case "m":
        return numValue * 60 * 1000;
      case "h":
        return numValue * 60 * 60 * 1000;
      case "d":
        return numValue * 24 * 60 * 60 * 1000;
      default:
        return 3600000;
    }
  }
}

// Mock implementation for testing
export class MockJWTManager extends JWTManager {
  constructor() {
    super({
      secret: "mock-jwt-secret",
      expiresIn: "1h",
      algorithm: "HS256",
    });
  }

  generateToken(user: JWTUser): string {
    console.log("Generating token for user:", user.email);
    return super.generateToken(user);
  }

  verifyToken(token: string): JWTUser | null {
    console.log("Verifying token:", token.substring(0, 20) + "...");
    return super.verifyToken(token);
  }
}
