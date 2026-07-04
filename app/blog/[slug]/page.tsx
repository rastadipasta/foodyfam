import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import { getGuide, seoGuides } from "@/lib/seo-content";

export function generateStaticParams() {
  return seoGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return pageMetadata({ title: "Guide not found", description: "Foody Fam guide not found.", path: "/blog" });
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/blog/${guide.slug}`,
    image: "/brand/generated/brand-editorial.png"
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: guide.title, path: `/blog/${guide.slug}` }
          ]),
          faqSchema(guide.faqs)
        ]}
      />
      <nav className="text-sm font-extrabold text-[#5c4a42]/70">
        <Link href="/" className="hover:text-[#f59b78]">Home</Link> / <Link href="/blog" className="hover:text-[#f59b78]">Guides</Link> / {guide.title}
      </nav>
      <article className="mt-6 rounded-[30px] border border-[#e9c7b7]/70 bg-[linear-gradient(145deg,#fffaf6_0%,#f7efe9_60%,#ffccb2_150%)] p-5 shadow-[0_24px_70px_rgba(92,74,66,0.12)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#78bea8]">Foody Fam guide</p>
        <h1 className="mt-3 font-display text-balance text-5xl font-black leading-tight text-[#1f1d1c]">{guide.title}</h1>
        <p className="mt-5 rounded-[24px] bg-white/74 p-5 text-lg font-bold leading-8 text-[#5c4a42]">{guide.summary}</p>
        <section className="mt-8">
          <h2 className="font-display text-3xl font-black">Practical steps</h2>
          <ol className="mt-4 grid gap-3">
            {guide.steps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-[20px] bg-white/74 p-4 text-sm font-bold leading-6 text-[#5c4a42]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8f4ef] text-xs font-black text-[#78bea8]">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
        <section className="mt-8">
          <h2 className="font-display text-3xl font-black">FAQ</h2>
          <div className="mt-4 grid gap-3">
            {guide.faqs.map((item) => (
              <div key={item.question} className="rounded-[20px] bg-white/78 p-4">
                <h3 className="font-display text-xl font-black">{item.question}</h3>
                <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-8 flex flex-wrap gap-3">
          {guide.links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full bg-[#78bea8] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(120,190,168,0.28)] transition hover:-translate-y-0.5">
              {link.label}
            </Link>
          ))}
        </section>
      </article>
    </main>
  );
}
