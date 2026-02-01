import { notFound } from "next/navigation";
import Link from "next/link";
import { getDiary } from "@/app/actions/diary";
import { EditDiaryForm } from "@/components/diary/EditDiaryForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function DiaryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diary = await getDiary(id);

  if (!diary) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/diary/${id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            돌아가기
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-semibold">일기 수정</h1>

      <EditDiaryForm diary={diary} />
    </div>
  );
}
