export interface Coordinates {
  lat: number;
  lon: number;
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const normalizeLongitude = (lon: number): number => {
  const x = ((((lon + 180) % 360) + 360) % 360) - 180;
  return x === -180 ? 180 : x;
};

export const computeAntipode = ({
  lat,
  lon,
}: Readonly<Coordinates>): Coordinates => {
  const antipodeLat = -lat;
  const antipodeLon = normalizeLongitude(lon >= 0 ? lon - 180 : lon + 180);
  return {
    lat: clamp(antipodeLat, -90, 90),
    lon: antipodeLon,
  };
};
