import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ScoreSubmission, ApiResponse, SubmitScoreResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body: ScoreSubmission = await request.json();

    // Validate input
    if (!body.playerName || body.playerName.trim().length === 0) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Player name is required" },
        { status: 400 }
      );
    }

    if (body.playerName.length > 20) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Player name must be 20 characters or less" },
        { status: 400 }
      );
    }

    // Insert score
    const { data: insertedScore, error: insertError } = await supabase
      .from("scores")
      .insert({
        player_name: body.playerName.trim(),
        score: body.score,
        altitude: body.altitude,
        time_spent: body.timeSpent,
        events_collected: body.eventsCollected,
        victory: body.victory,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting score:", insertError);
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Failed to save score" },
        { status: 500 }
      );
    }

    // Get rank
    const { count: higherScores } = await supabase
      .from("scores")
      .select("*", { count: "exact", head: true })
      .gt("score", body.score);

    const rank = (higherScores ?? 0) + 1;

    const response: SubmitScoreResponse = {
      entry: {
        id: insertedScore.id,
        playerName: insertedScore.player_name,
        score: insertedScore.score,
        altitude: insertedScore.altitude,
        timeSpent: insertedScore.time_spent,
        victory: insertedScore.victory,
        createdAt: insertedScore.created_at,
        rank,
      },
      rank,
    };

    return NextResponse.json<ApiResponse<SubmitScoreResponse>>(
      { success: true, data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/scores:", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
