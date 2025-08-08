"use client";
import * as React from "react";

import {
  useEditor,
  EditorContent,
  useEditorState,
  type JSONContent,
} from "@tiptap/react";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import { SubscriptIcon } from "lucide-react";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import { Superscript as SuperscriptIcon } from "lucide-react";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import Image from "@tiptap/extension-image";
import {
  handleImageUpload,
  MAX_FILE_SIZE,
  extractImageUrlsFromJSON,
  stripNodesOfType,
} from "@/lib/tiptap-utils";
import { Button as TiptapButton } from "@/components/tiptap-ui-primitive/button";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  UnderlineIcon,
} from "lucide-react";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { updateNote } from "@/server/notes";

interface RichTextEditorProps {
  content?: JSONContent;
  noteId?: string;
}

const RichTextEditor = ({ content, noteId }: RichTextEditorProps) => {
  const saveTimer = React.useRef<NodeJS.Timeout | null>(null);
  const debouncedSave = React.useCallback((fn: () => void, delay = 500) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(fn, delay);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
      }),
      Blockquote.configure({
        HTMLAttributes: { class: "my-blockquote" }, // optional styling hook
      }),
      Code.configure({
        HTMLAttributes: { class: "my-inline-code" }, // optional styling hook
      }),
      CodeBlock.configure({
        HTMLAttributes: { class: "my-code-block" }, // optional
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "my-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "my-list",
        },
      }),
      ListItem,
      TaskList.configure({
        HTMLAttributes: {
          class: "my-task-list",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "my-task-item",
        },
      }),
      Link.configure({ openOnClick: false }),
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),

      Image,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    immediatelyRender: false,
    autofocus: true,
    editable: true,
    injectCSS: false,
    onUpdate: ({ editor }) => {
      if (!noteId) return;
      const content = editor.getJSON();
      const images = extractImageUrlsFromJSON(content);
      debouncedSave(() => {
        updateNote(noteId, { content, images });
      });
    },
    content: (content
      ? stripNodesOfType(content as JSONContent, "imageUpload")
      : undefined) ?? {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Getting started" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Welcome to the " },
            {
              type: "text",
              text: "Simple Editor",
              marks: [{ type: "italic" }],
            },
            { type: "text", text: " template! This template integrates " },
            { type: "text", text: "open source", marks: [{ type: "bold" }] },
            {
              type: "text",
              text: " UI components and Tiptap extensions licensed under ",
            },
            { type: "text", text: "MIT", marks: [{ type: "bold" }] },
            { type: "text", text: "." },
          ],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Integrate it by following the " },
            {
              type: "text",
              text: "Tiptap UI Components docs",
              marks: [{ type: "code" }],
            },
            { type: "text", text: " or using our CLI tool." },
          ],
        },
        {
          type: "codeBlock",
          content: [{ type: "text", text: "npx @tiptap/cli init" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Features" }],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "A fully responsive rich text editor with built-in support for common formatting and layout tools. Type markdown ",
                },
                { type: "text", text: "**", marks: [{ type: "bold" }] },
                { type: "text", text: " or use keyboard shortcuts " },
                { type: "text", text: "⌘+B", marks: [{ type: "code" }] },
                { type: "text", text: " for most all common markdown marks." },
              ],
            },
          ],
        },
      ],
    },
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return {};
      return {
        isBold: ctx.editor?.isActive("bold"),
        canBold: ctx.editor?.can().chain().focus().toggleBold().run(),
        isItalic: ctx.editor?.isActive("italic"),
        canItalic: ctx.editor?.can().chain().focus().toggleItalic().run(),
        isStrike: ctx.editor?.isActive("strike"),
        canStrike: ctx.editor?.can().chain().focus().toggleStrike().run(),
        isCode: ctx.editor?.isActive("code"),
        canCode: ctx.editor?.can().chain().focus().toggleCode().run(),
        isUnderline: ctx.editor?.isActive("underline"),
        canUnderline: ctx.editor?.can().chain().focus().toggleUnderline().run(),
        isParagraph: ctx.editor?.isActive("paragraph"),
        isHeading1: ctx.editor?.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor?.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor?.isActive("heading", { level: 3 }),
        isBulletList: ctx.editor?.isActive("bulletList"),
        isOrderedList: ctx.editor?.isActive("orderedList"),
        isCodeBlock: ctx.editor?.isActive("codeBlock"),
        isBlockquote: ctx.editor?.isActive("blockquote"),
        canUndo: ctx.editor?.can().chain().focus().undo().run(),
        canRedo: ctx.editor?.can().chain().focus().redo().run(),
      };
    },
  });

  return (
    <div className="w-full max-w-7xl bg-card text-card-foreground rounded-lg overflow-hidden border">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-muted/50 border-b">
        {/* Undo/Redo */}
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={undefined}
          role="button"
          tabIndex={-1}
          disabled={!editorState?.canUndo}
          data-disabled={!editorState?.canUndo}
          aria-label="Undo"
          tooltip="Undo"
          onClick={() => editor?.chain().focus().undo().run()}
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center"
        >
          <Undo className="h-4 w-4" />
        </TiptapButton>
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={undefined}
          role="button"
          tabIndex={-1}
          disabled={!editorState?.canRedo}
          data-disabled={!editorState?.canRedo}
          aria-label="Redo"
          tooltip="Redo"
          onClick={() => editor?.chain().focus().redo().run()}
          className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center"
        >
          <Redo className="h-4 w-4" />
        </TiptapButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Heading Dropdown (Tiptap) */}
        <HeadingDropdownMenu editor={editor} levels={[1, 2, 3]} />

        {/* Lists Dropdown (Tiptap) */}
        {editor && (
          <ListDropdownMenu
            editor={editor}
            types={["bulletList", "orderedList", "taskList"]}
          />
        )}

        {/* Code Block Button (Tiptap UI) */}
        {editor && (
          <CodeBlockButton
            editor={editor}
            className={`size-8 p-0 hover:bg-accent flex items-center justify-center ${
              editor.isActive("codeBlock")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          />
        )}

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={editorState?.isBold ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!editorState?.canBold}
          data-disabled={!editorState?.canBold}
          aria-label="Bold"
          aria-pressed={editorState?.isBold}
          tooltip="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`size-8 p-0 hover:bg-accent flex items-center justify-center ${
            editorState?.isBold
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bold className="h-4 w-4" />
        </TiptapButton>
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={editorState?.isItalic ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!editorState?.canItalic}
          data-disabled={!editorState?.canItalic}
          aria-label="Italic"
          aria-pressed={editorState?.isItalic}
          tooltip="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isItalic
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Italic className="h-4 w-4" />
        </TiptapButton>
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={editorState?.isStrike ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!editorState?.canStrike}
          data-disabled={!editorState?.canStrike}
          aria-label="Strikethrough"
          aria-pressed={editorState?.isStrike}
          tooltip="Strikethrough"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editorState?.isStrike
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Strikethrough className="h-4 w-4" />
        </TiptapButton>

        {/* Blockquote Button (Tiptap UI) */}
        {editor && (
          <BlockquoteButton
            editor={editor}
            className={`size-8 p-0 hover:bg-accent flex items-center justify-center ${
              editor.isActive("blockquote")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          />
        )}

        {/* Code (inline) Button (Tiptap UI) */}
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={editorState?.isCode ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!editorState?.canCode}
          data-disabled={!editorState?.canCode}
          aria-label="Inline Code"
          aria-pressed={editorState?.isCode}
          tooltip="Inline Code"
          onClick={() => editor?.chain().focus().toggleCode().run()}
          className={`size-8 p-0 hover:bg-accent flex items-center justify-center ${
            editorState?.isCode
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </TiptapButton>

        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={editorState?.isUnderline ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!editorState?.canUnderline}
          data-disabled={!editorState?.canUnderline}
          aria-label="Underline"
          aria-pressed={editorState?.isUnderline}
          tooltip="Underline"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editor?.isActive("underline")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </TiptapButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Link Popover from Tiptap UI */}
        <LinkPopover editor={editor} />
        {/* Highlighter Popover from Tiptap UI */}
        <ColorHighlightPopover editor={editor} />
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={editor?.isActive("superscript") ? "on" : "off"}
          role="button"
          tabIndex={-1}
          aria-label="Superscript"
          aria-pressed={editor?.isActive("superscript")}
          tooltip="Superscript"
          onClick={() => editor?.chain().focus().toggleSuperscript().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editor?.isActive("superscript")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <SuperscriptIcon className="h-4 w-4" />
        </TiptapButton>
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={editor?.isActive("subscript") ? "on" : "off"}
          role="button"
          tabIndex={-1}
          aria-label="Subscript"
          aria-pressed={editor?.isActive("subscript")}
          tooltip="Subscript"
          onClick={() => editor?.chain().focus().toggleSubscript().run()}
          className={`size-8 p-0 hover:bg-accent ${
            editor?.isActive("subscript")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <SubscriptIcon className="h-4 w-4" />
        </TiptapButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={
            editor?.isActive({ textAlign: "left" }) ? "on" : "off"
          }
          role="button"
          tabIndex={-1}
          aria-label="Align Left"
          aria-pressed={editor?.isActive({ textAlign: "left" })}
          tooltip="Align Left"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={`size-8 p-0 hover:bg-accent ${
            editor?.isActive({ textAlign: "left" })
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlignLeft className="h-4 w-4" />
        </TiptapButton>
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={
            editor?.isActive({ textAlign: "center" }) ? "on" : "off"
          }
          role="button"
          tabIndex={-1}
          aria-label="Align Center"
          aria-pressed={editor?.isActive({ textAlign: "center" })}
          tooltip="Align Center"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={`size-8 p-0 hover:bg-accent ${
            editor?.isActive({ textAlign: "center" })
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlignCenter className="h-4 w-4" />
        </TiptapButton>
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={
            editor?.isActive({ textAlign: "right" }) ? "on" : "off"
          }
          role="button"
          tabIndex={-1}
          aria-label="Align Right"
          aria-pressed={editor?.isActive({ textAlign: "right" })}
          tooltip="Align Right"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={`size-8 p-0 hover:bg-accent ${
            editor?.isActive({ textAlign: "right" })
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlignRight className="h-4 w-4" />
        </TiptapButton>
        <TiptapButton
          type="button"
          data-style="ghost"
          data-active-state={
            editor?.isActive({ textAlign: "justify" }) ? "on" : "off"
          }
          role="button"
          tabIndex={-1}
          aria-label="Align Justify"
          aria-pressed={editor?.isActive({ textAlign: "justify" })}
          tooltip="Align Justify"
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
          className={`size-8 p-0 hover:bg-accent ${
            editor?.isActive({ textAlign: "justify" })
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlignJustify className="h-4 w-4" />
        </TiptapButton>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Image Upload Button (TipTap) */}
        {editor && <ImageUploadButton editor={editor} text="Add Image" />}
      </div>

      {/* Editor Content */}
      <div className="min-h-96 p-6 bg-card">
        <EditorContent
          editor={editor}
          className="prose prose-neutral dark:prose-invert max-w-none focus:outline-none 
    [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-96 
    [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 
    [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-3 
    [&_.ProseMirror_p]:mb-4 
    [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-border 
    [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic
    [&_.ProseMirror_blockquote]:my-4
    [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:overflow-x-auto 
    [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:rounded
    [&_.ProseMirror_ul:not([data-type='taskList'])]:list-disc [&_.ProseMirror_ul:not([data-type='taskList'])]:pl-6 [&_.ProseMirror_ul:not([data-type='taskList'])]:mb-4
    [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-4
    [&_.ProseMirror_ul[data-type='taskList']]:list-none [&_.ProseMirror_ul[data-type='taskList']]:pl-0 [&_.ProseMirror_ul[data-type='taskList']]:mb-4
    [&_.ProseMirror_ul[data-type='taskList']_.ProseMirror-li]:flex [&_.ProseMirror_ul[data-type='taskList']_.ProseMirror-li]:items-center [&_.ProseMirror_ul[data-type='taskList']_.ProseMirror-li]:gap-2
  [&_.ProseMirror_ul[data-type='taskList']_.ProseMirror-li_input[type='checkbox']]:w-10 [&_.ProseMirror_ul[data-type='taskList']_.ProseMirror-li_input[type='checkbox']]:h-10
  [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_li]:leading-relaxed
  [&_.ProseMirror_img]:block [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
