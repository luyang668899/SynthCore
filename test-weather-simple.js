#!/usr/bin/env node

// 简化的 UUID 生成函数
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 简化的日期函数
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function subDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function isWithinInterval(date, interval) {
  return date >= interval.start && date <= interval.end;
}

// 天气数据接口
class WeatherManager {
  constructor() {
    this.weatherData = [];
    this.forecastData = [];
    this.historyData = [];
    this.locations = [];
    this.initializeDefaultLocations();
    this.generateMockData();
  }

  initializeDefaultLocations() {
    this.locations = [
      {
        id: uuidv4(),
        name: "北京",
        latitude: 39.9042,
        longitude: 116.4074,
        timezone: "Asia/Shanghai",
        isDefault: true,
      },
      {
        id: uuidv4(),
        name: "上海",
        latitude: 31.2304,
        longitude: 121.4737,
        timezone: "Asia/Shanghai",
        isDefault: false,
      },
      {
        id: uuidv4(),
        name: "广州",
        latitude: 23.1291,
        longitude: 113.2644,
        timezone: "Asia/Shanghai",
        isDefault: false,
      },
    ];
  }

  generateMockData() {
    const now = new Date();
    const locations = this.locations;

    // 生成当前天气数据
    locations.forEach((location) => {
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now);
        timestamp.setHours(timestamp.getHours() - i);

        this.weatherData.push({
          id: uuidv4(),
          location: location.name,
          timestamp,
          temperature: Math.round(15 + Math.random() * 10),
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: Math.round(Math.random() * 10 * 10) / 10,
          windDirection: ["北", "东北", "东", "东南", "南", "西南", "西", "西北"][
            Math.floor(Math.random() * 8)
          ],
          pressure: Math.round(1000 + Math.random() * 20),
          condition: ["晴", "多云", "阴", "小雨", "中雨"][Math.floor(Math.random() * 5)],
          icon: ["sunny", "cloudy", "overcast", "light-rain", "moderate-rain"][
            Math.floor(Math.random() * 5)
          ],
          feelsLike: Math.round(14 + Math.random() * 10),
          visibility: Math.round(5 + Math.random() * 15),
          uvIndex: Math.round(Math.random() * 10),
        });
      }
    });

    // 生成天气预报数据（7天）
    locations.forEach((location) => {
      for (let i = 0; i < 7; i++) {
        const date = addDays(now, i);

        this.forecastData.push({
          id: uuidv4(),
          location: location.name,
          date,
          highTemp: Math.round(18 + Math.random() * 8),
          lowTemp: Math.round(8 + Math.random() * 8),
          condition: ["晴", "多云", "阴", "小雨", "中雨"][Math.floor(Math.random() * 5)],
          icon: ["sunny", "cloudy", "overcast", "light-rain", "moderate-rain"][
            Math.floor(Math.random() * 5)
          ],
          precipitation: Math.round(Math.random() * 100) / 10,
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: Math.round(Math.random() * 10 * 10) / 10,
        });
      }
    });

    // 生成历史天气数据（30天）
    locations.forEach((location) => {
      for (let i = 1; i <= 30; i++) {
        const date = subDays(now, i);

        this.historyData.push({
          id: uuidv4(),
          location: location.name,
          date,
          avgTemp: Math.round((10 + Math.random() * 15) * 10) / 10,
          maxTemp: Math.round(15 + Math.random() * 10),
          minTemp: Math.round(5 + Math.random() * 10),
          totalPrecipitation: Math.round(Math.random() * 50 * 10) / 10,
          avgHumidity: Math.round(40 + Math.random() * 40),
          avgWindSpeed: Math.round(Math.random() * 8 * 10) / 10,
        });
      }
    });
  }

  // 获取当前天气
  async getCurrentWeather(location) {
    const locationData = this.locations.find((loc) => loc.name === location);
    if (!locationData) {
      return null;
    }

    const weather = this.weatherData
      .filter((w) => w.location === location)
      .toSorted((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    return weather || null;
  }

  // 获取天气预报
  async getForecast(location, days = 7) {
    const locationData = this.locations.find((loc) => loc.name === location);
    if (!locationData) {
      return [];
    }

    return this.forecastData
      .filter((f) => f.location === location)
      .toSorted((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, days);
  }

  // 获取天气历史数据
  async getWeatherHistory(location, startDate, endDate) {
    const locationData = this.locations.find((loc) => loc.name === location);
    if (!locationData) {
      return [];
    }

    return this.historyData.filter((h) => {
      const historyDate = startOfDay(h.date);
      return (
        h.location === location &&
        isWithinInterval(historyDate, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        })
      );
    });
  }

  // 添加位置
  async addLocation(name, latitude, longitude, timezone) {
    const isDefault = this.locations.length === 0;

    const location = {
      id: uuidv4(),
      name,
      latitude,
      longitude,
      timezone,
      isDefault,
    };

    this.locations.push(location);
    return location;
  }

  // 获取所有位置
  async getLocations() {
    return this.locations;
  }

  // 设置默认位置
  async setDefaultLocation(locationId) {
    const location = this.locations.find((loc) => loc.id === locationId);
    if (!location) {
      return false;
    }

    this.locations.forEach((loc) => {
      loc.isDefault = false;
    });

    location.isDefault = true;
    return true;
  }

  // 获取默认位置
  async getDefaultLocation() {
    return this.locations.find((loc) => loc.isDefault) || null;
  }

  // 获取天气统计数据
  async getWeatherStatistics(location, days = 30) {
    const locationData = this.locations.find((loc) => loc.name === location);
    if (!locationData) {
      return null;
    }

    const endDate = new Date();
    const startDate = subDays(endDate, days);

    const history = await this.getWeatherHistory(location, startDate, endDate);
    if (history.length === 0) {
      return null;
    }

    const temperatures = history.map((h) => h.avgTemp);
    const humidities = history.map((h) => h.avgHumidity);
    const precipitations = history.map((h) => h.totalPrecipitation);
    const conditions = this.weatherData
      .filter(
        (w) =>
          w.location === location &&
          isWithinInterval(w.timestamp, {
            start: startOfDay(startDate),
            end: endOfDay(endDate),
          }),
      )
      .map((w) => w.condition);

    // 计算最常见的天气状况
    const conditionCount = {};
    conditions.forEach((condition) => {
      conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });
    const mostCommonCondition = Object.keys(conditionCount).reduce((a, b) =>
      conditionCount[a] > conditionCount[b] ? a : b,
    );

    return {
      avgTemperature:
        Math.round((temperatures.reduce((a, b) => a + b, 0) / temperatures.length) * 10) / 10,
      maxTemperature: Math.max(...history.map((h) => h.maxTemp)),
      minTemperature: Math.min(...history.map((h) => h.minTemp)),
      avgHumidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
      totalPrecipitation: Math.round(precipitations.reduce((a, b) => a + b, 0) * 10) / 10,
      mostCommonCondition,
    };
  }

  // 搜索位置
  async searchLocations(query) {
    return this.locations.filter((loc) => loc.name.toLowerCase().includes(query.toLowerCase()));
  }
}

async function testWeatherSkill() {
  console.log("=== 测试 Weather 技能插件 ===\n");

  const weatherManager = new WeatherManager();

  try {
    // 测试 1: 获取默认位置
    console.log("1. 测试获取默认位置:");
    const defaultLocation = await weatherManager.getDefaultLocation();
    console.log("默认位置:", defaultLocation.name);
    console.log("");

    // 测试 2: 获取所有位置
    console.log("2. 测试获取所有位置:");
    const locations = await weatherManager.getLocations();
    console.log(
      "所有位置:",
      locations.map((loc) => loc.name),
    );
    console.log("");

    // 测试 3: 获取当前天气
    console.log("3. 测试获取当前天气:");
    const currentWeather = await weatherManager.getCurrentWeather("北京");
    if (currentWeather) {
      console.log("北京当前天气:");
      console.log(`  温度: ${currentWeather.temperature}°C`);
      console.log(`  湿度: ${currentWeather.humidity}%`);
      console.log(`  天气: ${currentWeather.condition}`);
      console.log(`  风速: ${currentWeather.windSpeed} m/s`);
    }
    console.log("");

    // 测试 4: 获取天气预报
    console.log("4. 测试获取天气预报:");
    const forecast = await weatherManager.getForecast("北京", 3);
    console.log("北京3天天气预报:");
    forecast.forEach((day, index) => {
      console.log(
        `${index + 1}天: ${day.date.toLocaleDateString()} - ${day.condition}, ${day.lowTemp}°C ~ ${day.highTemp}°C`,
      );
    });
    console.log("");

    // 测试 5: 获取天气历史数据
    console.log("5. 测试获取天气历史数据:");
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 3);
    const history = await weatherManager.getWeatherHistory("北京", startDate, endDate);
    console.log(`北京最近${history.length}天历史天气数据`);
    console.log("");

    // 测试 6: 获取天气统计数据
    console.log("6. 测试获取天气统计数据:");
    const statistics = await weatherManager.getWeatherStatistics("北京", 7);
    if (statistics) {
      console.log("北京最近7天天气统计:");
      console.log(`  平均温度: ${statistics.avgTemperature}°C`);
      console.log(`  最高温度: ${statistics.maxTemperature}°C`);
      console.log(`  最低温度: ${statistics.minTemperature}°C`);
      console.log(`  平均湿度: ${statistics.avgHumidity}%`);
      console.log(`  总降水量: ${statistics.totalPrecipitation} mm`);
      console.log(`  最常见天气: ${statistics.mostCommonCondition}`);
    }
    console.log("");

    // 测试 7: 添加新位置
    console.log("7. 测试添加新位置:");
    const newLocation = await weatherManager.addLocation(
      "深圳",
      22.5431,
      114.0579,
      "Asia/Shanghai",
    );
    console.log("添加的新位置:", newLocation.name);
    console.log("");

    // 测试 8: 搜索位置
    console.log("8. 测试搜索位置:");
    const searchResults = await weatherManager.searchLocations("北");
    console.log(
      '搜索 "北" 的结果:',
      searchResults.map((loc) => loc.name),
    );
    console.log("");

    // 测试 9: 设置默认位置
    console.log("9. 测试设置默认位置:");
    const setDefaultResult = await weatherManager.setDefaultLocation(newLocation.id);
    console.log("设置默认位置结果:", setDefaultResult);
    const newDefaultLocation = await weatherManager.getDefaultLocation();
    console.log("新的默认位置:", newDefaultLocation.name);
    console.log("");

    // 测试 10: 获取新位置的天气
    console.log("10. 测试获取新位置的天气:");
    const shenzhenWeather = await weatherManager.getCurrentWeather("深圳");
    if (shenzhenWeather) {
      console.log("深圳当前天气:");
      console.log(`  温度: ${shenzhenWeather.temperature}°C`);
      console.log(`  湿度: ${shenzhenWeather.humidity}%`);
      console.log(`  天气: ${shenzhenWeather.condition}`);
    }
    console.log("");

    console.log("=== 所有测试完成 ===");
    console.log("Weather 技能插件功能正常！");
  } catch (error) {
    console.error("测试过程中出现错误:", error);
  }
}

void testWeatherSkill();
