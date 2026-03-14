// 测试 Finance 技能插件
import { FinanceManager } from "./src/finance-manager.js";

async function testFinanceSkill() {
  console.log("=== 测试 Finance 技能插件 ===\n");

  const financeManager = new FinanceManager();

  // 测试 1: 股票数据查询
  console.log("1. 测试股票数据查询");
  try {
    const appleStock = await financeManager.getStock("AAPL");
    console.log("Apple 股票数据:", appleStock);

    const microsoftStock = await financeManager.getStock("MSFT");
    console.log("Microsoft 股票数据:", microsoftStock);

    const batchStocks = await financeManager.getStocks(["AAPL", "MSFT"]);
    console.log("批量股票数据:", batchStocks);
  } catch (error) {
    console.error("股票数据查询错误:", error);
  }

  console.log("\n2. 测试市场指数查询");
  try {
    const sp500 = await financeManager.getMarketIndex("SP500");
    console.log("S&P 500 指数:", sp500);

    const nasdaq = await financeManager.getMarketIndex("NASDAQ");
    console.log("NASDAQ 指数:", nasdaq);

    const batchIndices = await financeManager.getMarketIndices(["SP500", "NASDAQ"]);
    console.log("批量指数数据:", batchIndices);
  } catch (error) {
    console.error("市场指数查询错误:", error);
  }

  console.log("\n3. 测试货币转换");
  try {
    const usdToEur = await financeManager.convertCurrency(100, "USD", "EUR");
    console.log("100 USD 转换为 EUR:", usdToEur);

    const eurToCny = await financeManager.convertCurrency(100, "EUR", "CNY");
    console.log("100 EUR 转换为 CNY:", eurToCny);

    const exchangeRate = await financeManager.getExchangeRate("USD", "CNY");
    console.log("USD 到 CNY 的汇率:", exchangeRate);
  } catch (error) {
    console.error("货币转换错误:", error);
  }

  console.log("\n4. 测试投资组合管理");
  try {
    // 创建投资组合
    const portfolio = await financeManager.createPortfolio("我的投资组合");
    console.log("创建的投资组合:", portfolio);

    // 添加投资
    const investment = await financeManager.addInvestment(portfolio.id, {
      name: "Apple Inc.",
      symbol: "AAPL",
      quantity: 10,
      purchasePrice: 180.0,
      purchaseDate: new Date().toISOString(),
    });
    console.log("添加的投资:", investment);

    // 获取投资组合
    const portfolioDetails = await financeManager.getPortfolio(portfolio.id);
    console.log("投资组合详情:", portfolioDetails);

    // 计算投资组合价值
    const portfolioValue = await financeManager.calculatePortfolioValue(portfolio.id);
    console.log("投资组合价值:", portfolioValue);

    // 获取所有投资组合
    const allPortfolios = await financeManager.getAllPortfolios();
    console.log("所有投资组合:", allPortfolios);

    // 更新投资组合
    const updatedPortfolio = await financeManager.updatePortfolio(portfolio.id, "更新后的投资组合");
    console.log("更新后的投资组合:", updatedPortfolio);

    // 删除投资
    const removeResult = await financeManager.removeInvestment(portfolio.id, investment.id);
    console.log("删除投资结果:", removeResult);

    // 删除投资组合
    const deleteResult = await financeManager.deletePortfolio(portfolio.id);
    console.log("删除投资组合结果:", deleteResult);
  } catch (error) {
    console.error("投资组合管理错误:", error);
  }

  console.log("\n5. 测试金融新闻");
  try {
    // 获取金融新闻
    const news = await financeManager.getFinancialNews();
    console.log("金融新闻:", news);

    // 按分类获取新闻
    const techNews = await financeManager.getFinancialNews("tech");
    console.log("科技类新闻:", techNews);

    // 搜索新闻
    const searchResults = await financeManager.searchFinancialNews("Fed");
    console.log('搜索 "Fed" 的结果:', searchResults);

    // 保存新闻
    if (news.length > 0) {
      const saveResult = await financeManager.saveNews(news[0].id);
      console.log("保存新闻结果:", saveResult);
    }
  } catch (error) {
    console.error("金融新闻错误:", error);
  }

  console.log("\n=== Finance 技能插件测试完成 ===");
}

// 运行测试
testFinanceSkill().catch(console.error);
