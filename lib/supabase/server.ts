import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase 클라이언트 (서버 전용)
 * Server Components, Server Actions에서 사용
 */
export function createSupabaseServer() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
