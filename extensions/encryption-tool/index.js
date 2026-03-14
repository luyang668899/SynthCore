"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const encryption_manager_1 = require("./src/encryption-manager");
function register() {
  const encryptionManager = new encryption_manager_1.EncryptionManager();
  return {
    commands: {
      encrypt: async (args) => {
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
            message: `Encryption failed: ${error.message}`,
          };
        }
      },
      decrypt: async (args) => {
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
            message: `Decryption failed: ${error.message}`,
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
            message: `Key generation failed: ${error.message}`,
          };
        }
      },
      hash: async (args) => {
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
            message: `Hashing failed: ${error.message}`,
          };
        }
      },
      "verify-hash": async (args) => {
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
            message: `Hash verification failed: ${error.message}`,
          };
        }
      },
      "encrypt-file": async (args) => {
        try {
          encryptionManager.encryptFile(args.input, args.output, args.key);
          return {
            success: true,
            message: "File encrypted successfully",
          };
        } catch (error) {
          return {
            success: false,
            message: `File encryption failed: ${error.message}`,
          };
        }
      },
      "decrypt-file": async (args) => {
        try {
          encryptionManager.decryptFile(args.input, args.output, args.key);
          return {
            success: true,
            message: "File decrypted successfully",
          };
        } catch (error) {
          return {
            success: false,
            message: `File decryption failed: ${error.message}`,
          };
        }
      },
    },
  };
}
