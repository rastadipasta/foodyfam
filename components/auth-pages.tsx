"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, ArrowRight, CheckCircle2, Chrome, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { getPreferredAuthAdapter, type OAuthProvider } from "@/lib/auth-adapter";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { loadSupabaseSnapshot } from "@/lib/supabase/profile-sync";
import { useAppStore } from "@/store/useAppStore";
import { SiteShell } from "./layout";
import { Button, Card, Field, Pill } from "./ui";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password needs at least 6 characters.")
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Add your name."),
    email: z.string().email("Enter a valid email."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password.")
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords need to match.",
    path: ["confirmPassword"]
  });

const forgotSchema = z.object({
  email: z.string().email("Enter the email connected to your account.")
});

type AuthMode = "login" | "register" | "forgot";
type LoadingTarget = "password" | OAuthProvider | null;
type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type ForgotForm = z.infer<typeof forgotSchema>;

export function AuthPage({ mode }: { mode: AuthMode }) {
  return (
    <SiteShell>
      <main className="app-page">
        <div className="editorial-page-main grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <AuthVisual />
        <AuthCard mode={mode} />
        </div>
      </main>
    </SiteShell>
  );
}

export function AuthCallbackPage() {
  const router = useRouter();
  const hydrateFromSupabaseSnapshot = useAppStore((state) => state.hydrateFromSupabaseSnapshot);
  const [status, setStatus] = useState("Finishing your sign-in...");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function finishCallback() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setStatus("Demo mode is active. Open your dashboard to continue.");
        return;
      }
      try {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) await supabase.auth.exchangeCodeForSession(code);
        const { data } = await supabase.auth.getUser();
        if (!data.user) throw new Error("No active Supabase session.");
        const snapshot = await loadSupabaseSnapshot(data.user);
        if (!mounted) return;
        hydrateFromSupabaseSnapshot(snapshot);
        router.replace("/dashboard");
      } catch {
        if (!mounted) return;
        setError("We could not finish this sign-in. Please try again.");
        setStatus("Account connection needs another try.");
      }
    }
    void finishCallback();
    return () => {
      mounted = false;
    };
  }, [hydrateFromSupabaseSnapshot, router]);

  return (
    <SiteShell>
      <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-10">
        <Card className="grid gap-4 text-center">
          <Pill className="mx-auto bg-[#e8f4ef]">{error ? "Sign-in paused" : "Connecting account"}</Pill>
          <h1 className="font-display text-4xl font-black">{status}</h1>
          <p className="mx-auto max-w-xl font-bold leading-7 text-[#5c4a42]">
            Foody Fam is checking your session and loading your family profile.
          </p>
          {error && <p className="rounded-2xl bg-[#fff0eb] px-4 py-3 text-sm font-extrabold text-[#b45435]">{error}</p>}
          <Button className="mx-auto" onClick={() => router.push("/dashboard")}>
            Open dashboard <ArrowRight size={17} />
          </Button>
        </Card>
      </main>
    </SiteShell>
  );
}

function AuthVisual() {
  return (
    <div className="grid content-start gap-5">
      <Card className="grid min-h-[420px] content-between gap-8 !rounded-[36px] bg-[linear-gradient(145deg,#fff_0%,#fffaf6_58%,#f7efe9_100%)] p-7 lg:p-9">
        <div>
          <Pill className="bg-[#e8f4ef]">One meal, whole family</Pill>
          <h2 className="mt-6 [font-family:Georgia,serif] text-5xl font-normal leading-[0.95] tracking-[-0.045em] text-[#243929]">Dinner remembers your family</h2>
          <p className="mt-5 max-w-md text-base font-bold leading-7 text-[#5c4a42]">Profiles, pantry, saved meals, and planner choices stay ready for the next dinner.</p>
        </div>
        <div className="grid gap-3 text-sm font-bold text-[#5c4a42]">
          {[
            "Keep baby profiles, allergies, saved meals, and planner choices together.",
            "Sign in with email, Google, or Apple when you come back.",
            "New families start with onboarding so meals feel personal from day one."
          ].map((item) => (
            <p key={item} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#78bea8]" size={17} />
              {item}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const loginDemoUser = useAppStore((state) => state.loginDemoUser);
  const registerDemoUser = useAppStore((state) => state.registerDemoUser);
  const loginWithProvider = useAppStore((state) => state.loginWithProvider);
  const loginSupabaseUser = useAppStore((state) => state.loginSupabaseUser);
  const hydrateFromSupabaseSnapshot = useAppStore((state) => state.hydrateFromSupabaseSnapshot);
  const requestPasswordReset = useAppStore((state) => state.requestPasswordReset);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const [loading, setLoading] = useState<LoadingTarget>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const title = mode === "login" ? "Welcome back" : mode === "register" ? "Create your Foody Fam" : "Reset your password";
  const body =
    mode === "login"
      ? "Open your personalized kitchen dashboard."
      : mode === "register"
        ? "Start with a family profile, then finish onboarding."
        : "Get a demo reset confirmation now, with email delivery ready for production.";

  async function runProvider(provider: OAuthProvider) {
    setLoading(provider);
    setError("");
    try {
      const adapter = getPreferredAuthAdapter();
      const user = await adapter.signInWithOAuth(provider);
      const completed = mode === "register" ? false : onboardingCompleted;
      loginWithProvider(user, completed);
      router.push(mode === "register" ? "/onboarding" : "/dashboard");
    } catch {
      setError(`Could not connect ${provider}. Try again.`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card className="grid content-start gap-5 !rounded-[36px] !bg-white p-6 sm:p-8">
      <div>
        <Pill className="bg-[#e8f4ef]">Secure account</Pill>
        <h1 className="mt-4 [font-family:Georgia,serif] text-5xl font-normal tracking-[-0.04em] text-[#243929]">{title}</h1>
        <p className="mt-2 font-bold leading-7 text-[#5c4a42]">{body}</p>
      </div>

      {mode === "login" && (
        <LoginFormView
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSubmit={async (values) => {
            setLoading("password");
            setError("");
            try {
              const adapter = getPreferredAuthAdapter();
              const user = await adapter.signInWithPassword(values);
              if (isSupabaseConfigured()) {
                const supabase = getSupabaseBrowserClient();
                const { data } = await supabase!.auth.getUser();
                if (data.user) {
                  const snapshot = await loadSupabaseSnapshot(data.user);
                  hydrateFromSupabaseSnapshot(snapshot);
                  router.push("/dashboard");
                  return;
                }
                loginSupabaseUser(user, onboardingCompleted);
              } else {
                loginDemoUser(user, onboardingCompleted);
              }
              router.push("/dashboard");
            } catch {
              setError("Login failed. Check your details and try again.");
            } finally {
              setLoading(null);
            }
          }}
        />
      )}

      {mode === "register" && (
        <RegisterFormView
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSubmit={async (values) => {
            setLoading("password");
            setError("");
            try {
              const adapter = getPreferredAuthAdapter();
              const user = await adapter.signUpWithPassword(values);
              if (isSupabaseConfigured()) {
                loginSupabaseUser(user, false);
              } else {
                registerDemoUser(user);
              }
              router.push("/onboarding");
            } catch {
              setError("Registration failed. Try again in a moment.");
            } finally {
              setLoading(null);
            }
          }}
        />
      )}

      {mode === "forgot" && (
        <ForgotFormView
          loading={loading}
          onSubmit={async (values) => {
            setLoading("password");
            setError("");
            setSuccess("");
            try {
              await getPreferredAuthAdapter().resetPassword(values.email);
              requestPasswordReset(values.email);
              setSuccess(isSupabaseConfigured() ? "Reset email sent. Check your inbox." : "Reset link prepared for demo mode.");
            } catch {
              setError("Could not prepare reset link. Try again.");
            } finally {
              setLoading(null);
            }
          }}
        />
      )}

      {mode !== "forgot" && (
        <>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[#5c4a42]/55">
            <span className="h-px bg-[#e9c7b7]" />
            Or continue with
            <span className="h-px bg-[#e9c7b7]" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProviderButton provider="google" loading={loading} onClick={() => void runProvider("google")} />
            <ProviderButton provider="apple" loading={loading} onClick={() => void runProvider("apple")} />
          </div>
        </>
      )}

      {(error || success) && (
        <p className={`rounded-2xl px-4 py-3 text-sm font-extrabold ${error ? "bg-[#fff0eb] text-[#b45435]" : "bg-[#e8f4ef] text-[#437967]"}`}>
          {error || success}
        </p>
      )}

      <AuthSwitch mode={mode} />
    </Card>
  );
}

function LoginFormView({
  loading,
  showPassword,
  setShowPassword,
  onSubmit
}: {
  loading: LoadingTarget;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  onSubmit: (values: LoginForm) => Promise<void>;
}) {
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => void onSubmit(values))}>
      <InputShell icon={<Mail size={18} />} error={form.formState.errors.email?.message}>
        <Field placeholder="Email" type="email" {...form.register("email")} className="pl-11" />
      </InputShell>
      <PasswordField
        error={form.formState.errors.password?.message}
        visible={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
        register={form.register("password")}
      />
      <div className="flex items-center justify-between gap-3 text-sm font-extrabold">
        <label className="flex items-center gap-2 text-[#5c4a42]">
          <input type="checkbox" className="h-4 w-4 accent-[#78bea8]" /> Remember me
        </label>
        <Link href="/forgot-password" className="text-[#78bea8]">Forgot password?</Link>
      </div>
      <Button type="submit" disabled={loading !== null}>
        {loading === "password" ? "Opening dashboard..." : "Log in"} <ArrowRight size={17} />
      </Button>
    </form>
  );
}

function RegisterFormView({
  loading,
  showPassword,
  setShowPassword,
  onSubmit
}: {
  loading: LoadingTarget;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  onSubmit: (values: RegisterForm) => Promise<void>;
}) {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" }
  });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => void onSubmit(values))}>
      <InputShell icon={<UserRound size={18} />} error={form.formState.errors.name?.message}>
        <Field placeholder="Full name" {...form.register("name")} className="pl-11" />
      </InputShell>
      <InputShell icon={<Mail size={18} />} error={form.formState.errors.email?.message}>
        <Field placeholder="Email" type="email" {...form.register("email")} className="pl-11" />
      </InputShell>
      <PasswordField
        error={form.formState.errors.password?.message}
        visible={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
        register={form.register("password")}
      />
      <InputShell icon={<LockKeyhole size={18} />} error={form.formState.errors.confirmPassword?.message}>
        <Field placeholder="Confirm password" type={showPassword ? "text" : "password"} {...form.register("confirmPassword")} className="pl-11" />
      </InputShell>
      <Button type="submit" disabled={loading !== null}>
        {loading === "password" ? "Creating account..." : "Create account"} <ArrowRight size={17} />
      </Button>
    </form>
  );
}

function ForgotFormView({
  loading,
  onSubmit
}: {
  loading: LoadingTarget;
  onSubmit: (values: ForgotForm) => Promise<void>;
}) {
  const form = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" } });
  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => void onSubmit(values))}>
      <InputShell icon={<Mail size={18} />} error={form.formState.errors.email?.message}>
        <Field placeholder="Email" type="email" {...form.register("email")} className="pl-11" />
      </InputShell>
      <Button type="submit" disabled={loading !== null}>
        {loading === "password" ? "Preparing link..." : "Send reset link"}
      </Button>
    </form>
  );
}

function PasswordField({
  error,
  visible,
  onToggle,
  register
}: {
  error?: string;
  visible: boolean;
  onToggle: () => void;
  register: UseFormRegisterReturn<"password">;
}) {
  return (
    <InputShell icon={<LockKeyhole size={18} />} error={error}>
      <Field placeholder="Password" type={visible ? "text" : "password"} {...register} className="pl-11 pr-12" />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-2.5 rounded-full p-1.5 text-[#5c4a42] hover:bg-[#f7efe9]"
        onClick={onToggle}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </InputShell>
  );
}

function InputShell({ children, icon, error }: { children: React.ReactNode; icon: React.ReactNode; error?: string }) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-4 top-3 text-[#5c4a42]/70">{icon}</span>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs font-extrabold text-[#b45435]">{error}</p>}
    </div>
  );
}

function ProviderButton({ provider, loading, onClick }: { provider: OAuthProvider; loading: LoadingTarget; onClick: () => void }) {
  const Icon = provider === "google" ? Chrome : Apple;
  const label = provider === "google" ? "Google" : "Apple";
  return (
    <Button type="button" variant="secondary" disabled={loading !== null} onClick={onClick}>
      <Icon size={18} />
      {loading === provider ? `Connecting ${label}...` : label}
    </Button>
  );
}

function AuthSwitch({ mode }: { mode: AuthMode }) {
  if (mode === "forgot") {
    return <Link href="/login" className="text-center text-sm font-extrabold text-[#78bea8]">Back to login</Link>;
  }
  return (
    <p className="text-center text-sm font-bold text-[#5c4a42]">
      {mode === "login" ? "New to Foody Fam?" : "Already have an account?"}{" "}
      <Link href={mode === "login" ? "/register" : "/login"} className="font-extrabold text-[#78bea8]">
        {mode === "login" ? "Create account" : "Log in"}
      </Link>
    </p>
  );
}
