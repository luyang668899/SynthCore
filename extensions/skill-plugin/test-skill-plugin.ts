import { OpenClawPlugin, PluginRuntime, Tool, ToolContext } from "../../../dist/plugin-sdk/core.js";
import SkillPlugin from "./index.js";
import { SkillManager } from "./src/skill-manager.js";

// Mock runtime implementation
class MockRuntime implements PluginRuntime {
  log(message: string) {
    console.log(`[INFO] ${message}`);
  }
  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }
  debug(message: string) {
    console.log(`[DEBUG] ${message}`);
  }
  getConfig(key: string) {
    return undefined;
  }
  setConfig(key: string, value: any) {
    // Do nothing
  }
  getSecret(key: string) {
    return undefined;
  }
  setSecret(key: string, value: string) {
    // Do nothing
  }
  async executeTool(name: string, parameters: any) {
    return null;
  }
  async emitEvent(event: string, data: any) {
    // Do nothing
  }
  onEvent(event: string, handler: (data: any) => void) {
    // Do nothing
    return () => {};
  }
  getPluginContext() {
    return {
      pluginId: "skill-plugin",
      version: "2026.2.17",
    };
  }
  getApiClient() {
    return {
      request: async (options: any) => {
        return { data: {} };
      },
    } as any;
  }
}

function createMockRuntime() {
  return new MockRuntime();
}

async function testSkillPlugin() {
  console.log("=== Testing skill plugin ===\n");

  // Create mock runtime
  const runtime = createMockRuntime();

  // Create plugin instance
  const plugin = new SkillPlugin(runtime);

  // Initialize plugin
  await plugin.init();

  // Test plugin registration
  console.log("=== Testing plugin registration ===");
  const tools = plugin.getTools();
  tools.forEach((tool) => {
    console.log(`Registered tool: ${tool.name}`);
  });
  console.log("[INFO] Skill plugin registered");
  console.log("Plugin registered successfully\n");

  // Test skill manager
  console.log("=== Testing skill manager ===");

  // Get enabled skills
  const listSkillsTool = tools.find((tool) => tool.name === "skill_list");
  if (listSkillsTool) {
    const skills = await listSkillsTool.handler({ parameters: {} });
    console.log("Enabled skills:", skills);
  }

  // Test weather skill
  console.log("\n=== Testing weather skill ===");
  const weatherTool = tools.find((tool) => tool.name === "skill_weather");
  if (weatherTool) {
    const weatherResult = await weatherTool.handler({
      parameters: {
        location: "New York",
      },
    });
    console.log("Weather result:", weatherResult);
  }

  // Test news skill
  console.log("\n=== Testing news skill ===");
  const newsTool = tools.find((tool) => tool.name === "skill_news");
  if (newsTool) {
    const newsResult = await newsTool.handler({
      parameters: {
        category: "technology",
        country: "us",
      },
    });
    console.log("News result:", newsResult);
  }

  // Test calculator skill
  console.log("\n=== Testing calculator skill ===");
  const calculatorTool = tools.find((tool) => tool.name === "skill_calculator");
  if (calculatorTool) {
    const calculatorResult = await calculatorTool.handler({
      parameters: {
        expression: "2 + 2 * 3",
      },
    });
    console.log("Calculator result:", calculatorResult);
  }

  // Test translator skill
  console.log("\n=== Testing translator skill ===");
  const translatorTool = tools.find((tool) => tool.name === "skill_translator");
  if (translatorTool) {
    const translatorResult = await translatorTool.handler({
      parameters: {
        text: "Hello, world!",
        targetLanguage: "fr",
      },
    });
    console.log("Translator result:", translatorResult);
  }

  // Test generic skill execute
  console.log("\n=== Testing generic skill execute ===");
  const executeTool = tools.find((tool) => tool.name === "skill_execute");
  if (executeTool) {
    const executeResult = await executeTool.handler({
      parameters: {
        skill: "weather",
        parameters: {
          location: "London",
        },
      },
    });
    console.log("Generic execute result:", executeResult);
  }

  // Test config update
  console.log("\n=== Testing config update ===");
  const configTool = tools.find((tool) => tool.name === "skill_config");
  if (configTool) {
    // Get current config
    const currentConfig = await configTool.handler({ parameters: {} });
    console.log("Current config:", currentConfig);

    // Update config
    const updatedConfig = await configTool.handler({
      parameters: {
        config: {
          skills: {
            weather: {
              enabled: true,
              apiKey: "test-api-key",
            },
          },
        },
      },
    });
    console.log("Updated config:", updatedConfig);
  }

  console.log("\n=== All tests completed ===");
}

testSkillPlugin().catch(console.error);
