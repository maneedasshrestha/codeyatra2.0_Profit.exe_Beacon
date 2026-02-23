"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthBackground } from "@/app/components/setup/AuthBackground";
import { AuthLogo } from "@/app/components/setup/AuthLogo";
import { AuthCard } from "@/app/components/setup/AuthCard";
import { ChipSelector } from "@/app/components/setup/ChipSelector";
import { AuthInput } from "@/app/components/ui/AuthInput";
import { AuthButton } from "@/app/components/ui/AuthButton";
import { UserIcon, MailIcon, LockIcon, BuildingIcon } from "@/app/components/setup/signup/SignupIcons";

const COURSES = ["Engineering", "BIT", "BCA", "MCA", "Physics", "Other"];
const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

type Form = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  course: string;
  semester: string;
  college: string;
};
type Errors = Partial<Record<keyof Form, string>>;

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    semester: "",
    college: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function onChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.course) e.course = "Please select a course";
    if (!form.semester) e.semester = "Please select a semester";
    if (!form.college.trim()) e.college = "College name is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    router.push("/dashboard/home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8">
      <AuthBackground />
      <div className="w-full max-w-95 flex flex-col gap-6">
        <AuthLogo title="Create Account" />
        <AuthCard>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              label="Email"
              icon={<MailIcon />}
              type="email"
              placeholder="you@campus.edu"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <AuthInput
              label="Password"
              icon={<LockIcon />}
              type="password"
              placeholder=""
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />
            <AuthInput
              label="Confirm Password"
              icon={<LockIcon />}
              type="password"
              placeholder=""
              value={form.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            <ChipSelector
              label="Course"
              options={COURSES}
              value={form.course}
              error={errors.course}
              onChange={(val) => onChange("course", val)}
            />
            <ChipSelector
              label="Semester"
              options={SEMESTERS}
              value={form.semester}
              error={errors.semester}
              onChange={(val) => onChange("semester", val)}
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
            <AuthButton loading={loading} type="submit">
              Create Account
            </AuthButton>
          </form>
        </AuthCard>
        <p className="text-center text-[13px]" style={{ color: "#9ca3af" }}>
          Already have an account?{" "}
          <Link
            href="/setup/login"
            className="font-bold"
            style={{ color: "#7c3aed" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
