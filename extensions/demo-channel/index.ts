import type { ChannelPlugin, OpenClawPluginApi } from "openclaw/plugin-sdk/telegram";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/telegram";
import { demoPlugin } from "./src/channel.js";
import { setDemoRuntime } from "./src/runtime.js";

const plugin = {
  id: "demo-channel",
  name: "Demo Channel",
  description: "Demo channel plugin for OpenClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setDemoRuntime(api.runtime);
    api.registerChannel({ plugin: demoPlugin as ChannelPlugin });
  },
};

export default plugin;
