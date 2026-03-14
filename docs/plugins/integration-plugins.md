---
title: "Integration Plugins"
summary: "Comprehensive guide for OpenClaw integration plugins including Bitbucket, Jira, Trello, Asana, and Notion"
read_when:
  - You are using OpenClaw integration plugins
  - You need to configure or develop integration plugins
  - You want to understand how integration plugins work
---

# OpenClaw 集成插件使用说明书

## 结构框架

### 文档章节划分

1. **基本介绍**：插件概述、功能特点、适用范围
2. **适用对象**：目标用户群体及使用场景
3. **阅读指南**：文档使用方法和导航建议
4. **安装与配置**：插件安装步骤和配置方法
5. **核心功能说明**：各插件详细功能和命令
6. **使用示例**：具体操作示例和命令用法
7. **常见问题解答**：常见问题及解决方案
8. **开发指南**：插件开发流程和最佳实践
9. **故障排除**：错误处理和问题解决方法
10. **总结**：插件价值和未来展望

### 章节逻辑关系

- **基础层**：基本介绍 → 适用对象 → 阅读指南
- **使用层**：安装与配置 → 核心功能说明 → 使用示例
- **支持层**：常见问题解答 → 开发指南 → 故障排除
- **总结层**：总结

## 1. 基本介绍

OpenClaw 集成插件是一组功能强大的扩展，用于连接 OpenClaw 与各种项目管理、代码托管和文档管理工具。这些插件允许用户在 OpenClaw 中直接与外部服务进行交互，实现更高效的工作流程。

### 1.1 插件列表

- **Bitbucket 集成插件**：连接 Bitbucket 代码仓库，管理仓库、PR 和 Issue
- **Jira 集成插件**：连接 Jira 项目管理系统，管理项目和任务
- **Trello 集成插件**：连接 Trello 看板，管理看板、列表和卡片
- **Asana 集成插件**：连接 Asana 项目管理工具，管理工作区、项目和任务
- **Notion 集成插件**：连接 Notion 文档管理系统，管理页面和数据库

## 2. 适用对象

本指南适用于以下用户：

- **OpenClaw 用户**：希望通过 OpenClaw 与外部服务进行集成的用户
- **开发人员**：希望了解如何开发或扩展集成插件的开发人员
- **系统管理员**：负责配置和维护 OpenClaw 集成的管理员

## 3. 阅读指南

- **快速开始**：如果你是首次使用集成插件，请先阅读[安装与配置](#4-安装与配置)部分
- **功能使用**：了解每个插件的具体功能和使用方法，请查看[核心功能说明](#5-核心功能说明)部分
- **故障排除**：遇到问题时，请参考[常见问题解答](#7-常见问题解答)部分
- **开发扩展**：希望开发自定义集成插件，请查看[开发指南](#8-开发指南)部分

## 4. 安装与配置

### 4.1 安装插件

集成插件已经包含在 OpenClaw 扩展目录中，无需单独安装。插件目录结构如下：

```
extensions/
├── bitbucket-integration/
├── jira-integration/
├── trello-integration/
├── asana-integration/
└── notion-integration/
```

### 4.2 配置插件

每个集成插件都需要在 OpenClaw 配置中设置相应的认证信息。配置示例：

```json
{
  "bitbucket": {
    "apiToken": "your-bitbucket-api-token",
    "username": "your-bitbucket-username"
  },
  "jira": {
    "apiToken": "your-jira-api-token",
    "email": "your-jira-email",
    "baseUrl": "https://your-domain.atlassian.net"
  },
  "trello": {
    "apiKey": "your-trello-api-key",
    "token": "your-trello-token"
  },
  "asana": {
    "personalAccessToken": "your-asana-personal-access-token"
  },
  "notion": {
    "apiKey": "your-notion-api-key"
  }
}
```

## 5. 核心功能说明

### 5.1 Bitbucket 集成插件

**功能**：

- 列出 Bitbucket 仓库
- 列出仓库的拉取请求
- 列出仓库的问题
- 创建新问题
- 评论问题
- 列出通知

**命令**：

- `bitbucket:list-repos`：列出所有仓库
- `bitbucket:list-pull-requests`：列出拉取请求
- `bitbucket:list-issues`：列出问题
- `bitbucket:create-issue`：创建新问题
- `bitbucket:comment-issue`：评论问题
- `bitbucket:list-notifications`：列出通知

### 5.2 Jira 集成插件

**功能**：

- 列出 Jira 项目
- 列出项目的问题
- 创建新问题
- 更新问题
- 评论问题
- 列出通知

**命令**：

- `jira:list-projects`：列出所有项目
- `jira:list-issues`：列出问题
- `jira:create-issue`：创建新问题
- `jira:update-issue`：更新问题
- `jira:comment-issue`：评论问题
- `jira:list-notifications`：列出通知

### 5.3 Trello 集成插件

**功能**：

- 列出 Trello 看板
- 列出看板的列表
- 列出列表的卡片
- 创建新卡片
- 更新卡片
- 评论卡片
- 列出通知

**命令**：

- `trello:list-boards`：列出所有看板
- `trello:list-lists`：列出列表
- `trello:list-cards`：列出卡片
- `trello:create-card`：创建新卡片
- `trello:update-card`：更新卡片
- `trello:comment-card`：评论卡片
- `trello:list-notifications`：列出通知

### 5.4 Asana 集成插件

**功能**：

- 列出 Asana 工作区
- 列出工作区的项目
- 列出项目的任务
- 创建新任务
- 更新任务
- 评论任务
- 列出通知

**命令**：

- `asana:list-workspaces`：列出所有工作区
- `asana:list-projects`：列出项目
- `asana:list-tasks`：列出任务
- `asana:create-task`：创建新任务
- `asana:update-task`：更新任务
- `asana:comment-task`：评论任务
- `asana:list-notifications`：列出通知

### 5.5 Notion 集成插件

**功能**：

- 列出 Notion 工作区
- 列出页面
- 创建新页面
- 更新页面
- 列出数据库
- 查询数据库
- 列出通知

**命令**：

- `notion:list-workspaces`：列出所有工作区
- `notion:list-pages`：列出页面
- `notion:create-page`：创建新页面
- `notion:update-page`：更新页面
- `notion:list-databases`：列出数据库
- `notion:query-database`：查询数据库
- `notion:list-notifications`：列出通知

## 6. 使用示例

### 6.1 Bitbucket 插件示例

```bash
# 列出所有仓库
openclaw bitbucket:list-repos

# 创建新问题
openclaw bitbucket:create-issue --owner=username --repo=repo-name --title="Bug fix" --description="Fix login issue"
```

### 6.2 Jira 插件示例

```bash
# 列出项目的问题
openclaw jira:list-issues --projectKey=PROJ

# 更新问题
openclaw jira:update-issue --issueKey=PROJ-123 --updates='{"summary": "Updated task"}'
```

### 6.3 Trello 插件示例

```bash
# 列出看板的列表
openclaw trello:list-lists --boardId=board-id

# 创建新卡片
openclaw trello:create-card --listId=list-id --name="New task" --desc="Task description"
```

### 6.4 Asana 插件示例

```bash
# 列出工作区的项目
openclaw asana:list-projects --workspaceId=workspace-id

# 创建新任务
openclaw asana:create-task --projectId=project-id --name="New task" --notes="Task notes"
```

### 6.5 Notion 插件示例

```bash
# 列出数据库
openclaw notion:list-databases

# 查询数据库
openclaw notion:query-database --databaseId=database-id
```

## 7. 常见问题解答

### 7.1 认证问题

**问题**：插件认证失败
**解决方法**：

- 检查配置中的 API 令牌是否正确
- 确保 API 令牌具有足够的权限
- 验证网络连接是否正常

### 7.2 命令执行失败

**问题**：执行插件命令时失败
**解决方法**：

- 检查命令参数是否正确
- 验证插件配置是否完整
- 查看 OpenClaw 日志获取详细错误信息

### 7.3 插件未加载

**问题**：插件未在 OpenClaw 中显示
**解决方法**：

- 确保插件目录结构正确
- 检查 `openclaw.plugin.json` 文件是否存在且格式正确
- 重启 OpenClaw 服务

## 8. 开发指南

### 8.1 插件结构

每个集成插件遵循以下结构：

```
plugin-name/
├── package.json          # 插件依赖和脚本
├── openclaw.plugin.json  # 插件配置和元数据
├── tsconfig.json         # TypeScript 配置
├── src/
│   ├── index.ts          # 插件入口点
│   └── manager.ts        # 核心功能实现
└── test-plugin.js        # 测试脚本
```

### 8.2 开发步骤

1. **创建插件目录**：在 `extensions` 目录下创建新的插件目录
2. **配置文件**：创建 `package.json`、`openclaw.plugin.json` 和 `tsconfig.json` 文件
3. **实现核心功能**：创建管理器类实现与外部服务的交互
4. **注册命令**：在 `index.ts` 中注册插件命令
5. **测试插件**：创建测试脚本验证插件功能
6. **构建插件**：运行 `tsc` 编译 TypeScript 代码

### 8.3 最佳实践

- 使用 TypeScript 开发，确保类型安全
- 实现完整的错误处理
- 遵循 OpenClaw 插件架构
- 提供清晰的配置选项
- 编写详细的文档

## 9. 故障排除

### 9.1 日志查看

查看 OpenClaw 日志以获取详细的错误信息：

```bash
openclaw logs
```

### 9.2 常见错误

| 错误信息   | 可能原因         | 解决方案                  |
| ---------- | ---------------- | ------------------------- |
| 认证失败   | API 令牌无效     | 检查配置中的 API 令牌     |
| 网络错误   | 网络连接问题     | 检查网络连接和防火墙设置  |
| 权限不足   | API 令牌权限不够 | 为 API 令牌授予适当的权限 |
| 命令未找到 | 插件未正确加载   | 检查插件配置和目录结构    |

## 10. 总结

OpenClaw 集成插件为用户提供了与各种外部服务交互的能力，大大扩展了 OpenClaw 的功能。通过本指南，用户可以了解如何安装、配置和使用这些插件，以及如何开发自定义集成插件。

集成插件的核心价值在于：

- 简化工作流程，减少在不同工具之间切换的需要
- 提供统一的界面管理多个服务
- 增强 OpenClaw 的自动化能力
- 为开发人员提供扩展 OpenClaw 功能的框架

随着更多集成插件的开发，OpenClaw 将能够与更多外部服务无缝集成，为用户提供更加全面和高效的 AI 助手体验。
