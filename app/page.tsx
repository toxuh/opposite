"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Loader2, MapPin } from "lucide-react";

import { computeAntipode, type Coordinates } from "@/lib/services/antipode";

const AntipodeMaps = dynamic(() => import("@/app/_components/antipode-maps"), {
  ssr: false,
});
const InfoPanel = dynamic(() => import("@/app/_components/info-panel"), {
  ssr: false,
});
const FactsPanel = dynamic(() => import("@/app/_components/facts-panel"), {
  ssr: false,
});
const LocationsPanel = dynamic(
  () => import("@/app/_components/locations-panel"),
  { ssr: false },
);
const WeatherPanel = dynamic(() => import("@/app/_components/weather-panel"), {
  ssr: false,
});

interface Status {
  state: "idle" | "locating" | "ready" | "error";
  message?: string;
}

const useGeolocation = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus({
        state: "error",
        message: "Geolocation is not supported in this browser",
      });
      return;
    }
    setStatus({ state: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        setStatus({ state: "ready" });
      },
      (err) => {
        setStatus({ state: "error", message: err.message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  useEffect(() => {
    request();
  }, [request]);

  return { coords, status, request };
};

const Home = () => {
  const { coords, status, request } = useGeolocation();
  const [pos, setPos] = useState<Coordinates | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [showFacts, setShowFacts] = useState(true);
  const [showLocations, setShowLocations] = useState(true);
  const [showWeather, setShowWeather] = useState(true);

  useEffect(() => {
    const savedInfo = localStorage.getItem("panel-info");
    const savedFacts = localStorage.getItem("panel-facts");
    const savedLocations = localStorage.getItem("panel-locations");
    const savedWeather = localStorage.getItem("panel-weather");

    if (savedInfo !== null) setShowInfo(savedInfo === "true");
    if (savedFacts !== null) setShowFacts(savedFacts === "true");
    if (savedLocations !== null) setShowLocations(savedLocations === "true");
    if (savedWeather !== null) setShowWeather(savedWeather === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("panel-info", String(showInfo));
  }, [showInfo]);

  useEffect(() => {
    localStorage.setItem("panel-facts", String(showFacts));
  }, [showFacts]);

  useEffect(() => {
    localStorage.setItem("panel-locations", String(showLocations));
  }, [showLocations]);

  useEffect(() => {
    localStorage.setItem("panel-weather", String(showWeather));
  }, [showWeather]);

  useEffect(() => {
    if (coords && !pos) setPos(coords);
  }, [coords, pos]);

  const opposite = useMemo(() => (pos ? computeAntipode(pos) : null), [pos]);

  return (
    <div className="relative h-screen overflow-hidden">
      {status.state === "locating" && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
            <p className="text-lg text-muted-foreground">
              Locating your position...
            </p>
          </motion.div>
        </div>
      )}

      {status.state === "error" && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md p-8 rounded-2xl border border-red-500/30 bg-black/60 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-semibold">Location Error</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              {status.message ?? "Failed to get location"}
            </p>
            <button
              type="button"
              onClick={request}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-4 py-3 font-medium transition-colors"
            >
              <Loader2 className="w-4 h-4" />
              Try again
            </button>
          </motion.div>
        </div>
      )}

      {pos && opposite && (
        <>
          <AntipodeMaps pos={pos} onDrag={setPos} />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="fixed top-3 left-16 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/20 rounded shadow-lg"
          >
            <h1 className="text-xs font-mono text-white/90">
              Antipode Explorer
            </h1>
          </motion.div>

          <div className="fixed top-4 right-4 z-30 flex flex-col gap-3 items-end">
            <div>
              <InfoPanel
                isExpanded={showInfo}
                onToggle={() => setShowInfo(!showInfo)}
                userLocation={pos}
                antipode={opposite}
              />
            </div>

            <div>
              <FactsPanel
                isExpanded={showFacts}
                onToggle={() => setShowFacts(!showFacts)}
                userLocation={pos}
                antipode={opposite}
              />
            </div>

            <div>
              <LocationsPanel
                isExpanded={showLocations}
                onToggle={() => setShowLocations(!showLocations)}
                onSelect={setPos}
              />
            </div>

            <div>
              <WeatherPanel
                isExpanded={showWeather}
                onToggle={() => setShowWeather(!showWeather)}
                userLocation={pos}
                antipode={opposite}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
