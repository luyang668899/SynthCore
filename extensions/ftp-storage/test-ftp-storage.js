// 测试 FTP/SFTP 存储插件
import { FtpManager } from "./src/ftp-manager.ts";

async function testFtpStorage() {
  console.log("=== 测试 FTP/SFTP 存储插件 ===\n");

  const ftpManager = new FtpManager();

  // 测试 1: 连接功能
  console.log("1. 测试连接功能");
  try {
    // 测试未连接状态
    const isConnectedBefore = await ftpManager.isConnected();
    console.log("连接前状态:", isConnectedBefore);

    // 测试连接
    const connectResult = await ftpManager.connect({
      host: "ftp.example.com",
      port: 21,
      username: "testuser",
      password: "testpass",
      type: "ftp",
      secure: false,
    });
    console.log("连接结果:", connectResult);

    // 测试连接后状态
    const isConnectedAfter = await ftpManager.isConnected();
    console.log("连接后状态:", isConnectedAfter);
  } catch (error) {
    console.error("连接测试错误:", error);
  }

  // 测试 2: 文件操作功能
  console.log("\n2. 测试文件操作功能");
  try {
    // 上传文件
    const uploadedFile = await ftpManager.uploadFile({
      path: "/test/file.txt",
      content: "Hello, FTP!",
      permissions: "-rw-r--r--",
    });
    console.log("上传的文件:", uploadedFile);

    // 获取文件元数据
    const metadata = await ftpManager.getFileMetadata("/test/file.txt");
    console.log("文件元数据:", metadata);

    // 下载文件
    const content = await ftpManager.downloadFile("/test/file.txt");
    console.log("下载的文件内容:", content.toString());

    // 重命名文件
    const renamedFile = await ftpManager.renameFile("/test/file.txt", "/test/renamed-file.txt");
    console.log("重命名后的文件:", renamedFile);

    // 修改文件权限
    const permissionFile = await ftpManager.changePermissions(
      "/test/renamed-file.txt",
      "-rwxr-xr-x",
    );
    console.log("修改权限后的文件:", permissionFile);

    // 删除文件
    const deleteResult = await ftpManager.deleteFile("/test/renamed-file.txt");
    console.log("删除文件结果:", deleteResult);
  } catch (error) {
    console.error("文件操作测试错误:", error);
  }

  // 测试 3: 文件夹操作功能
  console.log("\n3. 测试文件夹操作功能");
  try {
    // 创建文件夹
    const createdFolder = await ftpManager.createFolder("/test");
    console.log("创建的文件夹:", createdFolder);

    // 列出根目录
    const rootFiles = await ftpManager.listFolder("/");
    console.log("根目录内容:", rootFiles);

    // 列出测试文件夹
    const testFiles = await ftpManager.listFolder("/test");
    console.log("测试文件夹内容:", testFiles);
  } catch (error) {
    console.error("文件夹操作测试错误:", error);
  }

  // 测试 4: 搜索功能
  console.log("\n4. 测试搜索功能");
  try {
    // 搜索文件
    const searchResults = await ftpManager.search({
      query: "document",
      fileType: "file",
    });
    console.log("搜索结果:", searchResults);
  } catch (error) {
    console.error("搜索测试错误:", error);
  }

  // 测试 5: 断开连接
  console.log("\n5. 测试断开连接");
  try {
    await ftpManager.disconnect();
    const isConnectedAfterDisconnect = await ftpManager.isConnected();
    console.log("断开连接后状态:", isConnectedAfterDisconnect);
  } catch (error) {
    console.error("断开连接测试错误:", error);
  }

  console.log("\n=== FTP/SFTP 存储插件测试完成 ===");
}

// 运行测试
testFtpStorage().catch(console.error);
