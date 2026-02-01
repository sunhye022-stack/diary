import { createSupabaseServer } from "@/lib/supabase/server";
import { SUPABASE_TABLE } from "@/lib/supabase/constants";
import { EMOTION_OPTIONS, WEATHER_OPTIONS } from "@/lib/diary-constants";
import type { Diary } from "@/lib/supabase/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DiaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const diary = data as Diary;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{diary.title}</h1>
        <Button variant="outline" asChild>
          <Link href="/">목록으로</Link>
        </Button>
      </div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{new Date(diary.diary_date).toLocaleDateString("ko-KR")}</span>
        {diary.emotion && (
          <span>
            {EMOTION_OPTIONS.find((e) => e.value === diary.emotion)?.emoji ??
              diary.emotion}
          </span>
        )}
        {diary.weather && (
          <span>
            {WEATHER_OPTIONS.find((w) => w.value === diary.weather)?.emoji ??
              diary.weather}
          </span>
        )}
      </p>
      <div
        className="prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-4"
        dangerouslySetInnerHTML={{
          __html: renderTiptapToHtml(diary.content),
        }}
      />
    </div>
  );
}

type TiptapNode = {
  type?: string;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string }[];
};

function renderTiptapToHtml(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const node = content as TiptapNode;
  if (!node.type) return "";

  const renderChildren = (nodes: TiptapNode[]) =>
    nodes.map(renderTiptapToHtml).join("");

  const children = Array.isArray(node.content)
    ? renderChildren(node.content)
    : "";

  switch (node.type) {
    case "doc":
      return children;
    case "paragraph":
      return `<p>${children || "<br>"}</p>`;
    case "text": {
      let text = escapeHtml(node.text ?? "");
      for (const mark of node.marks ?? []) {
        if (mark.type === "bold") text = `<strong>${text}</strong>`;
        else if (mark.type === "italic") text = `<em>${text}</em>`;
        else if (mark.type === "underline") text = `<u>${text}</u>`;
        else if (mark.type === "strike") text = `<s>${text}</s>`;
        else if (mark.type === "code") text = `<code>${text}</code>`;
      }
      return text;
    }
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children}</code></pre>`;
    case "hardBreak":
      return "<br>";
    default:
      return children;
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}
