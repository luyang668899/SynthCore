---
summary: "Zalo Personal plugin: QR login + messaging via native zca-js (plugin install + channel config + tool)"
read_when:
  - You want Zalo Personal (unofficial) support in OpenClaw
  - You are configuring or developing the zalouser plugin
title: "Zalo Personal Plugin"
---

# OpenClaw Zalo 个人插件使用说明书

## 结构框架

### 文档章节划分

1. **基本介绍**：Zalo 个人插件概述、功能特点、适用范围
2. **适用对象**：目标用户群体及使用场景
3. **阅读指南**：文档使用方法和导航建议
4. **命名说明**：插件命名规则和原因
5. **运行位置**：插件运行环境说明
6. **安装**：插件安装步骤
7. **配置**：插件配置方法
8. **CLI**：命令行接口
9. **代理工具**：代理工具使用

### 章节逻辑关系

- **基础层**：基本介绍 → 适用对象 → 阅读指南
- **安装配置层**：命名说明 → 运行位置 → 安装 → 配置
- **接口层**：CLI → 代理工具

## 1. 基本介绍

通过插件实现 OpenClaw 的 Zalo 个人账号支持，使用原生 `zca-js` 自动化普通 Zalo 用户账号。

> **警告：** 非官方自动化可能导致账号暂停/封禁。使用风险自负。

## 2. 适用对象

本指南适用于以下用户：

- **OpenClaw 用户**：希望通过 OpenClaw 使用 Zalo 个人账号的用户
- **系统管理员**：负责配置和管理 Zalo 个人插件的管理员
- **开发人员**：希望了解 Zalo 个人插件实现的开发人员

## 3. 阅读指南

- **快速开始**：如果你是首次使用 Zalo 个人插件，请先阅读[安装](#6-安装)和[配置](#7-配置)部分
- **命令使用**：了解如何使用命令行管理 Zalo 个人账号，请查看[CLI](#8-cli)部分
- **代理集成**：学习如何通过代理工具使用 Zalo 功能，请参考[代理工具](#9-代理工具)部分

## 4. 命名说明

通道 ID 为 `zalouser`，以明确表示这是自动化**个人 Zalo 用户账号**（非官方）。我们保留 `zalo` 用于潜在的未来官方 Zalo API 集成。

## 5. 运行位置

此插件在**Gateway 进程内部**运行。

如果你使用远程 Gateway，请在**运行 Gateway 的机器**上安装/配置它，然后重启 Gateway。

不需要外部 `zca`/`openzca` CLI 二进制文件。

## 6. 安装

### 选项 A：从 npm 安装

```bash
openclaw plugins install @openclaw/zalouser
```

之后重启 Gateway。

### 选项 B：从本地文件夹安装（开发）

```bash
openclaw plugins install ./extensions/zalouser
cd ./extensions/zalouser && pnpm install
```

之后重启 Gateway。

## 7. 配置

通道配置位于 `channels.zalouser` 下（不是 `plugins.entries.*`）：

```json5
{
  channels: {
    zalouser: {
      enabled: true,
      dmPolicy: "pairing",
    },
  },
}
```

## 8. CLI

```bash
openclaw channels login --channel zalouser
openclaw channels logout --channel zalouser
openclaw channels status --probe
openclaw message send --channel zalouser --target <threadId> --message "Hello from OpenClaw"
openclaw directory peers list --channel zalouser --query "name"
```

## 9. 代理工具

工具名称：`zalouser`

操作：`send`、`image`、`link`、`friends`、`groups`、`me`、`status`

通道消息操作还支持 `react` 用于消息反应。
