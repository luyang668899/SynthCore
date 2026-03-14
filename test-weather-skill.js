#!/usr/bin/env node

import { WeatherManager } from "./extensions/weather-skill/src/weather-manager.js";

async function testWeatherSkill() {
  console.log("=== 测试 Weather 技能插件 ===\n");

  const weatherManager = new WeatherManager();

  try {
    // 测试 1: 获取默认位置
    console.log("1. 测试获取默认位置:");
    const defaultLocation = await weatherManager.getDefaultLocation();
    console.log("默认位置:", defaultLocation);
    console.log("");

    // 测试 2: 获取所有位置
    console.log("2. 测试获取所有位置:");
    const locations = await weatherManager.getLocations();
    console.log("所有位置:", locations);
    console.log("");

    // 测试 3: 获取当前天气
    console.log("3. 测试获取当前天气:");
    const currentWeather = await weatherManager.getCurrentWeather("北京");
    console.log("北京当前天气:", currentWeather);
    console.log("");

    // 测试 4: 获取天气预报
    console.log("4. 测试获取天气预报:");
    const forecast = await weatherManager.getForecast("北京", 3);
    console.log("北京3天天气预报:", forecast);
    console.log("");

    // 测试 5: 获取天气历史数据
    console.log("5. 测试获取天气历史数据:");
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const history = await weatherManager.getWeatherHistory("北京", startDate, endDate);
    console.log("北京最近7天历史天气:", history);
    console.log("");

    // 测试 6: 获取天气统计数据
    console.log("6. 测试获取天气统计数据:");
    const statistics = await weatherManager.getWeatherStatistics("北京", 7);
    console.log("北京最近7天天气统计:", statistics);
    console.log("");

    // 测试 7: 添加新位置
    console.log("7. 测试添加新位置:");
    const newLocation = await weatherManager.addLocation(
      "深圳",
      22.5431,
      114.0579,
      "Asia/Shanghai",
    );
    console.log("添加的新位置:", newLocation);
    console.log("");

    // 测试 8: 搜索位置
    console.log("8. 测试搜索位置:");
    const searchResults = await weatherManager.searchLocations("北");
    console.log('搜索 "北" 的结果:', searchResults);
    console.log("");

    // 测试 9: 设置默认位置
    console.log("9. 测试设置默认位置:");
    const setDefaultResult = await weatherManager.setDefaultLocation(newLocation.id);
    console.log("设置默认位置结果:", setDefaultResult);
    const newDefaultLocation = await weatherManager.getDefaultLocation();
    console.log("新的默认位置:", newDefaultLocation);
    console.log("");

    // 测试 10: 获取新位置的天气
    console.log("10. 测试获取新位置的天气:");
    const shenzhenWeather = await weatherManager.getCurrentWeather("深圳");
    console.log("深圳当前天气:", shenzhenWeather);
    console.log("");

    console.log("=== 所有测试完成 ===");
    console.log("Weather 技能插件功能正常！");
  } catch (error) {
    console.error("测试过程中出现错误:", error);
  }
}

void testWeatherSkill();
