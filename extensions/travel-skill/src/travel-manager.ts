import { format, differenceInDays, addDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

// 旅行数据类型定义
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  class: "economy" | "business" | "first";
  duration: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  attractions: string[];
  bestTimeToVisit: string;
  currency: string;
  language: string;
}

export interface TravelPlan {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  activities: string[];
  createdAt: string;
  lastUpdated: string;
}

export interface TravelBudget {
  id: string;
  planId: string;
  flights: number;
  accommodation: number;
  activities: number;
  food: number;
  transportation: number;
  miscellaneous: number;
  total: number;
  lastUpdated: string;
}

// 旅行管理器类
export class TravelManager {
  private flights: Map<string, Flight> = new Map();
  private hotels: Map<string, Hotel> = new Map();
  private destinations: Map<string, Destination> = new Map();
  private travelPlans: Map<string, TravelPlan> = new Map();
  private budgets: Map<string, TravelBudget> = new Map();

  constructor() {
    // 初始化模拟数据
    this.initializeMockData();
  }

  // 初始化模拟数据
  private initializeMockData() {
    // 模拟航班数据
    this.flights.set("flight-1", {
      id: "flight-1",
      airline: "Air China",
      flightNumber: "CA1234",
      departureAirport: "Beijing Capital International Airport (PEK)",
      arrivalAirport: "Shanghai Pudong International Airport (PVG)",
      departureTime: "2026-03-15T08:00:00Z",
      arrivalTime: "2026-03-15T10:15:00Z",
      price: 899,
      class: "economy",
      duration: "2h 15m",
    });

    this.flights.set("flight-2", {
      id: "flight-2",
      airline: "China Eastern",
      flightNumber: "MU5678",
      departureAirport: "Shanghai Pudong International Airport (PVG)",
      arrivalAirport: "Guangzhou Baiyun International Airport (CAN)",
      departureTime: "2026-03-16T14:30:00Z",
      arrivalTime: "2026-03-16T16:45:00Z",
      price: 799,
      class: "economy",
      duration: "2h 15m",
    });

    // 模拟酒店数据
    this.hotels.set("hotel-1", {
      id: "hotel-1",
      name: "Grand Hyatt Beijing",
      location: "Beijing, China",
      rating: 4.8,
      pricePerNight: 1200,
      amenities: ["Free WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "Spa"],
      image: "https://example.com/hotels/grand-hyatt-beijing.jpg",
    });

    this.hotels.set("hotel-2", {
      id: "hotel-2",
      name: "The Ritz-Carlton Shanghai",
      location: "Shanghai, China",
      rating: 4.9,
      pricePerNight: 1500,
      amenities: [
        "Free WiFi",
        "Swimming Pool",
        "Fitness Center",
        "Restaurant",
        "Spa",
        "Business Center",
      ],
      image: "https://example.com/hotels/ritz-carlton-shanghai.jpg",
    });

    // 模拟目的地数据
    this.destinations.set("destination-1", {
      id: "destination-1",
      name: "Beijing",
      country: "China",
      description:
        "The capital city of China, known for its historical sites and modern skyscrapers.",
      attractions: [
        "Great Wall of China",
        "Forbidden City",
        "Tiananmen Square",
        "Summer Palace",
        "Bird's Nest Stadium",
      ],
      bestTimeToVisit: "Spring (April-May) and Autumn (September-October)",
      currency: "Chinese Yuan (CNY)",
      language: "Mandarin Chinese",
    });

    this.destinations.set("destination-2", {
      id: "destination-2",
      name: "Shanghai",
      country: "China",
      description: "A global financial hub with a rich cultural heritage and modern skyline.",
      attractions: ["The Bund", "Shanghai Tower", "Yu Garden", "Nanjing Road", "Xintiandi"],
      bestTimeToVisit: "Spring (March-May) and Autumn (September-November)",
      currency: "Chinese Yuan (CNY)",
      language: "Mandarin Chinese",
    });

    this.destinations.set("destination-3", {
      id: "destination-3",
      name: "Tokyo",
      country: "Japan",
      description: "A bustling metropolis blending traditional and modern elements.",
      attractions: ["Tokyo Tower", "Shibuya Crossing", "Meiji Shrine", "Ueno Park", "Ginza"],
      bestTimeToVisit:
        "Spring (March-April) for cherry blossoms and Autumn (October-November) for fall foliage",
      currency: "Japanese Yen (JPY)",
      language: "Japanese",
    });
  }

  // 搜索航班
  async searchFlights(departure: string, arrival: string, date: string): Promise<Flight[]> {
    // 模拟航班搜索
    const results: Flight[] = [];

    for (const flight of this.flights.values()) {
      if (flight.departureAirport.includes(departure) && flight.arrivalAirport.includes(arrival)) {
        // 模拟价格波动
        const randomPrice = flight.price + Math.floor(Math.random() * 200) - 100;
        results.push({
          ...flight,
          price: Math.max(500, randomPrice),
          departureTime: date + "T" + flight.departureTime.split("T")[1],
          arrivalTime: date + "T" + flight.arrivalTime.split("T")[1],
        });
      }
    }

    return results;
  }

  // 预订航班
  async bookFlight(flightId: string): Promise<{ bookingId: string; flight: Flight }> {
    const flight = this.flights.get(flightId);
    if (!flight) {
      throw new Error("Flight not found");
    }

    const bookingId = `booking-${uuidv4()}`;
    return { bookingId, flight };
  }

  // 搜索酒店
  async searchHotels(destination: string, checkIn: string, checkOut: string): Promise<Hotel[]> {
    // 模拟酒店搜索
    const results: Hotel[] = [];

    for (const hotel of this.hotels.values()) {
      if (hotel.location.includes(destination)) {
        // 计算入住天数
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = differenceInDays(checkOutDate, checkInDate);

        results.push({
          ...hotel,
          // 模拟价格波动
          pricePerNight: hotel.pricePerNight + Math.floor(Math.random() * 300) - 150,
        });
      }
    }

    return results;
  }

  // 预订酒店
  async bookHotel(
    hotelId: string,
    checkIn: string,
    checkOut: string,
  ): Promise<{ bookingId: string; hotel: Hotel; totalPrice: number }> {
    const hotel = this.hotels.get(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    // 计算入住天数
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = differenceInDays(checkOutDate, checkInDate);
    const totalPrice = hotel.pricePerNight * nights;

    const bookingId = `booking-${uuidv4()}`;
    return { bookingId, hotel, totalPrice };
  }

  // 获取目的地信息
  async getDestinationInfo(destination: string): Promise<Destination | null> {
    for (const dest of this.destinations.values()) {
      if (dest.name.toLowerCase() === destination.toLowerCase()) {
        return dest;
      }
    }
    return null;
  }

  // 获取所有目的地
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  // 创建旅行计划
  async createTravelPlan(
    plan: Omit<TravelPlan, "id" | "createdAt" | "lastUpdated">,
  ): Promise<TravelPlan> {
    const newPlan: TravelPlan = {
      ...plan,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.travelPlans.set(newPlan.id, newPlan);
    return newPlan;
  }

  // 获取旅行计划
  async getTravelPlan(id: string): Promise<TravelPlan | null> {
    return this.travelPlans.get(id) || null;
  }

  // 获取所有旅行计划
  async getAllTravelPlans(): Promise<TravelPlan[]> {
    return Array.from(this.travelPlans.values());
  }

  // 更新旅行计划
  async updateTravelPlan(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan | null> {
    const plan = this.travelPlans.get(id);
    if (!plan) {
      return null;
    }

    const updatedPlan = {
      ...plan,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    this.travelPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  // 删除旅行计划
  async deleteTravelPlan(id: string): Promise<boolean> {
    // 同时删除相关的预算
    for (const budget of this.budgets.values()) {
      if (budget.planId === id) {
        this.budgets.delete(budget.id);
      }
    }

    return this.travelPlans.delete(id);
  }

  // 创建旅行预算
  async createBudget(
    planId: string,
    budget: Omit<TravelBudget, "id" | "planId" | "total" | "lastUpdated">,
  ): Promise<TravelBudget> {
    const total =
      budget.flights +
      budget.accommodation +
      budget.activities +
      budget.food +
      budget.transportation +
      budget.miscellaneous;

    const newBudget: TravelBudget = {
      ...budget,
      id: uuidv4(),
      planId,
      total,
      lastUpdated: new Date().toISOString(),
    };

    this.budgets.set(newBudget.id, newBudget);
    return newBudget;
  }

  // 获取旅行预算
  async getBudget(planId: string): Promise<TravelBudget | null> {
    for (const budget of this.budgets.values()) {
      if (budget.planId === planId) {
        return budget;
      }
    }
    return null;
  }

  // 更新旅行预算
  async updateBudget(id: string, updates: Partial<TravelBudget>): Promise<TravelBudget | null> {
    const budget = this.budgets.get(id);
    if (!budget) {
      return null;
    }

    const updatedBudget = {
      ...budget,
      ...updates,
      total:
        updates.flights ||
        updates.accommodation ||
        updates.activities ||
        updates.food ||
        updates.transportation ||
        updates.miscellaneous
          ? (updates.flights || budget.flights) +
            (updates.accommodation || budget.accommodation) +
            (updates.activities || budget.activities) +
            (updates.food || budget.food) +
            (updates.transportation || budget.transportation) +
            (updates.miscellaneous || budget.miscellaneous)
          : budget.total,
      lastUpdated: new Date().toISOString(),
    };

    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }

  // 获取旅行建议
  async getTravelRecommendations(
    destination: string,
    duration: number,
  ): Promise<{ recommendations: string[]; itinerary: string[] }> {
    const dest = await this.getDestinationInfo(destination);
    if (!dest) {
      return { recommendations: [], itinerary: [] };
    }

    // 生成旅行建议
    const recommendations = [
      `Visit the ${dest.attractions[0]}`,
      `Try local cuisine in ${dest.name}`,
      `Explore the cultural heritage of ${dest.name}`,
      `Visit ${dest.attractions[1]}`,
      `Experience the local nightlife`,
    ];

    // 生成行程安排
    const itinerary: string[] = [];
    for (let i = 1; i <= duration; i++) {
      if (i <= dest.attractions.length) {
        itinerary.push(`Day ${i}: Visit ${dest.attractions[i - 1]}`);
      } else {
        itinerary.push(`Day ${i}: Free day to explore ${dest.name}`);
      }
    }

    return { recommendations, itinerary };
  }
}
