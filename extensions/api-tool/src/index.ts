import { ApiManager, ApiEndpoint } from "./api-manager";

const apiManager = new ApiManager();

export const plugin = {
  id: "api-tool",
  name: "API Tool",
  description: "API integration and management tool plugin for OpenClaw",
  version: "1.0.0",
  type: "tool",
  commands: [
    {
      name: "api:create",
      description: "Create a new API endpoint",
      args: [
        { name: "name", description: "Name of the API endpoint", required: true },
        { name: "url", description: "URL of the API endpoint", required: true },
        {
          name: "method",
          description: "HTTP method (GET, POST, PUT, DELETE, PATCH)",
          required: true,
        },
        { name: "headers", description: "Headers as JSON string", required: false },
        { name: "params", description: "Query parameters as JSON string", required: false },
        { name: "data", description: "Request data as JSON string", required: false },
        { name: "timeout", description: "Timeout in milliseconds", required: false },
        {
          name: "auth-type",
          description: "Authentication type (none, basic, bearer, apiKey)",
          required: false,
        },
        { name: "auth-username", description: "Username for basic auth", required: false },
        { name: "auth-password", description: "Password for basic auth", required: false },
        { name: "auth-token", description: "Token for bearer auth", required: false },
        { name: "auth-api-key", description: "API key for apiKey auth", required: false },
        { name: "auth-api-key-header", description: "API key header name", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        const endpointData: Omit<ApiEndpoint, "id"> = {
          name: args.name as string,
          url: args.url as string,
          method: args.method as any,
          headers: args.headers ? JSON.parse(args.headers as string) : undefined,
          params: args.params ? JSON.parse(args.params as string) : undefined,
          data: args.data ? JSON.parse(args.data as string) : undefined,
          timeout: args.timeout ? parseInt(args.timeout as string) : undefined,
        };

        if (args["auth-type"]) {
          endpointData.auth = {
            type: args["auth-type"] as any,
            username: args["auth-username"] as string,
            password: args["auth-password"] as string,
            token: args["auth-token"] as string,
            apiKey: args["auth-api-key"] as string,
            apiKeyHeader: args["auth-api-key-header"] as string,
          };
        }

        const endpoint = apiManager.createEndpoint(endpointData);

        return {
          success: true,
          message: `API endpoint created successfully with ID: ${endpoint.id}`,
          data: endpoint,
        };
      },
    },
    {
      name: "api:list",
      description: "List all API endpoints",
      args: [],
      handler: async () => {
        const endpoints = apiManager.getEndpoints();

        return {
          success: true,
          message: `Found ${endpoints.length} API endpoints`,
          data: endpoints,
        };
      },
    },
    {
      name: "api:get",
      description: "Get an API endpoint by ID",
      args: [{ name: "id", description: "ID of the API endpoint", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const endpoint = apiManager.getEndpoint(args.id as string);

        if (!endpoint) {
          return {
            success: false,
            message: `API endpoint with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: `API endpoint found`,
          data: endpoint,
        };
      },
    },
    {
      name: "api:update",
      description: "Update an API endpoint",
      args: [
        { name: "id", description: "ID of the API endpoint", required: true },
        { name: "name", description: "Name of the API endpoint", required: false },
        { name: "url", description: "URL of the API endpoint", required: false },
        {
          name: "method",
          description: "HTTP method (GET, POST, PUT, DELETE, PATCH)",
          required: false,
        },
        { name: "headers", description: "Headers as JSON string", required: false },
        { name: "params", description: "Query parameters as JSON string", required: false },
        { name: "data", description: "Request data as JSON string", required: false },
        { name: "timeout", description: "Timeout in milliseconds", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const updates: Partial<ApiEndpoint> = {};

        if (args.name) updates.name = args.name as string;
        if (args.url) updates.url = args.url as string;
        if (args.method) updates.method = args.method as any;
        if (args.headers) updates.headers = JSON.parse(args.headers as string);
        if (args.params) updates.params = JSON.parse(args.params as string);
        if (args.data) updates.data = JSON.parse(args.data as string);
        if (args.timeout) updates.timeout = parseInt(args.timeout as string);

        const endpoint = apiManager.updateEndpoint(args.id as string, updates);

        if (!endpoint) {
          return {
            success: false,
            message: `API endpoint with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: `API endpoint updated successfully`,
          data: endpoint,
        };
      },
    },
    {
      name: "api:delete",
      description: "Delete an API endpoint",
      args: [{ name: "id", description: "ID of the API endpoint", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const deleted = apiManager.deleteEndpoint(args.id as string);

        if (!deleted) {
          return {
            success: false,
            message: `API endpoint with ID ${args.id} not found`,
          };
        }

        return {
          success: true,
          message: "API endpoint deleted successfully",
        };
      },
    },
    {
      name: "api:send",
      description: "Send a request to an API endpoint",
      args: [
        { name: "id", description: "ID of the API endpoint", required: true },
        { name: "data", description: "Override request data as JSON string", required: false },
      ],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const overrideConfig = args.data ? { data: JSON.parse(args.data as string) } : undefined;
          const response = await apiManager.sendRequest(args.id as string, overrideConfig);

          return {
            success: true,
            message: `API request sent successfully (${response.latency}ms)`,
            data: response,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `API request failed: ${error.message || JSON.stringify(error)}`,
            data: error,
          };
        }
      },
    },
    {
      name: "api:test",
      description: "Test an API endpoint",
      args: [{ name: "id", description: "ID of the API endpoint", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        const result = await apiManager.testEndpoint(args.id as string);

        if (result.success) {
          return {
            success: true,
            message: `API endpoint test successful (${result.response?.latency}ms)`,
            data: result,
          };
        } else {
          return {
            success: false,
            message: `API endpoint test failed: ${result.error}`,
            data: result,
          };
        }
      },
    },
    {
      name: "api:batch-test",
      description: "Batch test multiple API endpoints",
      args: [{ name: "ids", description: "Comma-separated list of endpoint IDs", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;
        const ids = (args.ids as string).split(",");

        const results = await apiManager.batchTestEndpoints(ids);
        const resultArray = Array.from(results.entries()).map(([id, result]) => ({
          id,
          ...result,
        }));

        const successCount = resultArray.filter((r) => r.success).length;

        return {
          success: true,
          message: `Batch test completed: ${successCount}/${resultArray.length} endpoints successful`,
          data: resultArray,
        };
      },
    },
    {
      name: "api:export",
      description: "Export API endpoints to JSON",
      args: [],
      handler: async () => {
        const endpoints = apiManager.exportEndpoints();

        return {
          success: true,
          message: `Exported ${endpoints.length} API endpoints`,
          data: endpoints,
        };
      },
    },
    {
      name: "api:import",
      description: "Import API endpoints from JSON",
      args: [{ name: "endpoints", description: "API endpoints as JSON string", required: true }],
      handler: async (ctx: any) => {
        const { args } = ctx;

        try {
          const endpoints = JSON.parse(args.endpoints as string);
          const count = apiManager.importEndpoints(endpoints);

          return {
            success: true,
            message: `Imported ${count} API endpoints`,
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Import failed: ${error.message}`,
          };
        }
      },
    },
  ],
  hooks: {
    onLoad: async () => {
      console.log("API Tool plugin loaded");
    },
    onUnload: async () => {
      console.log("API Tool plugin unloaded");
    },
  },
};

export default plugin;
