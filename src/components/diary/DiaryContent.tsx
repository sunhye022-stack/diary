"use client";

import { Fragment, type ReactNode } from "react";

type TiptapNode = {
  type?: string;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string }[];
  attrs?: { src?: string; alt?: string; title?: string };
};

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

function renderTiptapNode(node: TiptapNode): ReactNode {
  if (!node || !node.type) return null;

  const children = Array.isArray(node.content)
    ? node.content.map((child, index) => (
        <Fragment key={index}>{renderTiptapNode(child)}</Fragment>
      ))
    : null;

  switch (node.type) {
    case "doc":
      return <>{children}</>;
    case "paragraph":
      return <p>{children ?? <br />}</p>;
    case "text": {
      let text: ReactNode = escapeHtml(node.text ?? "");
      for (const mark of node.marks ?? []) {
        if (mark.type === "bold") text = <strong>{text}</strong>;
        else if (mark.type === "italic") text = <em>{text}</em>;
        else if (mark.type === "underline") text = <u>{text}</u>;
        else if (mark.type === "strike") text = <s>{text}</s>;
        else if (mark.type === "code") text = <code>{text}</code>;
      }
      return <>{text}</>;
    }
    case "bulletList":
      return <ul>{children}</ul>;
    case "orderedList":
      return <ol>{children}</ol>;
    case "listItem":
      return <li>{children}</li>;
    case "blockquote":
      return <blockquote>{children}</blockquote>;
    case "codeBlock":
      return (
        <pre>
          <code>{children}</code>
        </pre>
      );
    case "hardBreak":
      return <br />;
    case "image": {
      const src = node.attrs?.src;
      if (!src) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={node.attrs?.alt ?? ""}
          title={node.attrs?.title}
          className="my-2 block max-w-full rounded-md"
        />
      );
    }
    default:
      return <>{children}</>;
  }
}

interface DiaryContentProps {
  content: unknown;
  className?: string;
}

export function DiaryContent({ content, className }: DiaryContentProps) {
  if (!content || typeof content !== "object") return null;

  const node = content as TiptapNode;
  if (node.type !== "doc") return null;

  return (
    <div
      className={
        className ??
        "prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-4 [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md"
      }
    >
      {renderTiptapNode(node)}
    </div>
  );
}
