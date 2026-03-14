# SynthCore 开发文档

## 技术架构

SynthCore 是一个智能 AI 助手平台，集成了多渠道消息系统和插件扩展架构。项目使用 TypeScript 开发，为开发人员提供强大的智能代理和自动化工具。

### 核心架构

- **Gateway**: 作为控制平面，管理会话、通道、工具和事件
- **Agent**: 智能代理，处理用户请求并执行相应的操作
- **Channels**: 多渠道集成，支持 WhatsApp、Telegram、Slack、Discord 等
- **Plugins**: 插件扩展系统，允许添加新功能和集成
- **Tools**: 内置工具，如浏览器控制、Canvas、节点管理等

### 项目结构

```
├── src/              # 核心源代码
│   ├── agents/       # 代理相关代码
│   ├── browser/      # 浏览器控制
│   ├── channels/     # 消息渠道集成
│   ├── cli/          # 命令行界面
│   ├── gateway/      # 网关服务
│   ├── media/        # 媒体处理
│   └── plugins/      # 插件系统
├── extensions/       # 扩展插件
├── docs/             # 文档
├── apps/             # 应用程序
│   ├── android/      # Android 节点
│   ├── ios/          # iOS 节点
│   └── macos/        # macOS 应用
└── skills/           # 技能系统
```

## 开发环境配置

### 系统要求

- Node.js ≥ 22
- pnpm 或 npm 或 bun

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/luyang668899/SynthCore.git
   cd SynthCore
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **构建项目**
   ```bash
   pnpm build
   ```

4. **运行开发服务器**
   ```bash
   pnpm gateway:watch
   ```

### 开发流程

1. **代码风格**：使用 TypeScript，遵循项目的编码规范
2. **测试**：运行 `pnpm test` 确保代码质量
3. **提交**：使用 `scripts/committer` 脚本提交代码
4. **PR**：提交 Pull Request 进行代码审查

## API 文档

### Gateway API

- **WebSocket 接口**：`ws://127.0.0.1:18789`
- **控制 UI**：`http://127.0.0.1:18789/ui`
- **WebChat**：`http://127.0.0.1:18789/chat`

### 核心 API

- **Agent API**：处理用户请求和执行操作
- **Channel API**：管理消息渠道
- **Plugin API**：扩展系统功能
- **Tool API**：提供各种工具功能

### 插件开发

1. **创建插件目录**
   ```bash
   mkdir -p extensions/my-plugin
   ```

2. **创建插件配置文件**
   ```json
   // extensions/my-plugin/openclaw.plugin.json
   {
     "name": "my-plugin",
     "version": "1.0.0",
     "description": "My custom plugin",
     "main": "index.ts",
     "dependencies": {}
   }
   ```

3. **实现插件逻辑**
   ```typescript
   // extensions/my-plugin/index.ts
   export default {
     name: "my-plugin",
     async initialize() {
       // 插件初始化逻辑
     },
     async execute(args) {
       // 插件执行逻辑
     }
   };
   ```

## 调试指南

### 日志系统

- **日志位置**：`~/.openclaw/logs/`
- **日志级别**：可在配置文件中设置

### 常见问题

1. **依赖问题**：运行 `pnpm install` 重新安装依赖
2. **端口占用**：检查端口 18789 是否被占用
3. **权限问题**：确保有足够的权限访问相关目录

## 部署指南

### 本地部署

```bash
openclaw onboard --install-daemon
```

### 远程部署

- **Tailscale**：使用 Tailscale Serve/Funnel 进行远程访问
- **Docker**：使用 Docker 容器部署

### 环境变量

- **NODE_ENV**：设置为 `production` 或 `development`
- **PORT**：设置 Gateway 端口
- **HOST**：设置 Gateway 主机

## 贡献指南

1. **Fork 仓库**
2. **创建分支**
3. **提交代码**
4. **创建 Pull Request**

## 版本控制

- **稳定版**：`vYYYY.M.D`
- **测试版**：`vYYYY.M.D-beta.N`
- **开发版**：`main` 分支

## 联系方式

- **GitHub**：https://github.com/luyang668899/SynthCore
- **Issues**：https://github.com/luyang668899/SynthCore/issues
