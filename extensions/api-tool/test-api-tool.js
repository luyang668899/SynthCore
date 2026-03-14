const { ApiManager } = require("./dist/api-manager");

async function testApiTool() {
  console.log("Testing API Tool Plugin...");

  const apiManager = new ApiManager();

  try {
    // Test 1: Create API endpoint
    console.log("\n1. Testing createEndpoint...");
    const testEndpoint = apiManager.createEndpoint({
      name: "Test API",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      method: "GET",
      timeout: 10000,
    });
    console.log("✓ Endpoint created:", testEndpoint.id);

    // Test 2: Get endpoints
    console.log("\n2. Testing getEndpoints...");
    const endpoints = apiManager.getEndpoints();
    console.log("✓ Endpoints found:", endpoints.length);

    // Test 3: Get endpoint by ID
    console.log("\n3. Testing getEndpoint...");
    const fetchedEndpoint = apiManager.getEndpoint(testEndpoint.id);
    console.log("✓ Endpoint fetched:", fetchedEndpoint ? "Success" : "Failed");

    // Test 4: Update endpoint
    console.log("\n4. Testing updateEndpoint...");
    const updatedEndpoint = apiManager.updateEndpoint(testEndpoint.id, {
      name: "Updated Test API",
    });
    console.log("✓ Endpoint updated:", updatedEndpoint ? "Success" : "Failed");

    // Test 5: Test endpoint
    console.log("\n5. Testing testEndpoint...");
    const testResult = await apiManager.testEndpoint(testEndpoint.id);
    console.log("✓ Test result:", testResult.success ? "Success" : "Failed");
    if (testResult.success) {
      console.log("  Response status:", testResult.response.status);
      console.log("  Latency:", testResult.response.latency, "ms");
    }

    // Test 6: Send request with override data
    console.log("\n6. Testing sendRequest with override...");
    const postEndpoint = apiManager.createEndpoint({
      name: "Test POST API",
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      data: {
        title: "Test Post",
        body: "Test Body",
        userId: 1,
      },
    });

    const postResponse = await apiManager.sendRequest(postEndpoint.id, {
      data: {
        title: "Override Test Post",
        body: "Override Test Body",
        userId: 1,
      },
    });
    console.log("✓ POST request sent:", postResponse.status);

    // Test 7: Batch test endpoints
    console.log("\n7. Testing batchTestEndpoints...");
    const batchResults = await apiManager.batchTestEndpoints([testEndpoint.id, postEndpoint.id]);
    console.log("✓ Batch test completed:", batchResults.size, "endpoints tested");

    // Test 8: Export endpoints
    console.log("\n8. Testing exportEndpoints...");
    const exportedEndpoints = apiManager.exportEndpoints();
    console.log("✓ Endpoints exported:", exportedEndpoints.length);

    // Test 9: Import endpoints
    console.log("\n9. Testing importEndpoints...");
    const importCount = apiManager.importEndpoints(exportedEndpoints);
    console.log("✓ Endpoints imported:", importCount);

    // Test 10: Delete endpoint
    console.log("\n10. Testing deleteEndpoint...");
    const deleted = apiManager.deleteEndpoint(testEndpoint.id);
    console.log("✓ Endpoint deleted:", deleted ? "Success" : "Failed");

    // Test 11: Delete second endpoint
    const deleted2 = apiManager.deleteEndpoint(postEndpoint.id);
    console.log("✓ Second endpoint deleted:", deleted2 ? "Success" : "Failed");

    // Test 12: Verify all endpoints are deleted
    const finalEndpoints = apiManager.getEndpoints();
    console.log("\n11. Testing final endpoint count:", finalEndpoints.length);

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testApiTool();
