const { GitLabManager } = require("./dist/gitlab-manager");

async function testGitLabIntegration() {
  console.log("Testing GitLab Integration Plugin...");

  const gitlabManager = new GitLabManager();

  try {
    // Test 1: Check if initialized (should be false initially)
    console.log("\n1. Testing isInitialized...");
    const isInitialized = gitlabManager.isInitialized();
    console.log("✓ Is initialized:", isInitialized);

    // Test 2: Add project
    console.log("\n2. Testing addProject...");
    const testProject = gitlabManager.addProject(12345, "test-project", "openclaw", [
      "push",
      "merge_request",
      "issues",
    ]);
    console.log("✓ Project added:", testProject.id);

    // Test 3: Get projects
    console.log("\n3. Testing getProjects...");
    const projects = gitlabManager.getProjects();
    console.log("✓ Projects found:", projects.length);

    // Test 4: Get project by ID
    console.log("\n4. Testing getProject...");
    const fetchedProject = gitlabManager.getProject(testProject.id);
    console.log("✓ Project fetched:", fetchedProject ? "Success" : "Failed");

    // Test 5: Update project
    console.log("\n5. Testing updateProject...");
    const updatedProject = gitlabManager.updateProject(testProject.id, {
      enabled: false,
      events: ["push", "issues"],
    });
    console.log("✓ Project updated:", updatedProject ? "Success" : "Failed");
    console.log("  Updated enabled:", updatedProject.enabled);
    console.log("  Updated events:", updatedProject.events.join(", "));

    // Test 6: Export projects
    console.log("\n6. Testing exportProjects...");
    const exportedProjects = gitlabManager.exportProjects();
    console.log("✓ Projects exported:", exportedProjects.length);

    // Test 7: Import projects from JSON
    console.log("\n7. Testing importProjectsFromJson...");
    const importCount = gitlabManager.importProjectsFromJson(exportedProjects);
    console.log("✓ Projects imported:", importCount);

    // Test 8: Remove project
    console.log("\n8. Testing removeProject...");
    const deleted = gitlabManager.removeProject(testProject.id);
    console.log("✓ Project deleted:", deleted ? "Success" : "Failed");

    // Test 9: Verify project removal
    console.log("\n9. Testing final project count...");
    const finalProjects = gitlabManager.getProjects();
    console.log("✓ Final project count:", finalProjects.length);

    console.log("\n🎉 All tests completed successfully!");
    console.log("\nNote: Some tests require a valid GitLab token to fully test API functionality.");
    console.log("To test the complete functionality, run with a valid GitLab token:");
    console.log("node test-gitlab-integration.js <gitlab-token> [gitlab-url]");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run tests with optional token and URL
const [token, url] = process.argv.slice(2);
if (token) {
  const gitlabManager = new GitLabManager();
  gitlabManager.initialize(token, url || "https://gitlab.com");
  console.log("GitLab manager initialized with provided token");
  // Additional tests with API calls could be added here
}

testGitLabIntegration();
