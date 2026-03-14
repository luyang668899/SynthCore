// 测试 Travel 技能插件
import { TravelManager } from "./src/travel-manager.js";

async function testTravelSkill() {
  console.log("=== 测试 Travel 技能插件 ===\n");

  const travelManager = new TravelManager();

  // 测试 1: 搜索航班
  console.log("1. 测试搜索航班");
  try {
    const flights = await travelManager.searchFlights("Beijing", "Shanghai", "2026-03-15");
    console.log("搜索到的航班:", flights);

    if (flights.length > 0) {
      const booking = await travelManager.bookFlight(flights[0].id);
      console.log("预订航班结果:", booking);
    }
  } catch (error) {
    console.error("航班测试错误:", error);
  }

  // 测试 2: 搜索酒店
  console.log("\n2. 测试搜索酒店");
  try {
    const hotels = await travelManager.searchHotels("Beijing", "2026-03-15", "2026-03-18");
    console.log("搜索到的酒店:", hotels);

    if (hotels.length > 0) {
      const booking = await travelManager.bookHotel(hotels[0].id, "2026-03-15", "2026-03-18");
      console.log("预订酒店结果:", booking);
    }
  } catch (error) {
    console.error("酒店测试错误:", error);
  }

  // 测试 3: 获取目的地信息
  console.log("\n3. 测试获取目的地信息");
  try {
    const beijingInfo = await travelManager.getDestinationInfo("Beijing");
    console.log("北京信息:", beijingInfo);

    const shanghaiInfo = await travelManager.getDestinationInfo("Shanghai");
    console.log("上海信息:", shanghaiInfo);

    const allDestinations = await travelManager.getAllDestinations();
    console.log("所有目的地:", allDestinations);
  } catch (error) {
    console.error("目的地测试错误:", error);
  }

  // 测试 4: 旅行计划管理
  console.log("\n4. 测试旅行计划管理");
  try {
    // 创建旅行计划
    const plan = await travelManager.createTravelPlan({
      name: "北京之旅",
      destination: "Beijing",
      startDate: "2026-03-15",
      endDate: "2026-03-20",
      budget: 5000,
      activities: ["参观长城", "游览故宫", "品尝北京烤鸭"],
    });
    console.log("创建的旅行计划:", plan);

    // 获取旅行计划
    const planDetails = await travelManager.getTravelPlan(plan.id);
    console.log("旅行计划详情:", planDetails);

    // 更新旅行计划
    const updatedPlan = await travelManager.updateTravelPlan(plan.id, {
      name: "北京深度游",
      budget: 6000,
    });
    console.log("更新后的旅行计划:", updatedPlan);

    // 获取所有旅行计划
    const allPlans = await travelManager.getAllTravelPlans();
    console.log("所有旅行计划:", allPlans);

    // 创建预算
    const budget = await travelManager.createBudget(plan.id, {
      flights: 1000,
      accommodation: 2000,
      activities: 1000,
      food: 800,
      transportation: 200,
      miscellaneous: 500,
    });
    console.log("创建的预算:", budget);

    // 获取预算
    const budgetDetails = await travelManager.getBudget(plan.id);
    console.log("预算详情:", budgetDetails);

    // 更新预算
    const updatedBudget = await travelManager.updateBudget(budget.id, {
      food: 1000,
      miscellaneous: 600,
    });
    console.log("更新后的预算:", updatedBudget);

    // 删除旅行计划
    const deleteResult = await travelManager.deleteTravelPlan(plan.id);
    console.log("删除旅行计划结果:", deleteResult);
  } catch (error) {
    console.error("旅行计划测试错误:", error);
  }

  // 测试 5: 获取旅行建议
  console.log("\n5. 测试获取旅行建议");
  try {
    const recommendations = await travelManager.getTravelRecommendations("Beijing", 5);
    console.log("北京旅行建议:", recommendations);

    const tokyoRecommendations = await travelManager.getTravelRecommendations("Tokyo", 3);
    console.log("东京旅行建议:", tokyoRecommendations);
  } catch (error) {
    console.error("旅行建议测试错误:", error);
  }

  console.log("\n=== Travel 技能插件测试完成 ===");
}

// 运行测试
testTravelSkill().catch(console.error);
