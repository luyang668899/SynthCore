// 消息类型定义
export type MessageType =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "file"
  | "card"
  | "button"
  | "carousel"
  | "poll";

export interface MessageBase {
  type: MessageType;
  content: any;
  metadata?: Record<string, any>;
}

export interface TextMessage extends MessageBase {
  type: "text";
  content: string;
  formatting?: "plain" | "markdown" | "html";
}

export interface MediaMessage extends MessageBase {
  type: "image" | "audio" | "video" | "file";
  content: {
    url: string;
    filename?: string;
    mimeType?: string;
    caption?: string;
  };
}

export interface Button {
  id: string;
  text: string;
  type: "primary" | "secondary" | "danger";
  action?: {
    type: "url" | "callback";
    value: string;
  };
}

export interface CardMessage extends MessageBase {
  type: "card";
  content: {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttons: Button[];
  };
}

export interface CarouselMessage extends MessageBase {
  type: "carousel";
  content: CardMessage["content"][];
}

export interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

export interface PollMessage extends MessageBase {
  type: "poll";
  content: {
    question: string;
    options: PollOption[];
    allowMultiple?: boolean;
    expiresInSeconds?: number;
  };
}

export type RichMessage = TextMessage | MediaMessage | CardMessage | CarouselMessage | PollMessage;

// 消息类型转换接口
export interface MessageTypeAdapter {
  channel: string;
  supportsType: (type: MessageType) => boolean;
  convertToChannelFormat: (message: RichMessage) => any;
  convertFromChannelFormat: (channelMessage: any) => RichMessage;
}

// 消息类型注册表
class MessageTypeRegistry {
  private adapters: Map<string, MessageTypeAdapter> = new Map();

  registerAdapter(adapter: MessageTypeAdapter) {
    this.adapters.set(adapter.channel, adapter);
  }

  getAdapter(channel: string): MessageTypeAdapter | undefined {
    return this.adapters.get(channel);
  }

  listChannels(): string[] {
    return Array.from(this.adapters.keys());
  }

  supportsType(channel: string, type: MessageType): boolean {
    const adapter = this.getAdapter(channel);
    return adapter ? adapter.supportsType(type) : false;
  }

  convertToChannelFormat(channel: string, message: RichMessage): any {
    const adapter = this.getAdapter(channel);
    if (!adapter) {
      throw new Error(`No adapter found for channel: ${channel}`);
    }
    return adapter.convertToChannelFormat(message);
  }

  convertFromChannelFormat(channel: string, channelMessage: any): RichMessage {
    const adapter = this.getAdapter(channel);
    if (!adapter) {
      throw new Error(`No adapter found for channel: ${channel}`);
    }
    return adapter.convertFromChannelFormat(channelMessage);
  }
}

export const messageTypeRegistry = new MessageTypeRegistry();

// 通用消息类型工具
export function createTextMessage(
  content: string,
  formatting?: "plain" | "markdown" | "html",
): TextMessage {
  return {
    type: "text",
    content,
    formatting,
  };
}

export function createMediaMessage(
  type: "image" | "audio" | "video" | "file",
  url: string,
  options?: {
    filename?: string;
    mimeType?: string;
    caption?: string;
  },
): MediaMessage {
  return {
    type,
    content: {
      url,
      ...options,
    },
  };
}

export function createCardMessage(
  title: string,
  options?: {
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttons?: Button[];
  },
): CardMessage {
  return {
    type: "card",
    content: {
      title,
      buttons: [],
      ...options,
    },
  };
}

export function createCarouselMessage(cards: CardMessage["content"][]): CarouselMessage {
  return {
    type: "carousel",
    content: cards,
  };
}

export function createPollMessage(
  question: string,
  options: string[],
  pollOptions?: {
    allowMultiple?: boolean;
    expiresInSeconds?: number;
  },
): PollMessage {
  return {
    type: "poll",
    content: {
      question,
      options: options.map((text, index) => ({
        id: `option-${index}`,
        text,
      })),
      ...pollOptions,
    },
  };
}
