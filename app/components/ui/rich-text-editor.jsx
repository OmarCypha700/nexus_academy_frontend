"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2,
  Link2Off,
} from "lucide-react";
import { Toggle } from "@/app/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";

// Clicking a toolbar button is a mousedown on an element outside the editor's
// contenteditable, which collapses/steals the browser selection before the click handler
// (and editor.chain().focus()) ever runs — losing track of where in the document the
// command should apply. Preventing default on mousedown keeps the editor's selection intact.
const preventMouseDown = (e) => e.preventDefault();

function LinkPopover({ editor }) {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setUrl(editor.getAttributes("link").href || "");
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          aria-label="Insert link"
          onMouseDown={preventMouseDown}
        >
          <Link2 />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-2">
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          {editor.isActive("link") && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onMouseDown={preventMouseDown}
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setOpen(false);
              }}
            >
              <Link2Off className="mr-1" size={14} /> Remove
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onMouseDown={preventMouseDown}
            onClick={() => {
              if (url.trim()) {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url.trim() })
                  .run();
              }
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Toolbar({ editor }) {
  if (!editor) return null;

  const align =
    ["left", "center", "right"].find((a) => editor.isActive({ textAlign: a })) || "left";

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        onMouseDown={preventMouseDown}
        aria-label="Bold"
      >
        <Bold />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        onMouseDown={preventMouseDown}
        aria-label="Italic"
      >
        <Italic />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        onMouseDown={preventMouseDown}
        aria-label="Underline"
      >
        <UnderlineIcon />
      </Toggle>

      <ToggleGroup
        type="single"
        size="sm"
        value={align}
        onValueChange={(next) => next && editor.chain().focus().setTextAlign(next).run()}
      >
        <ToggleGroupItem value="left" aria-label="Align left" onMouseDown={preventMouseDown}>
          <AlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center" onMouseDown={preventMouseDown}>
          <AlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right" onMouseDown={preventMouseDown}>
          <AlignRight />
        </ToggleGroupItem>
      </ToggleGroup>

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        onMouseDown={preventMouseDown}
        aria-label="Bullet list"
      >
        <List />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        onMouseDown={preventMouseDown}
        aria-label="Numbered list"
      >
        <ListOrdered />
      </Toggle>

      <LinkPopover editor={editor} />
    </div>
  );
}

// Tiptap's empty state is "<p></p>", not "" — plain `.trim()` truthiness checks on rich-text
// values treat that as non-empty. Strip tags before checking for actual text.
export function isRichTextEmpty(html) {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, "").trim().length === 0;
}

export function RichTextEditor({ value, onChange, placeholder, className }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right"],
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-32 px-3 py-2 focus:outline-none",
        "data-placeholder": placeholder || "",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if ((value || "") !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  return (
    <div className={cn("rounded-md border", className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
