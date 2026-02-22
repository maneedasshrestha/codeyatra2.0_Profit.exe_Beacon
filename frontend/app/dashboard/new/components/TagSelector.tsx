"use client";
import React from "react";

const TAGS = [
  "Applied Mechanics", "Engineering Maths", "Programming",
  "Physics", "Chemistry", "Circuit Theory",
  "Data Structures", "OS", "DBMS",
  "Exam Tips", "Past Papers", "Project",
  "General", "Placement", "Events",
];

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selected, onChange }: TagSelectorProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (selected.length < 3) {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Add tags</p>
        <p className="text-xs text-gray-400">{selected.length}/3</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
              style={{
                background: active ? "#7c3aed" : "#f3f4f6",
                color: active ? "#fff" : "#4b5563",
                border: active ? "1.5px solid #7c3aed" : "1.5px solid #e5e7eb",
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
