import type { PluginRuntime } from "openclaw/plugin-sdk/telegram";

let runtime: PluginRuntime | null = null;

export function setDemoRuntime(r: PluginRuntime) {
  runtime = r;
}

export function getDemoRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("Demo runtime not initialized");
  }
  return runtime;
}
