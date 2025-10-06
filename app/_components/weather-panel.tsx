"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronUp,
  Cloud,
  Droplets,
  Wind,
  Gauge,
  Loader2,
  CloudOff,
} from "lucide-react";

import { type Coordinates } from "@/lib/services/antipode";
import { type WeatherData } from "@/lib/services/weather";

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  userLocation: Coordinates;
  antipode: Coordinates;
}

const WeatherPanel = ({
  isExpanded,
  onToggle,
  userLocation,
  antipode,
}: Readonly<Props>) => {
  const [userWeather, setUserWeather] = useState<WeatherData | null>(null);
  const [antipodeWeather, setAntipodeWeather] = useState<WeatherData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userLat: userLocation.lat,
            userLon: userLocation.lon,
            antipodeLat: antipode.lat,
            antipodeLon: antipode.lon,
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setUserWeather(data.userWeather);
          setAntipodeWeather(data.antipodeWeather);
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        setError("Failed to load weather data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [userLocation.lat, userLocation.lon, antipode.lat, antipode.lon]);

  const renderWeatherIcon = (iconCode: string) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt="Weather icon"
        className="w-12 h-12"
      />
    );
  };

  const renderWeatherCard = (
    weather: WeatherData | null,
    title: string,
    color: string,
  ) => {
    if (!weather) {
      return (
        <div className="text-center py-4">
          <CloudOff className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">No data</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${color}`}>
          <Cloud className="w-3 h-3" />
          <span className="text-xs font-medium">{title}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderWeatherIcon(weather.icon)}
            <div>
              <div className="text-2xl font-bold">{weather.temp}°C</div>
              <div className="text-xs text-muted-foreground capitalize">
                {weather.description}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3 h-3 text-blue-400" />
            <div>
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="text-xs font-medium">{weather.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-green-400" />
            <div>
              <div className="text-xs text-muted-foreground">Wind</div>
              <div className="text-xs font-medium">{weather.windSpeed} m/s</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-purple-400" />
            <div>
              <div className="text-xs text-muted-foreground">Pressure</div>
              <div className="text-xs font-medium">{weather.pressure} hPa</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Cloud className="w-3 h-3 text-gray-400" />
            <div>
              <div className="text-xs text-muted-foreground">Clouds</div>
              <div className="text-xs font-medium">{weather.clouds}%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
      style={{ width: isExpanded ? "320px" : "auto" }}
    >
      {!isExpanded && (
        <button
          onClick={onToggle}
          className="p-2.5 hover:bg-white/5 transition-colors"
          aria-label="Expand weather panel"
        >
          <Cloud className="w-5 h-5 text-white/80" />
        </button>
      )}

      {isExpanded && (
        <>
          <button
            onClick={onToggle}
            className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-white/80" />
              <h3 className="text-sm font-semibold">Weather Comparison</h3>
            </div>
            <ChevronUp className="w-4 h-4" />
          </button>

          <div className="p-3 pt-0 space-y-4 text-sm">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <CloudOff className="w-8 h-8 mx-auto mb-2 text-red-400" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {!isLoading && !error && (
              <>
                {renderWeatherCard(
                  userWeather,
                  "Your Location",
                  "text-blue-400",
                )}
                <div className="border-t border-white/10 pt-4">
                  {renderWeatherCard(
                    antipodeWeather,
                    "Antipode",
                    "text-purple-400",
                  )}
                </div>

                {userWeather && antipodeWeather && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Temperature Difference:
                      </span>
                      <span className="text-xs font-medium">
                        {Math.abs(
                          userWeather.temp - antipodeWeather.temp,
                        ).toFixed(1)}
                        °C
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default WeatherPanel;
