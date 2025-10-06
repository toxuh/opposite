export interface ElevationData {
  elevation: number;
  error?: string;
}

export const fetchElevation = async (
  lat: number,
  lon: number,
): Promise<number | null> => {
  try {
    const response = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`,
    );

    if (!response.ok) {
      console.error("Elevation API error:", response.status);
      return null;
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return Math.round(data.results[0].elevation);
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch elevation:", error);
    return null;
  }
};
