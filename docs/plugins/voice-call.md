---
summary: "Voice Call plugin: outbound + inbound calls via Twilio/Telnyx/Plivo (plugin install + config + CLI)"
read_when:
  - You want to place an outbound voice call from OpenClaw
  - You are configuring or developing the voice-call plugin
title: "Voice Call Plugin"
---

# OpenClaw 语音通话插件使用说明书

## 结构框架

### 文档章节划分

1. **基本介绍**：语音通话插件概述、功能特点、适用范围
2. **适用对象**：目标用户群体及使用场景
3. **阅读指南**：文档使用方法和导航建议
4. **运行位置**：插件运行环境说明
5. **安装**：插件安装步骤
6. **配置**：插件配置方法
7. **过期通话清理**：通话管理功能
8. **Webhook 安全**：Webhook 安全配置
9. **通话 TTS**：文本转语音配置
10. **呼入通话**：呼入通话配置
11. **CLI**：命令行接口
12. **代理工具**：代理工具使用
13. **Gateway RPC**：Gateway 远程调用

### 章节逻辑关系

- **基础层**：基本介绍 → 适用对象 → 阅读指南
- **安装配置层**：运行位置 → 安装 → 配置
- **功能层**：过期通话清理 → Webhook 安全 → 通话 TTS → 呼入通话
- **接口层**：CLI → 代理工具 → Gateway RPC

## 1. 基本介绍

通过插件实现 OpenClaw 的语音通话功能。支持外呼通知和带有呼入策略的多轮对话。

当前支持的提供商：

- `twilio` (Programmable Voice + Media Streams)
- `telnyx` (Call Control v2)
- `plivo` (Voice API + XML transfer + GetInput speech)
- `mock` (开发/无网络)

快速使用模型：

- 安装插件
- 重启 Gateway
- 在 `plugins.entries.voice-call.config` 下配置
- 使用 `openclaw voicecall ...` 或 `voice_call` 工具

## 2. 适用对象

本指南适用于以下用户：

- **OpenClaw 用户**：希望通过 OpenClaw 进行语音通话的用户
- **系统管理员**：负责配置和管理语音通话插件的管理员
- **开发人员**：希望开发或扩展语音通话功能的开发人员

## 3. 阅读指南

- **快速开始**：如果你是首次使用语音通话插件，请先阅读[安装](#5-安装)和[配置](#6-配置)部分
- **功能配置**：了解如何配置呼入通话和 TTS，请查看[呼入通话](#10-呼入通话)和[通话 TTS](#9-通话-tts)部分
- **接口使用**：学习如何使用命令行和代理工具，请参考[CLI](#11-cli)和[代理工具](#12-代理工具)部分

## 4. 运行位置

语音通话插件在**Gateway 进程内部**运行。

如果你使用远程 Gateway，请在**运行 Gateway 的机器**上安装/配置插件，然后重启 Gateway 以加载它。

## 5. 安装

### 选项 A：从 npm 安装（推荐）

```bash
openclaw plugins install @openclaw/voice-call
```

之后重启 Gateway。

### 选项 B：从本地文件夹安装（开发，不复制）

```bash
openclaw plugins install ./extensions/voice-call
cd ./extensions/voice-call && pnpm install
```

之后重启 Gateway。

## 6. 配置

在 `plugins.entries.voice-call.config` 下设置配置：

```json5
{
  plugins: {
    entries: {
      "voice-call": {
        enabled: true,
        config: {
          provider: "twilio", // 或 "telnyx" | "plivo" | "mock"
          fromNumber: "+15550001234",
          toNumber: "+15550005678",

          twilio: {
            accountSid: "ACxxxxxxxx",
            authToken: "...",
          },

          telnyx: {
            apiKey: "...",
            connectionId: "...",
            // 来自 Telnyx Mission Control Portal 的 Telnyx webhook 公钥
            // (Base64 字符串；也可以通过 TELNYX_PUBLIC_KEY 设置)。
            publicKey: "...",
          },

          plivo: {
            authId: "MAxxxxxxxxxxxxxxxxxxxx",
            authToken: "...",
          },

          // Webhook 服务器
          serve: {
            port: 3334,
            path: "/voice/webhook",
          },

          // Webhook 安全（对于隧道/代理推荐）
          webhookSecurity: {
            allowedHosts: ["voice.example.com"],
            trustedProxyIPs: ["100.64.0.1"],
          },

          // 公共暴露（选择一个）
          // publicUrl: "https://example.ngrok.app/voice/webhook",
          // tunnel: { provider: "ngrok" },
          // tailscale: { mode: "funnel", path: "/voice/webhook" }

          outbound: {
            defaultMode: "notify", // notify | conversation
          },

          streaming: {
            enabled: true,
            streamPath: "/voice/stream",
            preStartTimeoutMs: 5000,
            maxPendingConnections: 32,
            maxPendingConnectionsPerIp: 4,
            maxConnections: 128,
          },
        },
      },
    },
  },
}
```

注意：

- Twilio/Telnyx 需要**可公开访问**的 webhook URL。
- Plivo 需要**可公开访问**的 webhook URL。
- `mock` 是本地开发提供商（无网络调用）。
- 除非 `skipSignatureVerification` 为 true，否则 Telnyx 需要 `telnyx.publicKey`（或 `TELNYX_PUBLIC_KEY`）。
- `skipSignatureVerification` 仅用于本地测试。
- 如果你使用 ngrok 免费套餐，请将 `publicUrl` 设置为确切的 ngrok URL；签名验证始终强制执行。
- `tunnel.allowNgrokFreeTierLoopbackBypass: true` 仅当 `tunnel.provider="ngrok"` 且 `serve.bind` 为环回（ngrok 本地代理）时，允许具有无效签名的 Twilio webhook。仅用于本地开发。
- Ngrok 免费套餐 URL 可能会更改或添加插页行为；如果 `publicUrl` 漂移，Twilio 签名将失败。对于生产环境，首选稳定域或 Tailscale funnel。
- 流式安全默认值：
  - `streaming.preStartTimeoutMs` 关闭从未发送有效 `start` 帧的套接字。
  - `streaming.maxPendingConnections` 限制未认证的启动前套接字总数。
  - `streaming.maxPendingConnectionsPerIp` 限制每个源 IP 的未认证启动前套接字。
  - `streaming.maxConnections` 限制打开的媒体流套接字总数（挂起 + 活动）。

## 7. 过期通话清理

使用 `staleCallReaperSeconds` 结束从未收到终端 webhook 的通话
（例如，从未完成的通知模式通话）。默认值为 `0`
（禁用）。

推荐范围：

- **生产环境：** 通知式流程为 `120`–`300` 秒。
- 保持此值**高于 `maxDurationSeconds`**，以便正常通话可以
  完成。一个好的起点是 `maxDurationSeconds + 30–60` 秒。

示例：

```json5
{
  plugins: {
    entries: {
      "voice-call": {
        config: {
          maxDurationSeconds: 300,
          staleCallReaperSeconds: 360,
        },
      },
    },
  },
}
```

## 8. Webhook 安全

当 Gateway 前面有代理或隧道时，插件会重建用于签名验证的公共 URL。这些选项控制哪些转发的头部被信任。

`webhookSecurity.allowedHosts` 允许来自转发头部的主机列表。

`webhookSecurity.trustForwardingHeaders` 信任没有允许列表的转发头部。

`webhookSecurity.trustedProxyIPs` 仅当请求远程 IP 匹配列表时才信任转发头部。

Twilio 和 Plivo 启用了 Webhook 重放保护。重放的有效 webhook 请求会被确认但会跳过副作用。

Twilio 对话轮次在 `<Gather>` 回调中包含每轮令牌，因此过时/重放的语音回调无法满足较新的待处理转录轮次。

具有稳定公共主机的示例：

```json5
{
  plugins: {
    entries: {
      "voice-call": {
        config: {
          publicUrl: "https://voice.example.com/voice/webhook",
          webhookSecurity: {
            allowedHosts: ["voice.example.com"],
          },
        },
      },
    },
  },
}
```

## 9. 通话 TTS

语音通话使用核心 `messages.tts` 配置（OpenAI 或 ElevenLabs）进行通话中的流式语音。你可以在插件配置下使用**相同的结构**覆盖它 —— 它会与 `messages.tts` 深度合并。

```json5
{
  tts: {
    provider: "elevenlabs",
    elevenlabs: {
      voiceId: "pMsXgVXv3BLzUgSXRplE",
      modelId: "eleven_multilingual_v2",
    },
  },
}
```

注意：

- **语音通话忽略 Edge TTS**（电话音频需要 PCM；Edge 输出不可靠）。
- 当启用 Twilio 媒体流时使用核心 TTS；否则通话会回退到提供商的原生语音。

### 更多示例

仅使用核心 TTS（无覆盖）：

```json5
{
  messages: {
    tts: {
      provider: "openai",
      openai: { voice: "alloy" },
    },
  },
}
```

仅为通话覆盖到 ElevenLabs（在其他地方保持核心默认值）：

```json5
{
  plugins: {
    entries: {
      "voice-call": {
        config: {
          tts: {
            provider: "elevenlabs",
            elevenlabs: {
              apiKey: "elevenlabs_key",
              voiceId: "pMsXgVXv3BLzUgSXRplE",
              modelId: "eleven_multilingual_v2",
            },
          },
        },
      },
    },
  },
}
```

仅为通话覆盖 OpenAI 模型（深度合并示例）：

```json5
{
  plugins: {
    entries: {
      "voice-call": {
        config: {
          tts: {
            openai: {
              model: "gpt-4o-mini-tts",
              voice: "marin",
            },
          },
        },
      },
    },
  },
}
```

## 10. 呼入通话

呼入策略默认为 `disabled`。要启用呼入通话，请设置：

```json5
{
  inboundPolicy: "allowlist",
  allowFrom: ["+15550001234"],
  inboundGreeting: "Hello! How can I help?",
}
```

自动响应使用代理系统。可通过以下方式调整：

- `responseModel`
- `responseSystemPrompt`
- `responseTimeoutMs`

## 11. CLI

```bash
openclaw voicecall call --to "+15555550123" --message "Hello from OpenClaw"
openclaw voicecall continue --call-id <id> --message "Any questions?"
openclaw voicecall speak --call-id <id> --message "One moment"
openclaw voicecall end --call-id <id>
openclaw voicecall status --call-id <id>
openclaw voicecall tail
openclaw voicecall expose --mode funnel
```

## 12. 代理工具

工具名称：`voice_call`

操作：

- `initiate_call` (message, to?, mode?)
- `continue_call` (callId, message)
- `speak_to_user` (callId, message)
- `end_call` (callId)
- `get_status` (callId)

此仓库在 `skills/voice-call/SKILL.md` 中提供了匹配的技能文档。

## 13. Gateway RPC

- `voicecall.initiate` (`to?`, `message`, `mode?`)
- `voicecall.continue` (`callId`, `message`)
- `voicecall.speak` (`callId`, `message`)
- `voicecall.end` (`callId`)
- `voicecall.status` (`callId`)
