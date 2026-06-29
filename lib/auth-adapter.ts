import type { AuthProvider, AuthUser } from "@/lib/types";

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
  async signOut() {
    await wait(220);
  },
  async resetPassword() {
    await wait(620);
    return { ok: true };
  }
};

export function getAuthRedirectUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl.replace(/\/$/, "")}/auth/callback`;
}
