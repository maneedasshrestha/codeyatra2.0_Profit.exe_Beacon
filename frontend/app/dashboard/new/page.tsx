"use client";

import { useState, useRef } from "react";
import {
  MainCard,
  PostForm,
  SubmitButton,
} from "../../components/new-components/PostFormComponents";
import { PostType } from "../../components/PostTypeSelector";
import { AttachedFile, AttachedLink } from "../../components/AttachmentSection";
import NewPostHeader from "../../components/new-components/NewPostHeader";
import PostDoneState from "../../components/new-components/PostDoneState";

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

  const needsTitle =
    postType === "resource" ||
    postType === "question" ||
    postType === "announcement";
  const canSubmit =
    body.trim().length > 0 ||
    files.length > 0 ||
    images.length > 0 ||
    links.length > 0;

  const handleAddFile = (fl: FileList) => {
    const incoming: AttachedFile[] = Array.from(fl).map((f) => ({
      id: uid(),
      name: f.name,
      size: f.size,
    }));
    setFiles((prev) => [...prev, ...incoming]);
  };

  const handleAddImage = (fl: FileList) => {
    const incoming: AttachedFile[] = Array.from(fl).map((f) => ({
      id: uid(),
      name: f.name,
      size: f.size,
    }));
    setImages((prev) => [...prev, ...incoming]);
  };

  const handleAddLink = () => {
    const url = linkDraft.trim();
    if (!url) return;
    setLinks((prev) => [
      ...prev,
      { id: uid(), url: url.startsWith("http") ? url : `https://${url}` },
    ]);
    setLinkDraft("");
    setShowLinkInput(false);
  };

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1400);
  };

  const resetAll = () => {
    setDone(false);
    setTitle("");
    setBody("");
    setTags([]);
    setFiles([]);
    setImages([]);
    setLinks([]);
    setLinkDraft("");
    setPostType("discussion");
    setShowTags(false);
    setShowLinkInput(false);
  };

  if (done) {
    return <PostDoneState resetAll={resetAll} />;
  }

  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: "#f3f4f6" }}
    >
      <div className="w-full max-w-103 flex flex-col min-h-screen pb-28">
        <NewPostHeader
          canSubmit={canSubmit}
          submitting={submitting}
          handleSubmit={handleSubmit}
        />
        <MainCard>
          <PostForm
            USER={USER}
            visibility={visibility}
            setVisibility={setVisibility}
            postType={postType}
            setPostType={setPostType}
            needsTitle={needsTitle}
            title={title}
            setTitle={setTitle}
            body={body}
            setBody={setBody}
            images={images}
            setImages={setImages}
            files={files}
            setFiles={setFiles}
            links={links}
            setLinks={setLinks}
            linkDraft={linkDraft}
            setLinkDraft={setLinkDraft}
            showLinkInput={showLinkInput}
            setShowLinkInput={setShowLinkInput}
            handleAddImage={handleAddImage}
            handleAddFile={handleAddFile}
            handleAddLink={handleAddLink}
            tags={tags}
            setShowTags={setShowTags}
            showTags={showTags}
            setTags={setTags}
            imgRef={imgRef}
            fileRef={fileRef}
          />
        </MainCard>
        <SubmitButton
          canSubmit={canSubmit}
          submitting={submitting}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
