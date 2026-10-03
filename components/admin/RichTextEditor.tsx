"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bold, Code2, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Loader2, Pilcrow, Redo2, TextQuote, Undo2, Unlink,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { cn } from "@/lib/utils";

type Tool = { label: string; icon: ReactNode; command: string; arg?: string };

const TOOLS: Tool[] = [
  { icon: <Pilcrow className="size-4" />, label: "Paragraph", command: "formatBlock", arg: "<p>" },
  { icon: <Heading2 className="size-4" />, label: "Heading 2", command: "formatBlock", arg: "<h2>" },
  { icon: <Heading3 className="size-4" />, label: "Heading 3", command: "formatBlock", arg: "<h3>" },
  { icon: <Bold className="size-4" />, label: "Bold", command: "bold" },
  { icon: <Italic className="size-4" />, label: "Italic", command: "italic" },
  { icon: <List className="size-4" />, label: "Bulleted list", command: "insertUnorderedList" },
  { icon: <ListOrdered className="size-4" />, label: "Numbered list", command: "insertOrderedList" },
  { icon: <TextQuote className="size-4" />, label: "Quote", command: "formatBlock", arg: "<blockquote>" },
  { icon: <Link2 className="size-4" />, label: "Add link", command: "link" },
  { icon: <Unlink className="size-4" />, label: "Remove link", command: "unlink" },
  { icon: <Undo2 className="size-4" />, label: "Undo", command: "undo" },
  { icon: <Redo2 className="size-4" />, label: "Redo", command: "redo" },
];

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (html: string) => void;
  error?: string;
}

/**
 * Lightweight rich text editor (contentEditable + formatting commands).
 * Output is sanitized on the server when saved and again when rendered.
 */
export function RichTextEditor({ id, label, value, onChange, error }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [source, setSource] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Only push external value changes into the DOM when not editing, to keep the caret stable.
  useEffect(() => {
    const el = ref.current;
    if (el && !source && el.innerHTML !== value && document.activeElement !== el) el.innerHTML = value || "";
  }, [value, source]);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const addLink = () => {
    const url = window.prompt("Link URL (https://… or /page)");
    if (!url) return;
    if (!/^(https?:\/\/|\/|mailto:|tel:)/i.test(url)) {
      toast.error("Links must start with https://, /, mailto: or tel:");
      return;
    }
    exec("createLink", url);
  };

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "blogs");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || "Upload failed");
      const alt = window.prompt("Describe this image (alt text)") ?? "";
      exec("insertHTML", `<img src="${json.url}" alt="${alt.replace(/"/g, "&quot;")}" />`);
      toast.success("Image inserted.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const runTool = (tool: Tool) => (tool.command === "link" ? addLink() : exec(tool.command, tool.arg));

  return (
    <div>
      <p id={`${id}-label`} className="mb-2 text-sm font-semibold text-navy-900">
        {label}
      </p>
      <div className={cn("overflow-hidden rounded-2xl border bg-white focus-within:ring-4 focus-within:ring-teal-500/15", error ? "border-red-400" : "border-line focus-within:border-teal-500")}>
        <div role="toolbar" aria-label="Formatting" className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-line bg-sky-50/90 p-2 backdrop-blur">
          {TOOLS.map((t) => (
            <button
              key={t.label}
              type="button"
              title={t.label}
              aria-label={t.label}
              disabled={source}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runTool(t)}
              className="grid size-9 place-items-center rounded-lg text-navy-900 hover:bg-white disabled:opacity-40"
            >
              {t.icon}
            </button>
          ))}
          <button
            type="button"
            title="Insert image"
            aria-label="Insert image"
            disabled={source || uploading}
            onClick={() => fileRef.current?.click()}
            className="grid size-9 place-items-center rounded-lg text-navy-900 hover:bg-white disabled:opacity-40"
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
          <button
            type="button"
            onClick={() => setSource((s) => !s)}
            aria-pressed={source}
            className={cn("ml-auto flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold", source ? "bg-navy-900 text-white" : "text-navy-900 hover:bg-white")}
          >
            <Code2 className="size-4" aria-hidden="true" /> HTML
          </button>
        </div>
        {source ? (
          <textarea
            aria-labelledby={`${id}-label`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block min-h-[420px] w-full resize-y p-5 font-mono text-sm text-navy-900 focus:outline-none"
          />
        ) : (
          <div
            ref={ref}
            id={id}
            role="textbox"
            aria-multiline="true"
            aria-labelledby={`${id}-label`}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
            onBlur={(e) => onChange(e.currentTarget.innerHTML)}
            className="prose-clinic min-h-[420px] max-w-none p-5 focus:outline-none [&_img]:max-w-full"
          />
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
