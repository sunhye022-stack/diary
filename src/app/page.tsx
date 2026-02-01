import Link from "next/link";
import { getDiaries } from "@/app/actions/diary";
import { DiaryCard } from "@/components/diary/DiaryCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type MainPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function MainPage({ searchParams }: MainPageProps) {
  const { search } = await searchParams;
  const diaries = await getDiaries(search);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">최근 일기</h1>
        <Button asChild>
          <Link href="/new" className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            새 일기 작성
          </Link>
        </Button>
      </div>

      {diaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="mb-2 text-muted-foreground">
            아직 작성된 일기가 없습니다.
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            새 일기를 작성해 보세요.
          </p>
          <Button asChild>
            <Link href="/new" className="inline-flex items-center gap-2">
              <Plus className="size-4" />
              새 일기 작성
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {diaries.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </div>
      )}
    </div>
  );
}
