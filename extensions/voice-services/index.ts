import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import {
  VoiceManager,
  type VoiceServiceConfig,
  type SpeechRecognitionRequest,
  type SpeechSynthesisRequest,
} from "./src/voice-manager.js";

let voiceManager: VoiceManager | null = null;

const voiceServicesPlugin = {
  id: "voice-services",
  name: "Voice Services",
  description: "Voice services integration plugin for OpenClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    // 初始化语音服务管理器
    const config: VoiceServiceConfig = {
      enabled: true,
      defaultProvider: "google",
      providers: {
        google: {
          enabled: false,
        },
        azure: {
          enabled: false,
        },
        deepgram: {
          enabled: false,
        },
      },
    };

    voiceManager = new VoiceManager(api, config);

    // 注册工具
    api.registerTool({
      name: "voice_recognize",
      label: "Voice Recognition",
      description: "Recognize speech from audio",
      parameters: {
        type: "object",
        properties: {
          audio: {
            type: "string",
            description: "Audio data (base64 encoded)",
          },
          language: {
            type: "string",
            description: "Language code",
          },
          provider: {
            type: "string",
            enum: ["google", "azure", "deepgram"],
            description: "Voice service provider",
          },
          model: {
            type: "string",
            description: "Recognition model",
          },
        },
        required: ["audio"],
      },
      async execute(_toolCallId: string, params: SpeechRecognitionRequest) {
        if (!voiceManager) {
          return {
            content: [{ type: "text" as const, text: "Voice manager not initialized" }],
            details: { error: "Voice manager not initialized" },
          };
        }

        try {
          // 转换base64音频数据为Buffer
          let audioBuffer: Buffer;
          if (typeof params.audio === "string") {
            audioBuffer = Buffer.from(params.audio, "base64");
          } else {
            audioBuffer = params.audio;
          }
          const request = { ...params, audio: audioBuffer };
          const result = await voiceManager.recognize(request);
          return {
            content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
            details: result,
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

    api.registerTool({
      name: "voice_synthesize",
      label: "Speech Synthesis",
      description: "Synthesize speech from text",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text to synthesize",
          },
          voice: {
            type: "string",
            description: "Voice name",
          },
          language: {
            type: "string",
            description: "Language code",
          },
          provider: {
            type: "string",
            enum: ["google", "azure", "deepgram"],
            description: "Voice service provider",
          },
          format: {
            type: "string",
            description: "Audio format",
          },
        },
        required: ["text"],
      },
      async execute(_toolCallId: string, params: SpeechSynthesisRequest) {
        if (!voiceManager) {
          return {
            content: [{ type: "text" as const, text: "Voice manager not initialized" }],
            details: { error: "Voice manager not initialized" },
          };
        }

        try {
          const result = await voiceManager.synthesize(params);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  {
                    ...result,
                    audio: result.audio.toString("base64"),
                  },
                  null,
                  2,
                ),
              },
            ],
            details: {
              ...result,
              audio: result.audio.toString("base64"),
            },
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

    api.registerTool({
      name: "voice_services_status",
      label: "Voice Services Status",
      description: "Get status of voice services",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
      async execute(_toolCallId: string) {
        if (!voiceManager) {
          return {
            content: [{ type: "text" as const, text: "Voice manager not initialized" }],
            details: { error: "Voice manager not initialized" },
          };
        }

        try {
          const enabledServices = voiceManager.getEnabledServices();
          const config = voiceManager.getConfig();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  {
                    enabledServices,
                    defaultProvider: config.defaultProvider,
                  },
                  null,
                  2,
                ),
              },
            ],
            details: {
              enabledServices,
              defaultProvider: config.defaultProvider,
            },
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

    api.registerTool({
      name: "voice_config",
      label: "Configure Voice Services",
      description: "Configure voice services settings",
      parameters: {
        type: "object",
        properties: {
          enabled: { type: "boolean", description: "Enable voice services" },
          defaultProvider: {
            type: "string",
            enum: ["google", "azure", "deepgram"],
            description: "Default voice service provider",
          },
          providers: {
            type: "object",
            properties: {
              google: {
                type: "object",
                properties: {
                  enabled: { type: "boolean", description: "Enable Google Cloud Speech" },
                  credentials: { type: "string", description: "Google Cloud credentials JSON" },
                  projectId: { type: "string", description: "Google Cloud project ID" },
                },
              },
              azure: {
                type: "object",
                properties: {
                  enabled: { type: "boolean", description: "Enable Azure Speech" },
                  subscriptionKey: {
                    type: "string",
                    description: "Azure Speech Service subscription key",
                  },
                  region: { type: "string", description: "Azure Speech Service region" },
                },
              },
              deepgram: {
                type: "object",
                properties: {
                  enabled: { type: "boolean", description: "Enable Deepgram Speech" },
                  apiKey: { type: "string", description: "Deepgram API key" },
                },
              },
            },
          },
        },
        required: [],
      },
      async execute(_toolCallId: string, params: Partial<VoiceServiceConfig>) {
        if (!voiceManager) {
          return {
            content: [{ type: "text" as const, text: "Voice manager not initialized" }],
            details: { error: "Voice manager not initialized" },
          };
        }

        try {
          voiceManager.updateConfig(params);
          const config = voiceManager.getConfig();
          return {
            content: [{ type: "text" as const, text: JSON.stringify(config, null, 2) }],
            details: config,
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

    api.logger?.info("Voice services plugin registered");
  },
  unregister() {
    voiceManager = null;
  },
};

export default voiceServicesPlugin;
