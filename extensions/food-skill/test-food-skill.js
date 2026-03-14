// 测试 Food 技能插件
import { FoodManager } from "./src/food-manager.js";

async function testFoodSkill() {
  console.log("=== 测试 Food 技能插件 ===\n");

  const foodManager = new FoodManager();

  // 测试 1: 食谱相关功能
  console.log("1. 测试食谱相关功能");
  try {
    // 获取所有食谱
    const allRecipes = await foodManager.getAllRecipes();
    console.log("所有食谱:", allRecipes);

    // 搜索食谱
    const searchResults = await foodManager.searchRecipes("鸡肉");
    console.log("搜索鸡肉相关食谱:", searchResults);

    // 筛选食谱
    const filteredRecipes = await foodManager.filterRecipes("主菜", "川菜");
    console.log("筛选川菜主菜:", filteredRecipes);

    // 获取单个食谱
    if (allRecipes.length > 0) {
      const recipe = await foodManager.getRecipe(allRecipes[0].id);
      console.log("获取单个食谱:", recipe);
    }
  } catch (error) {
    console.error("食谱测试错误:", error);
  }

  // 测试 2: 餐厅相关功能
  console.log("\n2. 测试餐厅相关功能");
  try {
    // 获取所有餐厅
    const allRestaurants = await foodManager.getAllRestaurants();
    console.log("所有餐厅:", allRestaurants);

    // 搜索餐厅
    const beijingRestaurants = await foodManager.searchRestaurants("北京");
    console.log("北京的餐厅:", beijingRestaurants);

    // 搜索特定菜系餐厅
    const sichuanRestaurants = await foodManager.searchRestaurants("北京", "川菜");
    console.log("北京的川菜餐厅:", sichuanRestaurants);
  } catch (error) {
    console.error("餐厅测试错误:", error);
  }

  // 测试 3: 食材相关功能
  console.log("\n3. 测试食材相关功能");
  try {
    // 获取所有食材
    const allIngredients = await foodManager.getAllIngredients();
    console.log("所有食材:", allIngredients);

    // 添加食材
    const newIngredient = await foodManager.addIngredient({
      name: "牛肉",
      category: "肉类",
      unit: "斤",
      price: 45,
      inStock: true,
      lastPurchased: new Date().toISOString(),
    });
    console.log("添加的食材:", newIngredient);
  } catch (error) {
    console.error("食材测试错误:", error);
  }

  // 测试 4: 菜单计划相关功能
  console.log("\n4. 测试菜单计划相关功能");
  try {
    // 获取所有菜单计划
    const allMenuPlans = await foodManager.getAllMenuPlans();
    console.log("所有菜单计划:", allMenuPlans);

    // 创建菜单计划
    const newMenuPlan = await foodManager.createMenuPlan({
      name: "下周菜单",
      date: "2026-03-17",
      meals: {
        breakfast: "豆浆+油条",
        lunch: "宫保鸡丁+米饭",
        dinner: "意大利面",
      },
      recipes: ["recipe-1", "recipe-2"],
    });
    console.log("创建的菜单计划:", newMenuPlan);
  } catch (error) {
    console.error("菜单计划测试错误:", error);
  }

  // 测试 5: 购物清单相关功能
  console.log("\n5. 测试购物清单相关功能");
  try {
    // 获取所有购物清单
    const allShoppingLists = await foodManager.getAllShoppingLists();
    console.log("所有购物清单:", allShoppingLists);

    // 创建购物清单
    const newShoppingList = await foodManager.createShoppingList({
      name: "今天的购物清单",
      items: [
        {
          ingredient: "鸡肉",
          quantity: 1,
          unit: "斤",
          purchased: false,
        },
        {
          ingredient: "番茄",
          quantity: 3,
          unit: "个",
          purchased: false,
        },
      ],
    });
    console.log("创建的购物清单:", newShoppingList);

    // 切换购物项状态
    if (newShoppingList) {
      const updatedList = await foodManager.toggleShoppingItem(newShoppingList.id, 0);
      console.log("更新后的购物清单:", updatedList);
    }
  } catch (error) {
    console.error("购物清单测试错误:", error);
  }

  // 测试 6: 基于菜单计划生成购物清单
  console.log("\n6. 测试基于菜单计划生成购物清单");
  try {
    const allMenuPlans = await foodManager.getAllMenuPlans();
    if (allMenuPlans.length > 0) {
      const shoppingList = await foodManager.generateShoppingListFromMenu(allMenuPlans[0].id);
      console.log("基于菜单计划生成的购物清单:", shoppingList);
    }
  } catch (error) {
    console.error("生成购物清单测试错误:", error);
  }

  console.log("\n=== Food 技能插件测试完成 ===");
}

// 运行测试
testFoodSkill().catch(console.error);
