import { ClipboardList, PhoneCall, Plane, Clapperboard, Rocket, TrendingUp } from "lucide-react";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";
import Reveal from "./Reveal";

const STEPS = [
  { icon: ClipboardList, title: "Apply", body: "Tell us about your business. We only take on contractors we know we can grow." },
  { icon: PhoneCall, title: "Strategy Call", body: "We map your market, your numbers and the exact system we'd build for you." },
  { icon: Plane, title: "We Fly Out", body: "Our team travels to your location. No outsourcing, no stock, no shortcuts." },
  { icon: Clapperboard, title: "Film Everything", body: "Commercials, social content and ad creative — professionally produced on-site." },
  { icon: Rocket, title: "Launch Campaigns", body: "Google Ads, Meta Ads, landing pages and CRM automations go live." },
  { icon: TrendingUp, title: "Scale", body: "We optimize weekly and pour fuel on what converts into profitable jobs." },
];

export const ProcessTimeline = () => {
  return (
    <section className="relative py-24 sm:py-28" data-testid="process-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          chapter="05"
          kicker="The process"
          title="Six steps to a full pipeline"
          subtitle="A clear, proven path from application to a market-leading acquisition system."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={(i % 3) * 0.08} className="h-full">
              <div
                className="group h-full rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-[#285EE0]/40"
                data-testid={`process-step-${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl leading-none text-white/15 transition-colors duration-300 group-hover:text-[#285EE0]/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#285EE0]/30 bg-[#285EE0]/10 shadow-[0_0_30px_-12px_rgba(40,94,224,0.8)]">
                    <step.icon className="h-5 w-5 text-[#285EE0]" />
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl uppercase tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <SectionCTA testid="process-cta" />
      </div>
    </section>
  );
};

export default ProcessTimeline;
