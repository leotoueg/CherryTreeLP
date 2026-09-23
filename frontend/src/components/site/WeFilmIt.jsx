import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const SHOTS = [
  { src: "/film-stills/shot-1.jpg", alt: "On-site filmed interview with a contractor client" },
  { src: "/film-stills/shot-2.jpg", alt: "Real client work footage — crews, jobs and before-and-afters" },
  { src: "/film-stills/shot-3.jpg", alt: "Filming on location at a client's office" },
  { src: "/film-stills/shot-4.jpg", alt: "Capturing a contractor's story in person" },
];

export const WeFilmIt = () => {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" data-testid="we-film-it-section">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand/15 blur-[160px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          chapter="02"
          kicker="The difference"
          title={<>We don't ask you to send us content.<br />We come film it.</>}
          subtitle="Stock footage is why most contractor ads look identical. Ours don't."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4" data-testid="film-stills-strip">
          {SHOTS.map((s, i) => (
            <Reveal key={s.src} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group overflow-hidden rounded-2xl border border-white/10"
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-white/70 sm:text-lg" data-testid="film-it-caption">
            We fly to your market and spend the day capturing your team, your jobs, your customers and your
            story — then turn that footage into months of advertising creative.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default WeFilmIt;
