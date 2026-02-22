"use client";
import React, { useState, useRef } from "react";
import PostTypeSelector, { PostType } from "./components/PostTypeSelector";
import AttachmentSection, { AttachedFile, AttachedLink } from "./components/AttachmentSection";
import TagSelector from "./components/TagSelector";

const USER = { name: "Rajesh Shrestha", batch: "c/2080-BCT", initials: "RS" };

let _id = 0;
const uid = () => String(++_id);

type Visibility = "public" | "batch";
type FileKind = "doc" | "image";

export default function NewPostPage() {
  const [postType, setPostType] = useState<PostType>("discussion");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [images, setImages] = useState<AttachedFile[]>([]);
  const [links, setLinks] = useState<AttachedLink[]>([]);
  const [linkDraft, setLinkDraft] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const needsTitle = postType === "resource" || postType === "question" || postType === "announcement";
  const canSubmit = body.trim().length > 0 || files.length > 0 || images.length > 0 || links.length > 0;

  const handleAddFile = (fl: FileList) => {
    const incoming: AttachedFile[] = Array.from(fl).map((f) => ({
      id: uid(), name: f.name, size: f.size,
    }));
    setFiles((prev) => [...prev, ...incoming]);
  };

  const handleAddImage = (fl: FileList) => {
    const incoming: AttachedFile[] = Array.from(fl).map((f) => ({
      id: uid(), name: f.name, size: f.size,
    }));
    setImages((prev) => [...prev, ...incoming]);
  };

  const handleAddLink = () => {
    const url = linkDraft.trim();
    if (!url) return;
    setLinks((prev) => [...prev, { id: uid(), url: url.startsWith("http") ? url : `https://${url}` }]);
    setLinkDraft("");
    setShowLinkInput(false);
  };

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1400);
  };

  const resetAll = () => {
    setDone(false); setTitle(""); setBody(""); setTags([]);
    setFiles([]); setImages([]); setLinks([]); setLinkDraft(""); setPostType("discussion");
    setShowTags(false); setShowLinkInput(false);
  };

  // â”€â”€ Success screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#f3f4f6" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#7c3aed" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Post Published!</h2>
        <p className="text-sm text-gray-500 mb-6">Your post is now live on the feed.</p>
        <button onClick={resetAll} className="px-6 py-2.5 rounded-full font-semibold text-white text-sm" style={{ background: "#7c3aed" }}>
          Create Another
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: "#f3f4f6" }}>
      <div className="w-full max-w-[412px] flex flex-col min-h-screen pb-28">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-20 pt-6 pb-4 px-5"
          style={{
            background: "linear-gradient(180deg,#f3f4f6 70%,#f3f4f6cc 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
           
              <h1 className="text-3xl font-extrabold leading-none text-violet-900">
                Create Post
              </h1>
              <p className="text-sm font-medium mt-1" style={{ color: "#9f7aea" }}>
                What&apos;s happening in your community?
              </p>
            </div>

            {/* Post button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="mt-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
              style={{
                background: canSubmit ? "#7c3aed" : "#ede9fe",
                color: canSubmit ? "#fff" : "#a78bfa",
                boxShadow: canSubmit ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
              }}
            >
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>

        {/* â”€â”€ Main white card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>

          {/* User row */}
          <div className="flex items-center gap-3 px-4 pt-5 pb-5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
            >
              {USER.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[20px] font-bold text-gray-900 leading-tight">{USER.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {/* Visibility pill */}
                <button
                  onClick={() => setVisibility((v) => v === "public" ? "batch" : "public")}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[13px] font-semibold"
                  style={{ background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" }}
                >
                  {visibility === "public" ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      Public
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      Batch only
                    </>
                  )}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {/* post type badge */}
                <span className="text-[13px] text-violet-600 font-semibold capitalize">{postType}</span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: "#e5e7eb", margin: "0 16px" }} />

          {/* Post type chips */}
          <div className="px-4 pt-4 pb-4">
            <PostTypeSelector selected={postType} onChange={setPostType} />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#f3f4f6", margin: "0 16px" }} />

          {/* Title input — only for resource/question/notice */}
          {needsTitle && (
            <div className="px-4 pt-4">
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                style={{ background: "#f9f5ff", border: "1.5px solid #ddd6fe" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <input
                  type="text"
                  placeholder={
                    postType === "question" ? "Your question in one line…"
                    : postType === "announcement" ? "Notice heading…"
                    : "Resource title…"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 text-[15px] font-semibold outline-none placeholder:text-[#c4b5fd] bg-transparent"
                  style={{ color: "#4c1d95" }}
                />
              </div>
            </div>
          )}

          {/* Body textarea */}
          <textarea
            rows={10}
            placeholder={
              postType === "discussion" ? `What's on your mind, ${USER.name.split(" ")[0]}?`
              : postType === "question" ? "Describe your question in detail…"
              : postType === "resource" ? "Write a short description…"
              : "Write your announcement…"
            }
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 pt-3 pb-4 text-[15px] outline-none resize-none placeholder:text-gray-400"
            style={{ color: "#111827", background: "transparent", lineHeight: "1.75" }}
          />

          {/* Char count */}
          {body.length > 0 && (
            <div className="px-4 pb-1 flex justify-end">
              <span className="text-[11px]" style={{ color: body.length > 900 ? "#ef4444" : "#d1d5db" }}>{body.length}/1000</span>
            </div>
          )}

          {/* Attached images list */}
          {images.length > 0 && (
            <div className="px-4 pb-3 flex flex-col gap-2">
              {images.map((f) => (
                <div key={f.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: "#fdf4ff", border: "1px solid #f0abfc" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#c026d3" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{f.name}</p>
                    <p className="text-[10px] text-gray-400">{(f.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={() => setImages((p) => p.filter((x) => x.id !== f.id))} className="text-gray-300 hover:text-red-400 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Attached files list */}
          {files.length > 0 && (
            <div className="px-4 pb-3 flex flex-col gap-2">
              {files.map((f) => (
                <div key={f.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: "#f9f5ff", border: "1px solid #ede9fe" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#7c3aed" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{f.name}</p>
                    <p className="text-[10px] text-gray-400">{(f.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))} className="text-gray-300 hover:text-red-400 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Attached links list */}
          {links.length > 0 && (
            <div className="px-4 pb-2 flex flex-col gap-2">
              {links.map((l) => (
                <div key={l.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: "#f9f5ff", border: "1px solid #ede9fe" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#6d28d9" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                  <p className="flex-1 text-xs font-medium text-gray-700 truncate">{l.url.replace(/^https?:\/\//, "")}</p>
                  <button onClick={() => setLinks((p) => p.filter((x) => x.id !== l.id))} className="text-gray-300 hover:text-red-400 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Inline link input */}
          {showLinkInput && (
            <div className="px-4 pb-3 flex gap-2">
              <input
                autoFocus
                type="url"
                placeholder="Paste link hereâ€¦"
                value={linkDraft}
                onChange={(e) => setLinkDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#111827" }}
                onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button onClick={handleAddLink} className="px-3 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#7c3aed" }}>Add</button>
              <button onClick={() => { setShowLinkInput(false); setLinkDraft(""); }} className="px-2 py-2 rounded-xl text-sm text-gray-400">âœ•</button>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "#e5e7eb", margin: "0 16px" }} />

          {/* Action bar â€” Facebook-style */}
          <div className="flex items-center px-3 py-3 gap-1">
            <span className="text-xs font-medium text-gray-400 mr-1">Add to post</span>

            {/* Image upload */}
            <button
              onClick={() => imgRef.current?.click()}
              title="Upload Image"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 hover:bg-gray-100"
              style={{ color: "#c026d3" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              PNG
            </button>
            <input ref={imgRef} type="file" accept=".png,.jpg,.jpeg,.gif,.webp,.svg" multiple className="hidden" onChange={(e) => e.target.files && handleAddImage(e.target.files)} />

            {/* PDF upload */}
            <button
              onClick={() => fileRef.current?.click()}
              title="Upload PDF / Doc"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 hover:bg-gray-100"
              style={{ color: "#7c3aed" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              PDF
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" multiple className="hidden" onChange={(e) => e.target.files && handleAddFile(e.target.files)} />

            {/* Link */}
            <button
              onClick={() => setShowLinkInput((v) => !v)}
              title="Add link"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 hover:bg-gray-100"
              style={{ color: "#2563eb" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Link
            </button>

            {/* Tags */}
            <button
              onClick={() => setShowTags((v) => !v)}
              title="Add tags"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 hover:bg-gray-100"
              style={{ color: "#16a34a" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              Tags {tags.length > 0 && <span className="ml-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white" style={{ background: "#16a34a" }}>{tags.length}</span>}
            </button>
          </div>

          {/* Tags panel */}
          {showTags && (
            <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid #f3f4f6" }}>
              <TagSelector selected={tags} onChange={setTags} />
            </div>
          )}
        </div>

        {/* â”€â”€ Post button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="px-3 mt-3">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full py-3 rounded-xl font-semibold text-white text-[15px] transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: "#7c3aed", boxShadow: canSubmit ? "0 4px 18px rgba(124,58,237,0.3)" : "none" }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Publishingâ€¦
              </span>
            ) : "Publish Post"}
          </button>
        </div>

      </div>
    </div>
  );
}
