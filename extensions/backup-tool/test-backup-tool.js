// 测试 Backup 工具插件
import { BackupManager } from "./src/backup-manager.ts";

async function testBackupTool() {
  console.log("=== 测试 Backup 工具插件 ===\n");

  const backupManager = new BackupManager();

  // 测试 1: 创建备份
  console.log("1. 测试创建备份");
  try {
    const backup = await backupManager.createBackup({
      name: "Test Backup",
      type: "full",
      include: ["/config", "/data"],
      exclude: ["/temp", "/logs"],
      metadata: {
        test: "value",
      },
    });
    console.log("创建的备份:", backup);

    // 保存备份ID用于后续测试
    const testBackupId = backup.id;
  } catch (error) {
    console.error("创建备份测试错误:", error);
  }

  // 测试 2: 列出备份
  console.log("\n2. 测试列出备份");
  try {
    const backups = await backupManager.listBackups();
    console.log("备份列表数量:", backups.length);
    console.log("最新备份:", backups[0]);
  } catch (error) {
    console.error("列出备份测试错误:", error);
  }

  // 测试 3: 获取备份统计
  console.log("\n3. 测试获取备份统计");
  try {
    const stats = await backupManager.getBackupStats();
    console.log("备份统计:", stats);
  } catch (error) {
    console.error("获取备份统计测试错误:", error);
  }

  // 测试 4: 验证备份
  console.log("\n4. 测试验证备份");
  try {
    const backups = await backupManager.listBackups();
    if (backups.length > 0) {
      const validation = await backupManager.validateBackup(backups[0].id);
      console.log("备份验证结果:", validation);
    } else {
      console.log("没有备份可验证");
    }
  } catch (error) {
    console.error("验证备份测试错误:", error);
  }

  // 测试 5: 恢复备份
  console.log("\n5. 测试恢复备份");
  try {
    const backups = await backupManager.listBackups();
    if (backups.length > 0) {
      const restoreResult = await backupManager.restoreBackup({
        backupId: backups[0].id,
        targetLocation: "/restore",
      });
      console.log("恢复备份结果:", restoreResult);
    } else {
      console.log("没有备份可恢复");
    }
  } catch (error) {
    console.error("恢复备份测试错误:", error);
  }

  // 测试 6: 清理备份
  console.log("\n6. 测试清理备份");
  try {
    const cleanupResult = await backupManager.cleanupBackups({
      keepLast: 2,
    });
    console.log("清理备份结果:", cleanupResult);
  } catch (error) {
    console.error("清理备份测试错误:", error);
  }

  // 测试 7: 删除备份
  console.log("\n7. 测试删除备份");
  try {
    const backups = await backupManager.listBackups();
    if (backups.length > 0) {
      const deleteResult = await backupManager.deleteBackup(backups[backups.length - 1].id);
      console.log("删除备份结果:", deleteResult);
    } else {
      console.log("没有备份可删除");
    }
  } catch (error) {
    console.error("删除备份测试错误:", error);
  }

  // 测试 8: 再次列出备份
  console.log("\n8. 测试再次列出备份");
  try {
    const backups = await backupManager.listBackups();
    console.log("备份列表数量:", backups.length);
  } catch (error) {
    console.error("列出备份测试错误:", error);
  }

  console.log("\n=== Backup 工具插件测试完成 ===");
}

// 运行测试
testBackupTool().catch(console.error);
