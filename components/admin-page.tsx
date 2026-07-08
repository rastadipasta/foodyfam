"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, SlidersHorizontal, Users } from "lucide-react";
import { Button, Card, Pill, Select } from "@/components/ui";
import { isSupabaseConfigured, getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SettingsPreferences } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

type AdminUserRow = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  role: "user" | "admin";
  account_status: "active" | "suspended";
  subscription_status: SettingsPreferences["subscriptionStatus"];
  onboarding_completed: boolean;
  created_at: string;
};

const plans: SettingsPreferences["subscriptionStatus"][] = ["Free", "Premium", "Unlimited"];

export function AdminPage() {
  const authUser = useAppStore((state) => state.authUser);
  const localAdminEmails = useMemo(
    () => (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean),
    []
  );
  const canAdmin = authUser?.role === "admin" || Boolean(authUser?.email && localAdminEmails.includes(authUser.email.toLowerCase()));
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");

  useEffect(() => {
    if (!canAdmin || !isSupabaseConfigured()) return;
    void loadUsers();
  }, [canAdmin]);

  async function loadUsers() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,display_name,avatar_url,provider,role,account_status,subscription_status,onboarding_completed,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      setMessage("Could not load users. Confirm your account has role=admin and RLS migration is applied.");
    } else {
      setUsers((data || []) as AdminUserRow[]);
    }
    setLoading(false);
  }

  async function updateUser(user: AdminUserRow, patch: Partial<AdminUserRow>) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const next = { ...user, ...patch };
    setUsers((items) => items.map((item) => (item.id === user.id ? next : item)));
    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
    if (error) {
      setUsers((items) => items.map((item) => (item.id === user.id ? user : item)));
      setMessage("Update failed. Check admin permissions.");
      return;
    }
    await supabase.from("admin_audit_logs").insert({
      admin_id: authUser?.id,
      target_user_id: user.id,
      action: "profile_update",
      metadata: patch
    });
    setMessage("User updated.");
  }

  const filteredUsers = users.filter((user) => {
    const haystack = `${user.email} ${user.display_name || ""} ${user.provider || ""}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query.toLowerCase());
    const matchesPlan = planFilter === "All" || user.subscription_status === planFilter;
    return matchesQuery && matchesPlan;
  });

  if (!canAdmin) {
    return (
      <main className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4 py-12">
        <Card className="text-center">
          <ShieldCheck className="mx-auto text-[#78bea8]" size={38} />
          <h1 className="mt-4 font-display text-4xl font-black">Admin access required</h1>
          <p className="mt-3 font-bold leading-7 text-[#5c4a42]">
            Sign in with an account whose profile role is set to admin. First admin can be assigned in Supabase by updating `profiles.role`.
          </p>
          <Link href="/dashboard" className="mt-6 inline-flex"><Button>Back to dashboard</Button></Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Admin panel</p>
          <h1 className="mt-2 font-display text-5xl font-black text-[#243929]">Accounts & plans</h1>
          <p className="mt-3 max-w-2xl font-bold leading-7 text-[#5c4a42]">
            Manage user account status, roles, onboarding state, and Foody Fam subscription access.
          </p>
        </div>
        <Button type="button" onClick={() => void loadUsers()} disabled={loading}>
          <SlidersHorizontal size={17} />
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="!rounded-[28px]">
          <Users className="text-[#78bea8]" />
          <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-[#5c4a42]/70">Users loaded</p>
          <p className="mt-1 font-display text-4xl font-black">{users.length}</p>
        </Card>
        <Card className="!rounded-[28px]">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5c4a42]/70">Premium+</p>
          <p className="mt-1 font-display text-4xl font-black">{users.filter((user) => user.subscription_status !== "Free").length}</p>
        </Card>
        <Card className="!rounded-[28px]">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#5c4a42]/70">Admins</p>
          <p className="mt-1 font-display text-4xl font-black">{users.filter((user) => user.role === "admin").length}</p>
        </Card>
      </div>

      <Card className="mt-8">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users by email, name, or provider"
            className="min-h-12 rounded-full border border-[#eaded5] bg-white px-5 text-sm font-bold outline-none focus:border-[#78bea8] focus:ring-4 focus:ring-[#78bea8]/15"
          />
          <Select value={planFilter} onChange={(event) => setPlanFilter(event.target.value)}>
            <option>All</option>
            {plans.map((plan) => <option key={plan}>{plan}</option>)}
          </Select>
        </div>
        {message && <p className="mt-4 text-sm font-extrabold text-[#437967]">{message}</p>}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-y-3 text-left">
            <thead className="text-xs font-black uppercase tracking-[0.14em] text-[#5c4a42]/60">
              <tr>
                <th className="px-3">User</th>
                <th className="px-3">Plan</th>
                <th className="px-3">Role</th>
                <th className="px-3">Status</th>
                <th className="px-3">Provider</th>
                <th className="px-3">Onboarding</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="rounded-[22px] bg-[#fffaf6] shadow-sm">
                  <td className="rounded-l-[22px] px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[#405f46] text-sm font-black text-white">
                        {user.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          (user.display_name || user.email).slice(0, 1).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-black">{user.display_name || "Unnamed parent"}</p>
                        <p className="text-xs font-bold text-[#5c4a42]/70">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <Select value={user.subscription_status} onChange={(event) => void updateUser(user, { subscription_status: event.target.value as AdminUserRow["subscription_status"] })}>
                      {plans.map((plan) => <option key={plan}>{plan}</option>)}
                    </Select>
                  </td>
                  <td className="px-3 py-4">
                    <Select value={user.role} onChange={(event) => void updateUser(user, { role: event.target.value as AdminUserRow["role"] })}>
                      <option>user</option>
                      <option>admin</option>
                    </Select>
                  </td>
                  <td className="px-3 py-4">
                    <Select value={user.account_status} onChange={(event) => void updateUser(user, { account_status: event.target.value as AdminUserRow["account_status"] })}>
                      <option>active</option>
                      <option>suspended</option>
                    </Select>
                  </td>
                  <td className="px-3 py-4"><Pill className="w-fit">{user.provider || "password"}</Pill></td>
                  <td className="rounded-r-[22px] px-3 py-4">
                    <button
                      type="button"
                      className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#5c4a42] shadow-sm"
                      onClick={() => void updateUser(user, { onboarding_completed: !user.onboarding_completed })}
                    >
                      {user.onboarding_completed ? "Complete" : "Open"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isSupabaseConfigured() && (
            <p className="mt-5 rounded-[22px] bg-[#fff1e8] p-4 text-sm font-bold leading-6 text-[#5c4a42]">
              Supabase is not configured locally, so live account rows cannot load here yet. Add Supabase env vars and apply the migrations to activate this panel.
            </p>
          )}
        </div>
      </Card>
    </main>
  );
}
