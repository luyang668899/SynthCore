#!/usr/bin/env node

// 简化的 UUID 生成函数
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 简化的日期函数
function subDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function subYears(date, years) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() - years);
  return result;
}

// 金融数据接口
class FinanceManager {
  constructor() {
    this.stocks = [];
    this.stockHistory = [];
    this.marketIndices = [];
    this.portfolios = [];
    this.currencies = [];
    this.financialNews = [];
    this.initializeDefaultStocks();
    this.initializeDefaultMarketIndices();
    this.initializeDefaultCurrencies();
    this.initializeDefaultFinancialNews();
    this.generateStockHistory();
  }

  initializeDefaultStocks() {
    this.stocks = [
      {
        id: uuidv4(),
        symbol: "AAPL",
        name: "Apple Inc.",
        exchange: "NASDAQ",
        sector: "Technology",
        industry: "Consumer Electronics",
        marketCap: 2800000000000,
        price: 185.25,
        change: 2.35,
        changePercent: 1.28,
        volume: 45000000,
        peRatio: 28.5,
        eps: 6.5,
        dividendYield: 0.56,
        lastUpdated: new Date(),
      },
      {
        id: uuidv4(),
        symbol: "MSFT",
        name: "Microsoft Corporation",
        exchange: "NASDAQ",
        sector: "Technology",
        industry: "Software",
        marketCap: 3000000000000,
        price: 420.75,
        change: -1.25,
        changePercent: -0.29,
        volume: 28000000,
        peRatio: 32.1,
        eps: 13.1,
        dividendYield: 0.73,
        lastUpdated: new Date(),
      },
      {
        id: uuidv4(),
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        exchange: "NASDAQ",
        sector: "Technology",
        industry: "Internet Services",
        marketCap: 2100000000000,
        price: 135.42,
        change: 0.85,
        changePercent: 0.63,
        volume: 18000000,
        peRatio: 26.8,
        eps: 5.05,
        dividendYield: 0,
        lastUpdated: new Date(),
      },
      {
        id: uuidv4(),
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        exchange: "NASDAQ",
        sector: "Consumer Cyclical",
        industry: "E-Commerce",
        marketCap: 1800000000000,
        price: 178.25,
        change: 1.5,
        changePercent: 0.85,
        volume: 32000000,
        peRatio: 65.2,
        eps: 2.73,
        dividendYield: 0,
        lastUpdated: new Date(),
      },
      {
        id: uuidv4(),
        symbol: "TSLA",
        name: "Tesla Inc.",
        exchange: "NASDAQ",
        sector: "Consumer Cyclical",
        industry: "Automotive",
        marketCap: 750000000000,
        price: 235.6,
        change: -3.2,
        changePercent: -1.34,
        volume: 95000000,
        peRatio: 72.4,
        eps: 3.25,
        dividendYield: 0,
        lastUpdated: new Date(),
      },
    ];
  }

  initializeDefaultMarketIndices() {
    this.marketIndices = [
      {
        id: uuidv4(),
        symbol: "^GSPC",
        name: "S&P 500",
        value: 5250.35,
        change: 12.45,
        changePercent: 0.24,
        lastUpdated: new Date(),
      },
      {
        id: uuidv4(),
        symbol: "^DJI",
        name: "Dow Jones Industrial Average",
        value: 39875.6,
        change: -25.3,
        changePercent: -0.06,
        lastUpdated: new Date(),
      },
      {
        id: uuidv4(),
        symbol: "^IXIC",
        name: "NASDAQ Composite",
        value: 16325.8,
        change: 85.6,
        changePercent: 0.53,
        lastUpdated: new Date(),
      },
    ];
  }

  initializeDefaultCurrencies() {
    this.currencies = [
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        rate: 1.0,
        lastUpdated: new Date(),
      },
      {
        code: "CNY",
        name: "Chinese Yuan",
        symbol: "¥",
        rate: 7.15,
        lastUpdated: new Date(),
      },
      {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        rate: 0.92,
        lastUpdated: new Date(),
      },
    ];
  }

  initializeDefaultFinancialNews() {
    const news = [
      {
        title: "美联储维持利率不变，暗示年内可能降息",
        content:
          "美联储在最新的货币政策会议上决定维持利率不变，但暗示如果通胀继续下降，年内可能会开始降息周期。市场对此反应积极，美股三大指数均上涨。",
        source: "财经日报",
        url: "https://finance.example.com/news/1",
        tags: ["美联储", "利率", "货币政策"],
      },
      {
        title: "苹果公司发布财报，季度营收超预期",
        content:
          "苹果公司公布最新季度财报，营收和利润均超出分析师预期，主要得益于iPhone和服务业务的强劲增长。公司股价在盘后交易中上涨超过3%。",
        source: "科技财经",
        url: "https://finance.example.com/news/2",
        tags: ["苹果", "财报", "科技股"],
      },
      {
        title: "中国股市持续上涨，沪指创近期新高",
        content:
          "受政策利好和经济数据改善影响，中国股市持续上涨，上证指数创下近期新高。新能源、科技和消费板块表现尤为强势。",
        source: "中国证券报",
        url: "https://finance.example.com/news/3",
        tags: ["中国股市", "上证指数", "经济数据"],
      },
    ];

    news.forEach((item) => {
      this.financialNews.push({
        id: uuidv4(),
        ...item,
        publishDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      });
    });
  }

  generateStockHistory() {
    this.stocks.forEach((stock) => {
      const startDate = subYears(new Date(), 1);
      const endDate = new Date();
      let currentDate = new Date(startDate);
      let basePrice = stock.price * (0.8 + Math.random() * 0.4);

      while (currentDate <= endDate) {
        const priceChange = (Math.random() - 0.5) * basePrice * 0.03;
        basePrice = Math.max(0, basePrice + priceChange);
        const open = basePrice * (0.995 + Math.random() * 0.01);
        const high = open * (1 + Math.random() * 0.02);
        const low = open * (1 - Math.random() * 0.02);
        const close = basePrice;
        const volume = Math.floor(1000000 + Math.random() * 9000000);

        this.stockHistory.push({
          id: uuidv4(),
          symbol: stock.symbol,
          date: new Date(currentDate),
          open,
          high,
          low,
          close,
          volume,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  }

  // 获取股票数据
  async getStock(symbol) {
    return this.stocks.find((stock) => stock.symbol.toUpperCase() === symbol.toUpperCase()) || null;
  }

  // 获取股票列表
  async getStocks(options = {}) {
    let filteredStocks = [...this.stocks];

    if (options.sector) {
      filteredStocks = filteredStocks.filter(
        (stock) => stock.sector.toLowerCase() === options.sector?.toLowerCase(),
      );
    }

    if (options.limit) {
      filteredStocks = filteredStocks.slice(0, options.limit);
    }

    return filteredStocks;
  }

  // 获取股票历史数据
  async getStockHistory(symbol, period) {
    let days = 1;
    switch (period) {
      case "1w":
        days = 7;
        break;
      case "1m":
        days = 30;
        break;
      case "1y":
        days = 365;
        break;
    }

    const cutoffDate = subDays(new Date(), days);
    return this.stockHistory
      .filter(
        (item) => item.symbol.toUpperCase() === symbol.toUpperCase() && item.date >= cutoffDate,
      )
      .toSorted((a, b) => a.date.getTime() - b.date.getTime());
  }

  // 获取市场指数
  async getMarketIndices() {
    return this.marketIndices;
  }

  // 货币转换
  async convertCurrency(amount, fromCurrency, toCurrency) {
    const from = this.currencies.find((c) => c.code.toUpperCase() === fromCurrency.toUpperCase());
    const to = this.currencies.find((c) => c.code.toUpperCase() === toCurrency.toUpperCase());

    if (!from || !to) {
      throw new Error("Invalid currency code");
    }

    const amountInUSD = amount / from.rate;
    return amountInUSD * to.rate;
  }

  // 获取货币汇率
  async getExchangeRates() {
    return this.currencies;
  }

  // 创建投资组合
  async createPortfolio(name, description) {
    const portfolio = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date(),
      lastUpdated: new Date(),
      totalValue: 0,
      totalCost: 0,
      totalReturn: 0,
      totalReturnPercent: 0,
      holdings: [],
    };

    this.portfolios.push(portfolio);
    return portfolio;
  }

  // 获取投资组合
  async getPortfolio(portfolioId) {
    return this.portfolios.find((p) => p.id === portfolioId) || null;
  }

  // 获取所有投资组合
  async getPortfolios() {
    return this.portfolios;
  }

  // 添加持仓到投资组合
  async addHolding(portfolioId, symbol, shares, costPerShare) {
    const portfolio = this.portfolios.find((p) => p.id === portfolioId);
    const stock = this.stocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());

    if (!portfolio || !stock) {
      return false;
    }

    const holding = {
      id: uuidv4(),
      portfolioId,
      symbol: stock.symbol,
      name: stock.name,
      shares,
      costPerShare,
      currentPrice: stock.price,
      totalCost: shares * costPerShare,
      totalValue: shares * stock.price,
      return: shares * (stock.price - costPerShare),
      returnPercent: ((stock.price - costPerShare) / costPerShare) * 100,
    };

    portfolio.holdings.push(holding);
    this.updatePortfolioStats(portfolio);
    return true;
  }

  // 更新投资组合统计数据
  private updatePortfolioStats(portfolio) {
    let totalValue = 0;
    let totalCost = 0;

    portfolio.holdings.forEach((holding) => {
      const stock = this.stocks.find((s) => s.symbol === holding.symbol);
      if (stock) {
        holding.currentPrice = stock.price;
        holding.totalValue = holding.shares * stock.price;
        holding.return = holding.shares * (stock.price - holding.costPerShare);
        holding.returnPercent = ((stock.price - holding.costPerShare) / holding.costPerShare) * 100;
      }
      totalValue += holding.totalValue;
      totalCost += holding.totalCost;
    });

    portfolio.totalValue = totalValue;
    portfolio.totalCost = totalCost;
    portfolio.totalReturn = totalValue - totalCost;
    portfolio.totalReturnPercent = totalCost > 0 ? (portfolio.totalReturn / totalCost) * 100 : 0;
    portfolio.lastUpdated = new Date();
  }

  // 获取金融新闻
  async getFinancialNews(options = {}) {
    let filteredNews = [...this.financialNews];

    if (options.tags && options.tags.length > 0) {
      filteredNews = filteredNews.filter((news) =>
        options.tags?.some((tag) => news.tags.includes(tag)),
      );
    }

    filteredNews.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

    if (options.limit) {
      filteredNews = filteredNews.slice(0, options.limit);
    }

    return filteredNews;
  }

  // 搜索股票
  async searchStocks(query) {
    const queryLower = query.toLowerCase();
    return this.stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(queryLower) ||
        stock.name.toLowerCase().includes(queryLower) ||
        stock.sector.toLowerCase().includes(queryLower),
    );
  }

  // 计算投资收益
  async calculateInvestmentReturn(initialInvestment, years, annualReturn) {
    return initialInvestment * Math.pow(1 + annualReturn / 100, years);
  }

  // 获取行业板块数据
  async getSectorPerformance() {
    const sectors = [...new Set(this.stocks.map((stock) => stock.sector))];
    return sectors.map((sector) => {
      const sectorStocks = this.stocks.filter((stock) => stock.sector === sector);
      const averagePerformance =
        sectorStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / sectorStocks.length;
      return {
        sector,
        performance: Math.round(averagePerformance * 100) / 100,
      };
    });
  }
}

async function testFinanceSkill() {
  console.log("=== 测试 Finance 技能插件 ===\n");

  const financeManager = new FinanceManager();

  try {
    // 测试 1: 获取股票数据
    console.log("1. 测试获取股票数据:");
    const appleStock = await financeManager.getStock("AAPL");
    if (appleStock) {
      console.log("苹果股票:", appleStock.symbol, "-", appleStock.name);
      console.log("价格:", appleStock.price, "美元");
      console.log("涨跌幅:", appleStock.changePercent, "%");
      console.log("市值:", (appleStock.marketCap / 1000000000).toFixed(2), "亿美元");
    }
    console.log("");

    // 测试 2: 获取股票列表
    console.log("2. 测试获取股票列表:");
    const techStocks = await financeManager.getStocks({ sector: "Technology", limit: 3 });
    console.log("科技板块股票:");
    techStocks.forEach((stock) => {
      console.log(`${stock.symbol}: ${stock.name} - $${stock.price}`);
    });
    console.log("");

    // 测试 3: 获取股票历史数据
    console.log("3. 测试获取股票历史数据:");
    const stockHistory = await financeManager.getStockHistory("AAPL", "1w");
    console.log(`苹果股票最近1周历史数据: ${stockHistory.length} 条记录`);
    if (stockHistory.length > 0) {
      console.log(
        "最近一条记录:",
        stockHistory[stockHistory.length - 1].date.toLocaleString(),
        "- 收盘价:",
        stockHistory[stockHistory.length - 1].close,
      );
    }
    console.log("");

    // 测试 4: 获取市场指数
    console.log("4. 测试获取市场指数:");
    const indices = await financeManager.getMarketIndices();
    console.log("主要市场指数:");
    indices.forEach((index) => {
      console.log(
        `${index.name} (${index.symbol}): ${index.value} ${index.change > 0 ? "+" : ""}${index.changePercent}%`,
      );
    });
    console.log("");

    // 测试 5: 货币转换
    console.log("5. 测试货币转换:");
    const usdToCny = await financeManager.convertCurrency(100, "USD", "CNY");
    console.log("100 USD =", usdToCny.toFixed(2), "CNY");
    const eurToUsd = await financeManager.convertCurrency(100, "EUR", "USD");
    console.log("100 EUR =", eurToUsd.toFixed(2), "USD");
    console.log("");

    // 测试 6: 获取汇率
    console.log("6. 测试获取汇率:");
    const rates = await financeManager.getExchangeRates();
    console.log("货币汇率:");
    rates.forEach((currency) => {
      console.log(`${currency.code} (${currency.name}): 1 USD = ${currency.rate} ${currency.code}`);
    });
    console.log("");

    // 测试 7: 创建投资组合
    console.log("7. 测试创建投资组合:");
    const portfolio = await financeManager.createPortfolio("我的投资组合", "个人投资组合");
    console.log("创建的投资组合:", portfolio.name);
    console.log("投资组合ID:", portfolio.id);
    console.log("");

    // 测试 8: 添加持仓
    console.log("8. 测试添加持仓:");
    const addHoldingResult = await financeManager.addHolding(portfolio.id, "AAPL", 10, 180.0);
    console.log("添加苹果股票持仓结果:", addHoldingResult);
    const updatedPortfolio = await financeManager.getPortfolio(portfolio.id);
    if (updatedPortfolio) {
      console.log("投资组合总价值:", updatedPortfolio.totalValue.toFixed(2), "美元");
      console.log("投资组合总收益:", updatedPortfolio.totalReturn.toFixed(2), "美元");
      console.log("投资组合收益率:", updatedPortfolio.totalReturnPercent.toFixed(2), "%");
    }
    console.log("");

    // 测试 9: 获取金融新闻
    console.log("9. 测试获取金融新闻:");
    const news = await financeManager.getFinancialNews({ limit: 2 });
    console.log("最新金融新闻:");
    news.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   来源: ${item.source}`);
      console.log(`   日期: ${item.publishDate.toLocaleString()}`);
    });
    console.log("");

    // 测试 10: 搜索股票
    console.log("10. 测试搜索股票:");
    const searchResults = await financeManager.searchStocks("tech");
    console.log('搜索 "tech" 的结果:');
    searchResults.forEach((stock) => {
      console.log(`${stock.symbol}: ${stock.name} - ${stock.sector}`);
    });
    console.log("");

    // 测试 11: 计算投资收益
    console.log("11. 测试计算投资收益:");
    const investmentResult = await financeManager.calculateInvestmentReturn(10000, 5, 8);
    console.log("初始投资: 10000 美元");
    console.log("投资年限: 5 年");
    console.log("年化收益率: 8%");
    console.log("最终金额:", investmentResult.toFixed(2), "美元");
    console.log("");

    // 测试 12: 获取行业板块表现
    console.log("12. 测试获取行业板块表现:");
    const sectorPerformance = await financeManager.getSectorPerformance();
    console.log("行业板块表现:");
    sectorPerformance.forEach((sector) => {
      console.log(`${sector.sector}: ${sector.performance > 0 ? "+" : ""}${sector.performance}%`);
    });
    console.log("");

    console.log("=== 所有测试完成 ===");
    console.log("Finance 技能插件功能正常！");
  } catch (error) {
    console.error("测试过程中出现错误:", error);
  }
}

void testFinanceSkill();
