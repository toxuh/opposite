import { NextRequest, NextResponse } from "next/server";

import { fetchElevation } from "@/lib/services/elevation";

interface ElevationRequest {
  userLat: number;
  userLon: number;
  antipodeLat: number;
  antipodeLon: number;
}

interface ElevationResponse {
  userElevation: number | null;
  antipodeElevation: number | null;
  error?: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: ElevationRequest = await req.json();
    const { userLat, userLon, antipodeLat, antipodeLon } = body;

    const [userElevation, antipodeElevation] = await Promise.all([
      fetchElevation(userLat, userLon),
      fetchElevation(antipodeLat, antipodeLon),
    ]);

    return NextResponse.json({
      userElevation,
      antipodeElevation,
    } as ElevationResponse);
  } catch (error) {
    console.error("Elevation API error:", error);
    return NextResponse.json(
      {
        userElevation: null,
        antipodeElevation: null,
        error: "Failed to fetch elevation data",
      } as ElevationResponse,
      { status: 500 },
    );
  }
};
