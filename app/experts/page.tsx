import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/layout";
import { Button, Card, Pill, SectionShell } from "@/components/ui";
import { faqSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Foody Fam Safety And Expert Review Foundation",
  description:
    "How Foody Fam handles age-aware recipe guidance, allergy caution, baby texture guidance, and parent responsibility while expert review is being prepared.",
  path: "/experts"
});

const faqs = [
  {
    question: "Does Foody Fam guarantee baby-safe meals?",
    answer:
      "No. Foody Fam provides age-aware cooking guidance and safety prompts, but parents must confirm allergies, readiness, texture, temperature, and individual suitability."
  },
  {
    question: "What safety rules does Foody Fam highlight?",
    answer:
      "Foody Fam highlights common cautions such as no honey under 12 months, no added salt for baby portions, careful choking-shape preparation, and parent confirmation for allergens."
  }
];

export default function Page() {
  return (
    <SiteShell>
      <JsonLd data={faqSchema(faqs)} />
      <main className="app-page">
        <SectionShell className="py-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Pill className="border-[#e9c7b7] bg-white px-5 py-2 text-[11px] uppercase tracking-[0.16em]">
                <ShieldCheck size={14} className="mr-2 text-[#78bea8]" />
                Safety foundation
              </Pill>
              <h1 className="mt-6 [font-family:Georgia,serif] text-5xl font-normal leading-[0.95] tracking-[-0.04em] text-[#243929] sm:text-6xl">
                Age-aware guidance, parent-confirmed.
              </h1>
              <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-[#5c4a42]">
                Foody Fam is being prepared for expert review. Until real reviewers are attached, we do not claim medical approval or guaranteed safety.
              </p>
              <Link href="/generator" className="mt-7 inline-flex">
                <Button>Generate tonight&apos;s family meal free</Button>
              </Link>
            </div>
            <Card className="grid gap-5 !rounded-[34px] !bg-white">
              {[
                ["Reviewed rules", "Rules are written to be review-ready: no honey under 12 months, no added salt for babies, and careful texture/choking-shape prompts."],
                ["Allergy caution", "Foody Fam flags allergy notes in the recipe flow, but families must verify ingredients and medical guidance for their child."],
                ["Texture guidance", "Baby portions are described as mash, puree, or soft pieces depending on age and feeding style."],
                ["Parent responsibility", "Parents decide whether an ingredient, texture, and serving style is appropriate for their child."]
              ].map(([title, body]) => (
                <section key={title} className="rounded-[24px] bg-[#fffaf6] p-5">
                  <h2 className="font-display text-2xl font-black text-[#243929]">{title}</h2>
                  <p className="mt-2 font-bold leading-7 text-[#5c4a42]">{body}</p>
                </section>
              ))}
            </Card>
          </div>
        </SectionShell>
      </main>
    </SiteShell>
  );
}
