import {
  OpenClawPlugin,
  PluginRuntime,
  Tool,
  ToolContext,
  Message,
} from "../../../dist/plugin-sdk/core.js";
import DiscordEnhancedPlugin from "./index.js";
import { DiscordManager } from "./src/discord-manager.js";

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
      pluginId: "discord-enhanced",
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

async function testDiscordEnhancedPlugin() {
  console.log("=== Testing Discord enhanced plugin ===\n");

  // Create mock runtime
  const runtime = createMockRuntime();

  // Create plugin instance
  const plugin = new DiscordEnhancedPlugin(runtime);

  // Initialize plugin
  await plugin.init();

  // Test plugin registration
  console.log("=== Testing plugin registration ===");
  const tools = plugin.getTools();
  tools.forEach((tool) => {
    console.log(`Registered tool: ${tool.name}`);
  });
  console.log("[INFO] Discord enhanced plugin registered");
  console.log("Plugin registered successfully\n");

  // Test status
  console.log("=== Testing status ===");
  const statusTool = tools.find((tool) => tool.name === "discord_status");
  if (statusTool) {
    const status = await statusTool.handler({ parameters: {} });
    console.log("Status:", status);
  }

  // Test config
  console.log("\n=== Testing config ===");
  const configTool = tools.find((tool) => tool.name === "discord_config");
  if (configTool) {
    const config = await configTool.handler({ parameters: {} });
    console.log("Current config:", config);
  }

  // Test connect
  console.log("\n=== Testing connect ===");
  const connectTool = tools.find((tool) => tool.name === "discord_connect");
  if (connectTool) {
    const connectResult = await connectTool.handler({
      parameters: {
        token: "test-token",
      },
    });
    console.log("Connect result:", connectResult);
  }

  // Test status after connect
  console.log("\n=== Testing status after connect ===");
  if (statusTool) {
    const status = await statusTool.handler({ parameters: {} });
    console.log("Status after connect:", status);
  }

  // Test send message
  console.log("\n=== Testing send message ===");
  const sendMessageTool = tools.find((tool) => tool.name === "discord_send_message");
  if (sendMessageTool) {
    const messageResult = await sendMessageTool.handler({
      parameters: {
        channelId: "channel-1",
        content: "Hello, Discord!",
      },
    });
    console.log("Send message result:", messageResult);
  }

  // Test send embed
  console.log("\n=== Testing send embed ===");
  const sendEmbedTool = tools.find((tool) => tool.name === "discord_send_embed");
  if (sendEmbedTool) {
    const embedResult = await sendEmbedTool.handler({
      parameters: {
        channelId: "channel-1",
        embed: {
          title: "Test Embed",
          description: "This is a test embed",
          color: 0x00ff00,
          fields: [
            {
              name: "Field 1",
              value: "Value 1",
            },
            {
              name: "Field 2",
              value: "Value 2",
            },
          ],
        },
      },
    });
    console.log("Send embed result:", embedResult);
  }

  // Test get channel
  console.log("\n=== Testing get channel ===");
  const getChannelTool = tools.find((tool) => tool.name === "discord_get_channel");
  if (getChannelTool) {
    const channelResult = await getChannelTool.handler({
      parameters: {
        channelId: "channel-1",
      },
    });
    console.log("Get channel result:", channelResult);
  }

  // Test get guild
  console.log("\n=== Testing get guild ===");
  const getGuildTool = tools.find((tool) => tool.name === "discord_get_guild");
  if (getGuildTool) {
    const guildResult = await getGuildTool.handler({
      parameters: {
        guildId: "guild-1",
      },
    });
    console.log("Get guild result:", guildResult);
  }

  // Test get user
  console.log("\n=== Testing get user ===");
  const getUserTool = tools.find((tool) => tool.name === "discord_get_user");
  if (getUserTool) {
    const userResult = await getUserTool.handler({
      parameters: {
        userId: "user-1",
      },
    });
    console.log("Get user result:", userResult);
  }

  // Test list channels
  console.log("\n=== Testing list channels ===");
  const listChannelsTool = tools.find((tool) => tool.name === "discord_list_channels");
  if (listChannelsTool) {
    const channelsResult = await listChannelsTool.handler({
      parameters: {
        guildId: "guild-1",
      },
    });
    console.log("List channels result:", channelsResult);
  }

  // Test list guilds
  console.log("\n=== Testing list guilds ===");
  const listGuildsTool = tools.find((tool) => tool.name === "discord_list_guilds");
  if (listGuildsTool) {
    const guildsResult = await listGuildsTool.handler({ parameters: {} });
    console.log("List guilds result:", guildsResult);
  }

  // Test create channel
  console.log("\n=== Testing create channel ===");
  const createChannelTool = tools.find((tool) => tool.name === "discord_create_channel");
  if (createChannelTool) {
    const createChannelResult = await createChannelTool.handler({
      parameters: {
        guildId: "guild-1",
        name: "new-channel",
        type: 0,
      },
    });
    console.log("Create channel result:", createChannelResult);
  }

  // Test delete channel
  console.log("\n=== Testing delete channel ===");
  const deleteChannelTool = tools.find((tool) => tool.name === "discord_delete_channel");
  if (deleteChannelTool) {
    const deleteChannelResult = await deleteChannelTool.handler({
      parameters: {
        channelId: "channel-1",
      },
    });
    console.log("Delete channel result:", deleteChannelResult);
  }

  // Test disconnect
  console.log("\n=== Testing disconnect ===");
  const disconnectTool = tools.find((tool) => tool.name === "discord_disconnect");
  if (disconnectTool) {
    const disconnectResult = await disconnectTool.handler({ parameters: {} });
    console.log("Disconnect result:", disconnectResult);
  }

  // Test status after disconnect
  console.log("\n=== Testing status after disconnect ===");
  if (statusTool) {
    const status = await statusTool.handler({ parameters: {} });
    console.log("Status after disconnect:", status);
  }

  console.log("\n=== All tests completed ===");
}

testDiscordEnhancedPlugin().catch(console.error);
