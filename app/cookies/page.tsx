import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Learn about essential browser storage, optional cookies, Stripe checkout, and cookie controls used by Foody Fam.",
  path: "/cookies"
});

const sections = [
  {
    title: "What cookies and browser storage are",
    paragraphs: ["Cookies and browser storage allow a website to remember information on your device. Similar technologies include localStorage and sessionStorage. Some are necessary for requested features, while optional technologies require your choice."]
  },
  {
    title: "Essential storage",
    items: [
      "Supabase authentication data keeps you signed in and protects access to your account.",
      "Foody Fam local app state remembers profile, planner, shopping, and interface data while the service synchronizes with your account.",
      "Registration session data remembers an OAuth registration step without storing your password.",
      "The foodyfam-cookie-consent record remembers whether you accepted or declined optional cookies."
    ]
  },
  {
    title: "Payments and third parties",
    paragraphs: ["When you choose a paid plan, Stripe may use cookies and similar technologies for checkout, fraud prevention, security, and payment processing. Stripe controls those technologies on its hosted checkout pages under its own privacy and cookie information."]
  },
  {
    title: "Optional analytics",
    paragraphs: ["Foody Fam does not currently load optional analytics or advertising cookies. If optional analytics are introduced, they must remain disabled until consent is given, and this policy will be updated with provider, purpose, and retention details."]
  },
  {
    title: "Your choices",
    paragraphs: ["Allow Cookies records consent for optional technologies. Decline keeps optional technologies disabled while essential authentication and service storage continue to operate. You can reopen Cookie settings from the footer and change your choice at any time. Browser controls can also remove stored data, but doing so may sign you out or reset preferences."]
  },
  {
    title: "Storage duration",
    paragraphs: ["The consent choice remains until it is removed, replaced by a new policy version, or cleared through browser settings. Authentication duration is controlled by the active Supabase session. Other local app preferences remain until changed, cleared, or the account is deleted."]
  }
];

export default function Page() {
  return <LegalPage eyebrow="Cookies" title="Cookie Policy" intro="Foody Fam uses essential browser storage for accounts and app features. Optional cookies remain under your control." sections={sections} />;
}
