import {
  buildOauthProviderAuthResult,
  emptyPluginConfigSchema,
  type OpenClawPluginApi,
  type ProviderAuthContext,
} from "openclaw/plugin-sdk/core";
import { loginDemoOAuth } from "./src/oauth.js";

const PROVIDER_ID = "demo-auth";
const PROVIDER_LABEL = "Demo Auth";
const DEFAULT_MODEL = "demo-auth/demo-model";
const ENV_VARS = ["OPENCLAW_DEMO_CLIENT_ID", "OPENCLAW_DEMO_CLIENT_SECRET"];

const demoAuthPlugin = {
  id: "demo-auth",
  name: "Demo Authentication",
  description: "Demo authentication plugin for testing",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/demo",
      aliases: ["demo"],
      envVars: ENV_VARS,
      auth: [
        {
          id: "oauth",
          label: "Demo OAuth",
          hint: "Demo OAuth flow",
          kind: "oauth",
          run: async (ctx: ProviderAuthContext) => {
            const spin = ctx.prompter.progress("Starting demo OAuth…");
            try {
              const result = await loginDemoOAuth({
                openUrl: ctx.openUrl,
                log: (msg) => ctx.runtime.log(msg),
                note: ctx.prompter.note,
                prompt: async (message) => String(await ctx.prompter.text({ message })),
                progress: spin,
              });

              spin.stop("Demo OAuth complete");
              return buildOauthProviderAuthResult({
                providerId: PROVIDER_ID,
                defaultModel: DEFAULT_MODEL,
                access: result.access,
                refresh: result.refresh,
                expires: result.expires,
                email: result.email,
                credentialExtra: { projectId: result.projectId },
                notes: ["This is a demo authentication plugin for testing purposes."],
              });
            } catch (err) {
              spin.stop("Demo OAuth failed");
              await ctx.prompter.note(
                "Trouble with demo OAuth? This is just a test plugin.",
                "OAuth help",
              );
              throw err;
            }
          },
        },
      ],
    });
  },
};

export default demoAuthPlugin;
