"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { familyMoments } from "@/lib/data";
import { Card, Pill } from "./ui";

export function Reveal({
  children,
  delay = 0,
  className
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.62, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPhoto({
  src,
  title,
  caption
}: {
  src: string;
  title: string;
  caption: string;
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-[28px] shadow-[0_24px_70px_rgba(92,74,66,0.18)]"
      whileHover={{ y: -8, rotate: -0.4 }}
      transition={{ duration: 0.25 }}
    >
      <Image src={src} alt={title} width={900} height={640} className="h-full min-h-[260px] w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1f1d1c]/64 via-[#1f1d1c]/12 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <Pill className="mb-3 bg-white/90">
          <Sparkles size={13} className="mr-1 text-[#f59b78]" />
          Live family workflow
        </Pill>
        <h3 className="font-display text-2xl font-black text-white">{title}</h3>
        <p className="mt-1 text-sm font-bold leading-6 text-white/88">{caption}</p>
      </div>
    </motion.div>
  );
}

export function MomentStrip() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {familyMoments.map((moment, index) => (
        <Reveal key={moment.title} delay={index * 0.08}>
          <FloatingPhoto src={moment.image} title={moment.title} caption={moment.body} />
        </Reveal>
      ))}
    </div>
  );
}

export function ScrollProgressGlow() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <motion.div className="fixed left-0 top-0 z-[60] h-1 origin-left bg-[#78bea8]" style={{ scaleX }} />;
}

export function MetricCard({ label, value, body }: { label: string; value: string; body: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-[#ffccb2]/50 blur-2xl" />
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#78bea8]">{label}</p>
      <p className="mt-2 font-display text-4xl font-black">{value}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#5c4a42]">{body}</p>
    </Card>
  );
}
