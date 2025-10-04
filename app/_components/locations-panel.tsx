"use client";

import { motion } from "framer-motion";
import { ChevronUp, MapPin } from "lucide-react";

import { type Coordinates } from "@/lib/services/antipode";

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: (coords: Coordinates) => void;
}

const popularLocations = [
  { name: "New York", coords: { lat: 40.7128, lon: -74.006 } },
  { name: "London", coords: { lat: 51.5074, lon: -0.1278 } },
  { name: "Tokyo", coords: { lat: 35.6762, lon: 139.6503 } },
  { name: "Sydney", coords: { lat: -33.8688, lon: 151.2093 } },
  { name: "Paris", coords: { lat: 48.8566, lon: 2.3522 } },
  { name: "Dubai", coords: { lat: 25.2048, lon: 55.2708 } },
  { name: "Singapore", coords: { lat: 1.3521, lon: 103.8198 } },
  { name: "Moscow", coords: { lat: 55.7558, lon: 37.6173 } },
];

const LocationsPanel = ({
  isExpanded,
  onToggle,
  onSelect,
}: Readonly<Props>) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
      style={{ width: isExpanded ? "280px" : "auto" }}
    >
      {/* Collapsed - Icon only */}
      {!isExpanded && (
        <button
          onClick={onToggle}
          className="p-2.5 hover:bg-white/5 transition-colors"
          aria-label="Expand locations panel"
        >
          <MapPin className="w-5 h-5 text-white/80" />
        </button>
      )}

      {/* Expanded - Full content */}
      {isExpanded && (
        <>
          {/* Header */}
          <button
            onClick={onToggle}
            className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/80" />
              <h3 className="text-sm font-semibold">Quick Locations</h3>
            </div>
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-3 pt-0 grid grid-cols-2 gap-2">
            {popularLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => onSelect(location.coords)}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs font-medium text-left"
              >
                {location.name}
              </button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LocationsPanel;
