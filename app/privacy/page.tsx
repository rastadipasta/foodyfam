import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Foody Fam collects, uses, stores, and protects account, family profile, recipe, and billing information.",
  path: "/privacy"
});

const sections = [
  {
    title: "Who controls your data",
    paragraphs: ["Foody Fam is responsible for the personal information processed through this website and application. Privacy requests can be submitted through the Foody Fam contact page."]
  },
  {
    title: "Information we process",
    items: [
      "Account information such as name, email address, authentication provider, profile image, and account status.",
      "Family meal information such as family members, baby profiles, age bands, allergies, diet preferences, appliances, pantry items, saved recipes, meal plans, and shopping lists.",
      "AI requests and generated recipe results needed to provide the recipe generator and assistant.",
      "Subscription and transaction references from Stripe. Foody Fam does not store complete payment card details.",
      "Essential technical information required for authentication, security, fraud prevention, diagnostics, and service operation."
    ]
  },
  {
    title: "Why we use information",
    items: [
      "To create and maintain your account and provide requested features.",
      "To personalize family recipes, baby adaptations, planning, and shopping tools.",
      "To process subscriptions and enforce plan limits.",
      "To protect accounts, investigate errors, and prevent misuse.",
      "To comply with legal obligations and respond to valid requests."
    ]
  },
  {
    title: "Legal bases",
    paragraphs: ["Depending on the processing activity, Foody Fam relies on performance of a contract, legitimate interests in operating and securing the service, consent for optional cookies or communications, and compliance with legal obligations."]
  },
  {
    title: "Service providers and international transfers",
    paragraphs: ["Foody Fam uses service providers including Supabase for authentication and database services, OpenAI for AI-generated results, Stripe for subscription payments, and Vercel for hosting. These providers may process data in other countries using their contractual and legal transfer safeguards."]
  },
  {
    title: "Retention and deletion",
    paragraphs: ["Account and family data is retained while your account is active and for a limited period afterward where needed for security, disputes, accounting, or legal obligations. You may request account deletion through the contact page. Some records may be retained where legally required."]
  },
  {
    title: "Your privacy rights",
    items: [
      "Request access to or a copy of your personal data.",
      "Request correction, deletion, restriction, or portability where applicable.",
      "Object to certain processing or withdraw consent at any time.",
      "Lodge a complaint with your local data protection authority."
    ]
  },
  {
    title: "Children and feeding information",
    paragraphs: ["Foody Fam is designed for parents and caregivers, not for children to create accounts directly. Baby and allergy information is used to personalize cooking guidance. Foody Fam is not medical advice; consult a qualified professional for medical, allergy, or feeding concerns."]
  },
  {
    title: "Security and policy changes",
    paragraphs: ["Foody Fam uses access controls, encrypted connections, row-level database protections, and server-only credentials. No system is completely risk-free. Material policy changes will be reflected on this page with an updated date."]
  }
];

export default function Page() {
  return <LegalPage eyebrow="Privacy" title="Privacy Policy" intro="This policy explains what Foody Fam processes, why it is needed, and the choices available to you." sections={sections} />;
}
