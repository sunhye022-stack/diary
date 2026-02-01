"use client";

import { Tiptap, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useTiptap } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const EDITOR_PLACEHOLDER = "오늘 하루는 어땠나요? 일기를 작성해 보세요.";

function EditorToolbar() {
  const { editor, isReady } = useTiptap();

  if (!isReady || !editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () =>
    editor.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () =>
    editor.chain().focus().toggleCodeBlock().run();

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={onClick}
      title={title}
      className={cn(
        "size-8 rounded",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {children}
    </Button>
  );

  return (
    <div className="flex flex-wrap gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
      <ToolbarButton
        onClick={toggleBold}
        isActive={editor.isActive("bold")}
        title="굵게"
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleItalic}
        isActive={editor.isActive("italic")}
        title="기울임"
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleUnderline}
        isActive={editor.isActive("underline")}
        title="밑줄"
      >
        <Underline className="size-4" />
      </ToolbarButton>
      <div className="mx-1 w-px self-stretch bg-border" />
      <ToolbarButton
        onClick={toggleBulletList}
        isActive={editor.isActive("bulletList")}
        title="글머리 기호"
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleOrderedList}
        isActive={editor.isActive("orderedList")}
        title="번호 매기기"
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <div className="mx-1 w-px self-stretch bg-border" />
      <ToolbarButton
        onClick={toggleBlockquote}
        isActive={editor.isActive("blockquote")}
        title="인용구"
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleCodeBlock}
        isActive={editor.isActive("codeBlock")}
        title="코드 블록"
      >
        <Code className="size-4" />
      </ToolbarButton>
    </div>
  );
}

interface DiaryEditorProps {
  content?: object;
  onChange?: (json: object) => void;
  placeholder?: string;
  className?: string;
}

export function DiaryEditor({
  content,
  onChange,
  placeholder = EDITOR_PLACEHOLDER,
  className,
}: DiaryEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] px-4 py-3 focus:outline-none prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input bg-background",
        className
      )}
    >
      <Tiptap instance={editor}>
        <EditorToolbar />
        <Tiptap.Loading>
          <div className="min-h-[200px] animate-pulse bg-muted/30" />
        </Tiptap.Loading>
        <Tiptap.Content />
      </Tiptap>
    </div>
  );
}
