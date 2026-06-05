import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ApiResponse, LeaderboardResponse, LeaderboardEntry } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch leaderboard entries
    const { data: scores, error, count } = await supabase
      .from("scores")
      .select("*", { count: "exact" })
      .order("score", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    const entries: LeaderboardEntry[] = (scores || []).map((score, index) => ({
      id: score.id,
      playerName: score.player_name,
      score: score.score,
      altitude: score.altitude,
      timeSpent: score.time_spent,
      victory: score.victory,
      createdAt: score.created_at,
      rank: offset + index + 1,
    }));

    const response: LeaderboardResponse = {
      entries,
      total: count || 0,
    };

    return NextResponse.json<ApiResponse<LeaderboardResponse>>(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
