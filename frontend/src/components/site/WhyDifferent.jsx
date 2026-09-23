import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const TYPICAL = [
  "Runs the same ads for every contractor",
  "Uses stock footage or whatever you send them",
  "Sends leads through basic, generic forms",
  "Leaves you with disorganized leads to figure out",
];

const CHERRY = [
  "We fly to your business",
  "We professionally film your team",
  "We build customized landing pages for you",
  "We set up a custom CRM system for your campaign",
  "We build your entire funnel — you never touch it",
];

export const WhyDifferent = () => {
  return (
    <section className="relative py-24 sm:py-32" data-testid="why-different-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          chapter="03"
          kicker="Why we're different"
          title={<>Most agencies run ads.<br />We become your growth team.</>}
          subtitle="Other agencies generate leads and leave you to figure out what to do with them. We build the landing pages, CRM and follow-up — the whole funnel, working together from first click to booked job."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Other agencies */}
          <Reveal>
            <div className="h-full rounded-3xl border border-white/20 bg-white/[0.04] p-8 sm:p-10" data-testid="comparison-typical">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">Other marketing agencies</p>
              <ul className="mt-8 space-y-5">
                {TYPICAL.map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.05]">
                      <X className="h-4 w-4 text-white/60" />
                    </span>
                    <span className="text-base text-white/75">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-10 text-sm leading-relaxed text-white/50">
                You get leads dumped in your lap — and you're left figuring out what to do with them.
              </p>
            </div>
          </Reveal>

          {/* Cherry Tree */}
          <Reveal delay={0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              className="relative h-full overflow-hidden rounded-3xl border border-[#285EE0]/40 bg-gradient-to-b from-[#285EE0]/[0.12] to-white/[0.01] p-8 sm:p-10"
              data-testid="comparison-cherrytree"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#285EE0]/25 blur-3xl" />
              <p className="relative text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">CherryTree</p>
              <ul className="relative mt-8 space-y-5">
                {CHERRY.map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#285EE0]/40 bg-[#285EE0]/15 shadow-[0_0_20px_-6px_rgba(40,94,224,0.9)]">
                      <Check className="h-4 w-4 text-brand-accent" />
                    </span>
                    <span className="text-base font-medium text-white">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="relative mt-10 text-sm leading-relaxed text-white/60">
                Landing pages, CRM, lead organization and follow-up — built and managed end to end. You just answer the phone.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferent;
