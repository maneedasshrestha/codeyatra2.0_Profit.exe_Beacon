import React from "react";

interface InlineLinkInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InlineLinkInput: React.FC<InlineLinkInputProps> = ({
  value,
  onChange,
  onAdd,
  onKeyDown,
}) => (
  <div className="px-4 pb-3 flex gap-2 items-center">
    <input
      autoFocus
      type="url"
      placeholder="Paste link here…"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
      style={{
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        color: "#111827",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
    />
    <button
      onClick={onAdd}
      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
      style={{ background: "#7c3aed" }}
    >
      Add
    </button>
  </div>
);

export default InlineLinkInput;
