import jwt from "jsonwebtoken";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";

// SSO配置接口
export interface SSOConfig {
  enabled: boolean;
  providers: {
    google?: {
      clientId?: string;
      clientSecret?: string;
      enabled: boolean;
    };
    github?: {
      clientId?: string;
      clientSecret?: string;
      enabled: boolean;
    };
    microsoft?: {
      clientId?: string;
      clientSecret?: string;
      enabled: boolean;
    };
  };
  callbackUrl: string;
  jwtSecret?: string;
}

// SSO用户信息接口
export interface SSOUser {
  id: string;
  email: string;
  name: string;
  provider: string;
  providerId: string;
  avatar?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// SSO会话接口
export interface SSOSession {
  userId: string;
  user: SSOUser;
  token: string;
  createdAt: number;
  expiresAt: number;
}

// SSO管理器
export class SSOManager {
  private api: OpenClawPluginApi;
  private config: SSOConfig;
  private sessions: Map<string, SSOSession> = new Map();
  private passport: typeof passport;

  constructor(api: OpenClawPluginApi, config: SSOConfig) {
    this.api = api;
    this.config = config;
    this.passport = passport;
    this.initializePassport();
  }

  // 初始化Passport
  private initializePassport() {
    // 序列化用户
    this.passport.serializeUser((user: any, done: any) => {
      done(null, user);
    });

    // 反序列化用户
    this.passport.deserializeUser((user: any, done: any) => {
      done(null, user);
    });

    // 注册OAuth2策略
    this.registerStrategies();
  }

  // 注册认证策略
  private registerStrategies() {
    // Google策略
    if (
      this.config.providers.google?.enabled &&
      this.config.providers.google.clientId &&
      this.config.providers.google.clientSecret
    ) {
      this.passport.use(
        "google",
        new OAuth2Strategy(
          {
            authorizationURL: "https://accounts.google.com/o/oauth2/auth",
            tokenURL: "https://oauth2.googleapis.com/token",
            clientID: this.config.providers.google.clientId,
            clientSecret: this.config.providers.google.clientSecret,
            callbackURL: this.config.callbackUrl,
          },
          async (
            accessToken: string,
            refreshToken: string | undefined,
            profile: any,
            done: any,
          ) => {
            try {
              const user = await this.processUser("google", profile, accessToken, refreshToken);
              done(null, user);
            } catch (error) {
              done(error);
            }
          },
        ),
      );
    }

    // GitHub策略
    if (
      this.config.providers.github?.enabled &&
      this.config.providers.github.clientId &&
      this.config.providers.github.clientSecret
    ) {
      this.passport.use(
        "github",
        new OAuth2Strategy(
          {
            authorizationURL: "https://github.com/login/oauth/authorize",
            tokenURL: "https://github.com/login/oauth/access_token",
            clientID: this.config.providers.github.clientId,
            clientSecret: this.config.providers.github.clientSecret,
            callbackURL: this.config.callbackUrl,
          },
          async (
            accessToken: string,
            refreshToken: string | undefined,
            profile: any,
            done: any,
          ) => {
            try {
              const user = await this.processUser("github", profile, accessToken, refreshToken);
              done(null, user);
            } catch (error) {
              done(error);
            }
          },
        ),
      );
    }

    // Microsoft策略
    if (
      this.config.providers.microsoft?.enabled &&
      this.config.providers.microsoft.clientId &&
      this.config.providers.microsoft.clientSecret
    ) {
      this.passport.use(
        "microsoft",
        new OAuth2Strategy(
          {
            authorizationURL: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            tokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            clientID: this.config.providers.microsoft.clientId,
            clientSecret: this.config.providers.microsoft.clientSecret,
            callbackURL: this.config.callbackUrl,
          },
          async (
            accessToken: string,
            refreshToken: string | undefined,
            profile: any,
            done: any,
          ) => {
            try {
              const user = await this.processUser("microsoft", profile, accessToken, refreshToken);
              done(null, user);
            } catch (error) {
              done(error);
            }
          },
        ),
      );
    }
  }

  // 处理用户信息
  private async processUser(
    provider: string,
    profile: any,
    accessToken: string,
    refreshToken?: string,
  ): Promise<SSOUser> {
    const user: SSOUser = {
      id: `${provider}:${profile.id}`,
      email: profile.emails?.[0]?.value || `${profile.id}@${provider}.com`,
      name: profile.displayName || profile.username || profile.login || "Unknown",
      provider,
      providerId: profile.id,
      avatar: profile.photos?.[0]?.value,
      accessToken,
      refreshToken,
    };

    return user;
  }

  // 生成认证URL
  async getAuthUrl(provider: string): Promise<string> {
    if (!this.config.providers[provider as keyof typeof this.config.providers]?.enabled) {
      throw new Error(`Provider ${provider} is not enabled`);
    }

    // 这里简化处理，实际需要使用passport的authenticate方法
    const baseUrls: Record<string, string> = {
      google: "https://accounts.google.com/o/oauth2/auth",
      github: "https://github.com/login/oauth/authorize",
      microsoft: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    };

    const baseUrl = baseUrls[provider];
    if (!baseUrl) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const clientId =
      this.config.providers[provider as keyof typeof this.config.providers]?.clientId;
    if (!clientId) {
      throw new Error(`Client ID not configured for provider ${provider}`);
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: this.config.callbackUrl,
      response_type: "code",
      scope: this.getProviderScope(provider),
    });

    return `${baseUrl}?${params.toString()}`;
  }

  // 获取提供商的作用域
  private getProviderScope(provider: string): string {
    const scopes: Record<string, string> = {
      google: "email profile",
      github: "user:email",
      microsoft: "user.read email",
    };

    return scopes[provider] || "email";
  }

  // 验证回调
  async handleCallback(provider: string, code: string): Promise<SSOSession> {
    // 这里简化处理，实际需要使用passport的authenticate方法
    // 模拟用户信息
    const user: SSOUser = {
      id: `${provider}:test-user`,
      email: `test@${provider}.com`,
      name: `Test User`,
      provider,
      providerId: "test-user",
    };

    // 生成JWT令牌
    const token = this.generateToken(user);

    // 创建会话
    const session: SSOSession = {
      userId: user.id,
      user,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24小时
    };

    this.sessions.set(user.id, session);

    return session;
  }

  // 生成JWT令牌
  private generateToken(user: SSOUser): string {
    if (!this.config.jwtSecret) {
      throw new Error("JWT secret not configured");
    }

    return jwt.sign(
      { userId: user.id, email: user.email, provider: user.provider },
      this.config.jwtSecret,
      { expiresIn: "24h" },
    );
  }

  // 验证令牌
  async verifyToken(token: string): Promise<SSOUser | null> {
    try {
      if (!this.config.jwtSecret) {
        throw new Error("JWT secret not configured");
      }

      const decoded = jwt.verify(token, this.config.jwtSecret) as any;
      const session = this.sessions.get(decoded.userId);

      if (!session || session.expiresAt < Date.now()) {
        return null;
      }

      return session.user;
    } catch (error) {
      this.api.logger?.error(`Token verification error: ${error}`);
      return null;
    }
  }

  // 注销会话
  async logout(userId: string): Promise<boolean> {
    return this.sessions.delete(userId);
  }

  // 获取会话状态
  async getSessionStatus(userId: string): Promise<SSOSession | null> {
    const session = this.sessions.get(userId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  }

  // 更新配置
  updateConfig(config: Partial<SSOConfig>) {
    this.config = { ...this.config, ...config };
    // 重新初始化Passport策略
    this.initializePassport();
  }

  // 获取配置
  getConfig(): SSOConfig {
    return { ...this.config };
  }
}
