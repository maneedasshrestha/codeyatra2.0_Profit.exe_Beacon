"use client";

import Link from "next/link";
import { AuthInput } from "@/app/components/ui/AuthInput";
import { AuthButton } from "@/app/components/ui/AuthButton";

interface LoginFormProps {
  form: { email: string; password: string };
  errors: { email?: string; password?: string };
  loading: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export function LoginForm({ form, errors, loading, onChange, onSubmit }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
      <div className="flex flex-col gap-1">
        <AuthInput
          label="Password"
          icon={<LockIcon />}
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link href="#" className="text-[12px] font-semibold" style={{ color: "#7c3aed" }}>
            Forgot password?
          </Link>
        </div>
      </div>
      <AuthButton loading={loading} type="submit">
        Sign In
      </AuthButton>
    </form>
  );
}
