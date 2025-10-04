"use client";
import { motion } from "framer-motion";
import { Info, Lightbulb } from "lucide-react";
import { useState } from "react";

const facts = [
  "Most antipodes are in the ocean! About 71% of Earth's surface is water.",
  "Spain and New Zealand are nearly perfect antipodes of each other.",
  "If you could dig straight through Earth, it would take about 42 minutes to fall to the other side!",
  "The word 'antipode' comes from Greek, meaning 'with feet opposite'.",
  "China's antipode is mostly in Argentina and Chile.",
  "Very few major cities have their antipodes on land.",
  "The antipode of the North Pole is the South Pole!",
  "Hawaii's antipode is in Botswana, Africa.",
];

const FunFacts = () => {
  const [currentFact, setCurrentFact] = useState(0);

  const nextFact = () => {
    setCurrentFact((prev) => (prev + 1) % facts.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="w-full max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
        </div>

        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20">
                <Lightbulb className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">Did You Know?</h3>
            </div>
            <button
              onClick={nextFact}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-sm"
            >
              <Info className="w-4 h-4" />
              Next Fact
            </button>
          </div>

          {/* Fact content */}
          <motion.div
            key={currentFact}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-xl bg-black/20"
          >
            <p className="text-base leading-relaxed">{facts[currentFact]}</p>
          </motion.div>

          {/* Progress indicator */}
          <div className="flex gap-1.5">
            {facts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFact(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentFact
                    ? "w-8 bg-blue-400"
                    : "w-1.5 bg-white/20 hover:bg-white/30"
                }`}
                aria-label={`Go to fact ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FunFacts;
