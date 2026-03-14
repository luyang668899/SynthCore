import { FinanceManager } from "./src/finance-manager";

export default {
  name: "finance-skill",
  version: "1.0.0",
  description: "Finance skill plugin for OpenClaw",

  async initialize() {
    console.log("Finance skill plugin initialized");
  },

  async registerTools(tools: any) {
    const financeManager = new FinanceManager();

    // 股票相关工具
    tools.register({
      name: "getStock",
      description: "获取股票实时数据",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "股票代码",
          },
        },
        required: ["symbol"],
      },
      handler: async (args: { symbol: string }) => {
        const stock = await financeManager.getStock(args.symbol);
        if (!stock) {
          return { error: "股票代码不存在" };
        }
        return stock;
      },
    });

    tools.register({
      name: "getStocks",
      description: "批量获取股票数据",
      parameters: {
        type: "object",
        properties: {
          symbols: {
            type: "array",
            items: {
              type: "string",
            },
            description: "股票代码列表",
          },
        },
        required: ["symbols"],
      },
      handler: async (args: { symbols: string[] }) => {
        return await financeManager.getStocks(args.symbols);
      },
    });

    // 市场指数相关工具
    tools.register({
      name: "getMarketIndex",
      description: "获取市场指数数据",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "指数代码",
          },
        },
        required: ["symbol"],
      },
      handler: async (args: { symbol: string }) => {
        const index = await financeManager.getMarketIndex(args.symbol);
        if (!index) {
          return { error: "指数代码不存在" };
        }
        return index;
      },
    });

    tools.register({
      name: "getMarketIndices",
      description: "批量获取市场指数数据",
      parameters: {
        type: "object",
        properties: {
          symbols: {
            type: "array",
            items: {
              type: "string",
            },
            description: "指数代码列表",
          },
        },
        required: ["symbols"],
      },
      handler: async (args: { symbols: string[] }) => {
        return await financeManager.getMarketIndices(args.symbols);
      },
    });

    // 货币转换相关工具
    tools.register({
      name: "convertCurrency",
      description: "货币转换",
      parameters: {
        type: "object",
        properties: {
          amount: {
            type: "number",
            description: "金额",
          },
          fromCurrency: {
            type: "string",
            description: "源货币代码",
          },
          toCurrency: {
            type: "string",
            description: "目标货币代码",
          },
        },
        required: ["amount", "fromCurrency", "toCurrency"],
      },
      handler: async (args: { amount: number; fromCurrency: string; toCurrency: string }) => {
        try {
          const result = await financeManager.convertCurrency(
            args.amount,
            args.fromCurrency,
            args.toCurrency,
          );
          return { result };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    tools.register({
      name: "getExchangeRate",
      description: "获取货币汇率",
      parameters: {
        type: "object",
        properties: {
          fromCurrency: {
            type: "string",
            description: "源货币代码",
          },
          toCurrency: {
            type: "string",
            description: "目标货币代码",
          },
        },
        required: ["fromCurrency", "toCurrency"],
      },
      handler: async (args: { fromCurrency: string; toCurrency: string }) => {
        try {
          const rate = await financeManager.getExchangeRate(args.fromCurrency, args.toCurrency);
          return { rate };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    // 投资组合相关工具
    tools.register({
      name: "createPortfolio",
      description: "创建投资组合",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "投资组合名称",
          },
        },
        required: ["name"],
      },
      handler: async (args: { name: string }) => {
        return await financeManager.createPortfolio(args.name);
      },
    });

    tools.register({
      name: "getPortfolio",
      description: "获取投资组合详情",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "投资组合ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const portfolio = await financeManager.getPortfolio(args.id);
        if (!portfolio) {
          return { error: "投资组合不存在" };
        }
        return portfolio;
      },
    });

    tools.register({
      name: "getAllPortfolios",
      description: "获取所有投资组合",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return await financeManager.getAllPortfolios();
      },
    });

    tools.register({
      name: "updatePortfolio",
      description: "更新投资组合",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "投资组合ID",
          },
          name: {
            type: "string",
            description: "新的投资组合名称",
          },
        },
        required: ["id", "name"],
      },
      handler: async (args: { id: string; name: string }) => {
        const portfolio = await financeManager.updatePortfolio(args.id, args.name);
        if (!portfolio) {
          return { error: "投资组合不存在" };
        }
        return portfolio;
      },
    });

    tools.register({
      name: "deletePortfolio",
      description: "删除投资组合",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "投资组合ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const result = await financeManager.deletePortfolio(args.id);
        return { success: result };
      },
    });

    tools.register({
      name: "addInvestment",
      description: "添加投资到组合",
      parameters: {
        type: "object",
        properties: {
          portfolioId: {
            type: "string",
            description: "投资组合ID",
          },
          name: {
            type: "string",
            description: "投资名称",
          },
          symbol: {
            type: "string",
            description: "股票代码",
          },
          quantity: {
            type: "number",
            description: "数量",
          },
          purchasePrice: {
            type: "number",
            description: "购买价格",
          },
          purchaseDate: {
            type: "string",
            description: "购买日期",
          },
        },
        required: ["portfolioId", "name", "symbol", "quantity", "purchasePrice", "purchaseDate"],
      },
      handler: async (args: {
        portfolioId: string;
        name: string;
        symbol: string;
        quantity: number;
        purchasePrice: number;
        purchaseDate: string;
      }) => {
        const investment = await financeManager.addInvestment(args.portfolioId, {
          name: args.name,
          symbol: args.symbol,
          quantity: args.quantity,
          purchasePrice: args.purchasePrice,
          purchaseDate: args.purchaseDate,
        });
        if (!investment) {
          return { error: "投资组合不存在" };
        }
        return investment;
      },
    });

    tools.register({
      name: "removeInvestment",
      description: "从组合中删除投资",
      parameters: {
        type: "object",
        properties: {
          portfolioId: {
            type: "string",
            description: "投资组合ID",
          },
          investmentId: {
            type: "string",
            description: "投资ID",
          },
        },
        required: ["portfolioId", "investmentId"],
      },
      handler: async (args: { portfolioId: string; investmentId: string }) => {
        const result = await financeManager.removeInvestment(args.portfolioId, args.investmentId);
        return { success: result };
      },
    });

    tools.register({
      name: "calculatePortfolioValue",
      description: "计算投资组合价值",
      parameters: {
        type: "object",
        properties: {
          portfolioId: {
            type: "string",
            description: "投资组合ID",
          },
        },
        required: ["portfolioId"],
      },
      handler: async (args: { portfolioId: string }) => {
        try {
          return await financeManager.calculatePortfolioValue(args.portfolioId);
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    // 金融新闻相关工具
    tools.register({
      name: "getFinancialNews",
      description: "获取金融新闻",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "新闻分类（可选）",
          },
          limit: {
            type: "number",
            description: "返回数量限制（可选，默认10）",
          },
        },
      },
      handler: async (args: { category?: string; limit?: number }) => {
        return await financeManager.getFinancialNews(args.category, args.limit || 10);
      },
    });

    tools.register({
      name: "searchFinancialNews",
      description: "搜索金融新闻",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词",
          },
        },
        required: ["query"],
      },
      handler: async (args: { query: string }) => {
        return await financeManager.searchFinancialNews(args.query);
      },
    });

    tools.register({
      name: "saveNews",
      description: "保存金融新闻",
      parameters: {
        type: "object",
        properties: {
          newsId: {
            type: "string",
            description: "新闻ID",
          },
        },
        required: ["newsId"],
      },
      handler: async (args: { newsId: string }) => {
        const result = await financeManager.saveNews(args.newsId);
        return { success: result };
      },
    });
  },
};
