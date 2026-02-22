"use client";
import React, { useRef } from "react";

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
}

export interface AttachedLink {
  id: string;
  url: string;
}

interface AttachmentSectionProps {
  files: AttachedFile[];
  links: AttachedLink[];
  linkDraft: string;
  onLinkDraftChange: (v: string) => void;
  onAddFile: (files: FileList) => void;
  onRemoveFile: (id: string) => void;
  onAddLink: () => void;
  onRemoveLink: (id: string) => void;
}

function FileRow({ file, onRemove }: { file: AttachedFile; onRemove: () => void }) {
  const kb = (file.size / 1024).toFixed(0);
  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl"
      style={{ background: "#faf5ff", border: "1.5px solid #e9d5ff" }}
    >
      {/* PDF icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
        <p className="text-[11px] text-violet-400">{kb} KB</p>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-400 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

function LinkRow({ link, onRemove }: { link: AttachedLink; onRemove: () => void }) {
  const display = link.url.replace(/^https?:\/\//, "").slice(0, 40);
  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl"
      style={{ background: "#faf5ff", border: "1.5px solid #e9d5ff" }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg,#c084fc,#8b5cf6)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </div>
      <p className="flex-1 text-sm font-medium text-gray-700 truncate">{display}</p>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-400 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

export default function AttachmentSection({
  files,
  links,
  linkDraft,
  onLinkDraftChange,
  onAddFile,
  onRemoveFile,
  onAddLink,
  onRemoveLink,
}: AttachmentSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      {/* Action row */}
      <div className="flex gap-2">
        {/* Upload PDF */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 flex-1 px-4 py-3 rounded-2xl font-semibold text-sm active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
            color: "#6d28d9",
            border: "2px solid #ddd6fe",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload PDF
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onAddFile(e.target.files)}
        />
      </div>

      {/* Link input row */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </span>
          <input
            type="url"
            placeholder="Paste a link (YouTube, Drive, etc.)"
            value={linkDraft}
            onChange={(e) => onLinkDraftChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddLink()}
            className="w-full pl-9 pr-4 py-3 rounded-2xl text-sm font-medium outline-none"
            style={{
              background: "#fff",
              border: "2px solid #ddd6fe",
              color: "#1e1b4b",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")}
          />
        </div>
        <button
          type="button"
          onClick={onAddLink}
          disabled={!linkDraft.trim()}
          className="px-4 py-3 rounded-2xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            color: "#fff",
            boxShadow: linkDraft.trim() ? "0 4px 14px rgba(109,40,217,0.3)" : "none",
          }}
        >
          Add
        </button>
      </div>

      {/* Attached files */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f) => (
            <FileRow key={f.id} file={f} onRemove={() => onRemoveFile(f.id)} />
          ))}
        </div>
      )}

      {/* Attached links */}
      {links.length > 0 && (
        <div className="flex flex-col gap-2">
          {links.map((l) => (
            <LinkRow key={l.id} link={l} onRemove={() => onRemoveLink(l.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
