"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthBackground } from "@/app/components/setup/AuthBackground";
import { AuthLogo } from "@/app/components/setup/AuthLogo";
import { AuthCard } from "@/app/components/setup/AuthCard";
import { AuthInput } from "@/app/components/ui/AuthInput";
import { AuthButton } from "@/app/components/ui/AuthButton";
import { MailIcon, LockIcon } from "@/app/components/setup/signup/SignupIcons";

type Form = {
  email: string;
  password: string;
  confirmPassword: string;
};
type Errors = Partial<Record<keyof Form, string>>;

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function onChange(field: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
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

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.error || "Signup failed" });
        setLoading(false);
        return;
      }

      const token = data.token || data.session?.access_token;
      sessionStorage.setItem("signup_token", token);
      sessionStorage.setItem("signup_email", form.email);
      router.push("/setup/complete-profile");
    } catch (err) {
      setErrors({ email: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8">
      <AuthBackground />
      <div className="w-full max-w-95 flex flex-col gap-6">
        <AuthLogo title="Create Account" />
        <AuthCard>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />
            <AuthInput
              label="Confirm Password"
              icon={<LockIcon />}
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-400 text-center">
              Step 1 of 2 — You&apos;ll complete your profile next
            </p>
            <AuthButton loading={loading} type="submit">
              Continue
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
