export type DemoVoiceRuntime = {
  manager: {
    initiateCall: (
      to: string,
      _from?: string,
      options?: { message?: string; mode?: string },
    ) => Promise<{ success: boolean; callId?: string; error?: string }>;
    getCall: (callId: string) => any;
    stop: () => Promise<void>;
  };
  config: { toNumber: string };
};

export function createDemoVoiceRuntime(): DemoVoiceRuntime {
  const calls: Record<string, { id: string; to: string; status: string; startedAt: number }> = {};

  return {
    manager: {
      initiateCall: async (to, _from, options) => {
        console.log(`Demo voice call initiated to ${to} with message: ${options?.message}`);
        const callId = `demo-call-${Date.now()}`;
        calls[callId] = {
          id: callId,
          to,
          status: "initiated",
          startedAt: Date.now(),
        };
        return { success: true, callId };
      },
      getCall: (callId) => calls[callId],
      stop: async () => {
        console.log("Demo voice runtime stopped");
      },
    },
    config: { toNumber: "+15550001234" },
  };
}
