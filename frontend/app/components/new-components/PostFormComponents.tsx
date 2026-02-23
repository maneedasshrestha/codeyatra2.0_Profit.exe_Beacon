import React from "react";

function MainCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-4 mt-4 rounded-2xl overflow-hidden"
      style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
    >
      {children}
    </div>
  );
}

function PostForm({
  USER,
  visibility,
  setVisibility,
  postType,
  setPostType,
  needsTitle,
  title,
  setTitle,
  body,
  setBody,
  images,
  setImages,
  files,
  setFiles,
  links,
  setLinks,
  linkDraft,
  setLinkDraft,
  showLinkInput,
  setShowLinkInput,
  handleAddImage,
  handleAddFile,
  handleAddLink,
  tags,
  setShowTags,
  showTags,
  setTags,
  imgRef,
  fileRef,
}: any) {
  // Import child components from their respective files
  const PostTypeSelector = require("../../components/PostTypeSelector").default;
  const TitleInput = require("./TitleInput").default;
  const BodyTextarea = require("./BodyTextarea").default;
  const CharCount = require("./CharCount").default;
  const AttachedFileList = require("./AttachedFileList").default;
  const AttachedLinkList = require("./AttachedLinkList").default;
  const InlineLinkInput = require("./InlineLinkInput").default;
  const ActionBar = require("./ActionBar").default;
  const TagsPanel = require("./TagsPanel").default;
  const UserRow = require("./UserRow").default;

  return (
    <>
      <UserRow
        user={USER}
        visibility={visibility}
        setVisibility={setVisibility}
        postType={postType}
      />
      <div style={{ height: 1, background: "#e5e7eb", margin: "0 16px" }} />
      <div className="px-4 pt-4 pb-4">
        <PostTypeSelector selected={postType} onChange={setPostType} />
      </div>
      <div style={{ height: 1, background: "#f3f4f6", margin: "0 16px" }} />
      {needsTitle && (
        <TitleInput
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          postType={postType}
        />
      )}
      <BodyTextarea
        value={body}
        onChange={(e: any) => setBody(e.target.value)}
        postType={postType}
        userName={USER.name.split(" ")[0]}
      />
      <CharCount count={body.length} />
      <AttachedFileList
        files={images}
        onRemove={(id: any) =>
          setImages((p: any) => p.filter((x: any) => x.id !== id))
        }
        kind="image"
      />
      <AttachedFileList
        files={files}
        onRemove={(id: any) =>
          setFiles((p: any) => p.filter((x: any) => x.id !== id))
        }
        kind="file"
      />
      <AttachedLinkList
        links={links}
        onRemove={(id: any) =>
          setLinks((p: any) => p.filter((x: any) => x.id !== id))
        }
      />
      {showLinkInput && (
        <InlineLinkInput
          value={linkDraft}
          onChange={(e: any) => setLinkDraft(e.target.value)}
          onAdd={handleAddLink}
          onKeyDown={(e: any) => e.key === "Enter" && handleAddLink()}
        />
      )}
      <div style={{ height: 1, background: "#e5e7eb", margin: "0 16px" }} />
      <ActionBar
        imgRef={imgRef}
        fileRef={fileRef}
        handleAddImage={handleAddImage}
        handleAddFile={handleAddFile}
        setShowLinkInput={setShowLinkInput}
        setShowTags={setShowTags}
        tagsCount={tags.length}
      />
      {showTags && <TagsPanel tags={tags} setTags={setTags} />}
    </>
  );
}

function SubmitButton({ canSubmit, submitting, handleSubmit }: any) {
  return (
    <div className="px-3 mt-3">
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="w-full py-3 rounded-xl font-semibold text-white text-[15px] transition-all active:scale-[0.98] disabled:opacity-50"
        style={{
          background: "#7c3aed",
          boxShadow: canSubmit ? "0 4px 18px rgba(124,58,237,0.3)" : "none",
        }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Publishing
          </span>
        ) : (
          "Publish Post"
        )}
      </button>
    </div>
  );
}

export { MainCard, PostForm, SubmitButton };
