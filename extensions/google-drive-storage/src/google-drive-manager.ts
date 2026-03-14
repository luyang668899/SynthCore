import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// 文件类型定义
export interface GoogleDriveFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: "file" | "folder";
  mimeType?: string;
  createdAt: string;
  lastModified: string;
  shared: boolean;
  permissions: {
    role: "owner" | "writer" | "reader";
    type: "user" | "group" | "domain" | "anyone";
    emailAddress?: string;
  }[];
  url?: string;
}

// 上传文件选项
export interface UploadOptions {
  path: string;
  content: string | Buffer;
  overwrite?: boolean;
  shared?: boolean;
  permissions?: {
    role: "owner" | "writer" | "reader";
    type: "user" | "group" | "domain" | "anyone";
    emailAddress?: string;
  }[];
}

// 搜索选项
export interface SearchOptions {
  query: string;
  path?: string;
  fileType?: "file" | "folder" | "all";
  maxResults?: number;
}

// Google Drive 存储管理器类
export class GoogleDriveManager {
  private files: Map<string, GoogleDriveFile> = new Map();
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // 初始化模拟数据
    this.initializeMockData();
  }

  // 初始化模拟数据
  private initializeMockData() {
    // 模拟文件数据
    this.files.set("file-1", {
      id: "file-1",
      name: "document.pdf",
      path: "/Documents/document.pdf",
      size: 1024000,
      type: "file",
      mimeType: "application/pdf",
      createdAt: new Date("2026-03-01").toISOString(),
      lastModified: new Date("2026-03-02").toISOString(),
      shared: false,
      permissions: [
        {
          role: "owner",
          type: "user",
          emailAddress: "user@example.com",
        },
      ],
      url: "https://drive.google.com/file/d/file-1/view",
    });

    this.files.set("file-2", {
      id: "file-2",
      name: "photo.jpg",
      path: "/Photos/photo.jpg",
      size: 2048000,
      type: "file",
      mimeType: "image/jpeg",
      createdAt: new Date("2026-03-03").toISOString(),
      lastModified: new Date("2026-03-03").toISOString(),
      shared: true,
      permissions: [
        {
          role: "owner",
          type: "user",
          emailAddress: "user@example.com",
        },
        {
          role: "reader",
          type: "anyone",
        },
      ],
      url: "https://drive.google.com/file/d/file-2/view",
    });

    this.files.set("folder-1", {
      id: "folder-1",
      name: "Documents",
      path: "/Documents",
      size: 0,
      type: "folder",
      createdAt: new Date("2026-02-28").toISOString(),
      lastModified: new Date("2026-02-28").toISOString(),
      shared: false,
      permissions: [
        {
          role: "owner",
          type: "user",
          emailAddress: "user@example.com",
        },
      ],
    });

    this.files.set("folder-2", {
      id: "folder-2",
      name: "Photos",
      path: "/Photos",
      size: 0,
      type: "folder",
      createdAt: new Date("2026-02-27").toISOString(),
      lastModified: new Date("2026-02-27").toISOString(),
      shared: false,
      permissions: [
        {
          role: "owner",
          type: "user",
          emailAddress: "user@example.com",
        },
      ],
    });
  }

  // 认证相关方法
  async authenticate(accessToken: string, refreshToken?: string): Promise<boolean> {
    // 模拟认证
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
    return true;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.accessToken !== null;
  }

  async revokeAuthentication(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
  }

  async refreshAccessToken(): Promise<string | null> {
    // 模拟刷新令牌
    if (this.refreshToken) {
      this.accessToken = `new-access-token-${Date.now()}`;
      return this.accessToken;
    }
    return null;
  }

  // 文件操作方法
  async uploadFile(options: UploadOptions): Promise<GoogleDriveFile> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const fileName = options.path.split("/").pop() || "untitled";
    const fileId = uuidv4();
    const newFile: GoogleDriveFile = {
      id: fileId,
      name: fileName,
      path: options.path,
      size: typeof options.content === "string" ? options.content.length : options.content.length,
      type: "file",
      mimeType: this.guessMimeType(options.path),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      shared: options.shared || false,
      permissions: options.permissions || [
        {
          role: "owner",
          type: "user",
          emailAddress: "user@example.com",
        },
      ],
      url: `https://drive.google.com/file/d/${fileId}/view`,
    };

    this.files.set(newFile.id, newFile);
    return newFile;
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const file = this.files.get(fileId);
    if (!file || file.type !== "file") {
      throw new Error("File not found");
    }

    // 模拟下载，返回一个假的 Buffer
    return Buffer.from(`Content of ${file.name}`);
  }

  async deleteFile(fileId: string): Promise<boolean> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    return this.files.delete(fileId);
  }

  async getFileMetadata(fileId: string): Promise<GoogleDriveFile | null> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    return this.files.get(fileId) || null;
  }

  async updateFilePermissions(
    fileId: string,
    permissions: {
      role: "owner" | "writer" | "reader";
      type: "user" | "group" | "domain" | "anyone";
      emailAddress?: string;
    }[],
  ): Promise<GoogleDriveFile | null> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const file = this.files.get(fileId);
    if (!file) {
      return null;
    }

    file.permissions = permissions;
    file.shared = permissions.some((p) => p.type === "anyone" || p.type === "domain");
    file.lastModified = new Date().toISOString();

    this.files.set(fileId, file);
    return file;
  }

  // 文件夹操作方法
  async createFolder(path: string): Promise<GoogleDriveFile> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const folderName = path.split("/").pop() || "untitled";
    const newFolder: GoogleDriveFile = {
      id: uuidv4(),
      name: folderName,
      path: path,
      size: 0,
      type: "folder",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      shared: false,
      permissions: [
        {
          role: "owner",
          type: "user",
          emailAddress: "user@example.com",
        },
      ],
    };

    this.files.set(newFolder.id, newFolder);
    return newFolder;
  }

  async listFolder(folderId: string = "root"): Promise<GoogleDriveFile[]> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    // 处理根目录
    if (folderId === "root") {
      return Array.from(this.files.values()).filter((file) => {
        const pathParts = file.path.split("/");
        return pathParts.length === 2 && pathParts[0] === "";
      });
    }

    // 处理普通文件夹
    const folder = Array.from(this.files.values()).find(
      (f) => f.id === folderId && f.type === "folder",
    );
    if (!folder) {
      return [];
    }

    const folderPath = folder.path;
    return Array.from(this.files.values()).filter((file) => {
      if (file.path === folderPath) return false;
      if (file.path.startsWith(`${folderPath}/`)) {
        const relativePath = file.path.substring(folderPath.length + 1);
        return !relativePath.includes("/");
      }
      return false;
    });
  }

  async deleteFolder(folderId: string): Promise<boolean> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const folder = this.files.get(folderId);
    if (!folder || folder.type !== "folder") {
      return false;
    }

    // 删除文件夹及其所有内容
    const filesToDelete = Array.from(this.files.values()).filter(
      (f) => f.id === folderId || f.path.startsWith(`${folder.path}/`),
    );

    filesToDelete.forEach((file) => this.files.delete(file.id));
    return true;
  }

  // 搜索方法
  async search(options: SearchOptions): Promise<GoogleDriveFile[]> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const { query, path = "/", fileType = "all", maxResults = 10 } = options;
    const normalizedPath = path.endsWith("/") ? path : `${path}/`;

    let results = Array.from(this.files.values()).filter((file) => {
      if (!file.path.startsWith(normalizedPath)) return false;
      if (fileType !== "all" && file.type !== fileType) return false;
      return file.name.toLowerCase().includes(query.toLowerCase());
    });

    return results.slice(0, maxResults);
  }

  // 辅助方法：根据文件扩展名猜测 MIME 类型
  private guessMimeType(path: string): string {
    const ext = path.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      txt: "text/plain",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      json: "application/json",
      js: "application/javascript",
      ts: "application/typescript",
      html: "text/html",
      css: "text/css",
      md: "text/markdown",
      zip: "application/zip",
      rar: "application/x-rar-compressed",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
    };

    return mimeTypes[ext || ""] || "application/octet-stream";
  }
}
