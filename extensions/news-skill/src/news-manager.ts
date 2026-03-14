import { format, parseISO, isWithinInterval, subDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  category: string;
  author: string;
  url: string;
  imageUrl: string;
  publishDate: Date;
  tags: string[];
  isRead: boolean;
  isSaved: boolean;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
  isActive: boolean;
  priority: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface NewsSubscription {
  id: string;
  name: string;
  categories: string[];
  sources: string[];
  keywords: string[];
  isActive: boolean;
  notificationEnabled: boolean;
}

export class NewsManager {
  private articles: NewsArticle[] = [];
  private sources: NewsSource[] = [];
  private categories: NewsCategory[] = [];
  private subscriptions: NewsSubscription[] = [];

  constructor() {
    // 初始化默认分类
    this.initializeDefaultCategories();
    // 初始化默认来源
    this.initializeDefaultSources();
    // 初始化默认订阅
    this.initializeDefaultSubscriptions();
    // 生成模拟数据
    this.generateMockData();
  }

  private initializeDefaultCategories(): void {
    this.categories = [
      {
        id: uuidv4(),
        name: "科技",
        description: "科技新闻和创新",
        icon: "technology",
        color: "#3498db",
      },
      {
        id: uuidv4(),
        name: "财经",
        description: "财经和商业新闻",
        icon: "finance",
        color: "#2ecc71",
      },
      {
        id: uuidv4(),
        name: "体育",
        description: "体育新闻和赛事",
        icon: "sports",
        color: "#e74c3c",
      },
      {
        id: uuidv4(),
        name: "娱乐",
        description: "娱乐和明星新闻",
        icon: "entertainment",
        color: "#f39c12",
      },
      {
        id: uuidv4(),
        name: "健康",
        description: "健康和医疗新闻",
        icon: "health",
        color: "#9b59b6",
      },
      {
        id: uuidv4(),
        name: "教育",
        description: "教育和学习新闻",
        icon: "education",
        color: "#1abc9c",
      },
      {
        id: uuidv4(),
        name: "国际",
        description: "国际新闻和事件",
        icon: "international",
        color: "#34495e",
      },
      {
        id: uuidv4(),
        name: "本地",
        description: "本地新闻和事件",
        icon: "local",
        color: "#e67e22",
      },
    ];
  }

  private initializeDefaultSources(): void {
    this.sources = [
      {
        id: uuidv4(),
        name: "科技日报",
        url: "https://www.techdaily.com",
        category: "科技",
        isActive: true,
        priority: 1,
      },
      {
        id: uuidv4(),
        name: "财经网",
        url: "https://www.finance.com",
        category: "财经",
        isActive: true,
        priority: 1,
      },
      {
        id: uuidv4(),
        name: "体育新闻",
        url: "https://www.sportsnews.com",
        category: "体育",
        isActive: true,
        priority: 1,
      },
      {
        id: uuidv4(),
        name: "娱乐周刊",
        url: "https://www.entertainmentweekly.com",
        category: "娱乐",
        isActive: true,
        priority: 1,
      },
      {
        id: uuidv4(),
        name: "健康时报",
        url: "https://www.healthtimes.com",
        category: "健康",
        isActive: true,
        priority: 1,
      },
    ];
  }

  private initializeDefaultSubscriptions(): void {
    this.subscriptions = [
      {
        id: uuidv4(),
        name: "每日科技新闻",
        categories: ["科技"],
        sources: [],
        keywords: ["AI", "科技", "创新"],
        isActive: true,
        notificationEnabled: true,
      },
      {
        id: uuidv4(),
        name: "财经资讯",
        categories: ["财经"],
        sources: [],
        keywords: ["股票", "经济", "市场"],
        isActive: true,
        notificationEnabled: false,
      },
    ];
  }

  private generateMockData(): void {
    const categories = this.categories.map((cat) => cat.name);
    const sources = this.sources.map((src) => src.name);
    const keywords = ["AI", "科技", "财经", "体育", "娱乐", "健康", "教育", "国际", "本地"];

    // 生成 100 条模拟新闻
    for (let i = 0; i < 100; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const publishDate = new Date();
      publishDate.setHours(publishDate.getHours() - Math.floor(Math.random() * 168)); // 过去7天内

      // 生成随机标签
      const articleTags = [];
      const tagCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < tagCount; j++) {
        const tag = keywords[Math.floor(Math.random() * keywords.length)];
        if (!articleTags.includes(tag)) {
          articleTags.push(tag);
        }
      }

      this.articles.push({
        id: uuidv4(),
        title: `测试新闻 ${i + 1}: ${category}领域的最新动态`,
        content: `这是一条关于${category}领域的详细新闻内容。\n\n新闻内容包括多个段落，详细介绍了相关事件的背景、发展过程和影响。\n\n通过这条新闻，读者可以了解到${category}领域的最新趋势和重要信息。`,
        summary: `这是关于${category}领域的新闻摘要，简要介绍了新闻的主要内容和关键点。`,
        source,
        category,
        author: `作者${Math.floor(Math.random() * 100)}`,
        url: `https://news.example.com/article/${i + 1}`,
        imageUrl: `https://neeko-copilot.bytedance.net/api/text2image?prompt=${encodeURIComponent(category + " news")}&size=800x600`,
        publishDate,
        tags: articleTags,
        isRead: Math.random() > 0.5,
        isSaved: Math.random() > 0.8,
      });
    }
  }

  // 获取新闻列表
  async getNewsList(options?: {
    category?: string;
    source?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
    sortBy?: "date" | "relevance";
  }): Promise<{ articles: NewsArticle[]; total: number }> {
    let filteredArticles = [...this.articles];

    // 按分类过滤
    if (options?.category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category === options.category,
      );
    }

    // 按来源过滤
    if (options?.source) {
      filteredArticles = filteredArticles.filter((article) => article.source === options.source);
    }

    // 按关键词过滤
    if (options?.keyword) {
      const keyword = options.keyword.toLowerCase();
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(keyword) ||
          article.content.toLowerCase().includes(keyword) ||
          article.tags.some((tag) => tag.toLowerCase().includes(keyword)),
      );
    }

    // 排序
    if (options?.sortBy === "date") {
      filteredArticles.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
    } else if (options?.sortBy === "relevance" && options.keyword) {
      // 简单的相关性排序
      const keyword = options.keyword.toLowerCase();
      filteredArticles.sort((a, b) => {
        const aScore =
          (a.title.toLowerCase().includes(keyword) ? 3 : 0) +
          (a.content.toLowerCase().includes(keyword) ? 2 : 0) +
          (a.tags.some((tag) => tag.toLowerCase().includes(keyword)) ? 1 : 0);
        const bScore =
          (b.title.toLowerCase().includes(keyword) ? 3 : 0) +
          (b.content.toLowerCase().includes(keyword) ? 2 : 0) +
          (b.tags.some((tag) => tag.toLowerCase().includes(keyword)) ? 1 : 0);
        return bScore - aScore;
      });
    }

    // 分页
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
    };
  }

  // 获取新闻详情
  async getNewsDetail(articleId: string): Promise<NewsArticle | null> {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      // 标记为已读
      article.isRead = true;
      return article;
    }
    return null;
  }

  // 保存新闻
  async saveNews(articleId: string): Promise<boolean> {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      article.isSaved = true;
      return true;
    }
    return false;
  }

  // 取消保存新闻
  async unsaveNews(articleId: string): Promise<boolean> {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      article.isSaved = false;
      return true;
    }
    return false;
  }

  // 获取保存的新闻
  async getSavedNews(): Promise<NewsArticle[]> {
    return this.articles.filter((article) => article.isSaved);
  }

  // 获取未读新闻
  async getUnreadNews(): Promise<NewsArticle[]> {
    return this.articles.filter((article) => !article.isRead);
  }

  // 获取新闻分类
  async getCategories(): Promise<NewsCategory[]> {
    return this.categories;
  }

  // 获取新闻来源
  async getSources(): Promise<NewsSource[]> {
    return this.sources;
  }

  // 添加新闻来源
  async addSource(name: string, url: string, category: string): Promise<NewsSource> {
    const source: NewsSource = {
      id: uuidv4(),
      name,
      url,
      category,
      isActive: true,
      priority: this.sources.length + 1,
    };
    this.sources.push(source);
    return source;
  }

  // 更新新闻来源
  async updateSource(sourceId: string, updates: Partial<NewsSource>): Promise<boolean> {
    const source = this.sources.find((s) => s.id === sourceId);
    if (source) {
      Object.assign(source, updates);
      return true;
    }
    return false;
  }

  // 删除新闻来源
  async removeSource(sourceId: string): Promise<boolean> {
    const index = this.sources.findIndex((s) => s.id === sourceId);
    if (index !== -1) {
      this.sources.splice(index, 1);
      return true;
    }
    return false;
  }

  // 获取新闻订阅
  async getSubscriptions(): Promise<NewsSubscription[]> {
    return this.subscriptions;
  }

  // 添加新闻订阅
  async addSubscription(
    name: string,
    categories: string[],
    sources: string[],
    keywords: string[],
  ): Promise<NewsSubscription> {
    const subscription: NewsSubscription = {
      id: uuidv4(),
      name,
      categories,
      sources,
      keywords,
      isActive: true,
      notificationEnabled: true,
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  // 更新新闻订阅
  async updateSubscription(
    subscriptionId: string,
    updates: Partial<NewsSubscription>,
  ): Promise<boolean> {
    const subscription = this.subscriptions.find((s) => s.id === subscriptionId);
    if (subscription) {
      Object.assign(subscription, updates);
      return true;
    }
    return false;
  }

  // 删除新闻订阅
  async removeSubscription(subscriptionId: string): Promise<boolean> {
    const index = this.subscriptions.findIndex((s) => s.id === subscriptionId);
    if (index !== -1) {
      this.subscriptions.splice(index, 1);
      return true;
    }
    return false;
  }

  // 获取订阅的新闻
  async getSubscriptionNews(subscriptionId: string): Promise<NewsArticle[]> {
    const subscription = this.subscriptions.find((s) => s.id === subscriptionId);
    if (!subscription || !subscription.isActive) {
      return [];
    }

    return this.articles
      .filter((article) => {
        // 检查分类
        if (
          subscription.categories.length > 0 &&
          !subscription.categories.includes(article.category)
        ) {
          return false;
        }

        // 检查来源
        if (subscription.sources.length > 0 && !subscription.sources.includes(article.source)) {
          return false;
        }

        // 检查关键词
        if (subscription.keywords.length > 0) {
          const articleText =
            `${article.title} ${article.content} ${article.tags.join(" ")}`.toLowerCase();
          const hasKeyword = subscription.keywords.some((keyword) =>
            articleText.includes(keyword.toLowerCase()),
          );
          if (!hasKeyword) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  // 搜索新闻
  async searchNews(
    query: string,
    options?: {
      category?: string;
      source?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      pageSize?: number;
    },
  ): Promise<{ articles: NewsArticle[]; total: number }> {
    let filteredArticles = [...this.articles];

    // 按查询词过滤
    const queryLower = query.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(queryLower) ||
        article.content.toLowerCase().includes(queryLower) ||
        article.summary.toLowerCase().includes(queryLower) ||
        article.tags.some((tag) => tag.toLowerCase().includes(queryLower)),
    );

    // 按分类过滤
    if (options?.category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category === options.category,
      );
    }

    // 按来源过滤
    if (options?.source) {
      filteredArticles = filteredArticles.filter((article) => article.source === options.source);
    }

    // 按日期范围过滤
    if (options?.startDate || options?.endDate) {
      filteredArticles = filteredArticles.filter((article) => {
        if (options?.startDate && article.publishDate < options.startDate) {
          return false;
        }
        if (options?.endDate && article.publishDate > options.endDate) {
          return false;
        }
        return true;
      });
    }

    // 按日期排序
    filteredArticles.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

    // 分页
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
    };
  }

  // 获取热门新闻
  async getTrendingNews(days: number = 7): Promise<NewsArticle[]> {
    const cutoffDate = subDays(new Date(), days);
    return this.articles
      .filter((article) => article.publishDate >= cutoffDate)
      .sort((a, b) => {
        // 简单的热门度计算：基于是否被保存和发布时间
        const aScore = (a.isSaved ? 3 : 0) + a.publishDate.getTime() / 10000000;
        const bScore = (b.isSaved ? 3 : 0) + b.publishDate.getTime() / 10000000;
        return bScore - aScore;
      })
      .slice(0, 10);
  }
}
