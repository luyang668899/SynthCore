import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// 金融数据类型定义
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  lastUpdated: string;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface Currency {
  code: string;
  name: string;
  rate: number;
  lastUpdated: string;
}

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice: number;
  lastUpdated: string;
}

export interface InvestmentPortfolio {
  id: string;
  name: string;
  investments: Investment[];
  createdAt: string;
  lastUpdated: string;
}

export interface FinancialNews {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  publishDate: string;
  url: string;
}

// 金融管理器类
export class FinanceManager {
  private stocks: Map<string, Stock> = new Map();
  private marketIndices: Map<string, MarketIndex> = new Map();
  private currencies: Map<string, Currency> = new Map();
  private portfolios: Map<string, InvestmentPortfolio> = new Map();
  private news: FinancialNews[] = [];

  constructor() {
    // 初始化模拟数据
    this.initializeMockData();
  }

  // 初始化模拟数据
  private initializeMockData() {
    // 模拟股票数据
    this.stocks.set("AAPL", {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 187.56,
      change: 2.34,
      changePercent: 1.26,
      marketCap: 2930000000000,
      volume: 52340000,
      lastUpdated: new Date().toISOString(),
    });

    this.stocks.set("MSFT", {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 423.87,
      change: -1.23,
      changePercent: -0.29,
      marketCap: 3100000000000,
      volume: 28760000,
      lastUpdated: new Date().toISOString(),
    });

    // 模拟市场指数
    this.marketIndices.set("SP500", {
      name: "S&P 500",
      symbol: "SP500",
      value: 5234.56,
      change: 12.34,
      changePercent: 0.24,
      lastUpdated: new Date().toISOString(),
    });

    this.marketIndices.set("NASDAQ", {
      name: "NASDAQ Composite",
      symbol: "NASDAQ",
      value: 16345.78,
      change: 45.67,
      changePercent: 0.28,
      lastUpdated: new Date().toISOString(),
    });

    // 模拟货币汇率
    this.currencies.set("USD", {
      code: "USD",
      name: "US Dollar",
      rate: 1.0,
      lastUpdated: new Date().toISOString(),
    });

    this.currencies.set("EUR", {
      code: "EUR",
      name: "Euro",
      rate: 0.92,
      lastUpdated: new Date().toISOString(),
    });

    this.currencies.set("JPY", {
      code: "JPY",
      name: "Japanese Yen",
      rate: 152.34,
      lastUpdated: new Date().toISOString(),
    });

    this.currencies.set("CNY", {
      code: "CNY",
      name: "Chinese Yuan",
      rate: 7.18,
      lastUpdated: new Date().toISOString(),
    });

    // 模拟金融新闻
    this.news = [
      {
        id: uuidv4(),
        title: "Fed Signals Potential Rate Cut in June",
        content:
          "The Federal Reserve indicated that it may begin cutting interest rates as early as June if inflation continues to moderate.",
        source: "Financial Times",
        category: "central-bank",
        publishDate: new Date().toISOString(),
        url: "https://example.com/news/1",
      },
      {
        id: uuidv4(),
        title: "Tech Stocks Rally on AI Growth Prospects",
        content:
          "Major tech companies saw their stocks rise as investors bet on continued growth in artificial intelligence sectors.",
        source: "Bloomberg",
        category: "tech",
        publishDate: new Date().toISOString(),
        url: "https://example.com/news/2",
      },
    ];
  }

  // 获取股票数据
  async getStock(symbol: string): Promise<Stock | null> {
    const stock = this.stocks.get(symbol.toUpperCase());
    if (!stock) {
      return null;
    }
    // 模拟实时数据更新
    stock.price = +(stock.price + (Math.random() * 2 - 1)).toFixed(2);
    stock.change = +(stock.price - stock.price / (1 + stock.changePercent / 100)).toFixed(2);
    stock.changePercent = +((stock.change / (stock.price - stock.change)) * 100).toFixed(2);
    stock.lastUpdated = new Date().toISOString();
    return stock;
  }

  // 批量获取股票数据
  async getStocks(symbols: string[]): Promise<Stock[]> {
    const stocks: Stock[] = [];
    for (const symbol of symbols) {
      const stock = await this.getStock(symbol);
      if (stock) {
        stocks.push(stock);
      }
    }
    return stocks;
  }

  // 获取市场指数
  async getMarketIndex(symbol: string): Promise<MarketIndex | null> {
    const index = this.marketIndices.get(symbol.toUpperCase());
    if (!index) {
      return null;
    }
    // 模拟实时数据更新
    index.value = +(index.value + (Math.random() * 10 - 5)).toFixed(2);
    index.change = +(index.value - index.value / (1 + index.changePercent / 100)).toFixed(2);
    index.changePercent = +((index.change / (index.value - index.change)) * 100).toFixed(2);
    index.lastUpdated = new Date().toISOString();
    return index;
  }

  // 批量获取市场指数
  async getMarketIndices(symbols: string[]): Promise<MarketIndex[]> {
    const indices: MarketIndex[] = [];
    for (const symbol of symbols) {
      const index = await this.getMarketIndex(symbol);
      if (index) {
        indices.push(index);
      }
    }
    return indices;
  }

  // 货币转换
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    const from = this.currencies.get(fromCurrency.toUpperCase());
    const to = this.currencies.get(toCurrency.toUpperCase());

    if (!from || !to) {
      throw new Error("Invalid currency code");
    }

    // 转换逻辑：先转换为USD，再转换为目标货币
    const amountInUSD = amount / from.rate;
    const convertedAmount = amountInUSD * to.rate;

    return +convertedAmount.toFixed(2);
  }

  // 获取货币汇率
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const from = this.currencies.get(fromCurrency.toUpperCase());
    const to = this.currencies.get(toCurrency.toUpperCase());

    if (!from || !to) {
      throw new Error("Invalid currency code");
    }

    return +(to.rate / from.rate).toFixed(4);
  }

  // 创建投资组合
  async createPortfolio(name: string): Promise<InvestmentPortfolio> {
    const portfolio: InvestmentPortfolio = {
      id: uuidv4(),
      name,
      investments: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.portfolios.set(portfolio.id, portfolio);
    return portfolio;
  }

  // 获取投资组合
  async getPortfolio(id: string): Promise<InvestmentPortfolio | null> {
    return this.portfolios.get(id) || null;
  }

  // 获取所有投资组合
  async getAllPortfolios(): Promise<InvestmentPortfolio[]> {
    return Array.from(this.portfolios.values());
  }

  // 更新投资组合
  async updatePortfolio(id: string, name: string): Promise<InvestmentPortfolio | null> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) {
      return null;
    }

    portfolio.name = name;
    portfolio.lastUpdated = new Date().toISOString();
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  // 删除投资组合
  async deletePortfolio(id: string): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  // 添加投资到组合
  async addInvestment(
    portfolioId: string,
    investment: Omit<Investment, "id" | "lastUpdated" | "currentPrice">,
  ): Promise<Investment | null> {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      return null;
    }

    const stock = this.stocks.get(investment.symbol.toUpperCase());
    const currentPrice = stock ? stock.price : investment.purchasePrice;

    const newInvestment: Investment = {
      ...investment,
      id: uuidv4(),
      currentPrice,
      lastUpdated: new Date().toISOString(),
    };

    portfolio.investments.push(newInvestment);
    portfolio.lastUpdated = new Date().toISOString();
    this.portfolios.set(portfolioId, portfolio);
    return newInvestment;
  }

  // 更新投资
  async updateInvestment(
    portfolioId: string,
    investmentId: string,
    updates: Partial<Investment>,
  ): Promise<Investment | null> {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      return null;
    }

    const investmentIndex = portfolio.investments.findIndex((inv) => inv.id === investmentId);
    if (investmentIndex === -1) {
      return null;
    }

    const updatedInvestment = {
      ...portfolio.investments[investmentIndex],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    portfolio.investments[investmentIndex] = updatedInvestment;
    portfolio.lastUpdated = new Date().toISOString();
    this.portfolios.set(portfolioId, portfolio);
    return updatedInvestment;
  }

  // 删除投资
  async removeInvestment(portfolioId: string, investmentId: string): Promise<boolean> {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      return false;
    }

    const initialLength = portfolio.investments.length;
    portfolio.investments = portfolio.investments.filter((inv) => inv.id !== investmentId);

    if (portfolio.investments.length !== initialLength) {
      portfolio.lastUpdated = new Date().toISOString();
      this.portfolios.set(portfolioId, portfolio);
      return true;
    }

    return false;
  }

  // 计算投资组合价值
  async calculatePortfolioValue(
    portfolioId: string,
  ): Promise<{
    totalValue: number;
    totalCost: number;
    totalReturn: number;
    totalReturnPercent: number;
  }> {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }

    let totalValue = 0;
    let totalCost = 0;

    for (const investment of portfolio.investments) {
      const stock = await this.getStock(investment.symbol);
      const currentPrice = stock ? stock.price : investment.currentPrice;

      totalValue += currentPrice * investment.quantity;
      totalCost += investment.purchasePrice * investment.quantity;
    }

    const totalReturn = totalValue - totalCost;
    const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

    return {
      totalValue: +totalValue.toFixed(2),
      totalCost: +totalCost.toFixed(2),
      totalReturn: +totalReturn.toFixed(2),
      totalReturnPercent: +totalReturnPercent.toFixed(2),
    };
  }

  // 获取金融新闻
  async getFinancialNews(category?: string, limit: number = 10): Promise<FinancialNews[]> {
    let filteredNews = this.news;

    if (category) {
      filteredNews = filteredNews.filter((news) => news.category === category);
    }

    return filteredNews.slice(0, limit);
  }

  // 搜索金融新闻
  async searchFinancialNews(query: string): Promise<FinancialNews[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.news.filter(
      (news) =>
        news.title.toLowerCase().includes(lowercaseQuery) ||
        news.content.toLowerCase().includes(lowercaseQuery),
    );
  }

  // 保存新闻
  async saveNews(newsId: string): Promise<boolean> {
    // 这里可以实现保存新闻的逻辑
    // 目前只是模拟实现
    return true;
  }
}
