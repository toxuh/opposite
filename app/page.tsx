"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { computeAntipode, type Coordinates } from "@/lib/services/antipode";
import { cn } from "@/lib/utils";

const AntipodeMaps = dynamic(() => import("@/app/_components/antipode-maps"), {
  ssr: false,
});

interface Status {
  state: "idle" | "locating" | "ready" | "error";
  message?: string;
}

const format = (n: number): string => n.toFixed(6);

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

interface Props {
  className?: string;
}

const Home = ({ className }: Readonly<Props>) => {
  const { coords, status, request } = useGeolocation();
  const [pos, setPos] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (coords && !pos) setPos(coords);
  }, [coords, pos]);

  const opposite = useMemo(() => (pos ? computeAntipode(pos) : null), [pos]);

  return (
    <div
      className={cn(
        "min-h-dvh p-6 sm:p-10 flex flex-col items-center gap-6",
        className,
      )}
    >
      <h1 className="text-2xl font-semibold tracking-tight">
        Find your antipode
      </h1>

      {status.state === "locating" && (
        <p className="text-sm text-muted-foreground">
          Requesting your location…
        </p>
      )}

      {status.state === "error" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-destructive">
            {status.message ?? "Failed to get location"}
          </p>
          <button
            type="button"
            onClick={request}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-secondary"
          >
            Try again
          </button>
        </div>
      )}

      {pos && (
        <div className="w-full max-w-xl rounded-lg border p-4 flex flex-col gap-2">
          <h2 className="text-base font-medium">Your location</h2>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Latitude</span>
            <span className="font-mono">{format(pos.lat)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Longitude</span>
            <span className="font-mono">{format(pos.lon)}</span>
          </div>
        </div>
      )}

      {pos && opposite && (
        <div className="w-full max-w-4xl flex flex-col gap-4">
          <div className="w-full max-w-xl rounded-lg border p-4 flex flex-col gap-2">
            <h2 className="text-base font-medium">Antipode</h2>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Latitude</span>
              <span className="font-mono">{format(opposite.lat)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Longitude</span>
              <span className="font-mono">{format(opposite.lon)}</span>
            </div>
            <a
              className="text-xs text-muted-foreground hover:underline"
              href={`https://www.openstreetmap.org/?mlat=${opposite.lat}&mlon=${opposite.lon}#map=8/${opposite.lat}/${opposite.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in OpenStreetMap ↗
            </a>
          </div>

          <AntipodeMaps pos={pos} onDrag={setPos} />
        </div>
      )}
    </div>
  );
};

export default Home;
