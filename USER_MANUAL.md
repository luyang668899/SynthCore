# SynthCore 用户使用说明书

## 简介

SynthCore 是一个智能 AI 助手平台，集成了多渠道消息系统和插件扩展架构。它可以在各种消息平台上与您交互，提供智能助手功能和自动化工具。

## 安装步骤

### 系统要求

- Node.js ≥ 22
- 支持的操作系统：macOS、Linux、Windows (WSL2)

### 安装方法

1. **使用 npm 安装**
   ```bash
   npm install -g openclaw@latest
   ```

2. **使用 pnpm 安装**
   ```bash
   pnpm add -g openclaw@latest
   ```

3. **使用 bun 安装**
   ```bash
   bun add -g openclaw@latest
   ```

### 初始化配置

1. **运行引导向导**
   ```bash
   openclaw onboard --install-daemon
   ```

2. **配置模型**
   - 在 `~/.openclaw/openclaw.json` 文件中设置默认模型
   ```json
   {
     "agent": {
       "model": "anthropic/claude-opus-4-6"
     }
   }
   ```

3. **配置消息渠道**
   - 参考文档中的渠道配置部分，设置您想要使用的消息渠道

## 功能说明

### 核心功能

1. **多渠道集成**
   - 支持 WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage 等
   - 可以在多个渠道上同时使用助手

2. **智能代理**
   - 处理用户请求并提供智能回复
   - 支持上下文理解和多轮对话

3. **插件扩展**
   - 支持安装和使用各种插件
   - 可以扩展系统功能和集成第三方服务

4. **内置工具**
   - 浏览器控制：自动化网页操作
   - Canvas：可视化工作空间
   - 节点管理：设备控制和操作
   - 定时任务：设置和管理定时任务

5. **语音交互**
   - 支持语音唤醒和对话模式
   - 在 macOS/iOS/Android 上可用

### 扩展功能

1. **技能系统**
   - 支持安装和使用各种技能
   - 可以通过技能扩展助手能力

2. **媒体处理**
   - 支持处理图片、音频和视频
   - 提供媒体转码和分析功能

3. **远程访问**
   - 支持通过 Tailscale 或 SSH 隧道远程访问
   - 可以在任何地方使用助手

## 操作指南

### 基本命令

1. **启动网关**
   ```bash
   openclaw gateway --port 18789 --verbose
   ```

2. **发送消息**
   ```bash
   openclaw message send --to +1234567890 --message "Hello from SynthCore"
   ```

3. **与助手对话**
   ```bash
   openclaw agent --message "帮我制定一个旅行计划" --thinking high
   ```

4. **管理插件**
   ```bash
   openclaw plugins list
   openclaw plugins install <plugin-name>
   ```

5. **管理技能**
   ```bash
   openclaw skills list
   openclaw skills install <skill-name>
   ```

### 聊天命令

在 WhatsApp/Telegram/Slack/Google Chat/Microsoft Teams/WebChat 中发送以下命令：

- `/status` - 查看会话状态
- `/new` 或 `/reset` - 重置会话
- `/compact` - 压缩会话上下文
- `/think <level>` - 设置思考级别
- `/verbose on|off` - 开启/关闭详细模式
- `/usage off|tokens|full` - 设置使用情况显示
- `/restart` - 重启网关（仅限群组所有者）
- `/activation mention|always` - 群组激活模式切换

### 配置管理

1. **查看配置**
   ```bash
   openclaw config get
   ```

2. **修改配置**
   ```bash
   openclaw config set agent.model anthropic/claude-opus-4-6
   ```

3. **检查配置**
   ```bash
   openclaw doctor
   ```

## 常见问题

### 安装问题

1. **依赖安装失败**
   - 确保 Node.js 版本 ≥ 22
   - 尝试使用不同的包管理器（npm、pnpm、bun）

2. **端口占用**
   - 检查端口 18789 是否被其他程序占用
   - 使用 `--port` 参数指定其他端口

### 连接问题

1. **消息渠道连接失败**
   - 检查渠道配置是否正确
   - 确保网络连接正常
   - 检查渠道 API 密钥是否有效

2. **远程访问问题**
   - 确保 Tailscale 或 SSH 隧道配置正确
   - 检查防火墙设置

### 功能问题

1. **插件不工作**
   - 检查插件是否正确安装
   - 查看插件日志获取详细信息

2. **技能执行失败**
   - 检查技能配置是否正确
   - 确保技能依赖项已安装

## 高级用法

### 自定义配置

1. **创建自定义配置文件**
   - 编辑 `~/.openclaw/openclaw.json` 文件
   - 参考文档中的配置选项

2. **多代理配置**
   - 可以为不同的渠道或场景配置不同的代理
   - 使用 `agents` 配置部分

### 自动化工作流

1. **设置定时任务**
   ```bash
   openclaw cron add --name "daily-task" --schedule "0 9 * * *" --command "agent --message '每日任务'"
   ```

2. **配置 webhook**
   - 在配置文件中设置 webhook 端点
   - 可以接收外部触发事件

### 性能优化

1. **模型选择**
   - 根据需求选择合适的模型
   - 平衡性能和成本

2. **资源管理**
   - 调整 Gateway 内存和 CPU 使用
   - 优化插件和技能的资源使用

## 故障排除

1. **查看日志**
   ```bash
   openclaw logs
   ```

2. **检查状态**
   ```bash
   openclaw status
   ```

3. **运行诊断**
   ```bash
   openclaw doctor
   ```

## 联系支持

- **GitHub Issues**：https://github.com/luyang668899/SynthCore/issues
- **Discord**：加入 Discord 社区获取支持

## 更新指南

1. **更新 SynthCore**
   ```bash
   openclaw update
   ```

2. **更新插件**
   ```bash
   openclaw plugins update
   ```

3. **更新技能**
   ```bash
   openclaw skills update
   ```

## 安全注意事项

1. **API 密钥管理**
   - 不要在代码中硬编码 API 密钥
   - 使用环境变量或配置文件存储密钥

2. **权限管理**
   - 为不同的会话设置适当的权限
   - 使用沙箱模式运行非主会话

3. **数据保护**
   - 确保敏感数据得到适当保护
   - 定期备份配置和数据

## 许可证

SynthCore 使用 MIT 许可证。详情请参阅 LICENSE 文件。
