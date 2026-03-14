import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import {
  messageTypeRegistry,
  MessageTypeAdapter,
  createTextMessage,
  createMediaMessage,
  createCardMessage,
  createCarouselMessage,
  createPollMessage,
  type RichMessage,
} from "./src/message-types.js";

// 示例适配器：Telegram
const telegramAdapter: MessageTypeAdapter = {
  channel: "telegram",
  supportsType: (type) => {
    const supportedTypes = ["text", "image", "audio", "video", "file", "poll"];
    return supportedTypes.includes(type);
  },
  convertToChannelFormat: (message) => {
    switch (message.type) {
      case "text":
        return {
          text: message.content,
          parse_mode: message.formatting === "markdown" ? "Markdown" : "HTML",
        };
      case "image":
      case "audio":
      case "video":
      case "file":
        return {
          text: message.content.caption || "",
          mediaUrl: message.content.url,
        };
      case "poll":
        return {
          question: message.content.question,
          options: message.content.options.map((opt) => opt.text),
          is_anonymous: false,
          allows_multiple_answers: message.content.allowMultiple || false,
        };
      default:
        throw new Error(`Unsupported message type for Telegram: ${message.type}`);
    }
  },
  convertFromChannelFormat: (channelMessage) => {
    if (channelMessage.text) {
      return createTextMessage(channelMessage.text);
    }
    if (
      channelMessage.photo ||
      channelMessage.audio ||
      channelMessage.video ||
      channelMessage.document
    ) {
      const mediaType = channelMessage.photo
        ? "image"
        : channelMessage.audio
          ? "audio"
          : channelMessage.video
            ? "video"
            : "file";
      const media =
        channelMessage.photo ||
        channelMessage.audio ||
        channelMessage.video ||
        channelMessage.document;
      const url = media.file_id || media.url;
      return createMediaMessage(mediaType, url, {
        filename: media.file_name,
        caption: channelMessage.caption,
      });
    }
    return createTextMessage("Unknown message type");
  },
};

// 示例适配器：Discord
const discordAdapter: MessageTypeAdapter = {
  channel: "discord",
  supportsType: (type) => {
    const supportedTypes = ["text", "image", "audio", "video", "file", "card", "poll"];
    return supportedTypes.includes(type);
  },
  convertToChannelFormat: (message) => {
    switch (message.type) {
      case "text":
        return {
          content: message.content,
        };
      case "image":
      case "audio":
      case "video":
      case "file":
        return {
          content: message.content.caption || "",
          files: [message.content.url],
        };
      case "card":
        return {
          embeds: [
            {
              title: message.content.title,
              description: message.content.description || message.content.subtitle,
              image: message.content.imageUrl ? { url: message.content.imageUrl } : undefined,
              fields: message.content.buttons.map((button) => ({
                name: button.text,
                value: button.action?.value || "",
              })),
            },
          ],
        };
      case "poll":
        return {
          content: `Poll: ${message.content.question}\n${message.content.options.map((opt) => `- ${opt.text}`).join("\n")}`,
        };
      default:
        throw new Error(`Unsupported message type for Discord: ${message.type}`);
    }
  },
  convertFromChannelFormat: (channelMessage) => {
    if (channelMessage.content) {
      return createTextMessage(channelMessage.content);
    }
    if (channelMessage.attachments && channelMessage.attachments.length > 0) {
      const attachment = channelMessage.attachments[0];
      const mediaType = attachment.content_type?.startsWith("image/")
        ? "image"
        : attachment.content_type?.startsWith("audio/")
          ? "audio"
          : attachment.content_type?.startsWith("video/")
            ? "video"
            : "file";
      return createMediaMessage(mediaType, attachment.url, {
        filename: attachment.filename,
      });
    }
    return createTextMessage("Unknown message type");
  },
};

const messageTypesEnhancePlugin = {
  id: "message-types-enhance",
  name: "Message Types Enhance",
  description: "Enhance message types support for various channels",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    // 注册适配器
    messageTypeRegistry.registerAdapter(telegramAdapter);
    messageTypeRegistry.registerAdapter(discordAdapter);

    // 注册工具
    api.registerTool({
      name: "create_text_message",
      label: "Create Text Message",
      description: "Create a text message with optional formatting",
      parameters: {
        type: "object",
        properties: {
          content: { type: "string", description: "Message content" },
          formatting: {
            type: "string",
            enum: ["plain", "markdown", "html"],
            description: "Formatting type",
          },
        },
        required: ["content"],
      },
      async execute(_toolCallId, params) {
        const message = createTextMessage(params.content, params.formatting);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(message, null, 2) }],
          details: message,
        };
      },
    });

    api.registerTool({
      name: "create_media_message",
      label: "Create Media Message",
      description: "Create a media message (image, audio, video, file)",
      parameters: {
        type: "object",
        properties: {
          mediaType: {
            type: "string",
            enum: ["image", "audio", "video", "file"],
            description: "Media type",
          },
          url: { type: "string", description: "Media URL" },
          filename: { type: "string", description: "Filename" },
          caption: { type: "string", description: "Caption" },
        },
        required: ["mediaType", "url"],
      },
      async execute(_toolCallId, params) {
        const message = createMediaMessage(params.mediaType, params.url, {
          filename: params.filename,
          caption: params.caption,
        });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(message, null, 2) }],
          details: message,
        };
      },
    });

    api.registerTool({
      name: "create_card_message",
      label: "Create Card Message",
      description: "Create a card message with buttons",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Card title" },
          subtitle: { type: "string", description: "Card subtitle" },
          description: { type: "string", description: "Card description" },
          imageUrl: { type: "string", description: "Image URL" },
          buttons: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                text: { type: "string" },
                type: { type: "string", enum: ["primary", "secondary", "danger"] },
                action: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["url", "callback"] },
                    value: { type: "string" },
                  },
                },
              },
              required: ["id", "text", "type"],
            },
          },
        },
        required: ["title"],
      },
      async execute(_toolCallId, params) {
        const message = createCardMessage(params.title, {
          subtitle: params.subtitle,
          description: params.description,
          imageUrl: params.imageUrl,
          buttons: params.buttons,
        });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(message, null, 2) }],
          details: message,
        };
      },
    });

    api.registerTool({
      name: "create_poll_message",
      label: "Create Poll Message",
      description: "Create a poll message",
      parameters: {
        type: "object",
        properties: {
          question: { type: "string", description: "Poll question" },
          options: { type: "array", items: { type: "string" }, description: "Poll options" },
          allowMultiple: { type: "boolean", description: "Allow multiple answers" },
          expiresInSeconds: { type: "number", description: "Expiration time in seconds" },
        },
        required: ["question", "options"],
      },
      async execute(_toolCallId, params) {
        const message = createPollMessage(params.question, params.options, {
          allowMultiple: params.allowMultiple,
          expiresInSeconds: params.expiresInSeconds,
        });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(message, null, 2) }],
          details: message,
        };
      },
    });

    api.registerTool({
      name: "convert_message_to_channel",
      label: "Convert Message to Channel Format",
      description: "Convert a rich message to channel-specific format",
      parameters: {
        type: "object",
        properties: {
          channel: { type: "string", description: "Target channel" },
          message: { type: "object", description: "Rich message object" },
        },
        required: ["channel", "message"],
      },
      async execute(_toolCallId, params) {
        try {
          const channelFormat = messageTypeRegistry.convertToChannelFormat(
            params.channel,
            params.message as RichMessage,
          );
          return {
            content: [{ type: "text" as const, text: JSON.stringify(channelFormat, null, 2) }],
            details: channelFormat,
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            details: { error: error instanceof Error ? error.message : String(error) },
          };
        }
      },
    });

    api.logger.info("Message types enhancement plugin registered");
  },
};

export default messageTypesEnhancePlugin;
