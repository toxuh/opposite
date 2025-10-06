export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  clouds: number;
}

export interface WeatherResponse {
  userWeather: WeatherData | null;
  antipodeWeather: WeatherData | null;
  error?: string;
}

const parseWeatherData = (data: {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
  clouds: { all: number };
}): WeatherData => {
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    clouds: data.clouds.all,
  };
};

export const fetchWeather = async (
  lat: number,
  lon: number,
  apiKey: string,
): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
    );

    if (!response.ok) {
      console.error("Weather API error:", response.status);
      return null;
    }

    const data = await response.json();
    return parseWeatherData(data);
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
};
