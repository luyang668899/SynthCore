import {
  buildOauthProviderAuthResult,
  emptyPluginConfigSchema,
  type OpenClawPluginApi,
  type ProviderAuthContext,
} from "openclaw/plugin-sdk/core";
import { loginAzureAuth } from "./src/azure-auth.js";

const PROVIDER_ID = "azure";
const PROVIDER_LABEL = "Azure";
const DEFAULT_MODEL = "azure/openai-gpt-4";
const ENV_VARS = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET"];

const azureAuthPlugin = {
  id: "azure-auth",
  name: "Azure Authentication",
  description: "Azure authentication plugin for OpenClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/azure",
      aliases: ["azure"],
      envVars: ENV_VARS,
      auth: [
        {
          id: "azure-service-principal",
          label: "Azure Service Principal",
          hint: "Azure Tenant ID, Client ID, and Client Secret",
          kind: "oauth",
          run: async (ctx: ProviderAuthContext) => {
            const spin = ctx.prompter.progress("Starting Azure authentication…");
            try {
              const result = await loginAzureAuth({
                log: (msg) => ctx.runtime.log(msg),
                note: ctx.prompter.note,
                prompt: async (message) => String(await ctx.prompter.text({ message })),
                progress: spin,
              });

              spin.stop("Azure authentication complete");
              return buildOauthProviderAuthResult({
                providerId: PROVIDER_ID,
                defaultModel: DEFAULT_MODEL,
                access: result.clientId,
                refresh: result.clientSecret,
                expires: result.expires,
                credentialExtra: { tenantId: result.tenantId },
                notes: [
                  "Make sure your Azure service principal has the necessary permissions for OpenAI.",
                  "You may also need to set up the appropriate API endpoints in Azure.",
                  "For more information, visit the Azure OpenAI Service documentation.",
                ],
              });
            } catch (err) {
              spin.stop("Azure authentication failed");
              await ctx.prompter.note(
                "Trouble with Azure authentication? Ensure your service principal credentials are correct.",
                "Azure help",
              );
              throw err;
            }
          },
        },
      ],
    });
  },
};

export default azureAuthPlugin;
