import { type Coordinates } from "./antipode";

export interface GeodesicPoint {
  lat: number;
  lon: number;
}

export const calculateGeodesicPath = (
  from: Coordinates,
  to: Coordinates,
  numPoints: number = 100,
): GeodesicPoint[] => {
  const points: GeodesicPoint[] = [];

  const lat1 = (from.lat * Math.PI) / 180;
  const lon1 = (from.lon * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const lon2 = (to.lon * Math.PI) / 180;

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.pow(Math.sin((lon1 - lon2) / 2), 2),
      ),
    );

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;

    const a = Math.sin((1 - f) * d) / Math.sin(d);
    const b = Math.sin(f * d) / Math.sin(d);

    const x =
      a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
    const y =
      a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);

    points.push({
      lat: (lat * 180) / Math.PI,
      lon: (lon * 180) / Math.PI,
    });
  }

  return points;
};
