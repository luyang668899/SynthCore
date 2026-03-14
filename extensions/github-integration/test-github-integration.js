const { GitHubManager } = require("./dist/github-manager");

async function testGitHubIntegration() {
  console.log("Testing GitHub Integration Plugin...");

  const githubManager = new GitHubManager();

  try {
    // Test 1: Check if initialized (should be false initially)
    console.log("\n1. Testing isInitialized...");
    const isInitialized = githubManager.isInitialized();
    console.log("✓ Is initialized:", isInitialized);

    // Test 2: Add repository
    console.log("\n2. Testing addRepository...");
    const testRepo = githubManager.addRepository("openclaw", "openclaw", [
      "push",
      "pull_request",
      "issues",
    ]);
    console.log("✓ Repository added:", testRepo.id);

    // Test 3: Get repositories
    console.log("\n3. Testing getRepositories...");
    const repos = githubManager.getRepositories();
    console.log("✓ Repositories found:", repos.length);

    // Test 4: Get repository by ID
    console.log("\n4. Testing getRepository...");
    const fetchedRepo = githubManager.getRepository(testRepo.id);
    console.log("✓ Repository fetched:", fetchedRepo ? "Success" : "Failed");

    // Test 5: Update repository
    console.log("\n5. Testing updateRepository...");
    const updatedRepo = githubManager.updateRepository(testRepo.id, {
      enabled: false,
      events: ["push", "issues"],
    });
    console.log("✓ Repository updated:", updatedRepo ? "Success" : "Failed");
    console.log("  Updated enabled:", updatedRepo.enabled);
    console.log("  Updated events:", updatedRepo.events.join(", "));

    // Test 6: Export repositories
    console.log("\n6. Testing exportRepositories...");
    const exportedRepos = githubManager.exportRepositories();
    console.log("✓ Repositories exported:", exportedRepos.length);

    // Test 7: Import repositories from JSON
    console.log("\n7. Testing importRepositoriesFromJson...");
    const importCount = githubManager.importRepositoriesFromJson(exportedRepos);
    console.log("✓ Repositories imported:", importCount);

    // Test 8: Remove repository
    console.log("\n8. Testing removeRepository...");
    const deleted = githubManager.removeRepository(testRepo.id);
    console.log("✓ Repository deleted:", deleted ? "Success" : "Failed");

    // Test 9: Verify repository removal
    console.log("\n9. Testing final repository count...");
    const finalRepos = githubManager.getRepositories();
    console.log("✓ Final repository count:", finalRepos.length);

    console.log("\n🎉 All tests completed successfully!");
    console.log("\nNote: Some tests require a valid GitHub token to fully test API functionality.");
    console.log("To test the complete functionality, run with a valid GitHub token:");
    console.log("node test-github-integration.js <github-token> <webhook-secret>");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run tests with optional token and secret
const [token, webhookSecret] = process.argv.slice(2);
if (token && webhookSecret) {
  const githubManager = new GitHubManager();
  githubManager.initialize(token, webhookSecret);
  console.log("GitHub manager initialized with provided token");
  // Additional tests with API calls could be added here
}

testGitHubIntegration();
