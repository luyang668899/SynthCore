import { Octokit } from "@octokit/rest";
import { Webhooks } from "@octokit/webhooks";
import { v4 as uuidv4 } from "uuid";

export interface GitHubRepository {
  id: string;
  owner: string;
  repo: string;
  enabled: boolean;
  events: string[];
}

export interface GitHubNotification {
  id: string;
  subject: {
    title: string;
    url: string;
    type: string;
  };
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };
  reason: string;
  unread: boolean;
  updated_at: string;
  url: string;
}

export interface GitHubWebhook {
  id: number;
  name: string;
  active: boolean;
  events: string[];
  config: {
    url: string;
    content_type: string;
    secret: string;
  };
}

export class GitHubManager {
  private octokit: Octokit | null = null;
  private webhooks: Webhooks | null = null;
  private repositories: Map<string, GitHubRepository> = new Map();
  private token: string = "";

  /**
   * Initialize GitHub manager with token
   */
  initialize(token: string, webhookSecret: string): void {
    this.token = token;
    this.octokit = new Octokit({
      auth: token,
    });
    this.webhooks = new Webhooks({
      secret: webhookSecret,
    });
  }

  /**
   * Check if GitHub manager is initialized
   */
  isInitialized(): boolean {
    return !!this.octokit && !!this.webhooks;
  }

  /**
   * Add a repository to monitor
   */
  addRepository(
    owner: string,
    repo: string,
    events: string[] = ["push", "pull_request", "issues"],
  ): GitHubRepository {
    const id = uuidv4();
    const repository: GitHubRepository = {
      id,
      owner,
      repo,
      enabled: true,
      events,
    };
    this.repositories.set(id, repository);
    return repository;
  }

  /**
   * Remove a repository from monitoring
   */
  removeRepository(id: string): boolean {
    return this.repositories.delete(id);
  }

  /**
   * Get all monitored repositories
   */
  getRepositories(): GitHubRepository[] {
    return Array.from(this.repositories.values());
  }

  /**
   * Get a repository by ID
   */
  getRepository(id: string): GitHubRepository | undefined {
    return this.repositories.get(id);
  }

  /**
   * Update a repository
   */
  updateRepository(id: string, updates: Partial<GitHubRepository>): GitHubRepository | undefined {
    const existingRepo = this.repositories.get(id);
    if (!existingRepo) {
      return undefined;
    }

    const updatedRepo = {
      ...existingRepo,
      ...updates,
    };

    this.repositories.set(id, updatedRepo);
    return updatedRepo;
  }

  /**
   * Get GitHub notifications
   */
  async getNotifications(all: boolean = false): Promise<GitHubNotification[]> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    // TODO: Fix GitHub API path
    // const response = await this.octokit.rest.notifications.list({
    //   all,
    //   per_page: 100
    // });

    // return response.data as GitHubNotification[];
    return [];
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    // TODO: Fix GitHub API path
    // await this.octokit.rest.notifications.markAsRead({
    //   notification_id: notificationId
    // });
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    // TODO: Fix GitHub API path
    // await this.octokit.rest.notifications.markAsRead();
  }

  /**
   * Get repository issues
   */
  async getIssues(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open",
  ): Promise<any[]> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    const response = await this.octokit.rest.issues.listForRepo({
      owner,
      repo,
      state,
      per_page: 100,
    });

    return response.data;
  }

  /**
   * Get repository pull requests
   */
  async getPullRequests(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open",
  ): Promise<any[]> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    const response = await this.octokit.rest.pulls.list({
      owner,
      repo,
      state,
      per_page: 100,
    });

    return response.data;
  }

  /**
   * Get repository commits
   */
  async getCommits(owner: string, repo: string, perPage: number = 100): Promise<any[]> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    const response = await this.octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: perPage,
    });

    return response.data;
  }

  /**
   * Create a webhook for a repository
   */
  async createWebhook(
    owner: string,
    repo: string,
    url: string,
    events: string[],
    secret: string,
  ): Promise<GitHubWebhook> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    const response = await this.octokit.rest.repos.createWebhook({
      owner,
      repo,
      name: "web",
      active: true,
      events,
      config: {
        url,
        content_type: "json",
        secret,
      },
    });

    return response.data as GitHubWebhook;
  }

  /**
   * List webhooks for a repository
   */
  async listWebhooks(owner: string, repo: string): Promise<GitHubWebhook[]> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    const response = await this.octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    return response.data as GitHubWebhook[];
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(owner: string, repo: string, webhookId: number): Promise<void> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    await this.octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: webhookId,
    });
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.webhooks) {
      throw new Error("GitHub manager not initialized");
    }

    try {
      this.webhooks.verify(payload, signature);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get repository information
   */
  async getRepositoryInfo(owner: string, repo: string): Promise<any> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    const response = await this.octokit.rest.repos.get({
      owner,
      repo,
    });

    return response.data;
  }

  /**
   * Get user information
   */
  async getUserInfo(): Promise<any> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    const response = await this.octokit.rest.users.getAuthenticated();
    return response.data;
  }

  /**
   * Import repositories from GitHub
   */
  async importRepositories(): Promise<GitHubRepository[]> {
    if (!this.octokit) {
      throw new Error("GitHub manager not initialized");
    }

    const response = await this.octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
    });

    const importedRepos: GitHubRepository[] = [];

    for (const repo of response.data) {
      if (repo.owner && repo.name) {
        const importedRepo = this.addRepository(repo.owner.login, repo.name);
        importedRepos.push(importedRepo);
      }
    }

    return importedRepos;
  }

  /**
   * Export repositories to JSON
   */
  exportRepositories(): GitHubRepository[] {
    return this.getRepositories();
  }

  /**
   * Import repositories from JSON
   */
  importRepositoriesFromJson(repositories: GitHubRepository[]): number {
    let count = 0;
    for (const repo of repositories) {
      this.repositories.set(repo.id, repo);
      count++;
    }
    return count;
  }
}
