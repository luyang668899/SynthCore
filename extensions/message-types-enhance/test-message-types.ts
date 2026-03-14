import messageTypesEnhancePlugin from "./index.js";
import {
  createTextMessage,
  createMediaMessage,
  createCardMessage,
  createPollMessage,
  messageTypeRegistry,
} from "./src/message-types.js";

// 模拟插件API
const mockApi = {
  registerTool: (tool) => {
    console.log(`Registered tool: ${tool.name}`);
  },
  logger: {
    info: (message) => console.log(`[INFO] ${message}`),
    error: (message) => console.error(`[ERROR] ${message}`),
  },
};

// 测试插件注册
console.log("=== Testing plugin registration ===");
messageTypesEnhancePlugin.register(mockApi);
console.log("Plugin registered successfully");

// 测试消息创建
console.log("\n=== Testing message creation ===");

// 测试文本消息
const textMessage = createTextMessage("Hello, world!", "markdown");
console.log("Text message:", JSON.stringify(textMessage, null, 2));

// 测试媒体消息
const mediaMessage = createMediaMessage("image", "https://example.com/image.jpg", {
  caption: "A beautiful image",
  filename: "image.jpg",
});
console.log("Media message:", JSON.stringify(mediaMessage, null, 2));

// 测试卡片消息
const cardMessage = createCardMessage("Welcome Card", {
  subtitle: "Welcome to OpenClaw",
  description: "This is a demo card",
  imageUrl: "https://example.com/card-image.jpg",
  buttons: [
    {
      id: "btn1",
      text: "Learn More",
      type: "primary",
      action: {
        type: "url",
        value: "https://openclaw.ai",
      },
    },
    {
      id: "btn2",
      text: "Contact Support",
      type: "secondary",
    },
  ],
});
console.log("Card message:", JSON.stringify(cardMessage, null, 2));

// 测试投票消息
const pollMessage = createPollMessage(
  "What is your favorite feature?",
  ["Voice calls", "Rich messages", "Multi-channel support", "AI integration"],
  {
    allowMultiple: true,
    expiresInSeconds: 3600,
  },
);
console.log("Poll message:", JSON.stringify(pollMessage, null, 2));

// 测试消息类型转换
console.log("\n=== Testing message type conversion ===");

// 测试转换为Telegram格式
try {
  const telegramFormat = messageTypeRegistry.convertToChannelFormat("telegram", textMessage);
  console.log("Telegram format:", JSON.stringify(telegramFormat, null, 2));
} catch (error) {
  console.error("Error converting to Telegram format:", error);
}

// 测试转换为Discord格式
try {
  const discordFormat = messageTypeRegistry.convertToChannelFormat("discord", cardMessage);
  console.log("Discord format:", JSON.stringify(discordFormat, null, 2));
} catch (error) {
  console.error("Error converting to Discord format:", error);
}

// 测试支持的渠道
console.log("\n=== Testing supported channels ===");
const channels = messageTypeRegistry.listChannels();
console.log("Supported channels:", channels);

// 测试类型支持
try {
  const telegramSupportsPoll = messageTypeRegistry.supportsType("telegram", "poll");
  const discordSupportsCard = messageTypeRegistry.supportsType("discord", "card");
  console.log("Telegram supports poll:", telegramSupportsPoll);
  console.log("Discord supports card:", discordSupportsCard);
} catch (error) {
  console.error("Error checking type support:", error);
}

console.log("\n=== All tests completed ===");
