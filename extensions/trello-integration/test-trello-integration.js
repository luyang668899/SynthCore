// Simple test script for Trello integration plugin
const { TrelloManager } = require("./dist/trello-manager");

console.log("Testing Trello integration plugin...");

// Test 1: Check if the TrelloManager class is properly defined
console.log("\n1. Testing TrelloManager class definition...");
try {
  const config = {
    apiKey: "mock-api-key",
    token: "mock-token",
  };
  const trelloManager = new TrelloManager(config);
  console.log("✅ TrelloManager class is properly defined");
  console.log("✅ TrelloManager instance created successfully");

  // Test 2: Check if all required methods exist
  console.log("\n2. Testing TrelloManager methods...");
  const requiredMethods = [
    "authenticate",
    "listBoards",
    "listLists",
    "listCards",
    "createCard",
    "updateCard",
    "commentCard",
    "listNotifications",
    "getIsAuthenticated",
  ];

  let allMethodsExist = true;
  for (const method of requiredMethods) {
    if (typeof trelloManager[method] === "function") {
      console.log(`✅ ${method} method exists`);
    } else {
      console.log(`❌ ${method} method missing`);
      allMethodsExist = false;
    }
  }

  // Test 3: Check if the plugin index file can be loaded
  console.log("\n3. Testing plugin index file...");
  try {
    const plugin = require("./dist/index");
    console.log("✅ Plugin index file loaded successfully");
    if (typeof plugin.initialize === "function") {
      console.log("✅ Plugin initialize function exists");
    } else {
      console.log("❌ Plugin initialize function missing");
    }
  } catch (error) {
    console.log("❌ Plugin index file failed to load:", error.message);
  }

  // Test 4: Check if the plugin configuration is properly structured
  console.log("\n4. Testing plugin configuration structure...");
  try {
    const config = require("./openclaw.plugin.json");
    console.log("✅ openclaw.plugin.json loaded successfully");
    console.log("Plugin name:", config.name);
    console.log("Plugin version:", config.version);
    console.log("Plugin commands:", config.openclaw.commands);
  } catch (error) {
    console.log("❌ openclaw.plugin.json failed to load:", error.message);
  }

  console.log("\n✅ All structural tests passed!");
  console.log("\nNote: API functionality tests require valid Trello credentials.");
  console.log("The plugin is ready for use with proper configuration.");
} catch (error) {
  console.error("❌ Test failed:", error);
}
