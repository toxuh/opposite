"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { type Coordinates } from "@/lib/services/antipode";

interface Props {
  from: Coordinates;
  to: Coordinates;
}

const calculateDistance = (from: Coordinates, to: Coordinates): number => {
  const R = 6371; // Earth's radius in km
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

const ConnectionLine = ({ from, to }: Readonly<Props>) => {
  const distance = calculateDistance(from, to);
  const distanceFormatted = distance.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative flex items-center justify-center py-8"
    >
      {/* Connection line */}
      <div className="relative w-full max-w-md">
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Animated dots */}
        <motion.div
          className="absolute top-1/2 left-0 w-2 h-2 bg-blue-500 rounded-full -translate-y-1/2"
          animate={{
            x: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center info */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30"
          >
            <ArrowRight className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium whitespace-nowrap">
              {distanceFormatted} km
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectionLine;
