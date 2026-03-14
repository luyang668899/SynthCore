import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export interface TrelloConfig {
  apiKey: string;
  token: string;
}

export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  closed: boolean;
  url: string;
  idOrganization?: string;
}

export interface TrelloList {
  id: string;
  name: string;
  closed: boolean;
  idBoard: string;
  pos: number;
}

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  closed: boolean;
  idBoard: string;
  idList: string;
  url: string;
  due?: string;
  completed?: boolean;
}

export interface TrelloComment {
  id: string;
  idCard: string;
  text: string;
  date: string;
  idMemberCreator: string;
}

export interface TrelloNotification {
  id: string;
  type: string;
  date: string;
  data: {
    board?: { name: string; id: string };
    list?: { name: string; id: string };
    card?: { name: string; id: string };
    text?: string;
  };
  read: boolean;
}

export class TrelloManager {
  private config: TrelloConfig;
  private baseUrl: string = "https://api.trello.com/1";
  private isAuthenticated: boolean = false;

  constructor(config: TrelloConfig) {
    this.config = config;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/members/me`, {
        params: {
          key: this.config.apiKey,
          token: this.config.token,
        },
      });
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Trello authentication failed:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async listBoards(): Promise<TrelloBoard[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Trello");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/members/me/boards`, {
        params: {
          key: this.config.apiKey,
          token: this.config.token,
          fields: "id,name,desc,closed,url,idOrganization",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error listing Trello boards:", error);
      throw error;
    }
  }

  async listLists(boardId: string): Promise<TrelloList[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Trello");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/boards/${boardId}/lists`, {
        params: {
          key: this.config.apiKey,
          token: this.config.token,
          fields: "id,name,closed,idBoard,pos",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error listing Trello lists:", error);
      throw error;
    }
  }

  async listCards(listId: string): Promise<TrelloCard[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Trello");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/lists/${listId}/cards`, {
        params: {
          key: this.config.apiKey,
          token: this.config.token,
          fields: "id,name,desc,closed,idBoard,idList,url,due,completed",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error listing Trello cards:", error);
      throw error;
    }
  }

  async createCard(
    listId: string,
    name: string,
    desc: string = "",
    due?: string,
  ): Promise<TrelloCard> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Trello");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/cards`,
        {
          idList: listId,
          name,
          desc,
          due,
        },
        {
          params: {
            key: this.config.apiKey,
            token: this.config.token,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error creating Trello card:", error);
      throw error;
    }
  }

  async updateCard(cardId: string, updates: Partial<TrelloCard>): Promise<TrelloCard> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Trello");
      }
    }

    try {
      const response = await axios.put(`${this.baseUrl}/cards/${cardId}`, updates, {
        params: {
          key: this.config.apiKey,
          token: this.config.token,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating Trello card:", error);
      throw error;
    }
  }

  async commentCard(cardId: string, text: string): Promise<TrelloComment> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Trello");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/cards/${cardId}/actions/comments`,
        {
          text,
        },
        {
          params: {
            key: this.config.apiKey,
            token: this.config.token,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error commenting on Trello card:", error);
      throw error;
    }
  }

  async listNotifications(): Promise<TrelloNotification[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Trello");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/members/me/notifications`, {
        params: {
          key: this.config.apiKey,
          token: this.config.token,
          fields: "id,type,date,data,read",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error listing Trello notifications:", error);
      throw error;
    }
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
