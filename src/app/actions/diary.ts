"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

export type CreateDiaryState = {
  error?: string;
};

export async function createDiary(
  _prevState: CreateDiaryState,
  formData: FormData
): Promise<CreateDiaryState> {
  let diaryId: string | null = null;

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
    const dateValue = diaryDate || new Date().toISOString().split("T")[0];

    const insertData = {
      title: title.trim(),
      content,
      emotion: emotion || null,
      weather: weather || null,
      diary_date: dateValue,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("diary")
      .insert(insertData as never) // Supabase Insert 타입 추론 제한 우회
      .select("id")
      .single();

    if (error) {
      console.error("Diary insert error:", error);
      return { error: `일기 저장에 실패했습니다. (${error.message})` };
    }

    diaryId = (data as { id: string } | null)?.id ?? null;
    if (!diaryId) {
      return { error: "일기 저장에 실패했습니다." };
    }
  } catch (err) {
    console.error("createDiary error:", err);
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    return { error: `일기 저장 중 오류가 발생했습니다. (${message})` };
  }

  revalidatePath("/");
  redirect(`/diary/${diaryId!}`);
}
