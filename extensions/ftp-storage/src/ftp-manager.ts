import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export interface FtpFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: "file" | "folder";
  mimeType?: string;
  createdAt: string;
  lastModified: string;
  permissions?: string;
  owner?: string;
  group?: string;
}

export interface FtpSearchOptions {
  query: string;
  fileType?: "file" | "folder";
  sortBy?: "name" | "date" | "size";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

export interface FtpUploadOptions {
  path: string;
  content: string | Buffer;
  permissions?: string;
}

export interface FtpConnectionOptions {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  type: "ftp" | "sftp";
  secure?: boolean;
}

export class FtpManager {
  private connectionOptions: FtpConnectionOptions | null = null;
  private _isConnected: boolean = false;
  private mockFiles: FtpFile[] = [];

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
        permissions: "drwxr-xr-x",
        owner: "user",
        group: "users",
      },
      {
        id: "folder-2",
        name: "Photos",
        path: "/Photos",
        size: 0,
        type: "folder",
        createdAt: "2026-02-27T00:00:00.000Z",
        lastModified: "2026-02-27T00:00:00.000Z",
        permissions: "drwxr-xr-x",
        owner: "user",
        group: "users",
      },
      {
        id: "file-1",
        name: "document.txt",
        path: "/Documents/document.txt",
        size: 1024,
        type: "file",
        mimeType: "text/plain",
        createdAt: "2026-03-01T00:00:00.000Z",
        lastModified: "2026-03-02T00:00:00.000Z",
        permissions: "-rw-r--r--",
        owner: "user",
        group: "users",
      },
    ];
  }

  async connect(options: FtpConnectionOptions): Promise<boolean> {
    try {
      // 模拟连接过程
      this.connectionOptions = options;
      this._isConnected = true;
      return true;
    } catch (error) {
      console.error("FTP/SFTP connection failed:", error);
      return false;
    }
  }

  async isConnected(): Promise<boolean> {
    return this._isConnected;
  }

  async disconnect(): Promise<void> {
    this.connectionOptions = null;
    this._isConnected = false;
  }

  async uploadFile(options: FtpUploadOptions): Promise<FtpFile> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
      }

      const fileId = uuidv4();
      const now = formatISO(new Date());

      const newFile: FtpFile = {
        id: fileId,
        name: options.path.split("/").pop() || "untitled",
        path: options.path,
        size: Buffer.isBuffer(options.content) ? options.content.length : options.content.length,
        type: "file",
        mimeType: this.getMimeType(options.path),
        createdAt: now,
        lastModified: now,
        permissions: options.permissions || "-rw-r--r--",
        owner: "user",
        group: "users",
      };

      this.mockFiles.push(newFile);
      return newFile;
    } catch (error) {
      console.error("Failed to upload file via FTP/SFTP:", error);
      throw error;
    }
  }

  async downloadFile(path: string): Promise<Buffer> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
      }

      const file = this.mockFiles.find((f) => f.path === path && f.type === "file");
      if (!file) {
        throw new Error("File not found");
      }

      // 模拟下载内容
      return Buffer.from(`Content of ${file.name}`);
    } catch (error) {
      console.error("Failed to download file via FTP/SFTP:", error);
      throw error;
    }
  }

  async getFileMetadata(path: string): Promise<FtpFile> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
      }

      const file = this.mockFiles.find((f) => f.path === path);
      if (!file) {
        throw new Error("File not found");
      }

      return file;
    } catch (error) {
      console.error("Failed to get file metadata via FTP/SFTP:", error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<boolean> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
      }

      const index = this.mockFiles.findIndex((f) => f.path === path);
      if (index === -1) {
        throw new Error("File not found");
      }

      this.mockFiles.splice(index, 1);
      return true;
    } catch (error) {
      console.error("Failed to delete file via FTP/SFTP:", error);
      throw error;
    }
  }

  async createFolder(path: string): Promise<FtpFile> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
      }

      const folderId = uuidv4();
      const now = formatISO(new Date());

      const newFolder: FtpFile = {
        id: folderId,
        name: path.split("/").pop() || "untitled",
        path: path,
        size: 0,
        type: "folder",
        createdAt: now,
        lastModified: now,
        permissions: "drwxr-xr-x",
        owner: "user",
        group: "users",
      };

      this.mockFiles.push(newFolder);
      return newFolder;
    } catch (error) {
      console.error("Failed to create folder via FTP/SFTP:", error);
      throw error;
    }
  }

  async listFolder(path: string): Promise<FtpFile[]> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
      }

      if (path === "/") {
        return this.mockFiles.filter((f) => f.path.split("/").length === 2);
      }

      return this.mockFiles.filter(
        (f) =>
          f.path.startsWith(`${path}/`) && f.path.split("/").length === path.split("/").length + 1,
      );
    } catch (error) {
      console.error("Failed to list folder via FTP/SFTP:", error);
      throw error;
    }
  }

  async search(options: FtpSearchOptions): Promise<FtpFile[]> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
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
      console.error("Failed to search via FTP/SFTP:", error);
      throw error;
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<FtpFile> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
      }

      const file = this.mockFiles.find((f) => f.path === oldPath);
      if (!file) {
        throw new Error("File not found");
      }

      file.path = newPath;
      file.name = newPath.split("/").pop() || "untitled";
      file.lastModified = formatISO(new Date());

      return file;
    } catch (error) {
      console.error("Failed to rename file via FTP/SFTP:", error);
      throw error;
    }
  }

  async changePermissions(path: string, permissions: string): Promise<FtpFile> {
    try {
      if (!this._isConnected) {
        throw new Error("Not connected");
      }

      const file = this.mockFiles.find((f) => f.path === path);
      if (!file) {
        throw new Error("File not found");
      }

      file.permissions = permissions;
      file.lastModified = formatISO(new Date());

      return file;
    } catch (error) {
      console.error("Failed to change permissions via FTP/SFTP:", error);
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
