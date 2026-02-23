"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MainCard,
  PostForm,
  SubmitButton,
} from "../../components/new-components/PostFormComponents";
import { PostType } from "../../components/PostTypeSelector";
import { AttachedFile, AttachedLink } from "../../components/AttachmentSection";
import NewPostHeader from "../../components/new-components/NewPostHeader";
import PostDoneState from "../../components/new-components/PostDoneState";

let _id = 0;
const uid = () => String(++_id);

type Visibility = "public" | "batch";
type FileKind = "doc" | "image";

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", batch: "", initials: "" });
  const [userProfile, setUserProfile] = useState<any>(null);
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

  useEffect(() => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("signup_token");

    if (!token) {
      router.replace("/setup/login");
      return;
    }

    fetch("http://localhost:5000/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setUserProfile(data.profile);
          const initials = (data.profile.name || "U")
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          setUser({
            name: data.profile.name || "User",
            batch: `c/${data.profile.college}-${data.profile.stream}`,
            initials,
          });
        } else {
          router.replace("/setup/login");
        }
      })
      .catch(() => router.replace("/setup/login"));
  }, [router]);

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

  const handleSubmit = async () => {
    if (!canSubmit || submitting || !userProfile) return;

    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("signup_token");

    if (!token) {
      alert("Please login to create a post");
      router.replace("/setup/login");
      return;
    }

    setSubmitting(true);

    try {
      const postContent = title ? `${title}\n\n${body}` : body;

      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: postContent,
          college: userProfile.college,
          semester: userProfile.semester,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      console.log("✅ Post created:", data);
      setDone(true);
    } catch (err: any) {
      console.error("❌ Failed to create post:", err);
      alert(err.message || "Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            USER={user}
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
