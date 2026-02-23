"use client";

import { useState, useEffect, useCallback } from "react";
import { Resource } from "./mockData";
import { resourceService, ResourceResponse } from "../../services/resourceService";
import UploadModal from "../../components/resources/UploadModal";
import PreviewModal from "../../components/resources/PreviewModal";
import ResourceHeader from "../../components/resources/ResourceHeader";
import ResourceEmptyState from "../../components/resources/ResourceEmptyState";
import ResourceListItem from "../../components/resources/ResourceListItem";
import UploadFAB from "../../components/resources/UploadFAB";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [course, setCourse] = useState("All");
  const [semester, setSemester] = useState("All");
  const [type, setType] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resourceService.getResources({
        type,
        semester,
        // subject: course !== "All" ? course : undefined, // Mapping course to subject for now if backend lacks course
      });

      // Map backend response to frontend Resource interface
      const mapped: Resource[] = data.resources.map((r: ResourceResponse) => ({
        id: r.id || Date.now().toString(),
        title: r.title,
        subject: r.subject.toUpperCase(),
        type: r.file_type === "past_paper" ? "Past Papers" : "Notes",
        author: r.uploader?.email?.split("@")[0] || "Anonymous",
        semester: `${r.semester}${["st", "nd", "rd"][r.semester - 1] || "th"}`,
        size: "N/A", // API doesn't provide size yet
        course: "Engineering", // Defaulting as API lacks course
        fileUrl: r.file_url,
        upvotes_count: r.upvotes_count || 0,
        downvotes_count: r.downvotes_count || 0,
        has_upvoted: r.has_upvoted || false,
        has_downvoted: r.has_downvoted || false,
      }));

      setResources(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type, semester]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleUpvote = async (id: string) => {
    // Optimistic Update
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      const isRemoving = r.has_upvoted;
      const wasDownvoted = r.has_downvoted;
      return {
        ...r,
        has_upvoted: !isRemoving,
        has_downvoted: false,
        upvotes_count: (r.upvotes_count || 0) + (isRemoving ? -1 : 1),
        downvotes_count: (r.downvotes_count || 0) + (wasDownvoted ? -1 : 0)
      };
    }));

    try {
      await resourceService.toggleUpvote(id.toString());
    } catch (err) {
      // Revert if failed (simplistic revert - fetch again)
      fetchResources();
    }
  };

  const handleDownvote = async (id: string) => {
    // Optimistic Update
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      const isRemoving = r.has_downvoted;
      const wasUpvoted = r.has_upvoted;
      return {
        ...r,
        has_downvoted: !isRemoving,
        has_upvoted: false,
        downvotes_count: (r.downvotes_count || 0) + (isRemoving ? -1 : 1),
        upvotes_count: (r.upvotes_count || 0) + (wasUpvoted ? -1 : 0)
      };
    }));

    try {
      await resourceService.toggleDownvote(id.toString());
    } catch (err) {
      fetchResources();
    }
  };

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
          visibleCount={resources.length}
          onClear={() => {
            setCourse("All");
            setSemester("All");
            setType("All");
          }}
        />

        {/* Resource list */}
        <div className="flex flex-col gap-3 px-4 mt-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-medium">
              {error}
              <button
                onClick={fetchResources}
                className="block mx-auto mt-2 text-violet-600 underline"
              >
                Try again
              </button>
            </div>
          ) : resources.length === 0 ? (
            <ResourceEmptyState />
          ) : (
            resources.map((r) => (
              <ResourceListItem
                key={r.id}
                resource={r}
                onClick={() => setPreviewResource(r)}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
              />
            ))
          )}
        </div>

        {/* Upload FAB */}
        <UploadFAB onClick={() => setShowUpload(true)} />
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={() => fetchResources()}
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
