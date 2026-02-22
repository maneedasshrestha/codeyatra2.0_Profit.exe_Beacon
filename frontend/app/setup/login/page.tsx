"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthBackground } from "@/app/setup/components/AuthBackground";
import { AuthLogo } from "@/app/setup/components/AuthLogo";
import { AuthCard } from "@/app/setup/components/AuthCard";
import { AuthDivider } from "@/app/setup/components/AuthDivider";
import { GoogleButton } from "@/app/setup/components/GoogleButton";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function onChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next: typeof errors = {};
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Invalid email";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "At least 6 characters";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/dashboard/home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <AuthBackground />
      <div className="w-full max-w-[380px] flex flex-col gap-6">
        <AuthLogo title="Welcome back" />
        <AuthCard>
          <LoginForm
            form={form}
            errors={errors}
            loading={loading}
            onChange={onChange}
            onSubmit={handleSubmit}
          />
          <AuthDivider />
          <GoogleButton />
        </AuthCard>
        <p className="text-center text-[13px]" style={{ color: "#9ca3af" }}>
          Don&apos;t have an account?{" "}
          <Link href="/setup/signup" className="font-bold" style={{ color: "#7c3aed" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
