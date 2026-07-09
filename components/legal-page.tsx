import Link from "next/link";
import { SiteShell } from "./layout";

type LegalSection = { title: string; paragraphs?: string[]; items?: string[] };

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <SiteShell>
      <main className="bg-[#fffaf6] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#78bea8]">{eyebrow}</p>
          <h1 className="mt-4 [font-family:Georgia,serif] text-5xl font-normal leading-none text-[#243929] sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[#5c4a42]">{intro}</p>
          <p className="mt-3 text-sm font-bold text-[#5c4a42]/70">Last updated: July 9, 2026</p>

          <div className="mt-10 grid gap-5">
            {sections.map((section) => (
              <section key={section.title} className="rounded-[28px] border border-[#eaded5] bg-white p-6 shadow-[0_16px_45px_rgba(92,74,66,0.06)] sm:p-8">
                <h2 className="[font-family:Georgia,serif] text-3xl text-[#243929]">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 font-semibold leading-7 text-[#5c4a42]">{paragraph}</p>)}
                {section.items && (
                  <ul className="mt-4 grid gap-3">
                    {section.items.map((item) => <li key={item} className="flex gap-3 font-semibold leading-7 text-[#5c4a42]"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#78bea8]" />{item}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <p className="mt-8 rounded-[24px] bg-[#405f46] p-6 font-bold leading-7 text-[#fffaf6]">
            Questions about privacy or cookies? <Link href="/contact" className="underline underline-offset-4">Contact Foody Fam</Link>.
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
