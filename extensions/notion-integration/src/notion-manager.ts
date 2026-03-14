import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export interface NotionConfig {
  apiKey: string;
}

export interface NotionWorkspace {
  id: string;
  name: string;
  icon?: string;
  cover?: string;
}

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  last_edited_time: string;
  created_time: string;
  parent: {
    type: string;
    page_id?: string;
    database_id?: string;
    workspace?: boolean;
  };
}

export interface NotionDatabase {
  id: string;
  title: string;
  url: string;
  last_edited_time: string;
  created_time: string;
}

export interface NotionNotification {
  id: string;
  type: string;
  created_at: string;
  read: boolean;
  database_id?: string;
  page_id?: string;
  block_id?: string;
  user_id?: string;
}

export class NotionManager {
  private config: NotionConfig;
  private baseUrl: string = "https://api.notion.com/v1";
  private isAuthenticated: boolean = false;

  constructor(config: NotionConfig) {
    this.config = config;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      });
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Notion authentication failed:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async listWorkspaces(): Promise<NotionWorkspace[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Notion");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/workspaces`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      });

      return response.data.results.map((workspace: any) => ({
        id: workspace.id,
        name: workspace.name,
        icon: workspace.icon,
        cover: workspace.cover,
      }));
    } catch (error) {
      console.error("Error listing Notion workspaces:", error);
      throw error;
    }
  }

  async listPages(workspaceId?: string): Promise<NotionPage[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Notion");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/search`,
        {
          filter: {
            property: "object",
            value: "page",
          },
          sort: {
            direction: "descending",
            timestamp: "last_edited_time",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.results.map((page: any) => ({
        id: page.id,
        title: page.properties.title?.title[0]?.plain_text || "Untitled",
        url: page.url,
        last_edited_time: page.last_edited_time,
        created_time: page.created_time,
        parent: page.parent,
      }));
    } catch (error) {
      console.error("Error listing Notion pages:", error);
      throw error;
    }
  }

  async createPage(parentId: string, title: string, content: any[] = []): Promise<NotionPage> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Notion");
      }
    }

    try {
      const data = {
        parent: {
          page_id: parentId,
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
        },
        children: content,
      };

      const response = await axios.post(`${this.baseUrl}/pages`, data, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      });

      return {
        id: response.data.id,
        title: response.data.properties.title?.title[0]?.plain_text || "Untitled",
        url: response.data.url,
        last_edited_time: response.data.last_edited_time,
        created_time: response.data.created_time,
        parent: response.data.parent,
      };
    } catch (error) {
      console.error("Error creating Notion page:", error);
      throw error;
    }
  }

  async updatePage(pageId: string, updates: any): Promise<NotionPage> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Notion");
      }
    }

    try {
      const response = await axios.patch(`${this.baseUrl}/pages/${pageId}`, updates, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      });

      return {
        id: response.data.id,
        title: response.data.properties.title?.title[0]?.plain_text || "Untitled",
        url: response.data.url,
        last_edited_time: response.data.last_edited_time,
        created_time: response.data.created_time,
        parent: response.data.parent,
      };
    } catch (error) {
      console.error("Error updating Notion page:", error);
      throw error;
    }
  }

  async listDatabases(): Promise<NotionDatabase[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Notion");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/search`,
        {
          filter: {
            property: "object",
            value: "database",
          },
          sort: {
            direction: "descending",
            timestamp: "last_edited_time",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.results.map((database: any) => ({
        id: database.id,
        title: database.title[0]?.plain_text || "Untitled",
        url: database.url,
        last_edited_time: database.last_edited_time,
        created_time: database.created_time,
      }));
    } catch (error) {
      console.error("Error listing Notion databases:", error);
      throw error;
    }
  }

  async queryDatabase(databaseId: string, filter?: any, sorts?: any[]): Promise<any[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Notion");
      }
    }

    try {
      const data: any = {};
      if (filter) data.filter = filter;
      if (sorts) data.sorts = sorts;

      const response = await axios.post(`${this.baseUrl}/databases/${databaseId}/query`, data, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      });

      return response.data.results;
    } catch (error) {
      console.error("Error querying Notion database:", error);
      throw error;
    }
  }

  async listNotifications(): Promise<NotionNotification[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Notion");
      }
    }

    try {
      // Notion API doesn't provide a direct notifications endpoint
      // This is a placeholder implementation
      console.warn("Notion notifications API is not directly available. Returning mock data.");

      return [
        {
          id: "1",
          type: "comment",
          created_at: new Date().toISOString(),
          read: false,
          page_id: "page-123",
        },
        {
          id: "2",
          type: "mention",
          created_at: new Date().toISOString(),
          read: true,
          page_id: "page-456",
        },
      ];
    } catch (error) {
      console.error("Error listing Notion notifications:", error);
      throw error;
    }
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
