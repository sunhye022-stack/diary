import path from "path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Server Actions에서 환경 변수 미로드 시 .env.local 명시적 로드
config({ path: path.resolve(process.cwd(), ".env.local") });

/**
 * Supabase 클라이언트 (서버 전용)
 * Server Components, Server Actions에서 사용
 */
export function createSupabaseServer() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.SUPABASE_ANON_KEY;

  const missing: string[] = [];
  if (!supabaseUrl?.trim()) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseAnonKey?.trim()) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (missing.length > 0) {
    throw new Error(
      `Supabase 환경 변수가 설정되지 않았습니다: ${missing.join(", ")}. .env.local에 NEXT_PUBLIC_SUPABASE_ANON_KEY=키값 형식으로 한 줄에 작성했는지 확인하세요. (값에 공백이나 줄바꿈 없이)`
    );
  }

  return createClient<Database>(supabaseUrl!, supabaseAnonKey!);
}
