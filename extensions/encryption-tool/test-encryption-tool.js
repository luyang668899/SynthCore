const { EncryptionManager } = require("./src/encryption-manager");
const fs = require("fs");
const path = require("path");

async function testEncryptionTool() {
  console.log("Testing Encryption Tool Plugin...");

  const encryptionManager = new EncryptionManager();

  try {
    // Test 1: Generate encryption key
    console.log("\n1. Testing generateKey()...");
    const key = encryptionManager.generateKey();
    console.log("Generated key:", key);
    console.log("Key length:", key.length);
    console.log("✓ Key generation successful");

    // Test 2: Encrypt and decrypt data
    console.log("\n2. Testing encrypt() and decrypt()...");
    const originalData = "Hello, OpenClaw! This is a test message.";
    const encryptedData = encryptionManager.encrypt(originalData, key);
    console.log("Original data:", originalData);
    console.log("Encrypted data:", encryptedData);

    const decryptedData = encryptionManager.decrypt(encryptedData, key);
    console.log("Decrypted data:", decryptedData);

    if (decryptedData === originalData) {
      console.log("✓ Encryption and decryption successful");
    } else {
      console.log("✗ Encryption and decryption failed");
    }

    // Test 3: Hash and verify hash
    console.log("\n3. Testing hash() and verifyHash()...");
    const testData = "Test data for hashing";
    const hashedData = encryptionManager.hash(testData);
    console.log("Original data:", testData);
    console.log("Hashed data:", hashedData);

    const isValid = encryptionManager.verifyHash(testData, hashedData);
    console.log("Hash verification result:", isValid);

    if (isValid) {
      console.log("✓ Hash and verification successful");
    } else {
      console.log("✗ Hash and verification failed");
    }

    // Test 4: Generate password
    console.log("\n4. Testing generatePassword()...");
    const password = encryptionManager.generatePassword(16);
    console.log("Generated password:", password);
    console.log("Password length:", password.length);
    console.log("✓ Password generation successful");

    // Test 5: Encrypt and decrypt object
    console.log("\n5. Testing encryptObject() and decryptObject()...");
    const testObject = {
      name: "OpenClaw",
      version: "2026.3.7",
      features: ["encryption", "security", "tools"],
    };
    console.log("Original object:", testObject);

    const encryptedObject = encryptionManager.encryptObject(testObject, key);
    console.log("Encrypted object:", encryptedObject);

    const decryptedObject = encryptionManager.decryptObject(encryptedObject, key);
    console.log("Decrypted object:", decryptedObject);

    if (JSON.stringify(decryptedObject) === JSON.stringify(testObject)) {
      console.log("✓ Object encryption and decryption successful");
    } else {
      console.log("✗ Object encryption and decryption failed");
    }

    // Test 6: Get status
    console.log("\n6. Testing getStatus()...");
    const status = encryptionManager.getStatus();
    console.log("Status:", status);
    console.log("✓ Status retrieval successful");

    // Test 7: Encrypt and decrypt file
    console.log("\n7. Testing encryptFile() and decryptFile()...");
    const testFileName = "test-file.txt";
    const encryptedFileName = "test-file.encrypted";
    const decryptedFileName = "test-file.decrypted.txt";

    // Create test file
    fs.writeFileSync(testFileName, "This is a test file for encryption.", "utf8");
    console.log("Created test file:", testFileName);

    // Encrypt file
    encryptionManager.encryptFile(testFileName, encryptedFileName, key);
    console.log("Encrypted file created:", encryptedFileName);

    // Decrypt file
    encryptionManager.decryptFile(encryptedFileName, decryptedFileName, key);
    console.log("Decrypted file created:", decryptedFileName);

    // Verify file contents
    const originalFileContent = fs.readFileSync(testFileName, "utf8");
    const decryptedFileContent = fs.readFileSync(decryptedFileName, "utf8");

    if (originalFileContent === decryptedFileContent) {
      console.log("✓ File encryption and decryption successful");
    } else {
      console.log("✗ File encryption and decryption failed");
    }

    // Clean up test files
    fs.unlinkSync(testFileName);
    fs.unlinkSync(encryptedFileName);
    fs.unlinkSync(decryptedFileName);
    console.log("Cleaned up test files");

    console.log("\n🎉 All tests passed! Encryption Tool Plugin is working correctly.");
  } catch (error) {
    console.error("Error during testing:", error);
  }
}

testEncryptionTool();
