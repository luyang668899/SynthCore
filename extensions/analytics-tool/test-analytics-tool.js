// 测试 Analytics 工具插件
import { AnalyticsManager } from "./src/analytics-manager.ts";

async function testAnalyticsTool() {
  console.log("=== 测试 Analytics 工具插件 ===\n");

  const analyticsManager = new AnalyticsManager();

  // 测试 1: 跟踪事件
  console.log("1. 测试跟踪事件");
  try {
    const event = await analyticsManager.trackEvent({
      eventType: "message_sent",
      userId: "user-3",
      sessionId: "session-3",
      data: { channel: "slack", messageLength: 150, attachments: 1 },
    });
    console.log("跟踪的事件:", event);
  } catch (error) {
    console.error("跟踪事件测试错误:", error);
  }

  // 测试 2: 获取事件
  console.log("\n2. 测试获取事件");
  try {
    const events = await analyticsManager.getEvents();
    console.log("获取的事件数量:", events.length);
    console.log("事件示例:", events[0]);
  } catch (error) {
    console.error("获取事件测试错误:", error);
  }

  // 测试 3: 获取指标
  console.log("\n3. 测试获取指标");
  try {
    const metrics = await analyticsManager.getMetrics();
    console.log("获取的指标:", metrics);
  } catch (error) {
    console.error("获取指标测试错误:", error);
  }

  // 测试 4: 生成报告
  console.log("\n4. 测试生成报告");
  try {
    const report = await analyticsManager.generateReport("测试报告");
    console.log("生成的报告:", {
      id: report.id,
      title: report.title,
      generatedAt: report.generatedAt,
      summary: report.summary,
      metricsCount: report.metrics.length,
      eventsCount: report.data.length,
    });
  } catch (error) {
    console.error("生成报告测试错误:", error);
  }

  // 测试 5: 获取会话统计
  console.log("\n5. 测试获取会话统计");
  try {
    const sessionStats = await analyticsManager.getSessionStats();
    console.log("会话统计:", sessionStats);
  } catch (error) {
    console.error("获取会话统计测试错误:", error);
  }

  // 测试 6: 获取事件趋势
  console.log("\n6. 测试获取事件趋势");
  try {
    const trends = await analyticsManager.getEventTrends("day");
    console.log("事件趋势:", trends);
  } catch (error) {
    console.error("获取事件趋势测试错误:", error);
  }

  // 测试 7: 获取热门事件类型
  console.log("\n7. 测试获取热门事件类型");
  try {
    const topEventTypes = await analyticsManager.getTopEventTypes(5);
    console.log("热门事件类型:", topEventTypes);
  } catch (error) {
    console.error("获取热门事件类型测试错误:", error);
  }

  // 测试 8: 获取活跃用户
  console.log("\n8. 测试获取活跃用户");
  try {
    const topUsers = await analyticsManager.getTopUsers(5);
    console.log("活跃用户:", topUsers);
  } catch (error) {
    console.error("获取活跃用户测试错误:", error);
  }

  console.log("\n=== Analytics 工具插件测试完成 ===");
}

// 运行测试
testAnalyticsTool().catch(console.error);
