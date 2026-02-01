"use client";

import { useState, useCallback, useEffect } from "react";
import { useActionState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiaryEditor } from "./DiaryEditor";
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from "@/lib/diary-constants";
import { updateDiary } from "@/app/actions/diary";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import type { Diary } from "@/lib/supabase/types";

interface EditDiaryFormProps {
  diary: Diary;
}

const DEFAULT_CONTENT = { type: "doc", content: [{ type: "paragraph" }] };

export function EditDiaryForm({ diary }: EditDiaryFormProps) {
  const [title, setTitle] = useState(diary.title);
  const [content, setContent] = useState<object>(
    (diary.content as object) ?? DEFAULT_CONTENT
  );
  const [isUploading, setIsUploading] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(diary.emotion);
  const [weather, setWeather] = useState<string | null>(diary.weather);
  const [diaryDate, setDiaryDate] = useState<Date>(
    new Date(diary.diary_date)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [state, formAction, isPending] = useActionState(updateDiary, {});

  useEffect(() => {
    setTitle(diary.title);
    setContent((diary.content as object) ?? DEFAULT_CONTENT);
    setEmotion(diary.emotion);
    setWeather(diary.weather);
    setDiaryDate(new Date(diary.diary_date));
  }, [diary]);

  const handleContentChange = useCallback((json: object) => {
    setContent(json);
  }, []);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={diary.id} />
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <input
        type="hidden"
        name="diary_date"
        value={format(diaryDate, "yyyy-MM-dd")}
      />

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          제목 <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="일기 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">내용</label>
        <DiaryEditor
          content={content}
          onChange={handleContentChange}
          onUploadingChange={setIsUploading}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">감정</label>
          <div className="flex gap-2">
            {EMOTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() =>
                  setEmotion(emotion === opt.value ? null : opt.value)
                }
                className={cn(
                  "flex size-10 items-center justify-center rounded-md border text-xl transition-colors",
                  emotion === opt.value
                    ? "border-primary bg-primary/10"
                    : "border-input hover:bg-accent"
                )}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
          <input type="hidden" name="emotion" value={emotion ?? ""} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">날씨</label>
          <div className="flex gap-2">
            {WEATHER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() =>
                  setWeather(weather === opt.value ? null : opt.value)
                }
                className={cn(
                  "flex size-10 items-center justify-center rounded-md border text-xl transition-colors",
                  weather === opt.value
                    ? "border-primary bg-primary/10"
                    : "border-input hover:bg-accent"
                )}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
          <input type="hidden" name="weather" value={weather ?? ""} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">작성 날짜</label>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDatePicker((prev) => !prev)}
              className="min-w-[140px] justify-start gap-2"
            >
              <CalendarIcon className="size-4" />
              {format(diaryDate, "PPP", { locale: ko })}
            </Button>
            {showDatePicker && (
              <div className="absolute left-0 top-full z-10 mt-1 rounded-md border bg-popover p-3 shadow-md">
                <Calendar
                  mode="single"
                  selected={diaryDate}
                  onSelect={(date) => {
                    if (date) setDiaryDate(date);
                    setShowDatePicker(false);
                  }}
                  locale={ko}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending || isUploading}>
          {isPending ? "저장 중..." : isUploading ? "이미지 업로드 중..." : "저장"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href={`/diary/${diary.id}`}>취소</a>
        </Button>
      </div>
    </form>
  );
}
