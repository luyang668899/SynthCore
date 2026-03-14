---
summary: "Community plugins: quality bar, hosting requirements, and PR submission path"
read_when:
  - You want to publish a third-party OpenClaw plugin
  - You want to propose a plugin for docs listing
title: "Community plugins"
---

# OpenClaw 社区插件使用说明书

## 结构框架

### 文档章节划分

1. **基本介绍**：社区插件概述、功能特点、适用范围
2. **适用对象**：目标用户群体及使用场景
3. **阅读指南**：文档使用方法和导航建议
4. **列出要求**：社区插件的收录要求
5. **提交方法**：如何提交社区插件
6. **审查标准**：插件审查的质量标准
7. **候选格式**：插件条目的格式要求
8. **已列插件**：已收录的社区插件列表

### 章节逻辑关系

- **基础层**：基本介绍 → 适用对象 → 阅读指南
- **规范层**：列出要求 → 提交方法 → 审查标准 → 候选格式
- **内容层**：已列插件

## 1. 基本介绍

本页面跟踪 OpenClaw 的高质量**社区维护插件**。

当社区插件达到质量标准时，我们接受添加社区插件的 PR。

## 2. 适用对象

本指南适用于以下用户：

- **插件开发者**：希望发布第三方 OpenClaw 插件的开发者
- **OpenClaw 用户**：寻找社区插件来扩展 OpenClaw 功能的用户
- **贡献者**：希望为文档添加插件列表的贡献者

## 3. 阅读指南

- **插件开发者**：如果你想发布社区插件，请先阅读[列出要求](#4-列出要求)和[提交方法](#5-提交方法)部分
- **OpenClaw 用户**：如果你想使用社区插件，请查看[已列插件](#8-已列插件)部分
- **贡献者**：如果你想为文档添加插件，请参考[候选格式](#7-候选格式)部分

## 4. 列出要求

- Plugin package is published on npmjs (installable via `openclaw plugins install <npm-spec>`).
- Source code is hosted on GitHub (public repository).
- Repository includes setup/use docs and an issue tracker.
- Plugin has a clear maintenance signal (active maintainer, recent updates, or responsive issue handling).

## 5. 提交方法

打开一个 PR，将你的插件添加到本页面，包含：

- 插件名称
- npm 包名称
- GitHub 仓库 URL
- 一行描述
- 安装命令

## 6. 审查标准

我们偏好有用、有文档且安全操作的插件。
低质量包装器、所有权不明确或未维护的包可能会被拒绝。

## 7. 候选格式

添加条目时使用以下格式：

- **Plugin Name** — short description
  npm: `@scope/package`
  repo: `https://github.com/org/repo`
  install: `openclaw plugins install @scope/package`

## 8. 已列插件

- **WeChat** — Connect OpenClaw to WeChat personal accounts via WeChatPadPro (iPad protocol). Supports text, image, and file exchange with keyword-triggered conversations.
  npm: `@icesword760/openclaw-wechat`
  repo: `https://github.com/icesword0760/openclaw-wechat`
  install: `openclaw plugins install @icesword760/openclaw-wechat`
