export type FoodyFamEvent =
  | "generator_started"
  | "recipe_generated"
  | "recipe_saved"
  | "signup_started"
  | "signup_completed"
  | "plan_selected"
  | "checkout_started"
  | "checkout_completed"
  | "feedback_submitted";

export function trackEvent(eventName: FoodyFamEvent, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, metadata })
  }).catch(() => undefined);
}
