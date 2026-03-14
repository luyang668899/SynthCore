import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export interface BitbucketConfig {
  apiToken: string;
  username: string;
}

export interface BitbucketRepository {
  id: string;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  clone_url: string;
}

export interface BitbucketPullRequest {
  id: string;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  author: {
    username: string;
  };
}

export interface BitbucketIssue {
  id: string;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  reporter: {
    username: string;
  };
}

export interface BitbucketNotification {
  id: string;
  subject: string;
  repository: string;
  created_at: string;
  read: boolean;
}

export class BitbucketManager {
  private config: BitbucketConfig;
  private baseUrl: string = "https://api.bitbucket.org/2.0";
  private isAuthenticated: boolean = false;

  constructor(config: BitbucketConfig) {
    this.config = config;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/user`, {
        auth: {
          username: this.config.username,
          password: this.config.apiToken,
        },
      });
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Bitbucket authentication failed:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async listRepositories(): Promise<BitbucketRepository[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Bitbucket");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/repositories/${this.config.username}`, {
        auth: {
          username: this.config.username,
          password: this.config.apiToken,
        },
      });

      return response.data.values.map((repo: any) => ({
        id: repo.uuid,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || "",
        private: repo.is_private,
        clone_url: repo.links.clone.find((link: any) => link.name === "https").href,
      }));
    } catch (error) {
      console.error("Error listing Bitbucket repositories:", error);
      throw error;
    }
  }

  async listPullRequests(owner: string, repo: string): Promise<BitbucketPullRequest[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Bitbucket");
      }
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/repositories/${owner}/${repo}/pullrequests`,
        {
          auth: {
            username: this.config.username,
            password: this.config.apiToken,
          },
        },
      );

      return response.data.values.map((pr: any) => ({
        id: pr.id.toString(),
        title: pr.title,
        description: pr.description || "",
        state: pr.state,
        created_at: pr.created_on,
        updated_at: pr.updated_on,
        author: {
          username: pr.author.username,
        },
      }));
    } catch (error) {
      console.error("Error listing Bitbucket pull requests:", error);
      throw error;
    }
  }

  async listIssues(owner: string, repo: string): Promise<BitbucketIssue[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Bitbucket");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/repositories/${owner}/${repo}/issues`, {
        auth: {
          username: this.config.username,
          password: this.config.apiToken,
        },
      });

      return response.data.values.map((issue: any) => ({
        id: issue.id.toString(),
        title: issue.title,
        description: issue.content.raw || "",
        state: issue.state,
        created_at: issue.created_on,
        updated_at: issue.updated_on,
        reporter: {
          username: issue.reporter.username,
        },
      }));
    } catch (error) {
      console.error("Error listing Bitbucket issues:", error);
      throw error;
    }
  }

  async createIssue(
    owner: string,
    repo: string,
    title: string,
    description: string,
  ): Promise<BitbucketIssue> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Bitbucket");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/repositories/${owner}/${repo}/issues`,
        {
          title,
          content: {
            raw: description,
          },
        },
        {
          auth: {
            username: this.config.username,
            password: this.config.apiToken,
          },
        },
      );

      return {
        id: response.data.id.toString(),
        title: response.data.title,
        description: response.data.content.raw || "",
        state: response.data.state,
        created_at: response.data.created_on,
        updated_at: response.data.updated_on,
        reporter: {
          username: response.data.reporter.username,
        },
      };
    } catch (error) {
      console.error("Error creating Bitbucket issue:", error);
      throw error;
    }
  }

  async commentIssue(owner: string, repo: string, issueId: string, comment: string): Promise<any> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Bitbucket");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/repositories/${owner}/${repo}/issues/${issueId}/comments`,
        {
          content: {
            raw: comment,
          },
        },
        {
          auth: {
            username: this.config.username,
            password: this.config.apiToken,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error commenting on Bitbucket issue:", error);
      throw error;
    }
  }

  async listNotifications(): Promise<BitbucketNotification[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Bitbucket");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/notifications`, {
        auth: {
          username: this.config.username,
          password: this.config.apiToken,
        },
      });

      return response.data.values.map((notification: any) => ({
        id: notification.id.toString(),
        subject: notification.subject.title || "No subject",
        repository: notification.repository.full_name,
        created_at: notification.created_on,
        read: notification.read,
      }));
    } catch (error) {
      console.error("Error listing Bitbucket notifications:", error);
      throw error;
    }
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
