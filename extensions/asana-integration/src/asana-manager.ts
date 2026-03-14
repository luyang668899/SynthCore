import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export interface AsanaConfig {
  personalAccessToken: string;
}

export interface AsanaWorkspace {
  id: string;
  name: string;
  is_organization: boolean;
}

export interface AsanaProject {
  id: string;
  name: string;
  notes: string;
  archived: boolean;
  workspace: {
    id: string;
    name: string;
  };
}

export interface AsanaTask {
  id: string;
  name: string;
  notes: string;
  completed: boolean;
  due_at?: string;
  assignee?: {
    id: string;
    name: string;
  };
  project_ids: string[];
  workspace: {
    id: string;
  };
}

export interface AsanaComment {
  id: string;
  text: string;
  created_at: string;
  created_by: {
    id: string;
    name: string;
  };
}

export interface AsanaNotification {
  id: string;
  type: string;
  created_at: string;
  read: boolean;
  resource: {
    id: string;
    name: string;
    resource_type: string;
  };
}

export class AsanaManager {
  private config: AsanaConfig;
  private baseUrl: string = "https://app.asana.com/api/1.0";
  private isAuthenticated: boolean = false;

  constructor(config: AsanaConfig) {
    this.config = config;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${this.config.personalAccessToken}`,
          "Content-Type": "application/json",
        },
      });
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Asana authentication failed:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async listWorkspaces(): Promise<AsanaWorkspace[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Asana");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/workspaces`, {
        headers: {
          Authorization: `Bearer ${this.config.personalAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error listing Asana workspaces:", error);
      throw error;
    }
  }

  async listProjects(workspaceId: string): Promise<AsanaProject[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Asana");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/projects`, {
        headers: {
          Authorization: `Bearer ${this.config.personalAccessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          workspace: workspaceId,
          opt_fields: "id,name,notes,archived,workspace.name",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error listing Asana projects:", error);
      throw error;
    }
  }

  async listTasks(projectId: string): Promise<AsanaTask[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Asana");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${this.config.personalAccessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          project: projectId,
          opt_fields: "id,name,notes,completed,due_at,assignee.name,project_ids,workspace.id",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error listing Asana tasks:", error);
      throw error;
    }
  }

  async createTask(
    projectId: string,
    name: string,
    notes: string = "",
    dueAt?: string,
    assigneeId?: string,
  ): Promise<AsanaTask> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Asana");
      }
    }

    try {
      const data: any = {
        data: {
          name,
          notes,
          projects: [projectId],
        },
      };

      if (dueAt) {
        data.data.due_at = dueAt;
      }

      if (assigneeId) {
        data.data.assignee = assigneeId;
      }

      const response = await axios.post(`${this.baseUrl}/tasks`, data, {
        headers: {
          Authorization: `Bearer ${this.config.personalAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error creating Asana task:", error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<AsanaTask>): Promise<AsanaTask> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Asana");
      }
    }

    try {
      const data = {
        data: updates,
      };

      const response = await axios.put(`${this.baseUrl}/tasks/${taskId}`, data, {
        headers: {
          Authorization: `Bearer ${this.config.personalAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error updating Asana task:", error);
      throw error;
    }
  }

  async commentTask(taskId: string, text: string): Promise<AsanaComment> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Asana");
      }
    }

    try {
      const data = {
        data: {
          text,
        },
      };

      const response = await axios.post(`${this.baseUrl}/tasks/${taskId}/stories`, data, {
        headers: {
          Authorization: `Bearer ${this.config.personalAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error commenting on Asana task:", error);
      throw error;
    }
  }

  async listNotifications(): Promise<AsanaNotification[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Asana");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/users/me/notifications`, {
        headers: {
          Authorization: `Bearer ${this.config.personalAccessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          opt_fields: "id,type,created_at,read,resource.id,resource.name,resource.resource_type",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error listing Asana notifications:", error);
      throw error;
    }
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
