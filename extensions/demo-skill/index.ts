import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";

const demoSkillPlugin = {
  id: "demo-skill",
  name: "Demo Skill",
  description: "Demo skill for testing purposes",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    // Skill is delivered via plugin-shipped skills directory
    api.logger.info("Demo skill plugin registered");
  },
};

export default demoSkillPlugin;
