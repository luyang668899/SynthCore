---
summary: "Plugin manifest + JSON schema requirements (strict config validation)"
read_when:
  - You are building a OpenClaw plugin
  - You need to ship a plugin config schema or debug plugin validation errors
title: "Plugin Manifest"
---

# OpenClaw 插件清单使用说明书

## 结构框架

### 文档章节划分

1. **基本介绍**：插件清单概述、功能特点、适用范围
2. **适用对象**：目标用户群体及使用场景
3. **阅读指南**：文档使用方法和导航建议
4. **必填字段**：插件清单的必填字段
5. **JSON Schema 要求**：插件配置模式的要求
6. **验证行为**：配置验证的行为规则
7. **注意事项**：使用插件清单的注意事项

### 章节逻辑关系

- **基础层**：基本介绍 → 适用对象 → 阅读指南
- **规范层**：必填字段 → JSON Schema 要求 → 验证行为
- **支持层**：注意事项

## 1. 基本介绍

每个插件**必须**在**插件根目录**中包含一个 `openclaw.plugin.json` 文件。
OpenClaw 使用此清单来验证配置，**无需执行插件代码**。缺少或无效的清单会被视为插件错误并阻止配置验证。

查看完整的插件系统指南：[Plugins](/tools/plugin)。

## 2. 适用对象

本指南适用于以下用户：

- **插件开发人员**：希望创建 OpenClaw 插件的开发人员
- **系统管理员**：负责配置和管理 OpenClaw 插件的管理员
- **故障排除人员**：需要调试插件验证错误的技术人员

## 3. 阅读指南

- **插件开发**：如果你正在开发插件，请先阅读[必填字段](#4-必填字段)部分
- **配置验证**：了解配置验证的工作原理，请查看[验证行为](#6-验证行为)部分
- **故障排除**：解决插件验证错误，请参考[注意事项](#7-注意事项)部分

## 4. 必填字段

```json
{
  "id": "voice-call",
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {}
  }
}
```

Required keys:

- `id` (string): canonical plugin id.
- `configSchema` (object): JSON Schema for plugin config (inline).

Optional keys:

- `kind` (string): plugin kind (examples: `"memory"`, `"context-engine"`).
- `channels` (array): channel ids registered by this plugin (example: `["matrix"]`).
- `providers` (array): provider ids registered by this plugin.
- `skills` (array): skill directories to load (relative to the plugin root).
- `name` (string): display name for the plugin.
- `description` (string): short plugin summary.
- `uiHints` (object): config field labels/placeholders/sensitive flags for UI rendering.
- `version` (string): plugin version (informational).

## 5. JSON Schema 要求

- **每个插件必须提供 JSON Schema**，即使它不接受任何配置。
- 空模式是可以接受的（例如，`{ "type": "object", "additionalProperties": false }`）。
- 模式在配置读写时验证，而不是在运行时验证。

## 6. 验证行为

- 未知的 `channels.*` 键是**错误**，除非通道 ID 由插件清单声明。
- `plugins.entries.<id>`、`plugins.allow`、`plugins.deny` 和 `plugins.slots.*`
  必须引用**可发现的**插件 ID。未知 ID 是**错误**。
- 如果插件已安装但清单或模式损坏或丢失，
  验证失败，Doctor 会报告插件错误。
- 如果插件配置存在但插件**已禁用**，配置会保留，
  并在 Doctor 和日志中显示**警告**。

## 7. 注意事项

- 所有插件**都需要**清单，包括本地文件系统加载的插件。
- 运行时仍然单独加载插件模块；清单仅用于
  发现和验证。
- 独占插件类型通过 `plugins.slots.*` 选择。
  - `kind: "memory"` 由 `plugins.slots.memory` 选择。
  - `kind: "context-engine"` 由 `plugins.slots.contextEngine` 选择
    （默认：内置 `legacy`）。
- 如果你的插件依赖于原生模块，请记录构建步骤和任何
  包管理器允许列表要求（例如，pnpm `allow-build-scripts`
  - `pnpm rebuild <package>`）。
