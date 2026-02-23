"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "../components/account/ProfileHeader";
import AcademicCard from "../components/account/AcademicCard";
import ActionMenu from "../components/account/ActionMenu";
import HeaderSection from "../components/account/HeaderSection";
import StatsRow from "../components/account/StatsRow";
import {
  SavedResourcesIcon,
  MyThreadsIcon,
  SignOutIcon,
} from "../components/account/AccountMenuIcons";
import TopBarAccount from "../components/TopBarAccount";

type Profile = {
  name: string;
  email: string;
  college: string;
  stream: string;
  semester: number;
  role: string;
  avatar_url?: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    college: "",
    stream: "",
    semester: 0,
    role: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          setProfile({
            name: data.profile.name || "—",
            email: data.user?.email || "—",
            college: data.profile.college || "—",
            stream: data.profile.stream || "—",
            semester: data.profile.semester ?? 0,
            role: data.profile.role || "—",
            avatar_url: data.profile.avatar_url || "",
          });
        } else {
          router.replace("/setup/login");
        }
      })
      .catch(() => router.replace("/setup/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    console.log("📸 Uploading avatar:", file.name, file.type, file.size);

    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("signup_token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      console.log("🔄 Sending upload request...");
      const res = await fetch("http://localhost:5000/auth/upload-avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      console.log("📥 Response:", res.status, data);

      if (res.ok && data.avatar_url) {
        console.log("✅ Avatar uploaded successfully:", data.avatar_url);
        setProfile((prev) =>
          prev ? { ...prev, avatar_url: data.avatar_url } : prev,
        );
      } else {
        console.error("❌ Upload failed:", data);
        alert(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      alert("Network error. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSignOut() {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("signup_token");
    router.push("/setup/login");
  }

  function startEditing() {
    if (!profile) return;
    setEditForm({
      name: profile.name,
      college: profile.college,
      stream: profile.stream,
      semester: profile.semester,
      role: profile.role,
    });
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  async function handleSaveProfile() {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("signup_token");
    if (!token || !profile) return;

    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();

      if (res.ok && data.profile) {
        setProfile({
          ...profile,
          name: data.profile.name || profile.name,
          college: data.profile.college || profile.college,
          stream: data.profile.stream || profile.stream,
          semester: data.profile.semester ?? profile.semester,
          role: data.profile.role || profile.role,
        });
        setEditing(false);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const credentials = [
    { label: "College", value: profile.college },
    { label: "Stream", value: profile.stream },
    { label: "Semester", value: `${profile.semester} Sem` },
    { label: "Role", value: profile.role },
  ];

  const stats = [
    { label: "Questions Replied", value: 0 },
    { label: "Questions Asked", value: 0 },
  ];

  return (
    <>
      <TopBarAccount />
      <div
        className="min-h-screen w-full flex justify-center"
        style={{ background: "#F8F7FA" }}
      >
        <div className="w-full max-w-103 flex flex-col min-h-screen pb-28">
          <HeaderSection title="Account" subtitle="Your Profile" />

          <div
            className="mx-4 rounded-2xl overflow-hidden"
            style={{
              background: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <ProfileHeader
              name={profile.name}
              email={profile.email}
              year={`Sem ${profile.semester}`}
              initials={initials}
              imgSrc={profile.avatar_url || ""}
              onUploadClick={() => fileInputRef.current?.click()}
              uploading={uploading}
            />
          </div>

          <StatsRow stats={stats} />

          <div className="mt-4">
            <AcademicCard credentials={credentials} />
          </div>

          {/* Edit Profile Button */}
          <div className="mx-4 mt-4">
            <button
              onClick={startEditing}
              className="w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
              }}
            >
              Edit Profile
            </button>
          </div>

          {/* Edit Profile Modal */}
          {editing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
              <div
                className="w-full max-w-md rounded-3xl p-6 space-y-4"
                style={{
                  background: "#fff",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                }}
              >
                <h3 className="text-lg font-extrabold text-gray-900">
                  Edit Profile
                </h3>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                {/* College */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    College
                  </label>
                  <input
                    type="text"
                    value={editForm.college}
                    onChange={(e) =>
                      setEditForm({ ...editForm, college: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                {/* Stream */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Stream
                  </label>
                  <input
                    type="text"
                    value={editForm.stream}
                    onChange={(e) =>
                      setEditForm({ ...editForm, stream: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={editForm.semester}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        semester: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  >
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                      boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <ActionMenu
              items={[
                {
                  label: "Saved Resources",
                  icon: <SavedResourcesIcon />,
                },
                {
                  label: "My Threads",
                  icon: <MyThreadsIcon />,
                },
                {
                  label: "Sign Out",
                  danger: true,
                  onClick: handleSignOut,
                  icon: <SignOutIcon />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
