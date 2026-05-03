"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogin, useSignup } from "@/lib/hooks/useAuth";

interface AuthEmailFormProps {
  crossLinkLabel: string;
  crossLinkHref: string;
  signUpHref: string;
  signUpLabel: string;
  accountType: "Brand" | "Creator";
}

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function AuthEmailForm({
  crossLinkLabel,
  crossLinkHref,
  signUpHref,
  signUpLabel,
  accountType,
}: AuthEmailFormProps) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const signup = useSignup();
  const loading = login.isPending || signup.isPending;
  const success = login.isSuccess || signup.isSuccess;

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!email) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0 && (!isSignup || Boolean(fullName.trim())) && (accountType !== "Creator" || !isSignup || Boolean(instagramHandle.trim()));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (isSignup) {
      signup.mutate({
        fullName,
        email,
        password,
        accountType,
        ...(accountType === "Creator" ? { instagramHandle } : {}),
      });
    } else {
      login.mutate({ email, password });
    }
  }

  const inputBase =
    "w-full rounded-xl px-4 py-3.5 text-body text-(--text-primary) bg-(--bg-surface) border outline-none transition-all duration-200 placeholder:text-(--text-tertiary) focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-0 focus-visible:border-(--accent)";

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Email sign in">
      {isSignup && (
        <div className="mb-4">
          <label htmlFor="auth-name" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
            FULL NAME
          </label>
          <input
            id="auth-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            className={cn(inputBase, "border-(--border)")}
          />
          {isSignup && !fullName.trim() && (
            <p className="mt-1.5 text-caption text-(--text-tertiary)">Required for new accounts.</p>
          )}
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="auth-email"
          className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block"
        >
          EMAIL
        </label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="you@email.com"
          className={cn(
            inputBase,
            errors.email
              ? "border-(--warning) focus-visible:ring-(--warning) focus-visible:border-(--warning)"
              : "border-(--border)"
          )}
        />
        {errors.email && (
          <p className="mt-1.5 text-caption text-(--warning)" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {isSignup && accountType === "Creator" && (
        <div className="mb-4">
          <label htmlFor="auth-instagram" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
            INSTAGRAM HANDLE
          </label>
          <input
            id="auth-instagram"
            type="text"
            autoComplete="off"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            placeholder="@creator"
            className={cn(inputBase, "border-(--border)")}
          />
        </div>
      )}

      {/* Password */}
      <div className="mb-6">
        <label
          htmlFor="auth-password"
          className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block"
        >
          PASSWORD
        </label>
        <div className="relative">
          <input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((p) => ({ ...p, password: undefined }));
            }}
            placeholder="••••••••"
            className={cn(
              inputBase,
              "pr-12",
              errors.password
                ? "border-(--warning) focus-visible:ring-(--warning) focus-visible:border-(--warning)"
                : "border-(--border)"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-caption text-(--warning)" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || success}
        className={cn(
          "w-full h-13 rounded-xl font-semibold text-body transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2",
          success
            ? "bg-(--success) text-(--bg-primary) cursor-default"
            : "bg-(--accent) text-(--bg-primary) hover:bg-(--accent-hover) disabled:opacity-70 disabled:cursor-not-allowed"
        )}
        style={{ height: "52px" }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            Signing in…
          </span>
        ) : success ? (
          <span className="flex items-center justify-center gap-2">
            <span aria-hidden>✓</span> {isSignup ? "Created" : "Signed in"}
          </span>
        ) : (
          isSignup ? "Create account" : "Sign in"
        )}
      </button>

      {/* Links */}
      <div className="mt-6 flex flex-col gap-3 text-center">
        <a
          href={isSignup ? signUpHref.replace("?mode=signup", "") : signUpHref}
          className="text-caption text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
          data-interactive
        >
          {isSignup ? "Already have an account? Sign in →" : signUpLabel}
        </a>
        {!isSignup && (
          <a
            href="/forgot-password"
            className="text-caption text-(--text-tertiary) hover:text-(--text-secondary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
            data-interactive
          >
            Forgot password?
          </a>
        )}
        <a
          href={crossLinkHref}
          className="text-caption text-(--text-tertiary) hover:text-(--text-secondary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
          data-interactive
        >
          {crossLinkLabel}
        </a>
      </div>
    </form>
  );
}
