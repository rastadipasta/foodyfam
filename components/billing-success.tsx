"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadSupabaseSnapshot } from "@/lib/supabase/profile-sync";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "./ui";

export function BillingSuccess() {
  const router = useRouter();
  const hydrate = useAppStore((state) => state.hydrateFromSupabaseSnapshot);
  const [message, setMessage] = useState("Confirming your subscription...");

  useEffect(() => {
    let active = true;
    async function finish() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase!.auth.getSession();
      if (!data.session) return router.replace("/login");
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const response = await fetch("/api/billing/status", { headers: { Authorization: `Bearer ${data.session.access_token}` } });
        const status = await response.json();
        if (status.subscription_status !== "Free") break;
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
      }
      const { data: userData } = await supabase!.auth.getUser();
      if (userData.user && active) hydrate(await loadSupabaseSnapshot(userData.user));
      if (active) {
        setMessage("Subscription ready. Opening your dashboard...");
        window.setTimeout(() => router.replace("/dashboard"), 650);
      }
    }
    void finish();
    return () => {
      active = false;
    };
  }, [hydrate, router]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#fffaf6] px-4">
      <Card className="max-w-lg text-center">
        <CheckCircle2 className="mx-auto text-[#405f46]" size={44} />
        <h1 className="mt-4 [font-family:Georgia,serif] text-4xl text-[#243929]">Welcome to Foody Fam</h1>
        <p className="mt-3 font-bold text-[#5c4a42]">{message}</p>
      </Card>
    </main>
  );
}
