import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const SHOTS = [
  { src: "/film-clips/clip-1.mp4", poster: "/film-stills/shot-1.jpg", alt: "CherryTree crew filming an interior renovation on-site" },
  { src: "/film-clips/clip-2.mp4", poster: "/film-stills/shot-2.jpg", alt: "Client's branded truck and team on a job" },
  { src: "/film-clips/clip-3.mp4", poster: "/film-stills/shot-3.jpg", alt: "Crew filming a luxury kitchen with a gimbal" },
  { src: "/film-clips/clip-4.mp4", poster: "/film-stills/shot-4.jpg", alt: "Crew capturing interior footage on location" },
  { src: "/film-clips/clip-5.mp4", poster: "/film-stills/shot-5.jpg", alt: "Filming a contractor working with power tools on-site" },
  { src: "/film-clips/clip-6.mp4", poster: "/film-stills/shot-6.jpg", alt: "On the roof with a client's crew capturing content" },
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
      </div>

      <div className="relative mx-auto mt-14 max-w-[1096px] overflow-hidden" data-testid="film-stills-strip">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black via-black/70 to-transparent sm:w-36" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black via-black/70 to-transparent sm:w-36" />
        <div className="marquee-track-reverse gap-6 pr-6">
          {[...SHOTS, ...SHOTS].map((s, i) => (
            <div
              key={`${s.src}-${i}`}
              className="w-52 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:w-64"
            >
              <video
                src={s.src}
                poster={s.poster}
                aria-label={s.alt}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <Reveal delay={0.15}>
        <p className="mx-auto mt-10 max-w-2xl px-5 text-center text-base leading-relaxed text-white/70 sm:text-lg" data-testid="film-it-caption">
          We fly to your market and spend the day capturing your team, your jobs, your customers and your
          story — then turn that footage into months of advertising creative.
        </p>
      </Reveal>
    </section>
  );
};

export default WeFilmIt;
