"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Globe } from "lucide-react";

import { type Coordinates } from "@/lib/services/antipode";

interface Props {
  title: string;
  coords: Coordinates;
  variant?: "primary" | "secondary";
  onNavigate?: () => void;
}

const format = (n: number): string => n.toFixed(6);

const LocationCard = ({
  title,
  coords,
  variant = "primary",
  onNavigate,
}: Readonly<Props>) => {
  const isPrimary = variant === "primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-sm ${
        isPrimary
          ? "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-500/20"
          : "bg-gradient-to-br from-slate-500/10 via-gray-500/10 to-zinc-500/10 border-slate-500/20"
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute inset-0 ${
            isPrimary
              ? "bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
              : "bg-gradient-to-br from-slate-400 via-gray-400 to-zinc-400"
          } blur-3xl animate-pulse`}
          style={{ animationDuration: "4s" }}
        />
      </div>

      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                isPrimary
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-slate-500/20 text-slate-400"
              }`}
            >
              {isPrimary ? (
                <MapPin className="w-5 h-5" />
              ) : (
                <Globe className="w-5 h-5" />
              )}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          {onNavigate && (
            <button
              onClick={onNavigate}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Navigate to location"
            >
              <Navigation className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Coordinates */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
            <span className="text-sm text-muted-foreground">Latitude</span>
            <span className="font-mono text-sm font-medium">
              {format(coords.lat)}°
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
            <span className="text-sm text-muted-foreground">Longitude</span>
            <span className="font-mono text-sm font-medium">
              {format(coords.lon)}°
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      </div>
    </motion.div>
  );
};

export default LocationCard;
