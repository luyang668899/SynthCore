import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import speakeasy from "speakeasy";

// MFA配置接口
export interface MFAConfig {
  enabled: boolean;
  required: boolean;
  methods: string[];
  smsProvider?: string;
  emailProvider?: string;
}

// MFA用户数据接口
export interface MFAUserData {
  userId: string;
  methods: {
    totp?: {
      secret: string;
      verified: boolean;
    };
    sms?: {
      phone: string;
      verified: boolean;
    };
    email?: {
      email: string;
      verified: boolean;
    };
  };
  lastVerified?: number;
}

// MFA管理器
export class MFAManager {
  private api: OpenClawPluginApi;
  private config: MFAConfig;
  private userData: Map<string, MFAUserData> = new Map();

  constructor(api: OpenClawPluginApi, config: MFAConfig) {
    this.api = api;
    this.config = config;
  }

  // 初始化用户MFA设置
  async initializeUser(userId: string): Promise<MFAUserData> {
    let userData = this.userData.get(userId);
    if (!userData) {
      userData = {
        userId,
        methods: {},
      };
      this.userData.set(userId, userData);
    }
    return userData;
  }

  // 生成TOTP密钥
  async generateTOTP(userId: string): Promise<{ secret: string; otpauthUrl: string }> {
    const userData = await this.initializeUser(userId);

    const secret = speakeasy.generateSecret({
      length: 20,
      name: `OpenClaw (${userId})`,
    });

    userData.methods.totp = {
      secret: secret.base32,
      verified: false,
    };

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url || "",
    };
  }

  // 验证TOTP代码
  async verifyTOTP(userId: string, code: string): Promise<boolean> {
    const userData = this.userData.get(userId);
    if (!userData || !userData.methods.totp) {
      return false;
    }

    const verified = speakeasy.totp.verify({
      secret: userData.methods.totp.secret,
      encoding: "base32",
      token: code,
    });

    if (verified && !userData.methods.totp.verified) {
      userData.methods.totp.verified = true;
    }

    if (verified) {
      userData.lastVerified = Date.now();
    }

    return verified;
  }

  // 发送SMS验证码
  async sendSMSCode(userId: string, phone: string): Promise<boolean> {
    // 这里简化处理，实际需要集成SMS服务提供商
    this.api.logger?.info(`Would send SMS code to ${phone} for user ${userId}`);

    const userData = await this.initializeUser(userId);
    userData.methods.sms = {
      phone,
      verified: false,
    };

    return true;
  }

  // 验证SMS验证码
  async verifySMSCode(userId: string, code: string): Promise<boolean> {
    // 这里简化处理，实际需要验证SMS验证码
    const userData = this.userData.get(userId);
    if (!userData || !userData.methods.sms) {
      return false;
    }

    // 模拟验证成功
    userData.methods.sms.verified = true;
    userData.lastVerified = Date.now();

    return true;
  }

  // 发送电子邮件验证码
  async sendEmailCode(userId: string, email: string): Promise<boolean> {
    // 这里简化处理，实际需要集成电子邮件服务提供商
    this.api.logger?.info(`Would send email code to ${email} for user ${userId}`);

    const userData = await this.initializeUser(userId);
    userData.methods.email = {
      email,
      verified: false,
    };

    return true;
  }

  // 验证电子邮件验证码
  async verifyEmailCode(userId: string, code: string): Promise<boolean> {
    // 这里简化处理，实际需要验证电子邮件验证码
    const userData = this.userData.get(userId);
    if (!userData || !userData.methods.email) {
      return false;
    }

    // 模拟验证成功
    userData.methods.email.verified = true;
    userData.lastVerified = Date.now();

    return true;
  }

  // 检查用户是否已验证MFA
  async isVerified(userId: string): Promise<boolean> {
    const userData = this.userData.get(userId);
    if (!userData) {
      return false;
    }

    // 检查是否有任何已验证的MFA方法
    const verifiedMethods = Object.values(userData.methods).filter((method) => method.verified);
    return verifiedMethods.length > 0;
  }

  // 获取用户MFA状态
  async getUserStatus(userId: string): Promise<MFAUserData | null> {
    return this.userData.get(userId) || null;
  }

  // 禁用用户MFA
  async disableMFA(userId: string): Promise<boolean> {
    this.userData.delete(userId);
    return true;
  }

  // 更新配置
  updateConfig(config: Partial<MFAConfig>) {
    this.config = { ...this.config, ...config };
  }

  // 获取配置
  getConfig(): MFAConfig {
    return { ...this.config };
  }
}
