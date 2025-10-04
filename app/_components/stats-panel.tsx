"use client";

import { motion } from "framer-motion";
import { Compass, Ruler, Clock, Waves } from "lucide-react";

import { type Coordinates } from "@/lib/services/antipode";

interface Props {
  from: Coordinates;
  to: Coordinates;
}

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
  const hoursDiff = lonDiff / 15;
  return Math.round(hoursDiff);
};

const getHemisphere = (lat: number, lon: number): string => {
  const ns = lat >= 0 ? "Northern" : "Southern";
  const ew = lon >= 0 ? "Eastern" : "Western";
  return `${ns} & ${ew}`;
};

const StatsPanel = ({ from, to }: Readonly<Props>) => {
  const distance = calculateDistance(from, to);
  const timeDiff = getTimeDifference(from, to);
  const hemisphere = getHemisphere(to.lat, to.lon);

  const stats = [
    {
      icon: Ruler,
      label: "Distance",
      value: `${distance.toLocaleString("en-US", { maximumFractionDigits: 0 })} km`,
      description: "Straight through Earth",
      color: "blue",
    },
    {
      icon: Clock,
      label: "Time Difference",
      value: `~${timeDiff}h`,
      description: "Approximate timezone offset",
      color: "purple",
    },
    {
      icon: Compass,
      label: "Hemisphere",
      value: hemisphere,
      description: "Geographic location",
      color: "pink",
    },
    {
      icon: Waves,
      label: "Ocean Probability",
      value: "~71%",
      description: "Most antipodes are in water",
      color: "cyan",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
          purple:
            "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
          pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400",
          cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400",
        };

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className={`relative overflow-hidden rounded-xl border backdrop-blur-sm bg-gradient-to-br ${
              colorClasses[stat.color as keyof typeof colorClasses]
            }`}
          >
            <div className="p-4 space-y-3">
              {/* Icon */}
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-black/20">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Value */}
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-foreground/80 mt-1">
                  {stat.label}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>

            {/* Decorative gradient */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsPanel;
