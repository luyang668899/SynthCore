import { TravelManager } from "./src/travel-manager";

export default {
  name: "travel-skill",
  version: "1.0.0",
  description: "Travel skill plugin for OpenClaw",

  async initialize() {
    console.log("Travel skill plugin initialized");
  },

  async registerTools(tools: any) {
    const travelManager = new TravelManager();

    // 航班相关工具
    tools.register({
      name: "searchFlights",
      description: "搜索航班",
      parameters: {
        type: "object",
        properties: {
          departure: {
            type: "string",
            description: "出发地",
          },
          arrival: {
            type: "string",
            description: "目的地",
          },
          date: {
            type: "string",
            description: "出发日期（YYYY-MM-DD）",
          },
        },
        required: ["departure", "arrival", "date"],
      },
      handler: async (args: { departure: string; arrival: string; date: string }) => {
        return await travelManager.searchFlights(args.departure, args.arrival, args.date);
      },
    });

    tools.register({
      name: "bookFlight",
      description: "预订航班",
      parameters: {
        type: "object",
        properties: {
          flightId: {
            type: "string",
            description: "航班ID",
          },
        },
        required: ["flightId"],
      },
      handler: async (args: { flightId: string }) => {
        try {
          return await travelManager.bookFlight(args.flightId);
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    // 酒店相关工具
    tools.register({
      name: "searchHotels",
      description: "搜索酒店",
      parameters: {
        type: "object",
        properties: {
          destination: {
            type: "string",
            description: "目的地",
          },
          checkIn: {
            type: "string",
            description: "入住日期（YYYY-MM-DD）",
          },
          checkOut: {
            type: "string",
            description: "退房日期（YYYY-MM-DD）",
          },
        },
        required: ["destination", "checkIn", "checkOut"],
      },
      handler: async (args: { destination: string; checkIn: string; checkOut: string }) => {
        return await travelManager.searchHotels(args.destination, args.checkIn, args.checkOut);
      },
    });

    tools.register({
      name: "bookHotel",
      description: "预订酒店",
      parameters: {
        type: "object",
        properties: {
          hotelId: {
            type: "string",
            description: "酒店ID",
          },
          checkIn: {
            type: "string",
            description: "入住日期（YYYY-MM-DD）",
          },
          checkOut: {
            type: "string",
            description: "退房日期（YYYY-MM-DD）",
          },
        },
        required: ["hotelId", "checkIn", "checkOut"],
      },
      handler: async (args: { hotelId: string; checkIn: string; checkOut: string }) => {
        try {
          return await travelManager.bookHotel(args.hotelId, args.checkIn, args.checkOut);
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });

    // 目的地相关工具
    tools.register({
      name: "getDestinationInfo",
      description: "获取目的地信息",
      parameters: {
        type: "object",
        properties: {
          destination: {
            type: "string",
            description: "目的地名称",
          },
        },
        required: ["destination"],
      },
      handler: async (args: { destination: string }) => {
        const info = await travelManager.getDestinationInfo(args.destination);
        if (!info) {
          return { error: "目的地信息未找到" };
        }
        return info;
      },
    });

    tools.register({
      name: "getAllDestinations",
      description: "获取所有目的地",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return await travelManager.getAllDestinations();
      },
    });

    // 旅行计划相关工具
    tools.register({
      name: "createTravelPlan",
      description: "创建旅行计划",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "计划名称",
          },
          destination: {
            type: "string",
            description: "目的地",
          },
          startDate: {
            type: "string",
            description: "开始日期（YYYY-MM-DD）",
          },
          endDate: {
            type: "string",
            description: "结束日期（YYYY-MM-DD）",
          },
          budget: {
            type: "number",
            description: "预算",
          },
          activities: {
            type: "array",
            items: {
              type: "string",
            },
            description: "活动列表",
          },
        },
        required: ["name", "destination", "startDate", "endDate", "budget", "activities"],
      },
      handler: async (args: {
        name: string;
        destination: string;
        startDate: string;
        endDate: string;
        budget: number;
        activities: string[];
      }) => {
        return await travelManager.createTravelPlan({
          name: args.name,
          destination: args.destination,
          startDate: args.startDate,
          endDate: args.endDate,
          budget: args.budget,
          activities: args.activities,
        });
      },
    });

    tools.register({
      name: "getTravelPlan",
      description: "获取旅行计划",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "计划ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const plan = await travelManager.getTravelPlan(args.id);
        if (!plan) {
          return { error: "旅行计划未找到" };
        }
        return plan;
      },
    });

    tools.register({
      name: "getAllTravelPlans",
      description: "获取所有旅行计划",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return await travelManager.getAllTravelPlans();
      },
    });

    tools.register({
      name: "updateTravelPlan",
      description: "更新旅行计划",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "计划ID",
          },
          name: {
            type: "string",
            description: "计划名称（可选）",
          },
          destination: {
            type: "string",
            description: "目的地（可选）",
          },
          startDate: {
            type: "string",
            description: "开始日期（YYYY-MM-DD，可选）",
          },
          endDate: {
            type: "string",
            description: "结束日期（YYYY-MM-DD，可选）",
          },
          budget: {
            type: "number",
            description: "预算（可选）",
          },
          activities: {
            type: "array",
            items: {
              type: "string",
            },
            description: "活动列表（可选）",
          },
        },
        required: ["id"],
      },
      handler: async (args: {
        id: string;
        name?: string;
        destination?: string;
        startDate?: string;
        endDate?: string;
        budget?: number;
        activities?: string[];
      }) => {
        const updates: Partial<any> = {};
        if (args.name !== undefined) updates.name = args.name;
        if (args.destination !== undefined) updates.destination = args.destination;
        if (args.startDate !== undefined) updates.startDate = args.startDate;
        if (args.endDate !== undefined) updates.endDate = args.endDate;
        if (args.budget !== undefined) updates.budget = args.budget;
        if (args.activities !== undefined) updates.activities = args.activities;

        const plan = await travelManager.updateTravelPlan(args.id, updates);
        if (!plan) {
          return { error: "旅行计划未找到" };
        }
        return plan;
      },
    });

    tools.register({
      name: "deleteTravelPlan",
      description: "删除旅行计划",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "计划ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const result = await travelManager.deleteTravelPlan(args.id);
        return { success: result };
      },
    });

    // 预算相关工具
    tools.register({
      name: "createBudget",
      description: "创建旅行预算",
      parameters: {
        type: "object",
        properties: {
          planId: {
            type: "string",
            description: "旅行计划ID",
          },
          flights: {
            type: "number",
            description: "航班费用",
          },
          accommodation: {
            type: "number",
            description: "住宿费用",
          },
          activities: {
            type: "number",
            description: "活动费用",
          },
          food: {
            type: "number",
            description: "餐饮费用",
          },
          transportation: {
            type: "number",
            description: "交通费用",
          },
          miscellaneous: {
            type: "number",
            description: "其他费用",
          },
        },
        required: [
          "planId",
          "flights",
          "accommodation",
          "activities",
          "food",
          "transportation",
          "miscellaneous",
        ],
      },
      handler: async (args: {
        planId: string;
        flights: number;
        accommodation: number;
        activities: number;
        food: number;
        transportation: number;
        miscellaneous: number;
      }) => {
        return await travelManager.createBudget(args.planId, {
          flights: args.flights,
          accommodation: args.accommodation,
          activities: args.activities,
          food: args.food,
          transportation: args.transportation,
          miscellaneous: args.miscellaneous,
        });
      },
    });

    tools.register({
      name: "getBudget",
      description: "获取旅行预算",
      parameters: {
        type: "object",
        properties: {
          planId: {
            type: "string",
            description: "旅行计划ID",
          },
        },
        required: ["planId"],
      },
      handler: async (args: { planId: string }) => {
        const budget = await travelManager.getBudget(args.planId);
        if (!budget) {
          return { error: "预算未找到" };
        }
        return budget;
      },
    });

    tools.register({
      name: "updateBudget",
      description: "更新旅行预算",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "预算ID",
          },
          flights: {
            type: "number",
            description: "航班费用（可选）",
          },
          accommodation: {
            type: "number",
            description: "住宿费用（可选）",
          },
          activities: {
            type: "number",
            description: "活动费用（可选）",
          },
          food: {
            type: "number",
            description: "餐饮费用（可选）",
          },
          transportation: {
            type: "number",
            description: "交通费用（可选）",
          },
          miscellaneous: {
            type: "number",
            description: "其他费用（可选）",
          },
        },
        required: ["id"],
      },
      handler: async (args: {
        id: string;
        flights?: number;
        accommodation?: number;
        activities?: number;
        food?: number;
        transportation?: number;
        miscellaneous?: number;
      }) => {
        const updates: Partial<any> = {};
        if (args.flights !== undefined) updates.flights = args.flights;
        if (args.accommodation !== undefined) updates.accommodation = args.accommodation;
        if (args.activities !== undefined) updates.activities = args.activities;
        if (args.food !== undefined) updates.food = args.food;
        if (args.transportation !== undefined) updates.transportation = args.transportation;
        if (args.miscellaneous !== undefined) updates.miscellaneous = args.miscellaneous;

        const budget = await travelManager.updateBudget(args.id, updates);
        if (!budget) {
          return { error: "预算未找到" };
        }
        return budget;
      },
    });

    // 旅行建议工具
    tools.register({
      name: "getTravelRecommendations",
      description: "获取旅行建议",
      parameters: {
        type: "object",
        properties: {
          destination: {
            type: "string",
            description: "目的地",
          },
          duration: {
            type: "number",
            description: "旅行天数",
          },
        },
        required: ["destination", "duration"],
      },
      handler: async (args: { destination: string; duration: number }) => {
        return await travelManager.getTravelRecommendations(args.destination, args.duration);
      },
    });
  },
};
