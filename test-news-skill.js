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

// 新闻数据接口
class NewsManager {
  constructor() {
    this.articles = [];
    this.sources = [];
    this.categories = [];
    this.subscriptions = [];
    this.initializeDefaultCategories();
    this.initializeDefaultSources();
    this.initializeDefaultSubscriptions();
    this.generateMockData();
  }

  initializeDefaultCategories() {
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
    ];
  }

  initializeDefaultSources() {
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
    ];
  }

  initializeDefaultSubscriptions() {
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
    ];
  }

  generateMockData() {
    const categories = this.categories.map((cat) => cat.name);
    const sources = this.sources.map((src) => src.name);
    const keywords = ["AI", "科技", "财经", "体育", "娱乐", "健康"];

    // 生成 50 条模拟新闻
    for (let i = 0; i < 50; i++) {
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
  async getNewsList(options = {}) {
    let filteredArticles = [...this.articles];

    if (options.category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category === options.category,
      );
    }

    if (options.source) {
      filteredArticles = filteredArticles.filter((article) => article.source === options.source);
    }

    if (options.keyword) {
      const keyword = options.keyword.toLowerCase();
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(keyword) ||
          article.content.toLowerCase().includes(keyword) ||
          article.tags.some((tag) => tag.toLowerCase().includes(keyword)),
      );
    }

    if (options.sortBy === "date") {
      filteredArticles.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
    }

    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
    };
  }

  // 获取新闻详情
  async getNewsDetail(articleId) {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      article.isRead = true;
      return article;
    }
    return null;
  }

  // 保存新闻
  async saveNews(articleId) {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      article.isSaved = true;
      return true;
    }
    return false;
  }

  // 取消保存新闻
  async unsaveNews(articleId) {
    const article = this.articles.find((a) => a.id === articleId);
    if (article) {
      article.isSaved = false;
      return true;
    }
    return false;
  }

  // 获取保存的新闻
  async getSavedNews() {
    return this.articles.filter((article) => article.isSaved);
  }

  // 获取未读新闻
  async getUnreadNews() {
    return this.articles.filter((article) => !article.isRead);
  }

  // 获取新闻分类
  async getCategories() {
    return this.categories;
  }

  // 获取新闻来源
  async getSources() {
    return this.sources;
  }

  // 添加新闻来源
  async addSource(name, url, category) {
    const source = {
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

  // 获取新闻订阅
  async getSubscriptions() {
    return this.subscriptions;
  }

  // 添加新闻订阅
  async addSubscription(name, categories = [], sources = [], keywords = []) {
    const subscription = {
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

  // 获取订阅的新闻
  async getSubscriptionNews(subscriptionId) {
    const subscription = this.subscriptions.find((s) => s.id === subscriptionId);
    if (!subscription || !subscription.isActive) {
      return [];
    }

    return this.articles
      .filter((article) => {
        if (
          subscription.categories.length > 0 &&
          !subscription.categories.includes(article.category)
        ) {
          return false;
        }

        if (subscription.sources.length > 0 && !subscription.sources.includes(article.source)) {
          return false;
        }

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
      .toSorted((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  // 搜索新闻
  async searchNews(query, options = {}) {
    let filteredArticles = [...this.articles];

    const queryLower = query.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(queryLower) ||
        article.content.toLowerCase().includes(queryLower) ||
        article.summary.toLowerCase().includes(queryLower) ||
        article.tags.some((tag) => tag.toLowerCase().includes(queryLower)),
    );

    if (options.category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category === options.category,
      );
    }

    if (options.source) {
      filteredArticles = filteredArticles.filter((article) => article.source === options.source);
    }

    filteredArticles.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
    };
  }

  // 获取热门新闻
  async getTrendingNews(days = 7) {
    const cutoffDate = subDays(new Date(), days);
    return this.articles
      .filter((article) => article.publishDate >= cutoffDate)
      .toSorted((a, b) => {
        const aScore = (a.isSaved ? 3 : 0) + a.publishDate.getTime() / 10000000;
        const bScore = (b.isSaved ? 3 : 0) + b.publishDate.getTime() / 10000000;
        return bScore - aScore;
      })
      .slice(0, 10);
  }
}

async function testNewsSkill() {
  console.log("=== 测试 News 技能插件 ===\n");

  const newsManager = new NewsManager();

  try {
    // 测试 1: 获取新闻分类
    console.log("1. 测试获取新闻分类:");
    const categories = await newsManager.getCategories();
    console.log(
      "新闻分类:",
      categories.map((cat) => cat.name),
    );
    console.log("");

    // 测试 2: 获取新闻来源
    console.log("2. 测试获取新闻来源:");
    const sources = await newsManager.getSources();
    console.log(
      "新闻来源:",
      sources.map((src) => src.name),
    );
    console.log("");

    // 测试 3: 获取新闻列表
    console.log("3. 测试获取新闻列表:");
    const newsList = await newsManager.getNewsList({ page: 1, pageSize: 5, sortBy: "date" });
    console.log(`共 ${newsList.total} 条新闻，第 1 页:`);
    newsList.articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.category} - ${article.source})`);
    });
    console.log("");

    // 测试 4: 按分类获取新闻
    console.log("4. 测试按分类获取新闻:");
    const techNews = await newsManager.getNewsList({ category: "科技", page: 1, pageSize: 3 });
    console.log(`科技分类新闻 (共 ${techNews.total} 条):`);
    techNews.articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
    });
    console.log("");

    // 测试 5: 搜索新闻
    console.log("5. 测试搜索新闻:");
    const searchResult = await newsManager.searchNews("AI", { page: 1, pageSize: 3 });
    console.log(`搜索 "AI" 的结果 (共 ${searchResult.total} 条):`);
    searchResult.articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
    });
    console.log("");

    // 测试 6: 获取热门新闻
    console.log("6. 测试获取热门新闻:");
    const trendingNews = await newsManager.getTrendingNews(3);
    console.log("最近3天热门新闻:");
    trendingNews.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.publishDate.toLocaleString()})`);
    });
    console.log("");

    // 测试 7: 获取新闻详情
    console.log("7. 测试获取新闻详情:");
    const firstArticle = newsList.articles[0];
    const articleDetail = await newsManager.getNewsDetail(firstArticle.id);
    if (articleDetail) {
      console.log("新闻标题:", articleDetail.title);
      console.log("摘要:", articleDetail.summary);
      console.log("分类:", articleDetail.category);
      console.log("来源:", articleDetail.source);
      console.log("发布时间:", articleDetail.publishDate.toLocaleString());
      console.log("是否已读:", articleDetail.isRead);
    }
    console.log("");

    // 测试 8: 保存新闻
    console.log("8. 测试保存新闻:");
    const saveResult = await newsManager.saveNews(firstArticle.id);
    console.log("保存新闻结果:", saveResult);
    const savedNews = await newsManager.getSavedNews();
    console.log(`已保存的新闻数量: ${savedNews.length}`);
    console.log("");

    // 测试 9: 获取未读新闻
    console.log("9. 测试获取未读新闻:");
    const unreadNews = await newsManager.getUnreadNews();
    console.log(`未读新闻数量: ${unreadNews.length}`);
    console.log("");

    // 测试 10: 添加新闻来源
    console.log("10. 测试添加新闻来源:");
    const newSource = await newsManager.addSource(
      "娱乐周刊",
      "https://www.entertainmentweekly.com",
      "娱乐",
    );
    console.log("添加的新来源:", newSource.name);
    const updatedSources = await newsManager.getSources();
    console.log(`更新后的来源数量: ${updatedSources.length}`);
    console.log("");

    // 测试 11: 添加新闻订阅
    console.log("11. 测试添加新闻订阅:");
    const newSubscription = await newsManager.addSubscription(
      "娱乐新闻",
      ["娱乐"],
      [],
      ["明星", "电影", "音乐"],
    );
    console.log("添加的新订阅:", newSubscription.name);
    const subscriptions = await newsManager.getSubscriptions();
    console.log(`订阅数量: ${subscriptions.length}`);
    console.log("");

    // 测试 12: 获取订阅新闻
    console.log("12. 测试获取订阅新闻:");
    const subscriptionNews = await newsManager.getSubscriptionNews(subscriptions[0].id);
    console.log(`订阅 "${subscriptions[0].name}" 的新闻数量: ${subscriptionNews.length}`);
    if (subscriptionNews.length > 0) {
      console.log("第一条订阅新闻:", subscriptionNews[0].title);
    }
    console.log("");

    console.log("=== 所有测试完成 ===");
    console.log("News 技能插件功能正常！");
  } catch (error) {
    console.error("测试过程中出现错误:", error);
  }
}

void testNewsSkill();
