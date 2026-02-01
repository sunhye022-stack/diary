import Link from "next/link";
import type { Diary } from "@/lib/supabase/types";
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from "@/lib/diary-constants";
import {
  getFirstImageFromContent,
  getTextPreviewFromContent,
} from "@/lib/tiptap-utils";

interface DiaryCardProps {
  diary: Diary;
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const firstImage = getFirstImageFromContent(diary.content);
  const preview = getTextPreviewFromContent(diary.content, 80);
  const emotionEmoji =
    diary.emotion &&
    (EMOTION_OPTIONS.find((e) => e.value === diary.emotion)?.emoji ??
      diary.emotion);
  const weatherEmoji =
    diary.weather &&
    (WEATHER_OPTIONS.find((w) => w.value === diary.weather)?.emoji ??
      diary.weather);

  return (
    <Link
      href={`/diary/${diary.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-primary/50 hover:shadow-md"
    >
      {firstImage && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={firstImage}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-semibold group-hover:text-primary">
          {diary.title}
        </h3>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {new Date(diary.diary_date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          {(emotionEmoji || weatherEmoji) && (
            <span className="flex gap-0.5">
              {emotionEmoji}
              {weatherEmoji}
            </span>
          )}
        </p>
        {preview && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{preview}</p>
        )}
      </div>
    </Link>
  );
}
