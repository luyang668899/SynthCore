import { NewsManager } from "./src/news-manager";

export default {
  name: "news-skill",
  version: "1.0.0",
  description: "News skill plugin for OpenClaw",

  async register({ registerTool, logger }) {
    const newsManager = new NewsManager();

    // 注册获取新闻列表工具
    registerTool({
      name: "get_news_list",
      description: "获取新闻列表，支持分类、来源和关键词过滤",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "新闻分类，例如：科技、财经、体育",
          },
          source: {
            type: "string",
            description: "新闻来源，例如：科技日报、财经网",
          },
          keyword: {
            type: "string",
            description: "关键词搜索",
          },
          page: {
            type: "integer",
            description: "页码，默认1",
            minimum: 1,
          },
          pageSize: {
            type: "integer",
            description: "每页条数，默认20",
            minimum: 1,
            maximum: 100,
          },
          sortBy: {
            type: "string",
            enum: ["date", "relevance"],
            description: "排序方式，date按日期，relevance按相关性",
          },
        },
      },
      async execute({ category, source, keyword, page, pageSize, sortBy }) {
        try {
          const result = await newsManager.getNewsList({
            category,
            source,
            keyword,
            page,
            pageSize,
            sortBy,
          });
          return {
            success: true,
            data: result,
          };
        } catch (error) {
          logger.error("获取新闻列表失败:", error);
          return {
            success: false,
            message: "获取新闻列表失败",
          };
        }
      },
    });

    // 注册获取新闻详情工具
    registerTool({
      name: "get_news_detail",
      description: "获取新闻详情",
      parameters: {
        type: "object",
        properties: {
          articleId: {
            type: "string",
            description: "新闻文章ID",
          },
        },
        required: ["articleId"],
      },
      async execute({ articleId }) {
        try {
          const article = await newsManager.getNewsDetail(articleId);
          if (!article) {
            return {
              success: false,
              message: "未找到新闻文章",
            };
          }
          return {
            success: true,
            data: article,
          };
        } catch (error) {
          logger.error("获取新闻详情失败:", error);
          return {
            success: false,
            message: "获取新闻详情失败",
          };
        }
      },
    });

    // 注册保存新闻工具
    registerTool({
      name: "save_news",
      description: "保存新闻",
      parameters: {
        type: "object",
        properties: {
          articleId: {
            type: "string",
            description: "新闻文章ID",
          },
        },
        required: ["articleId"],
      },
      async execute({ articleId }) {
        try {
          const success = await newsManager.saveNews(articleId);
          if (!success) {
            return {
              success: false,
              message: "保存新闻失败",
            };
          }
          return {
            success: true,
            message: "新闻保存成功",
          };
        } catch (error) {
          logger.error("保存新闻失败:", error);
          return {
            success: false,
            message: "保存新闻失败",
          };
        }
      },
    });

    // 注册取消保存新闻工具
    registerTool({
      name: "unsave_news",
      description: "取消保存新闻",
      parameters: {
        type: "object",
        properties: {
          articleId: {
            type: "string",
            description: "新闻文章ID",
          },
        },
        required: ["articleId"],
      },
      async execute({ articleId }) {
        try {
          const success = await newsManager.unsaveNews(articleId);
          if (!success) {
            return {
              success: false,
              message: "取消保存新闻失败",
            };
          }
          return {
            success: true,
            message: "新闻取消保存成功",
          };
        } catch (error) {
          logger.error("取消保存新闻失败:", error);
          return {
            success: false,
            message: "取消保存新闻失败",
          };
        }
      },
    });

    // 注册获取保存的新闻工具
    registerTool({
      name: "get_saved_news",
      description: "获取保存的新闻",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute() {
        try {
          const articles = await newsManager.getSavedNews();
          return {
            success: true,
            data: articles,
          };
        } catch (error) {
          logger.error("获取保存的新闻失败:", error);
          return {
            success: false,
            message: "获取保存的新闻失败",
          };
        }
      },
    });

    // 注册获取未读新闻工具
    registerTool({
      name: "get_unread_news",
      description: "获取未读新闻",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute() {
        try {
          const articles = await newsManager.getUnreadNews();
          return {
            success: true,
            data: articles,
          };
        } catch (error) {
          logger.error("获取未读新闻失败:", error);
          return {
            success: false,
            message: "获取未读新闻失败",
          };
        }
      },
    });

    // 注册获取新闻分类工具
    registerTool({
      name: "get_news_categories",
      description: "获取新闻分类",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute() {
        try {
          const categories = await newsManager.getCategories();
          return {
            success: true,
            data: categories,
          };
        } catch (error) {
          logger.error("获取新闻分类失败:", error);
          return {
            success: false,
            message: "获取新闻分类失败",
          };
        }
      },
    });

    // 注册获取新闻来源工具
    registerTool({
      name: "get_news_sources",
      description: "获取新闻来源",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute() {
        try {
          const sources = await newsManager.getSources();
          return {
            success: true,
            data: sources,
          };
        } catch (error) {
          logger.error("获取新闻来源失败:", error);
          return {
            success: false,
            message: "获取新闻来源失败",
          };
        }
      },
    });

    // 注册添加新闻来源工具
    registerTool({
      name: "add_news_source",
      description: "添加新闻来源",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "来源名称",
          },
          url: {
            type: "string",
            description: "来源URL",
          },
          category: {
            type: "string",
            description: "来源分类",
          },
        },
        required: ["name", "url", "category"],
      },
      async execute({ name, url, category }) {
        try {
          const source = await newsManager.addSource(name, url, category);
          return {
            success: true,
            data: source,
          };
        } catch (error) {
          logger.error("添加新闻来源失败:", error);
          return {
            success: false,
            message: "添加新闻来源失败",
          };
        }
      },
    });

    // 注册获取新闻订阅工具
    registerTool({
      name: "get_news_subscriptions",
      description: "获取新闻订阅",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute() {
        try {
          const subscriptions = await newsManager.getSubscriptions();
          return {
            success: true,
            data: subscriptions,
          };
        } catch (error) {
          logger.error("获取新闻订阅失败:", error);
          return {
            success: false,
            message: "获取新闻订阅失败",
          };
        }
      },
    });

    // 注册添加新闻订阅工具
    registerTool({
      name: "add_news_subscription",
      description: "添加新闻订阅",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "订阅名称",
          },
          categories: {
            type: "array",
            items: {
              type: "string",
            },
            description: "订阅分类",
          },
          sources: {
            type: "array",
            items: {
              type: "string",
            },
            description: "订阅来源",
          },
          keywords: {
            type: "array",
            items: {
              type: "string",
            },
            description: "订阅关键词",
          },
        },
        required: ["name"],
      },
      async execute({ name, categories = [], sources = [], keywords = [] }) {
        try {
          const subscription = await newsManager.addSubscription(
            name,
            categories,
            sources,
            keywords,
          );
          return {
            success: true,
            data: subscription,
          };
        } catch (error) {
          logger.error("添加新闻订阅失败:", error);
          return {
            success: false,
            message: "添加新闻订阅失败",
          };
        }
      },
    });

    // 注册获取订阅新闻工具
    registerTool({
      name: "get_subscription_news",
      description: "获取订阅的新闻",
      parameters: {
        type: "object",
        properties: {
          subscriptionId: {
            type: "string",
            description: "订阅ID",
          },
        },
        required: ["subscriptionId"],
      },
      async execute({ subscriptionId }) {
        try {
          const articles = await newsManager.getSubscriptionNews(subscriptionId);
          return {
            success: true,
            data: articles,
          };
        } catch (error) {
          logger.error("获取订阅新闻失败:", error);
          return {
            success: false,
            message: "获取订阅新闻失败",
          };
        }
      },
    });

    // 注册搜索新闻工具
    registerTool({
      name: "search_news",
      description: "搜索新闻",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词",
          },
          category: {
            type: "string",
            description: "新闻分类",
          },
          source: {
            type: "string",
            description: "新闻来源",
          },
          startDate: {
            type: "string",
            format: "date",
            description: "开始日期，格式：YYYY-MM-DD",
          },
          endDate: {
            type: "string",
            format: "date",
            description: "结束日期，格式：YYYY-MM-DD",
          },
          page: {
            type: "integer",
            description: "页码，默认1",
            minimum: 1,
          },
          pageSize: {
            type: "integer",
            description: "每页条数，默认20",
            minimum: 1,
            maximum: 100,
          },
        },
        required: ["query"],
      },
      async execute({ query, category, source, startDate, endDate, page, pageSize }) {
        try {
          const result = await newsManager.searchNews(query, {
            category,
            source,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            page,
            pageSize,
          });
          return {
            success: true,
            data: result,
          };
        } catch (error) {
          logger.error("搜索新闻失败:", error);
          return {
            success: false,
            message: "搜索新闻失败",
          };
        }
      },
    });

    // 注册获取热门新闻工具
    registerTool({
      name: "get_trending_news",
      description: "获取热门新闻",
      parameters: {
        type: "object",
        properties: {
          days: {
            type: "integer",
            description: "天数，默认7天",
            minimum: 1,
            maximum: 30,
          },
        },
      },
      async execute({ days = 7 }) {
        try {
          const articles = await newsManager.getTrendingNews(days);
          return {
            success: true,
            data: articles,
          };
        } catch (error) {
          logger.error("获取热门新闻失败:", error);
          return {
            success: false,
            message: "获取热门新闻失败",
          };
        }
      },
    });

    logger.info("News skill plugin registered successfully");
  },

  async unregister({ logger }) {
    logger.info("News skill plugin unregistered");
  },
};
