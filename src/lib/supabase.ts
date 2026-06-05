import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ScoreRecord = {
  id: string;
  player_name: string;
  score: number;
  altitude: number;
  time_spent: number;
  events_collected: number;
  victory: boolean;
  created_at: string;
};
