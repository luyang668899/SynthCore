import { FoodManager } from "./src/food-manager";

export default {
  name: "food-skill",
  version: "1.0.0",
  description: "Food skill plugin for OpenClaw",

  async initialize() {
    console.log("Food skill plugin initialized");
  },

  async registerTools(tools: any) {
    const foodManager = new FoodManager();

    // 食谱相关工具
    tools.register({
      name: "getRecipe",
      description: "获取食谱详情",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "食谱ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const recipe = await foodManager.getRecipe(args.id);
        if (!recipe) {
          return { error: "食谱未找到" };
        }
        return recipe;
      },
    });

    tools.register({
      name: "getAllRecipes",
      description: "获取所有食谱",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return await foodManager.getAllRecipes();
      },
    });

    tools.register({
      name: "searchRecipes",
      description: "搜索食谱",
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
      handler: async (args: { query: string }) => {
        return await foodManager.searchRecipes(args.query);
      },
    });

    tools.register({
      name: "filterRecipes",
      description: "筛选食谱",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "分类（可选）",
          },
          cuisine: {
            type: "string",
            description: "菜系（可选）",
          },
          difficulty: {
            type: "string",
            description: "难度（可选）",
          },
        },
      },
      handler: async (args: { category?: string; cuisine?: string; difficulty?: string }) => {
        return await foodManager.filterRecipes(args.category, args.cuisine, args.difficulty);
      },
    });

    tools.register({
      name: "createRecipe",
      description: "创建食谱",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "食谱名称",
          },
          description: {
            type: "string",
            description: "食谱描述",
          },
          ingredients: {
            type: "array",
            items: {
              type: "string",
            },
            description: "食材列表",
          },
          instructions: {
            type: "array",
            items: {
              type: "string",
            },
            description: "制作步骤",
          },
          cookingTime: {
            type: "number",
            description: "烹饪时间（分钟）",
          },
          difficulty: {
            type: "string",
            enum: ["easy", "medium", "hard"],
            description: "难度",
          },
          category: {
            type: "string",
            description: "分类",
          },
          cuisine: {
            type: "string",
            description: "菜系",
          },
          servings: {
            type: "number",
            description: "份量",
          },
          image: {
            type: "string",
            description: "图片 URL",
          },
          nutrition: {
            type: "object",
            properties: {
              calories: {
                type: "number",
                description: "卡路里",
              },
              protein: {
                type: "number",
                description: "蛋白质",
              },
              carbs: {
                type: "number",
                description: "碳水化合物",
              },
              fat: {
                type: "number",
                description: "脂肪",
              },
            },
            description: "营养信息",
          },
        },
        required: [
          "name",
          "description",
          "ingredients",
          "instructions",
          "cookingTime",
          "difficulty",
          "category",
          "cuisine",
          "servings",
          "image",
          "nutrition",
        ],
      },
      handler: async (args: any) => {
        return await foodManager.createRecipe(args);
      },
    });

    tools.register({
      name: "updateRecipe",
      description: "更新食谱",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "食谱ID",
          },
          name: {
            type: "string",
            description: "食谱名称（可选）",
          },
          description: {
            type: "string",
            description: "食谱描述（可选）",
          },
          ingredients: {
            type: "array",
            items: {
              type: "string",
            },
            description: "食材列表（可选）",
          },
          instructions: {
            type: "array",
            items: {
              type: "string",
            },
            description: "制作步骤（可选）",
          },
          cookingTime: {
            type: "number",
            description: "烹饪时间（分钟，可选）",
          },
          difficulty: {
            type: "string",
            enum: ["easy", "medium", "hard"],
            description: "难度（可选）",
          },
          category: {
            type: "string",
            description: "分类（可选）",
          },
          cuisine: {
            type: "string",
            description: "菜系（可选）",
          },
          servings: {
            type: "number",
            description: "份量（可选）",
          },
          image: {
            type: "string",
            description: "图片 URL（可选）",
          },
          nutrition: {
            type: "object",
            properties: {
              calories: {
                type: "number",
                description: "卡路里",
              },
              protein: {
                type: "number",
                description: "蛋白质",
              },
              carbs: {
                type: "number",
                description: "碳水化合物",
              },
              fat: {
                type: "number",
                description: "脂肪",
              },
            },
            description: "营养信息（可选）",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string; [key: string]: any }) => {
        const { id, ...updates } = args;
        const recipe = await foodManager.updateRecipe(id, updates);
        if (!recipe) {
          return { error: "食谱未找到" };
        }
        return recipe;
      },
    });

    tools.register({
      name: "deleteRecipe",
      description: "删除食谱",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "食谱ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const result = await foodManager.deleteRecipe(args.id);
        return { success: result };
      },
    });

    // 餐厅相关工具
    tools.register({
      name: "getRestaurant",
      description: "获取餐厅详情",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "餐厅ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const restaurant = await foodManager.getRestaurant(args.id);
        if (!restaurant) {
          return { error: "餐厅未找到" };
        }
        return restaurant;
      },
    });

    tools.register({
      name: "getAllRestaurants",
      description: "获取所有餐厅",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return await foodManager.getAllRestaurants();
      },
    });

    tools.register({
      name: "searchRestaurants",
      description: "搜索餐厅",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "城市",
          },
          cuisine: {
            type: "string",
            description: "菜系（可选）",
          },
        },
        required: ["city"],
      },
      handler: async (args: { city: string; cuisine?: string }) => {
        return await foodManager.searchRestaurants(args.city, args.cuisine);
      },
    });

    tools.register({
      name: "addRestaurant",
      description: "添加餐厅",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "餐厅名称",
          },
          address: {
            type: "string",
            description: "地址",
          },
          city: {
            type: "string",
            description: "城市",
          },
          rating: {
            type: "number",
            description: "评分",
          },
          cuisine: {
            type: "string",
            description: "菜系",
          },
          priceRange: {
            type: "string",
            enum: ["cheap", "moderate", "expensive"],
            description: "价格范围",
          },
          phone: {
            type: "string",
            description: "电话",
          },
          website: {
            type: "string",
            description: "网站",
          },
          image: {
            type: "string",
            description: "图片 URL",
          },
          reviews: {
            type: "array",
            items: {
              type: "object",
              properties: {
                user: {
                  type: "string",
                  description: "用户",
                },
                rating: {
                  type: "number",
                  description: "评分",
                },
                comment: {
                  type: "string",
                  description: "评论",
                },
                date: {
                  type: "string",
                  description: "日期",
                },
              },
            },
            description: "评论列表",
          },
        },
        required: [
          "name",
          "address",
          "city",
          "rating",
          "cuisine",
          "priceRange",
          "phone",
          "website",
          "image",
          "reviews",
        ],
      },
      handler: async (args: any) => {
        return await foodManager.addRestaurant(args);
      },
    });

    // 食材相关工具
    tools.register({
      name: "getIngredient",
      description: "获取食材详情",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "食材ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const ingredient = await foodManager.getIngredient(args.id);
        if (!ingredient) {
          return { error: "食材未找到" };
        }
        return ingredient;
      },
    });

    tools.register({
      name: "getAllIngredients",
      description: "获取所有食材",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return await foodManager.getAllIngredients();
      },
    });

    tools.register({
      name: "addIngredient",
      description: "添加食材",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "食材名称",
          },
          category: {
            type: "string",
            description: "分类",
          },
          unit: {
            type: "string",
            description: "单位",
          },
          price: {
            type: "number",
            description: "价格",
          },
          inStock: {
            type: "boolean",
            description: "是否有库存",
          },
          lastPurchased: {
            type: "string",
            description: "最后购买日期",
          },
        },
        required: ["name", "category", "unit", "price", "inStock", "lastPurchased"],
      },
      handler: async (args: any) => {
        return await foodManager.addIngredient(args);
      },
    });

    tools.register({
      name: "updateIngredient",
      description: "更新食材",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "食材ID",
          },
          name: {
            type: "string",
            description: "食材名称（可选）",
          },
          category: {
            type: "string",
            description: "分类（可选）",
          },
          unit: {
            type: "string",
            description: "单位（可选）",
          },
          price: {
            type: "number",
            description: "价格（可选）",
          },
          inStock: {
            type: "boolean",
            description: "是否有库存（可选）",
          },
          lastPurchased: {
            type: "string",
            description: "最后购买日期（可选）",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string; [key: string]: any }) => {
        const { id, ...updates } = args;
        const ingredient = await foodManager.updateIngredient(id, updates);
        if (!ingredient) {
          return { error: "食材未找到" };
        }
        return ingredient;
      },
    });

    // 菜单计划相关工具
    tools.register({
      name: "getMenuPlan",
      description: "获取菜单计划",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "菜单计划ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const plan = await foodManager.getMenuPlan(args.id);
        if (!plan) {
          return { error: "菜单计划未找到" };
        }
        return plan;
      },
    });

    tools.register({
      name: "getAllMenuPlans",
      description: "获取所有菜单计划",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return await foodManager.getAllMenuPlans();
      },
    });

    tools.register({
      name: "createMenuPlan",
      description: "创建菜单计划",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "计划名称",
          },
          date: {
            type: "string",
            description: "日期",
          },
          meals: {
            type: "object",
            properties: {
              breakfast: {
                type: "string",
                description: "早餐（可选）",
              },
              lunch: {
                type: "string",
                description: "午餐（可选）",
              },
              dinner: {
                type: "string",
                description: "晚餐（可选）",
              },
            },
            description: " meals",
          },
          recipes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "食谱ID列表",
          },
        },
        required: ["name", "date", "meals", "recipes"],
      },
      handler: async (args: any) => {
        return await foodManager.createMenuPlan(args);
      },
    });

    tools.register({
      name: "updateMenuPlan",
      description: "更新菜单计划",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "菜单计划ID",
          },
          name: {
            type: "string",
            description: "计划名称（可选）",
          },
          date: {
            type: "string",
            description: "日期（可选）",
          },
          meals: {
            type: "object",
            properties: {
              breakfast: {
                type: "string",
                description: "早餐（可选）",
              },
              lunch: {
                type: "string",
                description: "午餐（可选）",
              },
              dinner: {
                type: "string",
                description: "晚餐（可选）",
              },
            },
            description: " meals（可选）",
          },
          recipes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "食谱ID列表（可选）",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string; [key: string]: any }) => {
        const { id, ...updates } = args;
        const plan = await foodManager.updateMenuPlan(id, updates);
        if (!plan) {
          return { error: "菜单计划未找到" };
        }
        return plan;
      },
    });

    tools.register({
      name: "deleteMenuPlan",
      description: "删除菜单计划",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "菜单计划ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const result = await foodManager.deleteMenuPlan(args.id);
        return { success: result };
      },
    });

    // 购物清单相关工具
    tools.register({
      name: "getShoppingList",
      description: "获取购物清单",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "购物清单ID",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string }) => {
        const list = await foodManager.getShoppingList(args.id);
        if (!list) {
          return { error: "购物清单未找到" };
        }
        return list;
      },
    });

    tools.register({
      name: "getAllShoppingLists",
      description: "获取所有购物清单",
      parameters: {
        type: "object",
        properties: {},
      },
      handler: async () => {
        return await foodManager.getAllShoppingLists();
      },
    });

    tools.register({
      name: "createShoppingList",
      description: "创建购物清单",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "清单名称",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ingredient: {
                  type: "string",
                  description: "食材",
                },
                quantity: {
                  type: "number",
                  description: "数量",
                },
                unit: {
                  type: "string",
                  description: "单位",
                },
                purchased: {
                  type: "boolean",
                  description: "是否已购买",
                },
              },
            },
            description: "购物项列表",
          },
        },
        required: ["name", "items"],
      },
      handler: async (args: any) => {
        return await foodManager.createShoppingList(args);
      },
    });

    tools.register({
      name: "updateShoppingList",
      description: "更新购物清单",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "购物清单ID",
          },
          name: {
            type: "string",
            description: "清单名称（可选）",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ingredient: {
                  type: "string",
                  description: "食材",
                },
                quantity: {
                  type: "number",
                  description: "数量",
                },
                unit: {
                  type: "string",
                  description: "单位",
                },
                purchased: {
                  type: "boolean",
                  description: "是否已购买",
                },
              },
            },
            description: "购物项列表（可选）",
          },
        },
        required: ["id"],
      },
      handler: async (args: { id: string; [key: string]: any }) => {
        const { id, ...updates } = args;
        const list = await foodManager.updateShoppingList(id, updates);
        if (!list) {
          return { error: "购物清单未找到" };
        }
        return list;
      },
    });

    tools.register({
      name: "toggleShoppingItem",
      description: "切换购物项状态",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "购物清单ID",
          },
          itemIndex: {
            type: "number",
            description: "购物项索引",
          },
        },
        required: ["id", "itemIndex"],
      },
      handler: async (args: { id: string; itemIndex: number }) => {
        const list = await foodManager.toggleShoppingItem(args.id, args.itemIndex);
        if (!list) {
          return { error: "购物清单或购物项未找到" };
        }
        return list;
      },
    });

    // 生成购物清单（基于菜单计划）
    tools.register({
      name: "generateShoppingListFromMenu",
      description: "基于菜单计划生成购物清单",
      parameters: {
        type: "object",
        properties: {
          menuId: {
            type: "string",
            description: "菜单计划ID",
          },
        },
        required: ["menuId"],
      },
      handler: async (args: { menuId: string }) => {
        try {
          return await foodManager.generateShoppingListFromMenu(args.menuId);
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    });
  },
};
