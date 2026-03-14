import type { PluginRuntime } from "openclaw/plugin-sdk/core";

let runtime: PluginRuntime | null = null;

export function setLinkedInRuntime(r: PluginRuntime) {
  runtime = r;
}

export function getLinkedInRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("LinkedIn runtime not initialized");
  }
  return runtime;
}
