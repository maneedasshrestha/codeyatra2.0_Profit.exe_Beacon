import React, { useRef, useState } from "react";
import {
  COURSES,
  SEMESTERS,
  TYPES,
} from "../../dashboard/resources/mockData";
import { resourceService } from "../../services/resourceService";

interface UploadModalProps {
  onClose: () => void;
  onUpload: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    type: "Notes",
    semester: "1st",
    course: "Engineering",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.subject.trim() || !file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("subject", form.subject.trim());
      formData.append("file", file);

      // Map semester (e.g. "1st") to number (1)
      const semInt = form.semester.replace(/\D/g, "");
      formData.append("semester", semInt);

      // Map frontend type to backend file_type
      const typeMap: Record<string, string> = {
        "Notes": "notes",
        "Past Papers": "past_paper",
        "Lab Report": "notes",
        "Cheatsheet": "notes",
      };
      formData.append("file_type", typeMap[form.type] || "notes");

      // Since backend doesn't have course yet, we could put it in description or ignore
      formData.append("description", `Course: ${form.course}`);

      await resourceService.uploadResource(formData);
      onUpload();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to upload resource");
    } finally {
      setUploading(false);
    }
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
            disabled={uploading}
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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-500 text-xs font-medium border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={() => !uploading && fileRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center py-5 rounded-2xl mb-4 transition-all active:scale-[0.98] disabled:opacity-50"
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
            disabled={uploading}
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
              disabled={uploading}
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
              disabled={uploading}
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
              disabled={uploading}
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
              disabled={uploading}
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
          disabled={!form.title.trim() || !form.subject.trim() || !file || uploading}
          className="w-full py-3.5 rounded-2xl font-bold text-white text-[15px] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background: "#7c3aed",
            boxShadow: "0 4px 18px rgba(124,58,237,0.3)",
          }}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            "Upload Resource"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
