"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthBackground } from "@/app/components/setup/AuthBackground";
import { AuthLogo } from "@/app/components/setup/AuthLogo";
import { AuthCard } from "@/app/components/setup/AuthCard";
import { ChipSelector } from "@/app/components/setup/ChipSelector";
import { AuthInput } from "@/app/components/ui/AuthInput";
import { AuthButton } from "@/app/components/ui/AuthButton";
import {
  UserIcon,
  BuildingIcon,
} from "@/app/components/setup/signup/SignupIcons";

const STREAMS = ["Engineering", "BIT", "BCA", "MCA", "Physics", "Other"];
const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const ROLES = ["junior", "senior", "alumni"];

type Form = {
  name: string;
  college: string;
  stream: string;
  semester: string;
  role: string;
};
type Errors = Partial<Record<keyof Form, string>>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    name: "",
    college: "",
    stream: "",
    semester: "",
    role: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Get token from sessionStorage (set during signup) or localStorage (set during login)
    const signupToken = sessionStorage.getItem("signup_token");
    const loginToken = localStorage.getItem("auth_token");

    if (signupToken) {
      setToken(signupToken);
    } else if (loginToken) {
      setToken(loginToken);
    } else {
      // No token found, redirect to signup
      router.push("/setup/signup");
    }
  }, [router]);

  function onChange(field: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.college.trim()) e.college = "College name is required";
    if (!form.stream) e.stream = "Please select a course/stream";
    if (!form.semester) e.semester = "Please select a semester";
    if (!form.role) e.role = "Please select your role";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    if (!token) {
      setApiError("Session expired. Please signup again.");
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("http://localhost:5000/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          college: form.college,
          stream: form.stream,
          semester: parseInt(form.semester),
          role: form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Failed to complete profile");
        setLoading(false);
        return;
      }

      // Clear session storage and save token to localStorage
      sessionStorage.removeItem("signup_token");
      sessionStorage.removeItem("signup_email");
      localStorage.setItem("auth_token", token);

      // Redirect to dashboard
      router.push("/dashboard/home");
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8">
      <AuthBackground />
      <div className="w-full max-w-95 flex flex-col gap-6">
        <AuthLogo title="Complete Your Profile" />
        <AuthCard>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <AuthInput
              label="Full Name"
              icon={<UserIcon />}
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              error={errors.name}
              autoComplete="name"
            />

            <AuthInput
              label="College Name"
              icon={<BuildingIcon />}
              type="text"
              placeholder="Your college"
              value={form.college}
              onChange={(e) => onChange("college", e.target.value)}
              error={errors.college}
            />

            <ChipSelector
              label="Course/Stream"
              options={STREAMS}
              value={form.stream}
              error={errors.stream}
              onChange={(val) => onChange("stream", val)}
            />

            <ChipSelector
              label="Semester"
              options={SEMESTERS}
              value={form.semester}
              error={errors.semester}
              onChange={(val) => onChange("semester", val)}
            />

            <ChipSelector
              label="I am a..."
              options={ROLES}
              value={form.role}
              error={errors.role}
              onChange={(val) => onChange("role", val)}
            />

            <p className="text-xs text-gray-400 text-center">
              Step 2 of 2 — Almost done!
            </p>

            <AuthButton loading={loading} type="submit">
              Complete Signup
            </AuthButton>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
