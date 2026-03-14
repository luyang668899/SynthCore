import { Type } from "@sinclair/typebox";
import type { GatewayRequestHandlerOptions, OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { createDemoVoiceRuntime, type DemoVoiceRuntime } from "./src/runtime.js";

const DemoVoiceToolSchema = Type.Union([
  Type.Object({
    action: Type.Literal("initiate_call"),
    to: Type.Optional(Type.String({ description: "Call target" })),
    message: Type.String({ description: "Intro message" }),
  }),
  Type.Object({
    action: Type.Literal("get_status"),
    callId: Type.String({ description: "Call ID" }),
  }),
]);

const demoVoicePlugin = {
  id: "demo-voice",
  name: "Demo Voice",
  description: "Demo voice call plugin for testing",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    let runtime: DemoVoiceRuntime | null = null;

    const ensureRuntime = async (): Promise<DemoVoiceRuntime> => {
      if (!runtime) {
        runtime = createDemoVoiceRuntime();
      }
      return runtime;
    };

    const sendError = (respond: (ok: boolean, payload?: unknown) => void, err: unknown) => {
      respond(false, { error: err instanceof Error ? err.message : String(err) });
    };

    api.registerGatewayMethod(
      "demovoice.initiate",
      async ({ params, respond }: GatewayRequestHandlerOptions) => {
        try {
          const message = typeof params?.message === "string" ? params.message.trim() : "";
          if (!message) {
            respond(false, { error: "message required" });
            return;
          }
          const rt = await ensureRuntime();
          const to =
            typeof params?.to === "string" && params.to.trim()
              ? params.to.trim()
              : rt.config.toNumber;
          if (!to) {
            respond(false, { error: "to required" });
            return;
          }
          const result = await rt.manager.initiateCall(to, undefined, { message });
          if (!result.success) {
            respond(false, { error: result.error || "initiate failed" });
            return;
          }
          respond(true, { callId: result.callId, initiated: true });
        } catch (err) {
          sendError(respond, err);
        }
      },
    );

    api.registerGatewayMethod(
      "demovoice.status",
      async ({ params, respond }: GatewayRequestHandlerOptions) => {
        try {
          const callId = typeof params?.callId === "string" ? params.callId.trim() : "";
          if (!callId) {
            respond(false, { error: "callId required" });
            return;
          }
          const rt = await ensureRuntime();
          const call = rt.manager.getCall(callId);
          if (!call) {
            respond(true, { found: false });
            return;
          }
          respond(true, { found: true, call });
        } catch (err) {
          sendError(respond, err);
        }
      },
    );

    api.registerTool({
      name: "demo_voice_call",
      label: "Demo Voice Call",
      description: "Make demo voice calls for testing purposes.",
      parameters: DemoVoiceToolSchema,
      async execute(_toolCallId, params) {
        const json = (payload: unknown) => ({
          content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
          details: payload,
        });

        try {
          const rt = await ensureRuntime();

          if (typeof params?.action === "string") {
            switch (params.action) {
              case "initiate_call": {
                const message = String(params.message || "").trim();
                if (!message) {
                  throw new Error("message required");
                }
                const to =
                  typeof params.to === "string" && params.to.trim()
                    ? params.to.trim()
                    : rt.config.toNumber;
                if (!to) {
                  throw new Error("to required");
                }
                const result = await rt.manager.initiateCall(to, undefined, { message });
                if (!result.success) {
                  throw new Error(result.error || "initiate failed");
                }
                return json({ callId: result.callId, initiated: true });
              }
              case "get_status": {
                const callId = String(params.callId || "").trim();
                if (!callId) {
                  throw new Error("callId required");
                }
                const call = rt.manager.getCall(callId);
                return json(call ? { found: true, call } : { found: false });
              }
            }
          }

          throw new Error("Invalid action");
        } catch (err) {
          return json({
            error: err instanceof Error ? err.message : String(err),
          });
        }
      },
    });

    api.registerService({
      id: "demovoice",
      start: async () => {
        try {
          await ensureRuntime();
          api.logger.info("Demo voice service started");
        } catch (err) {
          api.logger.error(
            `[demo-voice] Failed to start: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      },
      stop: async () => {
        if (runtime) {
          await runtime.manager.stop();
          runtime = null;
          api.logger.info("Demo voice service stopped");
        }
      },
    });
  },
};

export default demoVoicePlugin;
