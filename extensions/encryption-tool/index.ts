import { EncryptionManager } from "./src/encryption-manager";

export function register() {
  const encryptionManager = new EncryptionManager();

  return {
    commands: {
      encrypt: async (args: { data: string; key: string }) => {
        try {
          const encryptedData = encryptionManager.encrypt(args.data, args.key);
          return {
            success: true,
            message: "Data encrypted successfully",
            data: encryptedData,
          };
        } catch (error) {
          return {
            success: false,
            message: `Encryption failed: ${(error as Error).message}`,
          };
        }
      },
      decrypt: async (args: { data: string; key: string }) => {
        try {
          const decryptedData = encryptionManager.decrypt(args.data, args.key);
          return {
            success: true,
            message: "Data decrypted successfully",
            data: decryptedData,
          };
        } catch (error) {
          return {
            success: false,
            message: `Decryption failed: ${(error as Error).message}`,
          };
        }
      },
      "generate-key": async () => {
        try {
          const key = encryptionManager.generateKey();
          return {
            success: true,
            message: "Encryption key generated successfully",
            data: key,
          };
        } catch (error) {
          return {
            success: false,
            message: `Key generation failed: ${(error as Error).message}`,
          };
        }
      },
      hash: async (args: { data: string }) => {
        try {
          const hashedData = encryptionManager.hash(args.data);
          return {
            success: true,
            message: "Data hashed successfully",
            data: hashedData,
          };
        } catch (error) {
          return {
            success: false,
            message: `Hashing failed: ${(error as Error).message}`,
          };
        }
      },
      "verify-hash": async (args: { data: string; hash: string }) => {
        try {
          const isValid = encryptionManager.verifyHash(args.data, args.hash);
          return {
            success: true,
            message: isValid ? "Hash verification successful" : "Hash verification failed",
            data: isValid,
          };
        } catch (error) {
          return {
            success: false,
            message: `Hash verification failed: ${(error as Error).message}`,
          };
        }
      },
      "encrypt-file": async (args: { input: string; output: string; key: string }) => {
        try {
          encryptionManager.encryptFile(args.input, args.output, args.key);
          return {
            success: true,
            message: "File encrypted successfully",
          };
        } catch (error) {
          return {
            success: false,
            message: `File encryption failed: ${(error as Error).message}`,
          };
        }
      },
      "decrypt-file": async (args: { input: string; output: string; key: string }) => {
        try {
          encryptionManager.decryptFile(args.input, args.output, args.key);
          return {
            success: true,
            message: "File decrypted successfully",
          };
        } catch (error) {
          return {
            success: false,
            message: `File decryption failed: ${(error as Error).message}`,
          };
        }
      },
    },
  };
}
