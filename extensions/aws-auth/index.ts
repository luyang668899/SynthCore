import {
  buildOauthProviderAuthResult,
  emptyPluginConfigSchema,
  type OpenClawPluginApi,
  type ProviderAuthContext,
} from "openclaw/plugin-sdk/core";
import { loginAwsAuth } from "./src/aws-auth.js";

const PROVIDER_ID = "aws";
const PROVIDER_LABEL = "AWS";
const DEFAULT_MODEL = "aws/bedrock-anthropic-claude-3-sonnet-20240229-v1:0";
const ENV_VARS = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION"];

const awsAuthPlugin = {
  id: "aws-auth",
  name: "AWS Authentication",
  description: "AWS authentication plugin for OpenClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/aws",
      aliases: ["aws"],
      envVars: ENV_VARS,
      auth: [
        {
          id: "aws-access-key",
          label: "AWS Access Key",
          hint: "AWS Access Key ID and Secret Access Key",
          kind: "oauth",
          run: async (ctx: ProviderAuthContext) => {
            const spin = ctx.prompter.progress("Starting AWS authentication…");
            try {
              const result = await loginAwsAuth({
                log: (msg) => ctx.runtime.log(msg),
                note: ctx.prompter.note,
                prompt: async (message) => String(await ctx.prompter.text({ message })),
                progress: spin,
              });

              spin.stop("AWS authentication complete");
              return buildOauthProviderAuthResult({
                providerId: PROVIDER_ID,
                defaultModel: DEFAULT_MODEL,
                access: result.access,
                refresh: result.secret,
                expires: result.expires,
                credentialExtra: { region: result.region },
                notes: [
                  "Make sure your AWS credentials have the necessary permissions for Bedrock.",
                ],
              });
            } catch (err) {
              spin.stop("AWS authentication failed");
              await ctx.prompter.note(
                "Trouble with AWS authentication? Ensure your credentials are correct.",
                "AWS help",
              );
              throw err;
            }
          },
        },
      ],
    });
  },
};

export default awsAuthPlugin;
