"use client";

import { useState } from "react";
import { Resource, SEED } from "./mockData";
import UploadModal from "../../components/resources/UploadModal";
import PreviewModal from "../../components/resources/PreviewModal";
import ResourceHeader from "../../components/resources/ResourceHeader";
import ResourceEmptyState from "../../components/resources/ResourceEmptyState";
import ResourceListItem from "../../components/resources/ResourceListItem";
import UploadFAB from "../../components/resources/UploadFAB";

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
      className="h-full w-full flex justify-center overflow-y-auto"
      style={{ background: "#f3f4f6" }}
    >
      <div className="w-full max-w-103 flex flex-col pb-40">
        {/* Header */}
        <ResourceHeader
          course={course}
          semester={semester}
          type={type}
          setCourse={setCourse}
          setSemester={setSemester}
          setType={setType}
          activeCount={activeCount}
          visibleCount={visible.length}
          onClear={() => {
            setCourse("All");
            setSemester("All");
            setType("All");
          }}
        />

        {/* Resource list */}
        <div className="flex flex-col gap-3 px-4 mt-3">
          {visible.length === 0 && <ResourceEmptyState />}
          {visible.map((r) => (
            <ResourceListItem
              key={r.id}
              resource={r}
              onClick={() => setPreviewResource(r)}
            />
          ))}
        </div>

        {/* Upload FAB */}
        <UploadFAB onClick={() => setShowUpload(true)} />
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
