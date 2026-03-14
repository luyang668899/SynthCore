import {
  buildOauthProviderAuthResult,
  emptyPluginConfigSchema,
  type OpenClawPluginApi,
  type ProviderAuthContext,
} from "openclaw/plugin-sdk/core";
import { loginGcpAuth } from "./src/gcp-auth.js";

const PROVIDER_ID = "gcp";
const PROVIDER_LABEL = "GCP";
const DEFAULT_MODEL = "gcp/vertex-ai-gemini-pro";
const ENV_VARS = ["GOOGLE_APPLICATION_CREDENTIALS", "GOOGLE_CLOUD_PROJECT"];

const gcpAuthPlugin = {
  id: "gcp-auth",
  name: "GCP Authentication",
  description: "GCP authentication plugin for OpenClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/gcp",
      aliases: ["gcp"],
      envVars: ENV_VARS,
      auth: [
        {
          id: "gcp-service-account",
          label: "GCP Service Account",
          hint: "GCP Project ID and service account key file",
          kind: "oauth",
          run: async (ctx: ProviderAuthContext) => {
            const spin = ctx.prompter.progress("Starting GCP authentication…");
            try {
              const result = await loginGcpAuth({
                log: (msg) => ctx.runtime.log(msg),
                note: ctx.prompter.note,
                prompt: async (message) => String(await ctx.prompter.text({ message })),
                progress: spin,
              });

              spin.stop("GCP authentication complete");
              return buildOauthProviderAuthResult({
                providerId: PROVIDER_ID,
                defaultModel: DEFAULT_MODEL,
                access: result.projectId,
                refresh: result.credentialsPath,
                expires: result.expires,
                credentialExtra: {
                  projectId: result.projectId,
                  credentialsPath: result.credentialsPath,
                },
                notes: [
                  "Make sure your GCP service account has the necessary permissions for Vertex AI.",
                  "The service account key file should have appropriate IAM roles assigned.",
                  "For more information, visit the GCP Vertex AI documentation.",
                ],
              });
            } catch (err) {
              spin.stop("GCP authentication failed");
              await ctx.prompter.note(
                "Trouble with GCP authentication? Ensure your project ID and service account key file are correct.",
                "GCP help",
              );
              throw err;
            }
          },
        },
      ],
    });
  },
};

export default gcpAuthPlugin;
