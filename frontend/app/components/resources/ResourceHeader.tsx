import FilterDropdown from "./FilterDropdown";
import { COURSES, SEMESTERS, TYPES } from "../../dashboard/resources/mockData";
import React from "react";

interface ResourceHeaderProps {
  course: string;
  semester: string;
  type: string;
  setCourse: (v: string) => void;
  setSemester: (v: string) => void;
  setType: (v: string) => void;
  activeCount: number;
  visibleCount: number;
  onClear: () => void;
}

const ResourceHeader: React.FC<ResourceHeaderProps> = ({
  course,
  semester,
  type,
  setCourse,
  setSemester,
  setType,
  activeCount,
  visibleCount,
  onClear,
}) => (
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
            onClick={onClear}
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
          {visibleCount} files
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
);

export default ResourceHeader;
