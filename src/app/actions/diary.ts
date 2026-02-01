"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SUPABASE_TABLE } from "@/lib/supabase/constants";
import type { Json } from "@/lib/supabase/types";
import type { Diary } from "@/lib/supabase/types";

/** 일기 목록 조회 (최신순) - Server Component에서 사용 */
export async function getDiaries(search?: string | null): Promise<Diary[]> {
  const supabase = createSupabaseServer();
  let query = supabase
    .from(SUPABASE_TABLE)
    .select("*")
    .order("diary_date", { ascending: false })
    .order("created_at", { ascending: false });

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    query = query.ilike("title", `%${trimmedSearch}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getDiaries error:", error);
    return [];
  }
  return (data ?? []) as Diary[];
}

/** 날짜별 일기 맵 조회 - 캘린더용 (날짜 -> 일기 목록) */
export async function getDiaryDatesMap(): Promise<
  Record<
    string,
    {
      id: string;
      title: string;
      created_at: string;
      emotion: string | null;
      weather: string | null;
    }[]
  >
> {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("id, title, diary_date, created_at, emotion, weather")
    .order("diary_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getDiaryDatesMap error:", error);
    return {};
  }

  const map: Record<
    string,
    {
      id: string;
      title: string;
      created_at: string;
      emotion: string | null;
      weather: string | null;
    }[]
  > = {};
  for (const row of data ?? []) {
    const date = (row as { diary_date: string }).diary_date;
    if (!date) continue;
    if (!map[date]) map[date] = [];
    map[date].push({
      id: (row as { id: string }).id,
      title: (row as { title: string }).title ?? "",
      created_at: (row as { created_at: string }).created_at ?? "",
      emotion: (row as { emotion: string | null }).emotion ?? null,
      weather: (row as { weather: string | null }).weather ?? null,
    });
  }
  return map;
}

/** 일기 단건 조회 - Server Component에서 사용 */
export async function getDiary(id: string): Promise<Diary | null> {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Diary;
}

export type UpdateDiaryState = {
  error?: string;
};

export async function updateDiary(
  _prevState: UpdateDiaryState,
  formData: FormData
): Promise<UpdateDiaryState> {
  const id = (formData.get("id") as string | null)?.trim();
  if (!id) {
    return { error: "일기 정보를 찾을 수 없습니다." };
  }

  try {
    const title = formData.get("title") as string | null;
    const contentJson = formData.get("content") as string | null;
    const emotion = formData.get("emotion") as string | null;
    const weather = formData.get("weather") as string | null;
    const diaryDate = formData.get("diary_date") as string | null;

    if (!title?.trim()) {
      return { error: "제목을 입력해 주세요." };
    }

    let content: Json = { type: "doc", content: [] };
    if (contentJson) {
      try {
        content = JSON.parse(contentJson) as Json;
      } catch {
        content = { type: "doc", content: [] };
      }
    }

    const supabase = createSupabaseServer();
    const now = new Date().toISOString();
    const dateValue =
      diaryDate ||
      (() => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      })();

    const { error } = await supabase
      .from(SUPABASE_TABLE)
      .update({
        title: title.trim(),
        content,
        emotion: emotion || null,
        weather: weather || null,
        diary_date: dateValue,
        updated_at: now,
      } as never)
      .eq("id", id);

    if (error) {
      console.error("Diary update error:", error);
      return { error: `일기 수정에 실패했습니다. (${error.message})` };
    }
  } catch (err) {
    console.error("updateDiary error:", err);
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return { error: `일기 수정 중 오류가 발생했습니다. (${message})` };
  }

  revalidatePath("/");
  revalidatePath(`/diary/${id}`);
  revalidatePath(`/diary/${id}/edit`);
  redirect("/");
}

export async function deleteDiary(id: string): Promise<{ error?: string }> {
  try {
    const supabase = createSupabaseServer();
    const { error } = await supabase
      .from(SUPABASE_TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Diary delete error:", error);
      return { error: `일기 삭제에 실패했습니다. (${error.message})` };
    }
  } catch (err) {
    console.error("deleteDiary error:", err);
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return { error: `일기 삭제 중 오류가 발생했습니다. (${message})` };
  }

  revalidatePath("/");
  revalidatePath(`/diary/${id}`);
  redirect("/");
}
