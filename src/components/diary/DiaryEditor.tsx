"use client";

import { Tiptap, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useTiptap } from "@tiptap/react";
import type { EditorView } from "@tiptap/pm/view";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadImageToSupabase } from "@/lib/imageUpload";

const EDITOR_PLACEHOLDER = "오늘 하루는 어땠나요? 일기를 작성해 보세요.";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

function isImageFile(file: File): boolean {
  return IMAGE_TYPES.includes(file.type);
}

function getImageFilesFromDataTransfer(dt: DataTransfer | null): File[] {
  if (!dt) return [];
  const files: File[] = [];
  if (dt.items) {
    for (let i = 0; i < dt.items.length; i++) {
      const file = dt.items[i].getAsFile();
      if (file && isImageFile(file)) files.push(file);
    }
  }
  if (files.length === 0 && dt.files) {
    for (let i = 0; i < dt.files.length; i++) {
      if (isImageFile(dt.files[i])) files.push(dt.files[i]);
    }
  }
  return files;
}

async function uploadImage(file: File): Promise<string> {
  const { url } = await uploadImageToSupabase(file);
  return url;
}

function insertImagesAtPosition(
  view: EditorView,
  position: number,
  srcs: string[]
): void {
  const { state, dispatch } = view;
  const { schema } = state;
  const imageType = schema.nodes.image;
  if (!imageType) return;

  const nodes = srcs.map((src) => imageType.create({ src }));
  const tr = state.tr.insert(position, nodes);
  dispatch(tr);
}

function uploadImagesAndInsert(
  files: File[],
  view: EditorView,
  position: number,
  onUploadingChange?: (uploading: boolean) => void
): void {
  onUploadingChange?.(true);
  const id = toast.loading(`${files.length}개 이미지 업로드 중...`);
  Promise.allSettled(files.map(uploadImage))
    .then((results) => {
      const srcs = results
        .filter(
          (r): r is PromiseFulfilledResult<string> => r.status === "fulfilled"
        )
        .map((r) => r.value);
      const fulfilledCount = srcs.length;
      const totalCount = files.length;

      toast.dismiss(id);
      if (fulfilledCount === totalCount) {
        toast.success("모든 이미지가 업로드되었습니다.");
      } else if (fulfilledCount > 0) {
        toast.warning("일부 이미지 업로드에 실패했습니다.");
      } else {
        toast.error("이미지 업로드에 실패했습니다.");
      }

      if (srcs.length > 0) insertImagesAtPosition(view, position, srcs);
    })
    .finally(() => {
      onUploadingChange?.(false);
    });
}

function ToolbarButton({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
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
}

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
  onUploadingChange?: (isUploading: boolean) => void;
  placeholder?: string;
  className?: string;
}

export function DiaryEditor({
  content,
  onChange,
  onUploadingChange,
  placeholder = EDITOR_PLACEHOLDER,
  className,
}: DiaryEditorProps) {
  const handleUploadingChange = (uploading: boolean) => {
    onUploadingChange?.(uploading);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
    ],
    content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] px-4 py-3 focus:outline-none prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-4 [&_img]:max-w-full [&_img]:rounded-md",
        "data-placeholder": placeholder,
      },
      handleDOMEvents: {
        paste: (view, event) => {
          const files = getImageFilesFromDataTransfer(event.clipboardData);
          if (files.length === 0) return false;

          event.preventDefault();
          const position = view.state.selection.from;
          uploadImagesAndInsert(files, view, position, handleUploadingChange);
          return true;
        },
      },
      handleDrop(view, event) {
        const files = getImageFilesFromDataTransfer(event.dataTransfer);
        if (files.length === 0) return false;

        event.preventDefault();
        const coords = { left: event.clientX, top: event.clientY };
        const pos = view.posAtCoords(coords)?.pos ?? view.state.selection.from;
        uploadImagesAndInsert(files, view, pos, handleUploadingChange);
        return true;
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
