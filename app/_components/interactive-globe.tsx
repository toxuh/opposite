"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const InteractiveGlobe = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-md mx-auto aspect-square"
    >
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Globe container */}
      <div className="relative w-full h-full rounded-full border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-purple-950/40 to-pink-950/40 backdrop-blur-sm overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          {/* Latitude lines */}
          {[...Array(9)].map((_, i) => {
            const y = ((i + 1) * 100) / 10;
            return (
              <motion.line
                key={`lat-${i}`}
                x1="0"
                y1={`${y}%`}
                x2="100%"
                y2={`${y}%`}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-blue-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}
          {/* Longitude lines */}
          {[...Array(9)].map((_, i) => {
            const x = ((i + 1) * 100) / 10;
            return (
              <motion.line
                key={`lon-${i}`}
                x1={`${x}%`}
                y1="0"
                x2={`${x}%`}
                y2="100%"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-blue-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Rotating stars */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12;
            const radius = 40;
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Center point */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
        </motion.div>
      </div>

      {/* Orbiting ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-purple-500/30"
        style={{ transform: "rotateX(60deg)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

export default InteractiveGlobe;
