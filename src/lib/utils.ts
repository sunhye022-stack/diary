import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Tiptap JSON content에서 텍스트 추출 (미리보기용) */
export function extractTextFromTiptap(content: unknown, maxLength = 100): string {
  if (!content || typeof content !== "object") return ""
  const node = content as { type?: string; content?: unknown[]; text?: string }
  if (!node.type) return ""

  if (node.type === "text") {
    return (node.text ?? "").trim()
  }

  if (Array.isArray(node.content)) {
    const text = node.content
      .map((child) => extractTextFromTiptap(child, maxLength))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text
  }

  return ""
}
