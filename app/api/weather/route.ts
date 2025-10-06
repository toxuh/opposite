import { NextRequest, NextResponse } from "next/server";

import { fetchWeather, type WeatherResponse } from "@/lib/services/weather";

interface WeatherRequest {
  userLat: number;
  userLon: number;
  antipodeLat: number;
  antipodeLon: number;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: WeatherRequest = await req.json();
    const { userLat, userLon, antipodeLat, antipodeLon } = body;

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "your_openweather_api_key_here") {
      return NextResponse.json({
        userWeather: null,
        antipodeWeather: null,
        error: "Weather API key not configured",
      } as WeatherResponse);
    }

    const [userWeather, antipodeWeather] = await Promise.all([
      fetchWeather(userLat, userLon, apiKey),
      fetchWeather(antipodeLat, antipodeLon, apiKey),
    ]);

    return NextResponse.json({
      userWeather,
      antipodeWeather,
    } as WeatherResponse);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      {
        userWeather: null,
        antipodeWeather: null,
        error: "Failed to fetch weather data",
      } as WeatherResponse,
      { status: 500 },
    );
  }
};
