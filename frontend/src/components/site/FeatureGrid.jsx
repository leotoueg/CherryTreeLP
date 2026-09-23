import { Fragment } from "react";
import { motion } from "framer-motion";
import { Clapperboard, Megaphone, LayoutTemplate, Database, MessageSquareText, CalendarCheck, Trophy, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";
import Reveal from "./Reveal";

const FLOW = [
  { icon: Clapperboard, label: "Content" },
  { icon: Megaphone, label: "Ads" },
  { icon: LayoutTemplate, label: "Landing Page" },
  { icon: Database, label: "CRM" },
  { icon: MessageSquareText, label: "Follow-Up" },
  { icon: CalendarCheck, label: "Appointment" },
  { icon: Trophy, label: "Sale" },
];

export const FeatureGrid = () => {
  return (
    <section className="relative py-24 sm:py-32" data-testid="features-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          chapter="04"
          kicker="The system"
          title={<>Everything your growth team needs.<br />One partner.</>}
          subtitle="Most contractors buy these pieces from five vendors and stitch them together themselves. We build and run the whole pipeline — each stage feeds the next, so nothing leaks."
        />

        <div className="mt-14 flex flex-col gap-2 lg:flex-row lg:items-stretch" data-testid="system-flow">
          {FLOW.map((n, i) => {
            const last = i === FLOW.length - 1;
            return (
              <Fragment key={n.label}>
                <Reveal delay={i * 0.06} className="flex-1">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`flex h-full flex-col items-center justify-center gap-3 rounded-2xl border px-4 py-6 text-center ${
                      last
                        ? "border-[#285EE0]/60 bg-[#285EE0]/15 shadow-[0_0_40px_-12px_rgba(40,94,224,0.8)]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                    data-testid={`system-node-${i + 1}`}
                  >
                    <n.icon className={`h-6 w-6 ${last ? "text-brand-accent" : "text-[#285EE0]"}`} />
                    <span className="font-display text-sm uppercase tracking-wide text-white">{n.label}</span>
                  </motion.div>
                </Reveal>
                {!last && (
                  <div className="flex items-center justify-center py-1 lg:py-0">
                    <ArrowRight className="h-5 w-5 rotate-90 text-[#285EE0]/60 lg:rotate-0" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-white/40" data-testid="system-flow-caption">
          Built, connected and optimized by one team — you see every stage in one place.
        </p>

        <SectionCTA testid="features-cta" />
      </div>
    </section>
  );
};

export default FeatureGrid;
