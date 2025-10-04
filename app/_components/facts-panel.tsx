"use client";

import { motion } from "framer-motion";
import {
  ChevronUp,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

import { type Coordinates } from "@/lib/services/antipode";

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  userLocation: Coordinates;
  antipode: Coordinates;
}

const fallbackFacts = [
  "Most antipodes are in the ocean! About 71% of Earth's surface is water.",
  "Spain and New Zealand are nearly perfect antipodes of each other.",
  "If you could dig straight through Earth, it would take about 42 minutes to fall to the other side!",
  "The word 'antipode' comes from Greek, meaning 'with feet opposite'.",
  "China's antipode is mostly in Argentina and Chile.",
  "Very few major cities have their antipodes on land.",
  "The antipode of the North Pole is the South Pole!",
  "Hawaii's antipode is in Botswana, Africa.",
];

const FactsPanel = ({
  isExpanded,
  onToggle,
  userLocation,
  antipode,
}: Readonly<Props>) => {
  const [currentFact, setCurrentFact] = useState(0);
  const [facts, setFacts] = useState<string[]>(fallbackFacts);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch facts only once on mount
  useEffect(() => {
    const fetchFacts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/facts", {
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
        if (data.facts && Array.isArray(data.facts)) {
          setFacts(data.facts);
          setCurrentFact(0);
        }
      } catch (error) {
        console.error("Failed to fetch facts:", error);
        setFacts(fallbackFacts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - fetch only once on mount

  const nextFact = () => {
    setCurrentFact((prev) => (prev + 1) % facts.length);
  };

  const prevFact = () => {
    setCurrentFact((prev) => (prev - 1 + facts.length) % facts.length);
  };

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
          aria-label="Expand facts panel"
        >
          <Lightbulb className="w-5 h-5 text-white/80" />
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
              <Lightbulb className="w-4 h-4 text-white/80" />
              <h3 className="text-sm font-semibold">Did You Know?</h3>
            </div>
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-3 pt-0 space-y-3">
            {/* Loading state */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-white/60" />
              </div>
            ) : (
              <>
                {/* Fact content */}
                <motion.p
                  key={currentFact}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs leading-relaxed"
                >
                  {facts[currentFact]}
                </motion.p>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={prevFact}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    aria-label="Previous fact"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs text-muted-foreground">
                    {currentFact + 1} / {facts.length}
                  </span>

                  <button
                    onClick={nextFact}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    aria-label="Next fact"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1 justify-center">
                  {facts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFact(index)}
                      className={`h-1 rounded-full transition-all ${
                        index === currentFact
                          ? "w-6 bg-yellow-400"
                          : "w-1 bg-white/20 hover:bg-white/30"
                      }`}
                      aria-label={`Go to fact ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FactsPanel;
