"use client";

import Link from "next/link";
import { LockKeyhole, Sparkles } from "lucide-react";
import { Button, Card, Pill } from "@/components/ui";
import { canAccessFeature, featureLabels, getUpgradeTarget, type PlanFeature, type SubscriptionPlan } from "@/lib/plan-gating";

export function FeatureGate({
  plan,
  feature,
  children
}: {
  plan: SubscriptionPlan;
  feature: PlanFeature;
  children: React.ReactNode;
}) {
  if (canAccessFeature(plan, feature)) return <>{children}</>;
  const target = getUpgradeTarget(feature);
  const label = featureLabels[feature];

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[3px] opacity-45" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 z-10 grid place-items-center p-4">
        <Card className="max-w-md !rounded-[30px] border-[#e9c7b7] bg-white/94 p-6 text-center shadow-[0_28px_90px_rgba(92,74,66,0.18)] backdrop-blur-xl">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#405f46] text-[#fffaf6] shadow-[0_14px_32px_rgba(64,95,70,0.24)]">
            <LockKeyhole size={24} />
          </div>
          <Pill className="mx-auto mt-5 w-fit bg-[#e8f4ef]">Current plan: {plan}</Pill>
          <h2 className="mt-4 font-display text-3xl font-black text-[#243929]">{label} is locked</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-[#5c4a42]">
            Upgrade to {target} to unlock this Foody Fam workspace and keep one family meal flowing across recipes, planning, and shopping.
          </p>
          <Link href="/pricing" className="mt-5 inline-flex">
            <Button>
              <Sparkles size={17} />
              Upgrade to {target}
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
