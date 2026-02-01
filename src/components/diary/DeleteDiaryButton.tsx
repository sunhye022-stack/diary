"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteDiary } from "@/app/actions/diary";

interface DeleteDiaryButtonProps {
  diaryId: string;
}

export function DeleteDiaryButton({ diaryId }: DeleteDiaryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("정말 이 일기를 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      const result = await deleteDiary(diaryId);
      if (result?.error) {
        alert(result.error);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      title="일기 삭제"
      className="inline-flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 className="size-4" />
      {isDeleting ? "삭제 중..." : "삭제"}
    </Button>
  );
}
