import type { PluginRuntime } from "openclaw/plugin-sdk/core";

let runtime: PluginRuntime | null = null;

export function setRedditRuntime(r: PluginRuntime) {
  runtime = r;
}

export function getRedditRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("Reddit runtime not initialized");
  }
  return runtime;
}
