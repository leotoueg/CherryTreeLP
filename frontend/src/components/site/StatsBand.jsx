import Reveal from "./Reveal";

const STATS = [
  { value: "$100K+", label: "Monthly ad spend managed" },
  { value: "500+", label: "Sold projects" },
  { value: "7-Day", label: "Launch" },
];

export const StatsBand = () => {
  return (
    <section className="relative border-b border-white/10 py-14 sm:py-16" data-testid="stats-band">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="text-center sm:text-left">
              <p className="font-display text-5xl leading-none text-gradient sm:text-6xl" data-testid={`stat-${i + 1}`}>
                {s.value}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/55 sm:text-sm">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBand;
