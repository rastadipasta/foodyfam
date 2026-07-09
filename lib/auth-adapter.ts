import type { AuthProvider, AuthUser } from "@/lib/types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { authUserFromSupabase, ensureSupabaseProfile } from "@/lib/supabase/profile-sync";

export type OAuthProvider = Extract<AuthProvider, "google" | "apple">;

export type PasswordCredentials = {
  email: string;
  password: string;
  name?: string;
};

export type AuthAdapter = {
  signInWithPassword: (credentials: PasswordCredentials) => Promise<AuthUser>;
  signUpWithPassword: (credentials: PasswordCredentials) => Promise<AuthUser>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<AuthUser>;
  verifySignupOtp: (email: string, token: string) => Promise<AuthUser>;
  resendSignupOtp: (email: string) => Promise<void>;
  getSession?: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ ok: true }>;
};

const providerNames: Record<AuthProvider, string> = {
  password: "Foody Fam Parent",
  google: "Google Parent",
  apple: "Apple Parent"
};

const providerEmails: Record<AuthProvider, string> = {
  password: "parent@foodyfam.demo",
  google: "parent.google@foodyfam.demo",
  apple: "parent.apple@foodyfam.demo"
};

function wait(ms = 520) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function createDemoUser(provider: AuthProvider, email?: string, name?: string): AuthUser {
  const now = new Date().toISOString();
  const normalizedEmail = email?.trim().toLowerCase() || providerEmails[provider];
  const displayName = name?.trim() || providerNames[provider];

  return {
    id: `demo-${provider}-${normalizedEmail}`,
    email: normalizedEmail,
    displayName,
    avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
    provider,
    providerId: `demo-${provider}`,
    emailVerified: provider !== "password",
    lastLoginAt: now
  };
}

export const demoAuthAdapter: AuthAdapter = {
  async signInWithPassword(credentials) {
    await wait();
    return createDemoUser("password", credentials.email);
  },
  async signUpWithPassword(credentials) {
    await wait(680);
    return createDemoUser("password", credentials.email, credentials.name);
  },
  async signInWithOAuth(provider) {
    await wait(720);
    return createDemoUser(provider);
  },
  async verifySignupOtp(email) {
    await wait(520);
    return createDemoUser("password", email);
  },
  async resendSignupOtp() {
    await wait(420);
  },
  async signOut() {
    await wait(220);
  },
  async resetPassword() {
    await wait(620);
    return { ok: true };
  }
};

export const supabaseAuthAdapter: AuthAdapter = {
  async signInWithPassword(credentials) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    });
    if (error || !data.user) throw error || new Error("No Supabase user returned.");
    const profile = await ensureSupabaseProfile(data.user, credentials.name);
    return authUserFromSupabase(data.user, profile);
  },
  async signUpWithPassword(credentials) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
        data: {
          display_name: credentials.name || credentials.email.split("@")[0]
        }
      }
    });
    if (error || !data.user) throw error || new Error("No Supabase user returned.");
    const profile = data.session ? await ensureSupabaseProfile(data.user, credentials.name) : null;
    return authUserFromSupabase(data.user, profile);
  },
  async signInWithOAuth(provider) {
    const supabase = requireSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getAuthRedirectUrl()
      }
    });
    if (error) throw error;
    return new Promise<AuthUser>(() => undefined);
  },
  async verifySignupOtp(email, token) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token, type: "signup" });
    if (error || !data.user) throw error || new Error("Could not verify signup code.");
    const profile = await ensureSupabaseProfile(data.user);
    return authUserFromSupabase(data.user, profile);
  },
  async resendSignupOtp(email) {
    const supabase = requireSupabase();
    const { error } = await supabase.auth.resend({ type: "signup", email: email.trim().toLowerCase() });
    if (error) throw error;
  },
  async getSession() {
    const supabase = requireSupabase();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const profile = await ensureSupabaseProfile(data.user);
    return authUserFromSupabase(data.user, profile);
  },
  async signOut() {
    const supabase = requireSupabase();
    await supabase.auth.signOut();
  },
  async resetPassword(email) {
    const supabase = requireSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: getAuthRedirectUrl()
    });
    if (error) throw error;
    return { ok: true };
  }
};

export function getPreferredAuthAdapter() {
  return isSupabaseConfigured() ? supabaseAuthAdapter : demoAuthAdapter;
}

export async function signOutActiveAuth() {
  if (isSupabaseConfigured()) {
    await supabaseAuthAdapter.signOut().catch(() => undefined);
  } else {
    await demoAuthAdapter.signOut();
  }
}

export function getAuthRedirectUrl() {
  const explicit = process.env.NEXT_PUBLIC_SUPABASE_AUTH_REDIRECT_URL;
  if (explicit) return explicit;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl.replace(/\/$/, "")}/auth/callback`;
}

function requireSupabase() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}
