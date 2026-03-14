export type GcpAuthOptions = {
  prompt: (message: string) => Promise<string>;
  log: (message: string) => void;
  note: (message: string, title?: string) => Promise<void>;
  progress: { stop: (message: string) => void };
};

export async function loginGcpAuth(options: GcpAuthOptions) {
  options.log("Starting GCP authentication flow");

  // 模拟 GCP 认证流程
  const projectId = await options.prompt("Enter GCP Project ID:");
  const credentialsPath = await options.prompt("Enter path to GCP service account key file:");

  // 模拟验证
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    projectId,
    credentialsPath,
    expires: Date.now() + 3600000, // 1 hour
  };
}
