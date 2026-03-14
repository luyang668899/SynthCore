import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export interface BoxFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: "file" | "folder";
  mimeType?: string;
  createdAt: string;
  lastModified: string;
  shared: boolean;
  webUrl: string;
  permissions: BoxPermission[];
}

export interface BoxPermission {
  role: "owner" | "editor" | "viewer" | "uploader" | "previewer" | "previewer-uploader";
  type: "user" | "group" | "anyone" | "company";
  email?: string;
  name?: string;
  id?: string;
}

export interface BoxSearchOptions {
  query: string;
  fileType?: "file" | "folder";
  sortBy?: "name" | "date" | "size";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

export interface BoxUploadOptions {
  path: string;
  content: string | Buffer;
  shared?: boolean;
  permissions?: BoxPermission[];
}

export class BoxManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private _isAuthenticated: boolean = false;
  private mockFiles: BoxFile[] = [];

  constructor() {
    // 初始化模拟数据
    this.initializeMockData();
  }

  private initializeMockData() {
    this.mockFiles = [
      {
        id: "folder-1",
        name: "Documents",
        path: "/Documents",
        size: 0,
        type: "folder",
        createdAt: "2026-02-28T00:00:00.000Z",
        lastModified: "2026-02-28T00:00:00.000Z",
        shared: false,
        webUrl: "https://app.box.com/folder/FOLDER123",
        permissions: [
          {
            role: "owner",
            type: "user",
            email: "user@example.com",
            name: "Test User",
          },
        ],
      },
      {
        id: "folder-2",
        name: "Photos",
        path: "/Photos",
        size: 0,
        type: "folder",
        createdAt: "2026-02-27T00:00:00.000Z",
        lastModified: "2026-02-27T00:00:00.000Z",
        shared: false,
        webUrl: "https://app.box.com/folder/FOLDER456",
        permissions: [
          {
            role: "owner",
            type: "user",
            email: "user@example.com",
            name: "Test User",
          },
        ],
      },
      {
        id: "file-1",
        name: "document.pdf",
        path: "/Documents/document.pdf",
        size: 1024000,
        type: "file",
        mimeType: "application/pdf",
        createdAt: "2026-03-01T00:00:00.000Z",
        lastModified: "2026-03-02T00:00:00.000Z",
        shared: false,
        webUrl: "https://app.box.com/file/FILE123",
        permissions: [
          {
            role: "owner",
            type: "user",
            email: "user@example.com",
            name: "Test User",
          },
        ],
      },
    ];
  }

  async authenticate(accessToken: string, refreshToken: string): Promise<boolean> {
    try {
      // 模拟认证过程
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this._isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("Box authentication failed:", error);
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return this._isAuthenticated;
  }

  async refreshAccessToken(): Promise<string> {
    try {
      // 模拟刷新令牌
      if (!this.refreshToken) {
        throw new Error("No refresh token available");
      }
      this.accessToken = `new-access-token-${Date.now()}`;
      return this.accessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      throw error;
    }
  }

  async revokeAuthentication(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    this._isAuthenticated = false;
  }

  async uploadFile(options: BoxUploadOptions): Promise<BoxFile> {
    try {
      if (!(await this.isAuthenticated())) {
        throw new Error("Not authenticated");
      }

      const fileId = uuidv4();
      const now = formatISO(new Date());

      const newFile: BoxFile = {
        id: fileId,
        name: options.path.split("/").pop() || "untitled",
        path: options.path,
        size: Buffer.isBuffer(options.content) ? options.content.length : options.content.length,
        type: "file",
        mimeType: this.getMimeType(options.path),
        createdAt: now,
        lastModified: now,
        shared: options.shared || false,
        webUrl: `https://app.box.com/file/${fileId}`,
        permissions: options.permissions || [
          {
            role: "owner",
            type: "user",
            email: "user@example.com",
            name: "Test User",
          },
        ],
      };

      this.mockFiles.push(newFile);
      return newFile;
    } catch (error) {
      console.error("Failed to upload file to Box:", error);
      throw error;
    }
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      if (!(await this.isAuthenticated())) {
        throw new Error("Not authenticated");
      }

      const file = this.mockFiles.find((f) => f.id === fileId && f.type === "file");
      if (!file) {
        throw new Error("File not found");
      }

      // 模拟下载内容
      return Buffer.from(`Content of ${file.name}`);
    } catch (error) {
      console.error("Failed to download file from Box:", error);
      throw error;
    }
  }

  async getFileMetadata(fileId: string): Promise<BoxFile> {
    try {
      if (!(await this.isAuthenticated())) {
        throw new Error("Not authenticated");
      }

      const file = this.mockFiles.find((f) => f.id === fileId);
      if (!file) {
        throw new Error("File not found");
      }

      return file;
    } catch (error) {
      console.error("Failed to get file metadata from Box:", error);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      if (!(await this.isAuthenticated())) {
        throw new Error("Not authenticated");
      }

      const index = this.mockFiles.findIndex((f) => f.id === fileId);
      if (index === -1) {
        throw new Error("File not found");
      }

      this.mockFiles.splice(index, 1);
      return true;
    } catch (error) {
      console.error("Failed to delete file from Box:", error);
      throw error;
    }
  }

  async updateFilePermissions(fileId: string, permissions: BoxPermission[]): Promise<BoxFile> {
    try {
      if (!(await this.isAuthenticated())) {
        throw new Error("Not authenticated");
      }

      const file = this.mockFiles.find((f) => f.id === fileId);
      if (!file) {
        throw new Error("File not found");
      }

      file.permissions = permissions;
      file.shared = permissions.some((p) => p.type === "anyone" || p.type === "company");
      return file;
    } catch (error) {
      console.error("Failed to update file permissions in Box:", error);
      throw error;
    }
  }

  async createFolder(path: string): Promise<BoxFile> {
    try {
      if (!(await this.isAuthenticated())) {
        throw new Error("Not authenticated");
      }

      const folderId = uuidv4();
      const now = formatISO(new Date());

      const newFolder: BoxFile = {
        id: folderId,
        name: path.split("/").pop() || "untitled",
        path: path,
        size: 0,
        type: "folder",
        createdAt: now,
        lastModified: now,
        shared: false,
        webUrl: `https://app.box.com/folder/${folderId}`,
        permissions: [
          {
            role: "owner",
            type: "user",
            email: "user@example.com",
            name: "Test User",
          },
        ],
      };

      this.mockFiles.push(newFolder);
      return newFolder;
    } catch (error) {
      console.error("Failed to create folder in Box:", error);
      throw error;
    }
  }

  async listFolder(folderId: string): Promise<BoxFile[]> {
    try {
      if (!(await this.isAuthenticated())) {
        throw new Error("Not authenticated");
      }

      if (folderId === "root") {
        return this.mockFiles.filter((f) => f.path.split("/").length === 2);
      }

      const folder = this.mockFiles.find((f) => f.id === folderId && f.type === "folder");
      if (!folder) {
        throw new Error("Folder not found");
      }

      return this.mockFiles.filter(
        (f) =>
          f.path.startsWith(`${folder.path}/`) &&
          f.path.split("/").length === folder.path.split("/").length + 1,
      );
    } catch (error) {
      console.error("Failed to list folder in Box:", error);
      throw error;
    }
  }

  async search(options: BoxSearchOptions): Promise<BoxFile[]> {
    try {
      if (!(await this.isAuthenticated())) {
        throw new Error("Not authenticated");
      }

      let results = this.mockFiles.filter((file) => {
        if (options.fileType && file.type !== options.fileType) {
          return false;
        }
        return (
          file.name.toLowerCase().includes(options.query.toLowerCase()) ||
          file.path.toLowerCase().includes(options.query.toLowerCase())
        );
      });

      // 排序
      if (options.sortBy) {
        results.sort((a, b) => {
          let aValue: string | number;
          let bValue: string | number;

          switch (options.sortBy) {
            case "name":
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case "date":
              aValue = new Date(a.lastModified).getTime();
              bValue = new Date(b.lastModified).getTime();
              break;
            case "size":
              aValue = a.size;
              bValue = b.size;
              break;
            default:
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
          }

          if (aValue < bValue) {
            return options.sortOrder === "desc" ? 1 : -1;
          }
          if (aValue > bValue) {
            return options.sortOrder === "desc" ? -1 : 1;
          }
          return 0;
        });
      }

      // 限制结果数量
      if (options.limit) {
        results = results.slice(0, options.limit);
      }

      return results;
    } catch (error) {
      console.error("Failed to search in Box:", error);
      throw error;
    }
  }

  private getMimeType(path: string): string {
    const extension = path.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      txt: "text/plain",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      zip: "application/zip",
      rar: "application/x-rar-compressed",
      json: "application/json",
      xml: "application/xml",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      ts: "application/typescript",
    };

    return mimeTypes[extension || ""] || "application/octet-stream";
  }
}
