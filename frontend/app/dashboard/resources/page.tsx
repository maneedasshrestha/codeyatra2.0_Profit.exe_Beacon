"use client";
import React, { useState, useRef, useEffect } from "react";

const COURSES = ["All", "Engineering", "BIT", "BCA", "MCA", "Physics"];
const SEMESTERS = [
  "All",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
];
const TYPES = ["All", "Notes", "Past Papers", "Lab Report", "Cheatsheet"];

interface Resource {
  id: number;
  title: string;
  subject: string;
  type: string;
  author: string;
  semester: string;
  size: string;
  course: string;
  fileUrl?: string;
}

const SEED: Resource[] = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    subject: "DSA",
    type: "Notes",
    author: "Aman Joshi",
    semester: "3rd",
    size: "2.4 MB",
    course: "Engineering",
  },
  {
    id: 2,
    title: "Engineering Mathematics II",
    subject: "Math",
    type: "Past Papers",
    author: "Priya Thapa",
    semester: "2nd",
    size: "1.1 MB",
    course: "Engineering",
  },
  {
    id: 3,
    title: "Digital Logic Lab Manual",
    subject: "DLC",
    type: "Lab Report",
    author: "Rohan KC",
    semester: "2nd",
    size: "800 KB",
    course: "Engineering",
  },
  {
    id: 4,
    title: "Computer Architecture Notes",
    subject: "CA",
    type: "Notes",
    author: "Sita Rai",
    semester: "4th",
    size: "3.2 MB",
    course: "BIT",
  },
  {
    id: 5,
    title: "C Programming Cheatsheet",
    subject: "C",
    type: "Cheatsheet",
    author: "Dev Sharma",
    semester: "1st",
    size: "420 KB",
    course: "BCA",
  },
  {
    id: 6,
    title: "Operating Systems Slides",
    subject: "OS",
    type: "Notes",
    author: "Nisha Lama",
    semester: "5th",
    size: "5.1 MB",
    course: "BIT",
  },
  {
    id: 7,
    title: "Microprocessor Past Papers",
    subject: "MP",
    type: "Past Papers",
    author: "Bikash Pun",
    semester: "4th",
    size: "980 KB",
    course: "Engineering",
  },
];

const TYPE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Notes: { bg: "#f3f0ff", text: "#7c3aed", border: "#ddd6fe" },
  "Past Papers": { bg: "#fef9c3", text: "#b45309", border: "#fde68a" },
  "Lab Report": { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" },
  Cheatsheet: { bg: "#fdf4ff", text: "#c026d3", border: "#f0abfc" },
};

function PreviewModal({
  resource,
  onClose,
}: {
  resource: Resource;
  onClose: () => void;
}) {
  const ts = TYPE_COLORS[resource.type] ?? {
    bg: "#f3f4f6",
    text: "#6b7280",
    border: "#e5e7eb",
  };
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#0f0f0f" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 pt-5 pb-3 shrink-0"
        style={{ background: "#1a1a2e" }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white truncate leading-snug">
            {resource.title}
          </p>
          <p className="text-[11px] font-medium" style={{ color: "#a78bfa" }}>
            {resource.author} &middot; {resource.size}
          </p>
        </div>
        <a
          href={resource.fileUrl ?? "#"}
          download={resource.fileUrl ? resource.title : undefined}
          onClick={!resource.fileUrl ? (e) => e.preventDefault() : undefined}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[12px] active:scale-95 transition-transform"
          style={{
            background: "#7c3aed",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </a>
      </div>

      {/* PDF preview area */}
      <div className="flex-1 overflow-hidden relative">
        {resource.fileUrl ? (
          <iframe
            src={resource.fileUrl}
            className="w-full h-full border-0"
            title={resource.title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: ts.bg }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ts.text}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-[16px] mb-1">
                {resource.title}
              </p>
              <p
                className="text-[13px] font-medium mb-3"
                style={{ color: "#a78bfa" }}
              >
                Sem {resource.semester} &middot; {resource.course} &middot;{" "}
                {resource.subject}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span
                  className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: ts.bg, color: ts.text }}
                >
                  {resource.type}
                </span>
              </div>
              <p className="text-[12px] mt-5" style={{ color: "#6b7280" }}>
                No preview available &middot; tap Download to save
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const COURSE_ICONS: Record<string, string> = {
  All: "All",
  Engineering: "Eng",
  BIT: "BIT",
  BCA: "BCA",
  MCA: "MCA",
  Physics: "Phy",
};

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const displayValue = value === "All" ? label : value;

  return (
    <div ref={ref} className="relative flex-1">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-1 px-3 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95"
        style={
          value !== "All"
            ? {
                background: "#7c3aed",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
              }
            : {
                background: "#fff",
                color: "#7c3aed",
                border: "1.5px solid #ddd6fe",
              }
        }
      >
        <span className="truncate">{displayValue}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke={value !== "All" ? "#fff" : "#7c3aed"}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.18s",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
            border: "1.5px solid #ede9fe",
            minWidth: "130px",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[12px] font-semibold transition-colors"
              style={
                opt === value
                  ? { background: "#f3f0ff", color: "#7c3aed" }
                  : { background: "transparent", color: "#374151" }
              }
            >
              {opt === value && (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {opt !== value && <span className="w-2.75" />}
              {opt === "All" ? `All ${label}s` : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: (r: Resource) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    type: "Notes",
    semester: "1st",
    course: "Engineering",
  });
  const [file, setFile] = useState<File | null>(null);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.subject.trim() || !file) return;
    onUpload({
      id: Date.now(),
      title: form.title.trim(),
      subject: form.subject.trim().toUpperCase(),
      type: form.type,
      author: "You",
      semester: form.semester,
      course: form.course,
      size: `${(file.size / 1024).toFixed(0)} KB`,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-100 rounded-3xl px-5 pt-6 pb-8 overflow-y-auto"
        style={{
          background: "#fff",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          maxHeight: "88vh",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-extrabold text-violet-900">
            Upload Resource
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#f3f4f6" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center justify-center py-5 rounded-2xl mb-4 transition-all active:scale-[0.98]"
          style={{
            border: `2px dashed ${file ? "#7c3aed" : "#ddd6fe"}`,
            background: file ? "#f9f5ff" : "#faf9ff",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={file ? "#7c3aed" : "#c4b5fd"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p
            className="mt-2 text-sm font-semibold"
            style={{ color: file ? "#7c3aed" : "#a78bfa" }}
          >
            {file ? file.name : "Tap to choose file"}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">PDF, PNG, DOC, PPT</p>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.png,.jpg,.doc,.docx,.ppt,.pptx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        />

        <div className="mb-3">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
            Title
          </label>
          <input
            type="text"
            placeholder="e.g. DSA Handwritten Notes"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none"
            style={{
              background: "#f3f4f6",
              border: "1.5px solid #e5e7eb",
              color: "#111827",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. DSA"
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              className="w-full px-3 py-3 rounded-xl text-sm font-medium outline-none"
              style={{
                background: "#f3f4f6",
                border: "1.5px solid #e5e7eb",
                color: "#111827",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
              Course
            </label>
            <select
              value={form.course}
              onChange={(e) => set("course", e.target.value)}
              className="w-full px-3 py-3 rounded-xl text-sm font-medium outline-none appearance-none"
              style={{
                background: "#f3f4f6",
                border: "1.5px solid #e5e7eb",
                color: "#111827",
              }}
            >
              {COURSES.filter((c) => c !== "All").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
              Semester
            </label>
            <select
              value={form.semester}
              onChange={(e) => set("semester", e.target.value)}
              className="w-full px-3 py-3 rounded-xl text-sm font-medium outline-none appearance-none"
              style={{
                background: "#f3f4f6",
                border: "1.5px solid #e5e7eb",
                color: "#111827",
              }}
            >
              {SEMESTERS.filter((s) => s !== "All").map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full px-3 py-3 rounded-xl text-sm font-medium outline-none appearance-none"
              style={{
                background: "#f3f4f6",
                border: "1.5px solid #e5e7eb",
                color: "#111827",
              }}
            >
              {TYPES.filter((t) => t !== "All").map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.title.trim() || !form.subject.trim() || !file}
          className="w-full py-3.5 rounded-2xl font-bold text-white text-[15px] transition-all active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "#7c3aed",
            boxShadow: "0 4px 18px rgba(124,58,237,0.3)",
          }}
        >
          Upload Resource
        </button>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(SEED);
  const [course, setCourse] = useState("All");
  const [semester, setSemester] = useState("All");
  const [type, setType] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  const visible = resources.filter(
    (r) =>
      (course === "All" || r.course === course) &&
      (semester === "All" || r.semester === semester) &&
      (type === "All" || r.type === type),
  );

  const activeCount = [course, semester, type].filter(
    (v) => v !== "All",
  ).length;

  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: "#f3f4f6" }}
    >
      <div className="w-full max-w-103 flex flex-col min-h-screen pb-28">
        {/* Header */}
        <div
          className="sticky top-0 z-20 pt-6 pb-3 px-5"
          style={{
            background: "linear-gradient(180deg,#f3f4f6 85%,#f3f4f6cc 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <span
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: "#a78bfa", letterSpacing: "0.12em" }}
          >
            Study Material
          </span>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl font-extrabold leading-none text-violet-900">
              Resources
            </h1>
            <div className="flex items-center gap-2 pb-0.5">
              {activeCount > 0 && (
                <button
                  onClick={() => {
                    setCourse("All");
                    setSemester("All");
                    setType("All");
                  }}
                  className="text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{
                    background: "#fdf4ff",
                    color: "#c026d3",
                    border: "1px solid #f0abfc",
                  }}
                >
                  Clear {activeCount}
                </button>
              )}
              <p className="text-sm font-medium" style={{ color: "#9f7aea" }}>
                {visible.length} files
              </p>
            </div>
          </div>

          {/* Filter dropdowns row */}
          <div className="mt-3 flex gap-2">
            <FilterDropdown
              label="Course"
              value={course}
              options={COURSES}
              onChange={setCourse}
            />
            <FilterDropdown
              label="Semester"
              value={semester}
              options={SEMESTERS}
              onChange={setSemester}
            />
            <FilterDropdown
              label="Type"
              value={type}
              options={TYPES}
              onChange={setType}
            />
          </div>
        </div>

        {/* Resource list */}
        <div className="flex flex-col gap-3 px-4 mt-3">
          {visible.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "#f3f0ff" }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c4b5fd"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <p className="text-base font-bold text-gray-400">
                No resources found
              </p>
              <p className="text-sm text-gray-300 mt-0.5">
                Try a different filter
              </p>
            </div>
          )}

          {visible.map((r) => {
            const ts = TYPE_COLORS[r.type] ?? {
              bg: "#f3f4f6",
              text: "#6b7280",
              border: "#e5e7eb",
            };
            return (
              <button
                key={r.id}
                onClick={() => setPreviewResource(r)}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl w-full text-left active:scale-[0.98] transition-transform"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: ts.bg }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={ts.text}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900 truncate leading-snug">
                    {r.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                    {r.author} &middot; Sem {r.semester} &middot; {r.size}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: ts.bg,
                        color: ts.text,
                        border: `1px solid ${ts.border}`,
                      }}
                    >
                      {r.type}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "#f3f0ff",
                        color: "#7c3aed",
                        border: "1px solid #ddd6fe",
                      }}
                    >
                      {r.subject}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "#fdf4ff",
                        color: "#c026d3",
                        border: "1px solid #f0abfc",
                      }}
                    >
                      {r.course}
                    </span>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "#f3f0ff" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Upload FAB */}
        <button
          onClick={() => setShowUpload(true)}
          className="fixed bottom-32 right-5 w-14 h-14 rounded-2xl flex items-center justify-center z-30 active:scale-95 transition-transform"
          style={{
            background: "#7c3aed",
            boxShadow: "0 6px 24px rgba(124,58,237,0.4)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={(r) => setResources((prev) => [r, ...prev])}
        />
      )}
      {previewResource && (
        <PreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}
    </div>
  );
}
