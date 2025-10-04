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

const makeDivIcon = (color: string) =>
  L.divIcon({
    className: "",
    iconSize: [18, 18],
    html: `<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.25);"></span>`,
  });

const redIcon = makeDivIcon("#ef4444");
const grayIcon = makeDivIcon("#64748b");

const toLatLng = ({ lat, lon }: Readonly<Coordinates>): LatLngExpression => [
  lat,
  lon,
];

const AntipodeMaps = ({ pos, onDrag }: Readonly<Props>) => {
  const anti = useMemo(() => computeAntipode(pos), [pos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="w-full aspect-video overflow-hidden rounded-lg border">
        <MapContainer center={toLatLng(pos)} zoom={3} className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          <Marker
            position={toLatLng(pos)}
            draggable
            icon={redIcon}
            eventHandlers={{
              dragend: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onDrag({ lat: ll.lat, lon: ll.lng });
              },
            }}
          />
        </MapContainer>
      </div>

      <div className="w-full aspect-video overflow-hidden rounded-lg border">
        <MapContainer
          center={toLatLng(anti)}
          zoom={3}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          <Marker position={toLatLng(anti)} icon={grayIcon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default AntipodeMaps;
