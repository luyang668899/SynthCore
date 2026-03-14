import type { ChannelPlugin, OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { redditPlugin } from "./src/channel.js";
import { setRedditRuntime } from "./src/runtime.js";

const plugin = {
  id: "reddit",
  name: "Reddit",
  description: "Reddit channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setRedditRuntime(api.runtime);
    api.registerChannel({ plugin: redditPlugin as ChannelPlugin });
  },
};

export default plugin;
