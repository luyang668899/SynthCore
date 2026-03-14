import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// 文件类型定义
export interface DropboxFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: "file" | "folder";
  mimeType?: string;
  createdAt: string;
  lastModified: string;
  shared: boolean;
  url?: string;
}

// 上传文件选项
export interface UploadOptions {
  path: string;
  content: string | Buffer;
  overwrite?: boolean;
  shared?: boolean;
}

// 搜索选项
export interface SearchOptions {
  query: string;
  path?: string;
  fileType?: "file" | "folder" | "all";
  maxResults?: number;
}

// Dropbox 存储管理器类
export class DropboxManager {
  private files: Map<string, DropboxFile> = new Map();
  private accessToken: string | null = null;

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
      url: "https://dropbox.com/s/abc123/document.pdf",
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
      url: "https://dropbox.com/s/def456/photo.jpg",
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
    });
  }

  // 认证相关方法
  async authenticate(accessToken: string): Promise<boolean> {
    // 模拟认证
    this.accessToken = accessToken;
    return true;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.accessToken !== null;
  }

  async revokeAuthentication(): Promise<void> {
    this.accessToken = null;
  }

  // 文件操作方法
  async uploadFile(options: UploadOptions): Promise<DropboxFile> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const fileName = options.path.split("/").pop() || "untitled";
    const newFile: DropboxFile = {
      id: uuidv4(),
      name: fileName,
      path: options.path,
      size: typeof options.content === "string" ? options.content.length : options.content.length,
      type: "file",
      mimeType: this.guessMimeType(options.path),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      shared: options.shared || false,
      url: `https://dropbox.com/s/${uuidv4().substring(0, 6)}/${fileName}`,
    };

    this.files.set(newFile.id, newFile);
    return newFile;
  }

  async downloadFile(path: string): Promise<Buffer> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const file = Array.from(this.files.values()).find((f) => f.path === path && f.type === "file");
    if (!file) {
      throw new Error("File not found");
    }

    // 模拟下载，返回一个假的 Buffer
    return Buffer.from(`Content of ${file.name}`);
  }

  async deleteFile(path: string): Promise<boolean> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const file = Array.from(this.files.values()).find((f) => f.path === path);
    if (!file) {
      return false;
    }

    return this.files.delete(file.id);
  }

  async getFileMetadata(path: string): Promise<DropboxFile | null> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    return Array.from(this.files.values()).find((f) => f.path === path) || null;
  }

  // 文件夹操作方法
  async createFolder(path: string): Promise<DropboxFile> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const newFolder: DropboxFile = {
      id: uuidv4(),
      name: path.split("/").pop() || "untitled",
      path: path,
      size: 0,
      type: "folder",
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      shared: false,
    };

    this.files.set(newFolder.id, newFolder);
    return newFolder;
  }

  async listFolder(path: string = "/"): Promise<DropboxFile[]> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    // 确保路径以 '/' 结尾
    const normalizedPath = path.endsWith("/") ? path : `${path}/`;

    return Array.from(this.files.values()).filter((file) => {
      if (file.path === normalizedPath) return true;
      if (file.path.startsWith(normalizedPath)) {
        const relativePath = file.path.substring(normalizedPath.length);
        return !relativePath.includes("/");
      }
      return false;
    });
  }

  async deleteFolder(path: string): Promise<boolean> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const folder = Array.from(this.files.values()).find(
      (f) => f.path === path && f.type === "folder",
    );
    if (!folder) {
      return false;
    }

    // 删除文件夹及其所有内容
    const filesToDelete = Array.from(this.files.values()).filter(
      (f) => f.path === path || f.path.startsWith(`${path}/`),
    );

    filesToDelete.forEach((file) => this.files.delete(file.id));
    return true;
  }

  // 搜索方法
  async search(options: SearchOptions): Promise<DropboxFile[]> {
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
    };

    return mimeTypes[ext || ""] || "application/octet-stream";
  }
}
