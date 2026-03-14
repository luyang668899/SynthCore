import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// 餐饮数据类型定义
export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number; // 分钟
  difficulty: "easy" | "medium" | "hard";
  category: string;
  cuisine: string;
  servings: number;
  image: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: string;
  lastUpdated: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  cuisine: string;
  priceRange: "cheap" | "moderate" | "expensive";
  phone: string;
  website: string;
  image: string;
  reviews: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  inStock: boolean;
  lastPurchased: string;
}

export interface MenuPlan {
  id: string;
  name: string;
  date: string;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  recipes: string[]; // 食谱ID列表
  createdAt: string;
  lastUpdated: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: {
    ingredient: string;
    quantity: number;
    unit: string;
    purchased: boolean;
  }[];
  createdAt: string;
  lastUpdated: string;
}

// 餐饮管理器类
export class FoodManager {
  private recipes: Map<string, Recipe> = new Map();
  private restaurants: Map<string, Restaurant> = new Map();
  private ingredients: Map<string, Ingredient> = new Map();
  private menuPlans: Map<string, MenuPlan> = new Map();
  private shoppingLists: Map<string, ShoppingList> = new Map();

  constructor() {
    // 初始化模拟数据
    this.initializeMockData();
  }

  // 初始化模拟数据
  private initializeMockData() {
    // 模拟食谱数据
    this.recipes.set("recipe-1", {
      id: "recipe-1",
      name: "宫保鸡丁",
      description: "经典川菜，鸡肉与花生的完美搭配",
      ingredients: ["鸡肉", "花生", "干辣椒", "葱", "姜", "蒜", "酱油", "醋", "糖", "料酒"],
      instructions: [
        "将鸡肉切成丁，用料酒和盐腌制15分钟",
        "热锅倒油，放入干辣椒和花椒爆香",
        "加入鸡肉丁翻炒至变色",
        "加入葱姜蒜翻炒",
        "加入酱油、醋、糖调味",
        "最后加入花生翻炒均匀即可",
      ],
      cookingTime: 25,
      difficulty: "medium",
      category: "主菜",
      cuisine: "川菜",
      servings: 4,
      image: "https://example.com/recipes/kung-pao-chicken.jpg",
      nutrition: {
        calories: 350,
        protein: 25,
        carbs: 15,
        fat: 20,
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    this.recipes.set("recipe-2", {
      id: "recipe-2",
      name: "意大利面",
      description: "经典意大利面食，简单美味",
      ingredients: ["意大利面", "番茄", "洋葱", "大蒜", "橄榄油", "盐", "胡椒", "罗勒"],
      instructions: [
        "煮一锅沸水，加入盐，放入意大利面煮至八分熟",
        "热锅倒油，放入洋葱和大蒜炒香",
        "加入番茄丁翻炒至软烂",
        "加入盐、胡椒和罗勒调味",
        "将煮好的意大利面加入酱汁中翻炒均匀即可",
      ],
      cookingTime: 20,
      difficulty: "easy",
      category: "主菜",
      cuisine: "意大利菜",
      servings: 2,
      image: "https://example.com/recipes/spaghetti.jpg",
      nutrition: {
        calories: 400,
        protein: 15,
        carbs: 60,
        fat: 10,
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    // 模拟餐厅数据
    this.restaurants.set("restaurant-1", {
      id: "restaurant-1",
      name: "四川饭店",
      address: "北京市朝阳区建国路88号",
      city: "北京",
      rating: 4.8,
      cuisine: "川菜",
      priceRange: "moderate",
      phone: "010-12345678",
      website: "https://example.com/sichuan-restaurant",
      image: "https://example.com/restaurants/sichuan-restaurant.jpg",
      reviews: [
        {
          user: "张三",
          rating: 5,
          comment: "菜品非常正宗，服务也很好",
          date: "2026-03-01",
        },
        {
          user: "李四",
          rating: 4,
          comment: "味道不错，就是有点辣",
          date: "2026-02-28",
        },
      ],
    });

    this.restaurants.set("restaurant-2", {
      id: "restaurant-2",
      name: "意式餐厅",
      address: "上海市静安区南京西路1268号",
      city: "上海",
      rating: 4.6,
      cuisine: "意大利菜",
      priceRange: "expensive",
      phone: "021-87654321",
      website: "https://example.com/italian-restaurant",
      image: "https://example.com/restaurants/italian-restaurant.jpg",
      reviews: [
        {
          user: "王五",
          rating: 5,
          comment: "正宗的意大利风味，环境优雅",
          date: "2026-03-02",
        },
      ],
    });

    // 模拟食材数据
    this.ingredients.set("ingredient-1", {
      id: "ingredient-1",
      name: "鸡肉",
      category: "肉类",
      unit: "斤",
      price: 25,
      inStock: true,
      lastPurchased: "2026-03-05",
    });

    this.ingredients.set("ingredient-2", {
      id: "ingredient-2",
      name: "番茄",
      category: "蔬菜",
      unit: "个",
      price: 2,
      inStock: true,
      lastPurchased: "2026-03-06",
    });

    // 模拟菜单计划数据
    this.menuPlans.set("menu-1", {
      id: "menu-1",
      name: "本周菜单",
      date: "2026-03-10",
      meals: {
        breakfast: "牛奶+面包",
        lunch: "宫保鸡丁+米饭",
        dinner: "意大利面",
      },
      recipes: ["recipe-1", "recipe-2"],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });

    // 模拟购物清单数据
    this.shoppingLists.set("shopping-1", {
      id: "shopping-1",
      name: "本周购物清单",
      items: [
        {
          ingredient: "鸡肉",
          quantity: 2,
          unit: "斤",
          purchased: false,
        },
        {
          ingredient: "番茄",
          quantity: 5,
          unit: "个",
          purchased: true,
        },
      ],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
  }

  // 食谱相关方法
  async getRecipe(id: string): Promise<Recipe | null> {
    return this.recipes.get(id) || null;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(lowercaseQuery) ||
        recipe.description.toLowerCase().includes(lowercaseQuery) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(lowercaseQuery)),
    );
  }

  async filterRecipes(category?: string, cuisine?: string, difficulty?: string): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter((recipe) => {
      if (category && recipe.category !== category) return false;
      if (cuisine && recipe.cuisine !== cuisine) return false;
      if (difficulty && recipe.difficulty !== difficulty) return false;
      return true;
    });
  }

  async createRecipe(recipe: Omit<Recipe, "id" | "createdAt" | "lastUpdated">): Promise<Recipe> {
    const newRecipe: Recipe = {
      ...recipe,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    this.recipes.set(newRecipe.id, newRecipe);
    return newRecipe;
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe | null> {
    const recipe = this.recipes.get(id);
    if (!recipe) return null;

    const updatedRecipe = {
      ...recipe,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: string): Promise<boolean> {
    return this.recipes.delete(id);
  }

  // 餐厅相关方法
  async getRestaurant(id: string): Promise<Restaurant | null> {
    return this.restaurants.get(id) || null;
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async searchRestaurants(city: string, cuisine?: string): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter((restaurant) => {
      if (restaurant.city.toLowerCase() !== city.toLowerCase()) return false;
      if (cuisine && restaurant.cuisine.toLowerCase() !== cuisine.toLowerCase()) return false;
      return true;
    });
  }

  async addRestaurant(restaurant: Omit<Restaurant, "id">): Promise<Restaurant> {
    const newRestaurant: Restaurant = {
      ...restaurant,
      id: uuidv4(),
    };
    this.restaurants.set(newRestaurant.id, newRestaurant);
    return newRestaurant;
  }

  // 食材相关方法
  async getIngredient(id: string): Promise<Ingredient | null> {
    return this.ingredients.get(id) || null;
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values());
  }

  async addIngredient(ingredient: Omit<Ingredient, "id">): Promise<Ingredient> {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: uuidv4(),
    };
    this.ingredients.set(newIngredient.id, newIngredient);
    return newIngredient;
  }

  async updateIngredient(id: string, updates: Partial<Ingredient>): Promise<Ingredient | null> {
    const ingredient = this.ingredients.get(id);
    if (!ingredient) return null;

    const updatedIngredient = {
      ...ingredient,
      ...updates,
    };
    this.ingredients.set(id, updatedIngredient);
    return updatedIngredient;
  }

  // 菜单计划相关方法
  async getMenuPlan(id: string): Promise<MenuPlan | null> {
    return this.menuPlans.get(id) || null;
  }

  async getAllMenuPlans(): Promise<MenuPlan[]> {
    return Array.from(this.menuPlans.values());
  }

  async createMenuPlan(
    plan: Omit<MenuPlan, "id" | "createdAt" | "lastUpdated">,
  ): Promise<MenuPlan> {
    const newPlan: MenuPlan = {
      ...plan,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    this.menuPlans.set(newPlan.id, newPlan);
    return newPlan;
  }

  async updateMenuPlan(id: string, updates: Partial<MenuPlan>): Promise<MenuPlan | null> {
    const plan = this.menuPlans.get(id);
    if (!plan) return null;

    const updatedPlan = {
      ...plan,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.menuPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteMenuPlan(id: string): Promise<boolean> {
    return this.menuPlans.delete(id);
  }

  // 购物清单相关方法
  async getShoppingList(id: string): Promise<ShoppingList | null> {
    return this.shoppingLists.get(id) || null;
  }

  async getAllShoppingLists(): Promise<ShoppingList[]> {
    return Array.from(this.shoppingLists.values());
  }

  async createShoppingList(
    list: Omit<ShoppingList, "id" | "createdAt" | "lastUpdated">,
  ): Promise<ShoppingList> {
    const newList: ShoppingList = {
      ...list,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    this.shoppingLists.set(newList.id, newList);
    return newList;
  }

  async updateShoppingList(
    id: string,
    updates: Partial<ShoppingList>,
  ): Promise<ShoppingList | null> {
    const list = this.shoppingLists.get(id);
    if (!list) return null;

    const updatedList = {
      ...list,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.shoppingLists.set(id, updatedList);
    return updatedList;
  }

  async toggleShoppingItem(id: string, itemIndex: number): Promise<ShoppingList | null> {
    const list = this.shoppingLists.get(id);
    if (!list || !list.items[itemIndex]) return null;

    list.items[itemIndex].purchased = !list.items[itemIndex].purchased;
    list.lastUpdated = new Date().toISOString();
    this.shoppingLists.set(id, list);
    return list;
  }

  // 生成购物清单（基于菜单计划）
  async generateShoppingListFromMenu(menuId: string): Promise<ShoppingList> {
    const menu = this.menuPlans.get(menuId);
    if (!menu) {
      throw new Error("Menu plan not found");
    }

    const ingredientsMap = new Map<string, { quantity: number; unit: string }>();

    // 收集所有食谱的食材
    for (const recipeId of menu.recipes) {
      const recipe = this.recipes.get(recipeId);
      if (recipe) {
        for (const ingredient of recipe.ingredients) {
          if (ingredientsMap.has(ingredient)) {
            const existing = ingredientsMap.get(ingredient)!;
            ingredientsMap.set(ingredient, {
              quantity: existing.quantity + 1,
              unit: existing.unit,
            });
          } else {
            ingredientsMap.set(ingredient, {
              quantity: 1,
              unit: "份",
            });
          }
        }
      }
    }

    // 转换为购物清单格式
    const items = Array.from(ingredientsMap.entries()).map(([ingredient, info]) => ({
      ingredient,
      quantity: info.quantity,
      unit: info.unit,
      purchased: false,
    }));

    return this.createShoppingList({
      name: `${menu.name} - 购物清单`,
      items,
    });
  }
}
