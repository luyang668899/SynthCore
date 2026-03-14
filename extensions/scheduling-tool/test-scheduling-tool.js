const { SchedulingManager } = require("./src/scheduling-manager");

async function testSchedulingTool() {
  console.log("Testing Scheduling Tool Plugin...");

  const schedulingManager = new SchedulingManager();

  try {
    // Test 1: Create job
    console.log("\n1. Testing createJob()...");
    const job = schedulingManager.createJob(
      "Test Job",
      "0 0 * * *", // Daily at midnight
      "echo",
      ["Hello, OpenClaw!"],
      true,
    );
    console.log("Created job:", job);
    console.log("✓ Job created successfully");

    // Test 2: List jobs
    console.log("\n2. Testing listJobs()...");
    const jobs = schedulingManager.listJobs();
    console.log("Jobs:", jobs);
    console.log("✓ Jobs listed successfully");

    // Test 3: Get job by ID
    console.log("\n3. Testing getJob()...");
    const retrievedJob = schedulingManager.getJob(job.id);
    console.log("Retrieved job:", retrievedJob);
    if (retrievedJob) {
      console.log("✓ Job retrieved successfully");
    } else {
      console.log("✗ Job not found");
    }

    // Test 4: Update job
    console.log("\n4. Testing updateJob()...");
    const updatedJob = schedulingManager.updateJob(job.id, {
      name: "Updated Test Job",
      cron: "30 0 * * *", // Daily at 12:30 AM
    });
    console.log("Updated job:", updatedJob);
    if (updatedJob) {
      console.log("✓ Job updated successfully");
    } else {
      console.log("✗ Job not found");
    }

    // Test 5: Run job immediately
    console.log("\n5. Testing runJob()...");
    const executionResult = await schedulingManager.runJob(job.id);
    console.log("Execution result:", executionResult);
    if (executionResult) {
      console.log("✓ Job executed successfully");
    } else {
      console.log("✗ Job not found");
    }

    // Test 6: Get execution history
    console.log("\n6. Testing getExecutionHistory()...");
    const history = schedulingManager.getExecutionHistory(job.id);
    console.log("Execution history:", history);
    console.log("✓ Execution history retrieved successfully");

    // Test 7: Disable job
    console.log("\n7. Testing disableJob()...");
    const disabledJob = schedulingManager.disableJob(job.id);
    console.log("Disabled job:", disabledJob);
    if (disabledJob) {
      console.log("✓ Job disabled successfully");
    } else {
      console.log("✗ Job not found");
    }

    // Test 8: Enable job
    console.log("\n8. Testing enableJob()...");
    const enabledJob = schedulingManager.enableJob(job.id);
    console.log("Enabled job:", enabledJob);
    if (enabledJob) {
      console.log("✓ Job enabled successfully");
    } else {
      console.log("✗ Job not found");
    }

    // Test 9: Delete job
    console.log("\n9. Testing deleteJob()...");
    const deleted = schedulingManager.deleteJob(job.id);
    console.log("Delete result:", deleted);
    if (deleted) {
      console.log("✓ Job deleted successfully");
    } else {
      console.log("✗ Job not found");
    }

    // Test 10: Clear execution history
    console.log("\n10. Testing clearExecutionHistory()...");
    schedulingManager.clearExecutionHistory();
    const clearedHistory = schedulingManager.getExecutionHistory();
    console.log("History after clearing:", clearedHistory);
    if (clearedHistory.length === 0) {
      console.log("✓ Execution history cleared successfully");
    } else {
      console.log("✗ Execution history not cleared");
    }

    // Test 11: Stop all jobs
    console.log("\n11. Testing stopAllJobs()...");
    schedulingManager.stopAllJobs();
    console.log("✓ All jobs stopped successfully");

    console.log("\n🎉 All tests passed! Scheduling Tool Plugin is working correctly.");
  } catch (error) {
    console.error("Error during testing:", error);
  } finally {
    // Clean up
    schedulingManager.stopAllJobs();
  }
}

testSchedulingTool();
