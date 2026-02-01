import { NewDiaryForm } from "@/components/diary/NewDiaryForm";

export default function NewDiaryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">새 일기 작성</h1>
      <NewDiaryForm />
    </div>
  );
}
