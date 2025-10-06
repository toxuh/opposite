"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronUp,
  Info,
  MapPin,
  Globe,
  Ruler,
  Clock,
  Compass,
  Mountain,
} from "lucide-react";

import { type Coordinates } from "@/lib/services/antipode";

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  userLocation: Coordinates;
  antipode: Coordinates;
}

const format = (n: number): string => n.toFixed(6);

const calculateDistance = (from: Coordinates, to: Coordinates): number => {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lon - from.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getTimeDifference = (from: Coordinates, to: Coordinates): number => {
  const lonDiff = Math.abs(from.lon - to.lon);
  return Math.round(lonDiff / 15);
};

const InfoPanel = ({
  isExpanded,
  onToggle,
  userLocation,
  antipode,
}: Readonly<Props>) => {
  const distance = calculateDistance(userLocation, antipode);
  const timeDiff = getTimeDifference(userLocation, antipode);

  const [userElevation, setUserElevation] = useState<number | null>(null);
  const [antipodeElevation, setAntipodeElevation] = useState<number | null>(
    null,
  );
  const [elevationLoading, setElevationLoading] = useState(false);

  useEffect(() => {
    const fetchElevations = async () => {
      setElevationLoading(true);
      try {
        const response = await fetch("/api/elevation", {
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
        setUserElevation(data.userElevation);
        setAntipodeElevation(data.antipodeElevation);
      } catch (error) {
        console.error("Failed to fetch elevations:", error);
      } finally {
        setElevationLoading(false);
      }
    };

    fetchElevations();
  }, [userLocation.lat, userLocation.lon, antipode.lat, antipode.lon]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
      style={{ width: isExpanded ? "280px" : "auto" }}
    >
      {!isExpanded && (
        <button
          onClick={onToggle}
          className="p-2.5 hover:bg-white/5 transition-colors"
          aria-label="Expand info panel"
        >
          <Info className="w-5 h-5 text-white/80" />
        </button>
      )}

      {isExpanded && (
        <>
          <button
            onClick={onToggle}
            className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-white/80" />
              <h3 className="text-sm font-semibold">Location Info</h3>
            </div>
            <ChevronUp className="w-4 h-4" />
          </button>

          <div className="p-3 pt-0 space-y-3 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <MapPin className="w-3 h-3" />
                <span className="text-xs font-medium">Your Location</span>
              </div>
              <div className="pl-5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Lat</span>
                  <span className="text-xs font-mono">
                    {format(userLocation.lat)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Lon</span>
                  <span className="text-xs font-mono">
                    {format(userLocation.lon)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Elevation
                  </span>
                  <span className="text-xs font-mono">
                    {elevationLoading
                      ? "..."
                      : userElevation !== null
                        ? `${userElevation} m`
                        : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Globe className="w-3 h-3" />
                <span className="text-xs font-medium">Antipode</span>
              </div>
              <div className="pl-5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Lat</span>
                  <span className="text-xs font-mono">
                    {format(antipode.lat)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Lon</span>
                  <span className="text-xs font-mono">
                    {format(antipode.lon)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Elevation
                  </span>
                  <span className="text-xs font-mono">
                    {elevationLoading
                      ? "..."
                      : antipodeElevation !== null
                        ? `${antipodeElevation} m`
                        : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <Ruler className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-muted-foreground">Distance:</span>
                <span className="text-xs font-medium">
                  {distance.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  km
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-muted-foreground">
                  Time diff:
                </span>
                <span className="text-xs font-medium">~{timeDiff}h</span>
              </div>

              <div className="flex items-center gap-2">
                <Compass className="w-3 h-3 text-pink-400" />
                <span className="text-xs text-muted-foreground">
                  Hemisphere:
                </span>
                <span className="text-xs font-medium">
                  {antipode.lat >= 0 ? "N" : "S"} &{" "}
                  {antipode.lon >= 0 ? "E" : "W"}
                </span>
              </div>

              {userElevation !== null && antipodeElevation !== null && (
                <div className="flex items-center gap-2">
                  <Mountain className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-muted-foreground">
                    Elevation diff:
                  </span>
                  <span className="text-xs font-medium">
                    {Math.abs(userElevation - antipodeElevation)} m
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default InfoPanel;
