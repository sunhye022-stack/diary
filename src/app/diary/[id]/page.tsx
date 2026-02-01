import { notFound } from "next/navigation";
import Link from "next/link";
import { getDiary } from "@/app/actions/diary";
import { DiaryContent } from "@/components/diary/DiaryContent";
import { Button } from "@/components/ui/button";
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from "@/lib/diary-constants";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

export default async function DiaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diary = await getDiary(id);

  if (!diary) {
    notFound();
  }

  const emotionEmoji =
    diary.emotion &&
    (EMOTION_OPTIONS.find((e) => e.value === diary.emotion)?.emoji ??
      diary.emotion);
  const weatherEmoji =
    diary.weather &&
    (WEATHER_OPTIONS.find((w) => w.value === diary.weather)?.emoji ??
      diary.weather);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            목록으로
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/diary/${id}/edit`} className="inline-flex items-center gap-2">
              <Pencil className="size-4" />
              수정
            </Link>
          </Button>
          <Button variant="outline" size="sm" disabled title="삭제 기능은 추후 구현 예정">
            <Trash2 className="size-4" />
            삭제
          </Button>
        </div>
      </div>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{diary.title}</h1>
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            {new Date(diary.diary_date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>
            {new Date(diary.created_at).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {(emotionEmoji || weatherEmoji) && (
            <span className="flex gap-1">
              {emotionEmoji}
              {weatherEmoji}
            </span>
          )}
        </p>
      </header>

      <DiaryContent
        content={diary.content}
        className="prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-4 [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md"
      />
    </div>
  );
}
