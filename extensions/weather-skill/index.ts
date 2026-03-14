import { WeatherManager } from "./src/weather-manager";

export default {
  name: "weather-skill",
  version: "1.0.0",
  description: "Weather skill plugin for OpenClaw",

  async register({ registerTool, logger }) {
    const weatherManager = new WeatherManager();

    // 注册获取当前天气工具
    registerTool({
      name: "get_current_weather",
      description: "获取指定位置的当前天气信息",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "位置名称，例如：北京、上海、广州",
          },
        },
        required: ["location"],
      },
      async execute({ location }) {
        try {
          const weather = await weatherManager.getCurrentWeather(location);
          if (!weather) {
            return {
              success: false,
              message: `未找到位置 ${location} 的天气信息`,
            };
          }
          return {
            success: true,
            data: weather,
          };
        } catch (error) {
          logger.error("获取当前天气失败:", error);
          return {
            success: false,
            message: "获取天气信息失败",
          };
        }
      },
    });

    // 注册获取天气预报工具
    registerTool({
      name: "get_weather_forecast",
      description: "获取指定位置的天气预报",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "位置名称，例如：北京、上海、广州",
          },
          days: {
            type: "integer",
            description: "预报天数，默认7天",
            minimum: 1,
            maximum: 14,
          },
        },
        required: ["location"],
      },
      async execute({ location, days = 7 }) {
        try {
          const forecast = await weatherManager.getForecast(location, days);
          if (forecast.length === 0) {
            return {
              success: false,
              message: `未找到位置 ${location} 的天气预报`,
            };
          }
          return {
            success: true,
            data: forecast,
          };
        } catch (error) {
          logger.error("获取天气预报失败:", error);
          return {
            success: false,
            message: "获取天气预报失败",
          };
        }
      },
    });

    // 注册获取天气历史数据工具
    registerTool({
      name: "get_weather_history",
      description: "获取指定位置的历史天气数据",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "位置名称，例如：北京、上海、广州",
          },
          startDate: {
            type: "string",
            format: "date",
            description: "开始日期，格式：YYYY-MM-DD",
          },
          endDate: {
            type: "string",
            format: "date",
            description: "结束日期，格式：YYYY-MM-DD",
          },
        },
        required: ["location", "startDate", "endDate"],
      },
      async execute({ location, startDate, endDate }) {
        try {
          const history = await weatherManager.getWeatherHistory(
            location,
            new Date(startDate),
            new Date(endDate),
          );
          return {
            success: true,
            data: history,
          };
        } catch (error) {
          logger.error("获取天气历史数据失败:", error);
          return {
            success: false,
            message: "获取天气历史数据失败",
          };
        }
      },
    });

    // 注册获取天气统计数据工具
    registerTool({
      name: "get_weather_statistics",
      description: "获取指定位置的天气统计数据",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "位置名称，例如：北京、上海、广州",
          },
          days: {
            type: "integer",
            description: "统计天数，默认30天",
            minimum: 1,
            maximum: 90,
          },
        },
        required: ["location"],
      },
      async execute({ location, days = 30 }) {
        try {
          const statistics = await weatherManager.getWeatherStatistics(location, days);
          if (!statistics) {
            return {
              success: false,
              message: `未找到位置 ${location} 的天气统计数据`,
            };
          }
          return {
            success: true,
            data: statistics,
          };
        } catch (error) {
          logger.error("获取天气统计数据失败:", error);
          return {
            success: false,
            message: "获取天气统计数据失败",
          };
        }
      },
    });

    // 注册添加位置工具
    registerTool({
      name: "add_weather_location",
      description: "添加天气位置",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "位置名称",
          },
          latitude: {
            type: "number",
            description: "纬度",
          },
          longitude: {
            type: "number",
            description: "经度",
          },
          timezone: {
            type: "string",
            description: "时区，例如：Asia/Shanghai",
          },
        },
        required: ["name", "latitude", "longitude", "timezone"],
      },
      async execute({ name, latitude, longitude, timezone }) {
        try {
          const location = await weatherManager.addLocation(name, latitude, longitude, timezone);
          return {
            success: true,
            data: location,
          };
        } catch (error) {
          logger.error("添加位置失败:", error);
          return {
            success: false,
            message: "添加位置失败",
          };
        }
      },
    });

    // 注册获取所有位置工具
    registerTool({
      name: "get_weather_locations",
      description: "获取所有天气位置",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute() {
        try {
          const locations = await weatherManager.getLocations();
          return {
            success: true,
            data: locations,
          };
        } catch (error) {
          logger.error("获取位置列表失败:", error);
          return {
            success: false,
            message: "获取位置列表失败",
          };
        }
      },
    });

    // 注册设置默认位置工具
    registerTool({
      name: "set_default_weather_location",
      description: "设置默认天气位置",
      parameters: {
        type: "object",
        properties: {
          locationId: {
            type: "string",
            description: "位置ID",
          },
        },
        required: ["locationId"],
      },
      async execute({ locationId }) {
        try {
          const success = await weatherManager.setDefaultLocation(locationId);
          if (!success) {
            return {
              success: false,
              message: "设置默认位置失败",
            };
          }
          return {
            success: true,
            message: "默认位置设置成功",
          };
        } catch (error) {
          logger.error("设置默认位置失败:", error);
          return {
            success: false,
            message: "设置默认位置失败",
          };
        }
      },
    });

    // 注册获取默认位置工具
    registerTool({
      name: "get_default_weather_location",
      description: "获取默认天气位置",
      parameters: {
        type: "object",
        properties: {},
      },
      async execute() {
        try {
          const location = await weatherManager.getDefaultLocation();
          return {
            success: true,
            data: location,
          };
        } catch (error) {
          logger.error("获取默认位置失败:", error);
          return {
            success: false,
            message: "获取默认位置失败",
          };
        }
      },
    });

    // 注册搜索位置工具
    registerTool({
      name: "search_weather_locations",
      description: "搜索天气位置",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词",
          },
        },
        required: ["query"],
      },
      async execute({ query }) {
        try {
          const locations = await weatherManager.searchLocations(query);
          return {
            success: true,
            data: locations,
          };
        } catch (error) {
          logger.error("搜索位置失败:", error);
          return {
            success: false,
            message: "搜索位置失败",
          };
        }
      },
    });

    logger.info("Weather skill plugin registered successfully");
  },

  async unregister({ logger }) {
    logger.info("Weather skill plugin unregistered");
  },
};
