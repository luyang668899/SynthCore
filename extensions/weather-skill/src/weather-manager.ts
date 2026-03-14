import { format, addDays, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export interface WeatherData {
  id: string;
  location: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  condition: string;
  icon: string;
  feelsLike: number;
  visibility: number;
  uvIndex: number;
}

export interface ForecastData {
  id: string;
  location: string;
  date: Date;
  highTemp: number;
  lowTemp: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherHistory {
  id: string;
  location: string;
  date: Date;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  totalPrecipitation: number;
  avgHumidity: number;
  avgWindSpeed: number;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isDefault: boolean;
}

export class WeatherManager {
  private weatherData: WeatherData[] = [];
  private forecastData: ForecastData[] = [];
  private historyData: WeatherHistory[] = [];
  private locations: Location[] = [];

  constructor() {
    // 初始化默认位置
    this.initializeDefaultLocations();
    // 生成一些模拟数据
    this.generateMockData();
  }

  private initializeDefaultLocations(): void {
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

  private generateMockData(): void {
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
  async getCurrentWeather(location: string): Promise<WeatherData | null> {
    const locationData = this.locations.find((loc) => loc.name === location);
    if (!locationData) {
      return null;
    }

    const weather = this.weatherData
      .filter((w) => w.location === location)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    return weather || null;
  }

  // 获取天气预报
  async getForecast(location: string, days: number = 7): Promise<ForecastData[]> {
    const locationData = this.locations.find((loc) => loc.name === location);
    if (!locationData) {
      return [];
    }

    return this.forecastData
      .filter((f) => f.location === location)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, days);
  }

  // 获取天气历史数据
  async getWeatherHistory(
    location: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WeatherHistory[]> {
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
  async addLocation(
    name: string,
    latitude: number,
    longitude: number,
    timezone: string,
  ): Promise<Location> {
    // 如果是第一个位置，设为默认
    const isDefault = this.locations.length === 0;

    const location: Location = {
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

  // 删除位置
  async removeLocation(locationId: string): Promise<boolean> {
    const index = this.locations.findIndex((loc) => loc.id === locationId);
    if (index === -1) {
      return false;
    }

    this.locations.splice(index, 1);

    // 如果删除的是默认位置，设置第一个位置为默认
    if (this.locations.length > 0 && !this.locations.some((loc) => loc.isDefault)) {
      this.locations[0].isDefault = true;
    }

    return true;
  }

  // 获取所有位置
  async getLocations(): Promise<Location[]> {
    return this.locations;
  }

  // 设置默认位置
  async setDefaultLocation(locationId: string): Promise<boolean> {
    const location = this.locations.find((loc) => loc.id === locationId);
    if (!location) {
      return false;
    }

    // 重置所有默认标志
    this.locations.forEach((loc) => {
      loc.isDefault = false;
    });

    // 设置新的默认位置
    location.isDefault = true;
    return true;
  }

  // 获取默认位置
  async getDefaultLocation(): Promise<Location | null> {
    return this.locations.find((loc) => loc.isDefault) || null;
  }

  // 获取天气统计数据
  async getWeatherStatistics(
    location: string,
    days: number = 30,
  ): Promise<{
    avgTemperature: number;
    maxTemperature: number;
    minTemperature: number;
    avgHumidity: number;
    totalPrecipitation: number;
    mostCommonCondition: string;
  } | null> {
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
    const conditionCount: Record<string, number> = {};
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
  async searchLocations(query: string): Promise<Location[]> {
    return this.locations.filter((loc) => loc.name.toLowerCase().includes(query.toLowerCase()));
  }
}
