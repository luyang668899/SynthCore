export type DemoAuthOptions = {
  openUrl: (url: string) => Promise<void>;
  log: (message: string) => void;
  note: (message: string, title?: string) => Promise<void>;
  prompt: (message: string) => Promise<string>;
  progress: { stop: (message: string) => void };
};

export async function loginDemoOAuth(options: DemoAuthOptions) {
  options.log("Starting demo OAuth flow");

  // 模拟 OAuth 流程
  const demoUrl = "https://example.com/oauth/demo";
  await options.openUrl(demoUrl);

  const code = await options.prompt("Enter demo authorization code:");

  // 模拟获取令牌
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    access: "demo-access-token",
    refresh: "demo-refresh-token",
    expires: Date.now() + 3600000, // 1 hour
    email: "demo@example.com",
    projectId: "demo-project",
  };
}
