import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SUPABASE_TABLE } from "@/lib/supabase/constants";
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from "@/lib/diary-constants";
import { extractTextFromTiptap } from "@/lib/utils";
import type { Diary } from "@/lib/supabase/types";

export default async function HomePage() {
  const supabase = createSupabaseServer();

  const { data: diaries, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold">최근 일기</h1>
        <p className="text-destructive">일기 목록을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  const diaryList = (diaries ?? []) as Diary[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">최근 일기</h1>

      {diaryList.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
          아직 작성한 일기가 없습니다.
          <br />
          <Link href="/new" className="mt-2 inline-block text-primary underline">
            새 일기 작성하기
          </Link>
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {diaryList.map((diary) => (
            <li key={diary.id}>
              <Link
                href={`/diary/${diary.id}`}
                className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
              >
                <h2 className="mb-2 line-clamp-1 font-semibold">{diary.title}</h2>
                <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {new Date(diary.diary_date).toLocaleDateString("ko-KR")}
                  </span>
                  {diary.emotion && (
                    <span>
                      {EMOTION_OPTIONS.find((e) => e.value === diary.emotion)
                        ?.emoji ?? diary.emotion}
                    </span>
                  )}
                  {diary.weather && (
                    <span>
                      {WEATHER_OPTIONS.find((w) => w.value === diary.weather)
                        ?.emoji ?? diary.weather}
                    </span>
                  )}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {extractTextFromTiptap(diary.content) || "내용 없음"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}