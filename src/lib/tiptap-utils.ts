import type { Json } from "@/lib/supabase/types";

type TiptapNode = {
  type?: string;
  content?: TiptapNode[];
  text?: string;
  attrs?: { src?: string };
};

/** Tiptap JSON 콘텐츠에서 첫 번째 이미지 URL 추출 */
export function getFirstImageFromContent(content: Json | null): string | null {
  if (!content || typeof content !== "object") return null;
  const node = content as TiptapNode;
  if (node.type === "image" && node.attrs?.src) return node.attrs.src;
  if (!Array.isArray(node.content)) return null;

  for (const child of node.content) {
    const found = getFirstImageFromContent(child as Json);
    if (found) return found;
  }
  return null;
}

/** Tiptap JSON 콘텐츠에서 평문 텍스트 추출 (미리보기용) */
function extractText(node: TiptapNode): string {
  if (!node) return "";
  if (node.text) return node.text;
  if (!Array.isArray(node.content)) return "";
  return node.content.map(extractText).join("");
}

/** Tiptap JSON 콘텐츠에서 텍스트 미리보기 추출 */
export function getTextPreviewFromContent(
  content: Json | null,
  maxLength = 100
): string {
  if (!content || typeof content !== "object") return "";
  const text = extractText(content as TiptapNode).trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
