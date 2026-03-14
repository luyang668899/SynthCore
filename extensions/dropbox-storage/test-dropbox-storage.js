// 测试 Dropbox 存储插件
import { DropboxManager } from "./src/dropbox-manager.js";

async function testDropboxStorage() {
  console.log("=== 测试 Dropbox 存储插件 ===\n");

  const dropboxManager = new DropboxManager();

  // 测试 1: 认证功能
  console.log("1. 测试认证功能");
  try {
    // 测试未认证状态
    const isAuthenticatedBefore = await dropboxManager.isAuthenticated();
    console.log("认证前状态:", isAuthenticatedBefore);

    // 测试认证
    const authResult = await dropboxManager.authenticate("test-access-token");
    console.log("认证结果:", authResult);

    // 测试认证后状态
    const isAuthenticatedAfter = await dropboxManager.isAuthenticated();
    console.log("认证后状态:", isAuthenticatedAfter);
  } catch (error) {
    console.error("认证测试错误:", error);
  }

  // 测试 2: 文件操作功能
  console.log("\n2. 测试文件操作功能");
  try {
    // 上传文件
    const uploadedFile = await dropboxManager.uploadFile({
      path: "/test/file.txt",
      content: "Hello, Dropbox!",
      shared: true,
    });
    console.log("上传的文件:", uploadedFile);

    // 获取文件元数据
    const metadata = await dropboxManager.getFileMetadata("/test/file.txt");
    console.log("文件元数据:", metadata);

    // 下载文件
    const content = await dropboxManager.downloadFile("/test/file.txt");
    console.log("下载的文件内容:", content.toString());

    // 删除文件
    const deleteResult = await dropboxManager.deleteFile("/test/file.txt");
    console.log("删除文件结果:", deleteResult);
  } catch (error) {
    console.error("文件操作测试错误:", error);
  }

  // 测试 3: 文件夹操作功能
  console.log("\n3. 测试文件夹操作功能");
  try {
    // 创建文件夹
    const createdFolder = await dropboxManager.createFolder("/test");
    console.log("创建的文件夹:", createdFolder);

    // 列出根目录
    const rootFiles = await dropboxManager.listFolder("/");
    console.log("根目录内容:", rootFiles);

    // 列出测试文件夹
    const testFiles = await dropboxManager.listFolder("/test");
    console.log("测试文件夹内容:", testFiles);
  } catch (error) {
    console.error("文件夹操作测试错误:", error);
  }

  // 测试 4: 搜索功能
  console.log("\n4. 测试搜索功能");
  try {
    // 搜索文件
    const searchResults = await dropboxManager.search({
      query: "document",
      fileType: "file",
    });
    console.log("搜索结果:", searchResults);
  } catch (error) {
    console.error("搜索测试错误:", error);
  }

  // 测试 5: 撤销认证
  console.log("\n5. 测试撤销认证");
  try {
    await dropboxManager.revokeAuthentication();
    const isAuthenticatedAfterRevoke = await dropboxManager.isAuthenticated();
    console.log("撤销认证后状态:", isAuthenticatedAfterRevoke);
  } catch (error) {
    console.error("撤销认证测试错误:", error);
  }

  console.log("\n=== Dropbox 存储插件测试完成 ===");
}

// 运行测试
testDropboxStorage().catch(console.error);
