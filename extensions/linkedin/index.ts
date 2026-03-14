import type { ChannelPlugin, OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { linkedInPlugin } from "./src/channel.js";
import { setLinkedInRuntime } from "./src/runtime.js";

const plugin = {
  id: "linkedin",
  name: "LinkedIn",
  description: "LinkedIn channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setLinkedInRuntime(api.runtime);
    api.registerChannel({ plugin: linkedInPlugin as ChannelPlugin });
  },
};

export default plugin;
