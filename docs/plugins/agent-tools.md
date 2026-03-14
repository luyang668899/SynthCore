---
summary: "Write agent tools in a plugin (schemas, optional tools, allowlists)"
read_when:
  - You want to add a new agent tool in a plugin
  - You need to make a tool opt-in via allowlists
title: "Plugin Agent Tools"
---

# OpenClaw 插件代理工具使用说明书

## 结构框架

### 文档章节划分

1. **基本介绍**：代理工具概述、功能特点、适用范围
2. **适用对象**：目标用户群体及使用场景
3. **阅读指南**：文档使用方法和导航建议
4. **基本工具**：基本代理工具的创建和使用
5. **可选工具**：可选代理工具的配置和使用
6. **规则与提示**：工具开发和使用的规则和建议

### 章节逻辑关系

- **基础层**：基本介绍 → 适用对象 → 阅读指南
- **使用层**：基本工具 → 可选工具
- **支持层**：规则与提示

## 1. 基本介绍

OpenClaw 插件可以注册**代理工具**（JSON schema 函数），这些工具在代理运行期间会暴露给 LLM。工具可以是**必需的**（始终可用）或**可选的**（需要选择启用）。

代理工具在主配置中的 `tools` 下配置，或在每个代理的 `agents.list[].tools` 下配置。允许列表/拒绝列表策略控制代理可以调用哪些工具。

## 2. 适用对象

本指南适用于以下用户：

- **插件开发人员**：希望为 OpenClaw 开发新的代理工具的开发人员
- **系统管理员**：负责配置和管理 OpenClaw 代理工具的管理员
- **OpenClaw 用户**：希望了解如何使用和配置代理工具的用户

## 3. 阅读指南

- **快速开始**：如果你是首次开发代理工具，请先阅读[基本工具](#4-基本工具)部分
- **高级配置**：了解如何创建可选工具，请查看[可选工具](#5-可选工具)部分
- **最佳实践**：开发代理工具的最佳实践，请参考[规则与提示](#6-规则与提示)部分

## 4. 基本工具

```ts
import { Type } from "@sinclair/typebox";

export default function (api) {
  api.registerTool({
    name: "my_tool",
    description: "Do a thing",
    parameters: Type.Object({
      input: Type.String(),
    }),
    async execute(_id, params) {
      return { content: [{ type: "text", text: params.input }] };
    },
  });
}
```

## 5. 可选工具

Optional tools are **never** auto‑enabled. Users must add them to an agent
allowlist.

```ts
export default function (api) {
  api.registerTool(
    {
      name: "workflow_tool",
      description: "Run a local workflow",
      parameters: {
        type: "object",
        properties: {
          pipeline: { type: "string" },
        },
        required: ["pipeline"],
      },
      async execute(_id, params) {
        return { content: [{ type: "text", text: params.pipeline }] };
      },
    },
    { optional: true },
  );
}
```

Enable optional tools in `agents.list[].tools.allow` (or global `tools.allow`):

```json5
{
  agents: {
    list: [
      {
        id: "main",
        tools: {
          allow: [
            "workflow_tool", // specific tool name
            "workflow", // plugin id (enables all tools from that plugin)
            "group:plugins", // all plugin tools
          ],
        },
      },
    ],
  },
}
```

Other config knobs that affect tool availability:

- Allowlists that only name plugin tools are treated as plugin opt-ins; core tools remain
  enabled unless you also include core tools or groups in the allowlist.
- `tools.profile` / `agents.list[].tools.profile` (base allowlist)
- `tools.byProvider` / `agents.list[].tools.byProvider` (provider‑specific allow/deny)
- `tools.sandbox.tools.*` (sandbox tool policy when sandboxed)

## 6. 规则与提示

- Tool names must **not** clash with core tool names; conflicting tools are skipped.
- Plugin ids used in allowlists must not clash with core tool names.
- Prefer `optional: true` for tools that trigger side effects or require extra
  binaries/credentials.
