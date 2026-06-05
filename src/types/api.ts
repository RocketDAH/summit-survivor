// API Type Definitions

export interface ScoreSubmission {
  playerName: string;
  score: number;
  altitude: number;
  timeSpent: number;
  eventsCollected: number;
  victory: boolean;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  altitude: number;
  timeSpent: number;
  victory: boolean;
  createdAt: string;
  rank?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SubmitScoreResponse {
  entry: LeaderboardEntry;
  rank: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
}
