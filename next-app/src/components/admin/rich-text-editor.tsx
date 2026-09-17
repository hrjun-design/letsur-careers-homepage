"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, List, ListOrdered } from "lucide-react";
import { cn } from "cn";

/**
 * `/admin/recruit`의 "상세 설명" 필드용 리치텍스트 에디터 — 원래 HTML을 textarea에 직접
 * 입력하던 자리를 대체(2026-09-14). 웹플로우 에디터처럼 태그 없이 보이는 대로 편집하고,
 * 내부적으로는 여전히 HTML 문자열(`description_html`)을 생성해 기존 DB 컬럼·스키마 그대로 사용.
 */
type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
        active && "bg-muted text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rte-content",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col rounded border border-input">
      <div className="flex items-center gap-0.5 border-b border-input px-1.5 py-1">
        <ToolbarButton
          label="굵게"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="기울임"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-input" />
        <ToolbarButton
          label="소제목 (큰)"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="소제목 (작은)"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-input" />
        <ToolbarButton
          label="글머리 기호 목록"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="번호 매기기 목록"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      {/*
        이 프로젝트 Tailwind 테마는 --spacing를 named 스케일로 재정의해두면서 임의 숫자
        유틸리티(px-3, w-full, max-w-none, [&_h2]:... 등)가 생성되지 않는 문제가 있음
        (2026-09-14 확인 — ProseMirror 콘텐츠가 한글 글자 단위로 줄바꿈되는 형태로 나타남).
        Tailwind에 의존하지 않는 순수 CSS로 우회.
      */}
      <style jsx global>{`
        .rte-content {
          display: block;
          width: 100%;
          box-sizing: border-box;
          min-height: 160px;
          padding: 8px 12px;
          font-size: 15px;
          line-height: 1.6;
          outline: none;
        }
        .rte-content h2 {
          margin: 16px 0 4px;
          font-size: 18px;
          font-weight: 600;
        }
        .rte-content h2:first-child {
          margin-top: 0;
        }
        .rte-content h3 {
          margin: 16px 0 4px;
          font-size: 16px;
          font-weight: 600;
        }
        .rte-content h3:first-child {
          margin-top: 0;
        }
        .rte-content p {
          margin: 0 0 8px;
        }
        .rte-content ul {
          margin: 0 0 8px;
          padding-left: 20px;
          list-style: disc;
        }
        .rte-content ol {
          margin: 0 0 8px;
          padding-left: 20px;
          list-style: decimal;
        }
        .rte-content li {
          margin-bottom: 2px;
        }
      `}</style>
    </div>
  );
}
