"use client";

import { useRef, useState, MouseEvent as ReactMouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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

/** Bottom-border accent that draws in left→right on focus, instead of a flat ring. */
function MagneticField({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) {
  return (
    <div className="relative">
      {children}
      <motion.span
        aria-hidden
        className="absolute left-0 -bottom-px h-[2px] bg-(--accent) rounded-full"
        style={{ transformOrigin: "left", width: "100%" }}
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  );
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
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);
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
    const ok = Object.keys(next).length === 0 && (!isSignup || Boolean(fullName.trim())) && (accountType !== "Creator" || !isSignup || Boolean(instagramHandle.trim()));
    if (!ok) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
    return ok;
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

  // Magnetic hover for the submit button (same technique as ui/Button.tsx).
  function handleSubmitMouseMove(e: ReactMouseEvent<HTMLButtonElement>) {
    const el = submitRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${(x / rect.width) * 4}px, ${(y / rect.height) * 4}px)`;
  }
  function handleSubmitMouseLeave() {
    if (submitRef.current) submitRef.current.style.transform = "translate(0, 0)";
  }

  const inputBase =
    "w-full rounded-xl px-4 py-3.5 text-body text-(--text-primary) bg-(--bg-surface) border outline-none transition-all duration-200 placeholder:text-(--text-tertiary) focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-0 focus-visible:border-(--accent)";

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Email sign in"
      animate={shake ? { x: [0, -8, 8, -6, 6, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
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
            data-interactive
            data-cursor="Enter"
            tabIndex={0}
            className={cn(inputBase, "border-(--border)")}
          />
          {isSignup && !fullName.trim() && (
            <p className="mt-1.5 text-caption text-(--text-tertiary)">Required for new accounts.</p>
          )}
        </div>
      )}

      {/* Email — tab stop 1 */}
      <div className="mb-4">
        <label
          htmlFor="auth-email"
          className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block"
        >
          EMAIL
        </label>
        <MagneticField focused={emailFocused}>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            tabIndex={1}
            data-interactive
            data-cursor="Enter"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
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
        </MagneticField>
        {errors.email && (
          <p className="mt-1.5 text-caption text-(--warning)" role="alert" aria-live="assertive">
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
            data-interactive
            data-cursor="Enter"
            tabIndex={0}
            className={cn(inputBase, "border-(--border)")}
          />
        </div>
      )}

      {/* Password — tab stop 2 */}
      <div className="mb-2">
        <label
          htmlFor="auth-password"
          className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block"
        >
          PASSWORD
        </label>
        <MagneticField focused={passwordFocused}>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              tabIndex={2}
              data-interactive
              data-cursor="Enter"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
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
              tabIndex={0}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </MagneticField>
        {errors.password && (
          <p className="mt-1.5 text-caption text-(--warning)" role="alert" aria-live="assertive">
            {errors.password}
          </p>
        )}
      </div>

      {/* Forgot password — right-aligned, sits right under the password field */}
      {!isSignup && (
        <div className="flex justify-end mb-6">
          <a
            href="/forgot-password"
            tabIndex={0}
            className="text-caption text-(--text-tertiary) hover:text-(--text-secondary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
            data-interactive
          >
            Forgot password?
          </a>
        </div>
      )}
      {isSignup && <div className="mb-6" />}

      {/* Submit — tab stop 3, magnetic hover */}
      <button
        ref={submitRef}
        type="submit"
        tabIndex={3}
        disabled={loading || success}
        data-interactive
        data-cursor="Continue"
        onMouseMove={handleSubmitMouseMove}
        onMouseLeave={handleSubmitMouseLeave}
        className={cn(
          "w-full h-13 rounded-xl font-semibold text-body transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2",
          success
            ? "bg-(--success) text-(--bg-primary) cursor-default"
            : "bg-(--accent) text-(--bg-primary) hover:bg-(--accent-hover) disabled:opacity-70 disabled:cursor-not-allowed"
        )}
        style={{ height: "52px", transition: "transform 0.3s ease-out, background-color 0.2s, opacity 0.2s" }}
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

      {/* Links — after social buttons in tab order (page renders social grid before this form) */}
      <div className="mt-6 flex flex-col gap-3 text-center">
        <a
          href={isSignup ? signUpHref.replace("?mode=signup", "") : signUpHref}
          tabIndex={0}
          className="text-caption text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
          data-interactive
        >
          {isSignup ? "Already have an account? Sign in →" : signUpLabel}
        </a>
        <a
          href={crossLinkHref}
          tabIndex={0}
          className="text-caption text-(--text-tertiary) hover:text-(--text-secondary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
          data-interactive
        >
          {crossLinkLabel}
        </a>
      </div>
    </motion.form>
  );
}
