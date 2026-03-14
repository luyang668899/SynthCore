import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export interface EncryptionOptions {
  algorithm?: string;
  ivLength?: number;
  saltLength?: number;
}

export interface HashOptions {
  algorithm?: string;
  saltLength?: number;
}

export class EncryptionManager {
  private defaultEncryptionOptions: EncryptionOptions = {
    algorithm: "aes-256-cbc",
    ivLength: 16,
    saltLength: 16,
  };

  private defaultHashOptions: HashOptions = {
    algorithm: "sha256",
    saltLength: 16,
  };

  /**
   * Encrypt data
   * @param data Data to encrypt
   * @param key Encryption key
   * @param options Encryption options
   * @returns Encrypted data
   */
  encrypt(data: string, key: string, options: EncryptionOptions = {}): string {
    const { algorithm, ivLength, saltLength } = {
      ...this.defaultEncryptionOptions,
      ...options,
    };

    const salt = crypto.randomBytes(saltLength!);
    const iv = crypto.randomBytes(ivLength!);
    const derivedKey = crypto.pbkdf2Sync(key, salt, 100000, 32, "sha256");
    const cipher = crypto.createCipheriv(algorithm!, derivedKey, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}`;
  }

  /**
   * Decrypt data
   * @param data Data to decrypt
   * @param key Decryption key
   * @param options Encryption options
   * @returns Decrypted data
   */
  decrypt(data: string, key: string, options: EncryptionOptions = {}): string {
    const { algorithm, ivLength, saltLength } = {
      ...this.defaultEncryptionOptions,
      ...options,
    };

    const [saltHex, ivHex, encryptedHex] = data.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const derivedKey = crypto.pbkdf2Sync(key, salt, 100000, 32, "sha256");
    const decipher = crypto.createDecipheriv(algorithm!, derivedKey, iv);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  /**
   * Generate encryption key
   * @param length Key length in bytes
   * @returns Generated key
   */
  generateKey(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * Hash data
   * @param data Data to hash
   * @param options Hash options
   * @returns Hashed data
   */
  hash(data: string, options: HashOptions = {}): string {
    const { algorithm, saltLength } = {
      ...this.defaultHashOptions,
      ...options,
    };

    const salt = crypto.randomBytes(saltLength!);
    const hash = crypto.createHash(algorithm!);
    hash.update(salt);
    hash.update(data);

    return `${salt.toString("hex")}:${hash.digest("hex")}`;
  }

  /**
   * Verify hash
   * @param data Data to verify
   * @param hashString Hash to verify against
   * @param options Hash options
   * @returns True if hash matches
   */
  verifyHash(data: string, hashString: string, options: HashOptions = {}): boolean {
    const { algorithm } = {
      ...this.defaultHashOptions,
      ...options,
    };

    const [saltHex, storedHash] = hashString.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const hash = crypto.createHash(algorithm!);
    hash.update(salt);
    hash.update(data);

    return hash.digest("hex") === storedHash;
  }

  /**
   * Encrypt file
   * @param inputPath Input file path
   * @param outputPath Output file path
   * @param key Encryption key
   * @param options Encryption options
   */
  encryptFile(
    inputPath: string,
    outputPath: string,
    key: string,
    options: EncryptionOptions = {},
  ): void {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }

    const data = fs.readFileSync(inputPath, "utf8");
    const encryptedData = this.encrypt(data, key, options);
    fs.writeFileSync(outputPath, encryptedData, "utf8");
  }

  /**
   * Decrypt file
   * @param inputPath Input file path
   * @param outputPath Output file path
   * @param key Decryption key
   * @param options Encryption options
   */
  decryptFile(
    inputPath: string,
    outputPath: string,
    key: string,
    options: EncryptionOptions = {},
  ): void {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }

    const encryptedData = fs.readFileSync(inputPath, "utf8");
    const decryptedData = this.decrypt(encryptedData, key, options);
    fs.writeFileSync(outputPath, decryptedData, "utf8");
  }

  /**
   * Encrypt object
   * @param obj Object to encrypt
   * @param key Encryption key
   * @param options Encryption options
   * @returns Encrypted object string
   */
  encryptObject(obj: any, key: string, options: EncryptionOptions = {}): string {
    const data = JSON.stringify(obj);
    return this.encrypt(data, key, options);
  }

  /**
   * Decrypt object
   * @param data Encrypted data
   * @param key Decryption key
   * @param options Encryption options
   * @returns Decrypted object
   */
  decryptObject(data: string, key: string, options: EncryptionOptions = {}): any {
    const decryptedData = this.decrypt(data, key, options);
    return JSON.parse(decryptedData);
  }

  /**
   * Generate random password
   * @param length Password length
   * @param options Password options
   * @returns Generated password
   */
  generatePassword(
    length: number = 12,
    options: {
      includeUppercase?: boolean;
      includeLowercase?: boolean;
      includeNumbers?: boolean;
      includeSymbols?: boolean;
    } = {},
  ): string {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
    } = options;

    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  /**
   * Get encryption status
   * @returns Encryption status
   */
  getStatus(): {
    available: boolean;
    algorithms: string[];
    hashAlgorithms: string[];
  } {
    return {
      available: true,
      algorithms: ["aes-256-cbc", "aes-256-gcm", "des-ede3-cbc"],
      hashAlgorithms: ["sha256", "sha512", "md5"],
    };
  }
}
