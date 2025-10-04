"use client";

import { useMemo } from "react";
import { type LatLngExpression } from "leaflet";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { computeAntipode, type Coordinates } from "@/lib/services/antipode";

interface Props {
  pos: Coordinates;
  onDrag: (next: Coordinates) => void;
}

const makeDivIcon = (color: string, size: number = 24) =>
  L.divIcon({
    className: "",
    iconSize: [size, size],
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px rgba(0,0,0,0.1);"><div style="width:8px;height:8px;border-radius:50%;background:white;"></div></div>`,
  });

const primaryIcon = makeDivIcon("#3b82f6", 28);
const secondaryIcon = makeDivIcon("#8b5cf6", 28);

const toLatLng = ({ lat, lon }: Readonly<Coordinates>): LatLngExpression => [
  lat,
  lon,
];

const AntipodeMaps = ({ pos, onDrag }: Readonly<Props>) => {
  const anti = useMemo(() => computeAntipode(pos), [pos]);

  return (
    <div className="fixed inset-0 grid grid-cols-1 lg:grid-cols-2">
      {/* Your Location Map - Full Screen */}
      <div className="relative h-full">
        <MapContainer
          center={toLatLng(pos)}
          zoom={4}
          className="w-full h-full"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={toLatLng(pos)}
            draggable
            icon={primaryIcon}
            eventHandlers={{
              dragend: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onDrag({ lat: ll.lat, lon: ll.lng });
              },
            }}
          />
        </MapContainer>

        {/* Drag hint overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 pointer-events-none">
          <p className="text-xs text-white/80">Drag marker to explore</p>
        </div>
      </div>

      {/* Antipode Map - Full Screen */}
      <div className="relative h-full border-l border-white/10">
        <MapContainer
          center={toLatLng(anti)}
          zoom={4}
          className="w-full h-full"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={toLatLng(anti)} icon={secondaryIcon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default AntipodeMaps;
