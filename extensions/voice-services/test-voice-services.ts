import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import voiceServicesPlugin from "./index.js";
import {
  VoiceManager,
  VoiceServiceConfig,
  SpeechRecognitionRequest,
  SpeechSynthesisRequest,
} from "./src/voice-manager.js";

// 模拟插件API
const mockApi: Partial<OpenClawPluginApi> = {
  registerTool: (tool) => {
    console.log(`Registered tool: ${tool.name}`);
  },
  logger: {
    info: (message: string) => console.log(`[INFO] ${message}`),
    error: (message: string) => console.error(`[ERROR] ${message}`),
    debug: (message: string) => console.log(`[DEBUG] ${message}`),
    warn: (message: string) => console.log(`[WARN] ${message}`),
  },
};

// 测试插件注册
console.log("=== Testing plugin registration ===");
voiceServicesPlugin.register(mockApi as OpenClawPluginApi);
console.log("Plugin registered successfully");

// 测试语音服务管理器
console.log("\n=== Testing voice services manager ===");
const config: VoiceServiceConfig = {
  enabled: true,
  defaultProvider: "google",
  providers: {
    google: {
      enabled: true,
      credentials: "test-credentials",
      projectId: "test-project",
    },
    azure: {
      enabled: true,
      subscriptionKey: "test-subscription-key",
      region: "eastus",
    },
    deepgram: {
      enabled: true,
      apiKey: "test-api-key",
    },
  },
};

const voiceManager = new VoiceManager(mockApi as OpenClawPluginApi, config);
console.log("Voice manager created");

// 测试启用的服务
console.log("\n=== Testing enabled services ===");
const enabledServices = voiceManager.getEnabledServices();
console.log("Enabled services:", enabledServices);

// 测试语音识别
console.log("\n=== Testing speech recognition ===");
const recognitionRequest: SpeechRecognitionRequest = {
  audio: Buffer.from("test audio data"),
  language: "en-US",
  provider: "google",
};

voiceManager
  .recognize(recognitionRequest)
  .then((result) => {
    console.log("Recognition result:", JSON.stringify(result, null, 2));

    // 测试语音合成
    console.log("\n=== Testing speech synthesis ===");
    const synthesisRequest: SpeechSynthesisRequest = {
      text: "Hello, this is a test synthesis",
      voice: "en-US-Standard-A",
      language: "en-US",
      provider: "azure",
    };
    return voiceManager.synthesize(synthesisRequest);
  })
  .then((result) => {
    console.log("Synthesis result:", {
      provider: result.provider,
      duration: result.duration,
      audioLength: result.audio.length,
    });

    // 测试默认提供商
    console.log("\n=== Testing default provider ===");
    const defaultRecognitionRequest: SpeechRecognitionRequest = {
      audio: Buffer.from("test audio data"),
      language: "en-US",
    };
    return voiceManager.recognize(defaultRecognitionRequest);
  })
  .then((result) => {
    console.log("Default provider recognition result:", JSON.stringify(result, null, 2));

    // 测试配置更新
    console.log("\n=== Testing config update ===");
    voiceManager.updateConfig({
      defaultProvider: "deepgram",
    });
    const updatedConfig = voiceManager.getConfig();
    console.log("Updated config:", JSON.stringify(updatedConfig, null, 2));

    console.log("\n=== All tests completed ===");
  })
  .catch((error) => {
    console.error("Error during tests:", error);
  });
