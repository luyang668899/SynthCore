import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export interface JiraConfig {
  apiToken: string;
  email: string;
  baseUrl: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  description: string;
  lead: {
    displayName: string;
    emailAddress: string;
  };
}

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description: string;
  status: {
    name: string;
    statusCategory: {
      name: string;
    };
  };
  assignee: {
    displayName: string;
    emailAddress: string;
  } | null;
  created: string;
  updated: string;
}

export interface JiraNotification {
  id: string;
  title: string;
  body: string;
  created: string;
  read: boolean;
  issueKey?: string;
}

export class JiraManager {
  private config: JiraConfig;
  private baseUrl: string;
  private isAuthenticated: boolean = false;

  constructor(config: JiraConfig) {
    this.config = config;
    this.baseUrl = `${config.baseUrl}/rest/api/3`;
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/myself`, {
        auth: {
          username: this.config.email,
          password: this.config.apiToken,
        },
      });
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Jira authentication failed:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async listProjects(): Promise<JiraProject[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Jira");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/project`, {
        auth: {
          username: this.config.email,
          password: this.config.apiToken,
        },
      });

      return response.data.map((project: any) => ({
        id: project.id,
        key: project.key,
        name: project.name,
        description: project.description || "",
        lead: project.lead
          ? {
              displayName: project.lead.displayName,
              emailAddress: project.lead.emailAddress,
            }
          : {
              displayName: "Unassigned",
              emailAddress: "",
            },
      }));
    } catch (error) {
      console.error("Error listing Jira projects:", error);
      throw error;
    }
  }

  async listIssues(projectKey: string): Promise<JiraIssue[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Jira");
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        auth: {
          username: this.config.email,
          password: this.config.apiToken,
        },
        params: {
          jql: `project = ${projectKey}`,
          maxResults: 50,
        },
      });

      return response.data.issues.map((issue: any) => ({
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description || "",
        status: {
          name: issue.fields.status.name,
          statusCategory: {
            name: issue.fields.status.statusCategory.name,
          },
        },
        assignee: issue.fields.assignee
          ? {
              displayName: issue.fields.assignee.displayName,
              emailAddress: issue.fields.assignee.emailAddress,
            }
          : null,
        created: issue.fields.created,
        updated: issue.fields.updated,
      }));
    } catch (error) {
      console.error("Error listing Jira issues:", error);
      throw error;
    }
  }

  async createIssue(
    projectKey: string,
    summary: string,
    description: string,
    issueType: string = "Task",
  ): Promise<JiraIssue> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Jira");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/issue`,
        {
          fields: {
            project: {
              key: projectKey,
            },
            summary,
            description: {
              type: "doc",
              version: 1,
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: description,
                    },
                  ],
                },
              ],
            },
            issuetype: {
              name: issueType,
            },
          },
        },
        {
          auth: {
            username: this.config.email,
            password: this.config.apiToken,
          },
        },
      );

      const issue = response.data;
      return {
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description || "",
        status: {
          name: issue.fields.status.name,
          statusCategory: {
            name: issue.fields.status.statusCategory.name,
          },
        },
        assignee: issue.fields.assignee
          ? {
              displayName: issue.fields.assignee.displayName,
              emailAddress: issue.fields.assignee.emailAddress,
            }
          : null,
        created: issue.fields.created,
        updated: issue.fields.updated,
      };
    } catch (error) {
      console.error("Error creating Jira issue:", error);
      throw error;
    }
  }

  async updateIssue(issueKey: string, updates: Partial<JiraIssue>): Promise<JiraIssue> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Jira");
      }
    }

    try {
      const fields: any = {};

      if (updates.summary) {
        fields.summary = updates.summary;
      }

      if (updates.description) {
        fields.description = {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: updates.description,
                },
              ],
            },
          ],
        };
      }

      if (updates.status) {
        fields.status = {
          name: updates.status.name,
        };
      }

      const response = await axios.put(
        `${this.baseUrl}/issue/${issueKey}`,
        {
          fields,
        },
        {
          auth: {
            username: this.config.email,
            password: this.config.apiToken,
          },
        },
      );

      // Get the updated issue
      const issueResponse = await axios.get(`${this.baseUrl}/issue/${issueKey}`, {
        auth: {
          username: this.config.email,
          password: this.config.apiToken,
        },
      });

      const issue = issueResponse.data;
      return {
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description || "",
        status: {
          name: issue.fields.status.name,
          statusCategory: {
            name: issue.fields.status.statusCategory.name,
          },
        },
        assignee: issue.fields.assignee
          ? {
              displayName: issue.fields.assignee.displayName,
              emailAddress: issue.fields.assignee.emailAddress,
            }
          : null,
        created: issue.fields.created,
        updated: issue.fields.updated,
      };
    } catch (error) {
      console.error("Error updating Jira issue:", error);
      throw error;
    }
  }

  async commentIssue(issueKey: string, comment: string): Promise<any> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Jira");
      }
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/issue/${issueKey}/comment`,
        {
          body: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: comment,
                  },
                ],
              },
            ],
          },
        },
        {
          auth: {
            username: this.config.email,
            password: this.config.apiToken,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error commenting on Jira issue:", error);
      throw error;
    }
  }

  async listNotifications(): Promise<JiraNotification[]> {
    if (!this.isAuthenticated) {
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Not authenticated with Jira");
      }
    }

    try {
      // Jira doesn't have a direct notifications API endpoint
      // This is a placeholder implementation
      console.warn("Jira notifications API is not directly available. Returning mock data.");

      return [
        {
          id: "1",
          title: "Issue Assigned",
          body: "You have been assigned to issue PROJ-123",
          created: new Date().toISOString(),
          read: false,
          issueKey: "PROJ-123",
        },
        {
          id: "2",
          title: "Issue Updated",
          body: "Issue PROJ-456 has been updated",
          created: new Date().toISOString(),
          read: true,
          issueKey: "PROJ-456",
        },
      ];
    } catch (error) {
      console.error("Error listing Jira notifications:", error);
      throw error;
    }
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
