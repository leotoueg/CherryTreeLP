import { useState } from "react";
import { motion } from "framer-motion";
import { Play, MapPin, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "../ui/dialog";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";
import Reveal from "./Reveal";
import VideoPlayer from "./VideoPlayer";

const TESTIMONIALS = [
  {
    name: "Stephen Cruey",
    company: "Apex Bath Remodeling",
    location: "Cleburne, TX",
    industry: "Bath Remodeling",
    poster: "/testimonials/apex-baths.jpg",
    source: { kind: "mp4", src: "/testimonials/apex-baths.mp4" },
  },
  {
    name: "Emilio Talavera",
    company: "Roofing Monkeys",
    location: "Toronto, ON",
    industry: "Roofing",
    poster: "/testimonials/roofing-monkeys.jpg",
    source: { kind: "mp4", src: "/testimonials/roofing-monkeys.mp4" },
  },
  {
    name: "Clint Roberts",
    company: "Prime Baths of New Mexico",
    location: "Albuquerque, NM",
    industry: "Bath Remodeling",
    poster: "/testimonials/prime-baths.jpg",
    source: { kind: "mp4", src: "/testimonials/prime-baths.mp4" },
  },
  {
    name: "Ali Vafaeian",
    company: "CFC Contracting",
    location: "Toronto, Ontario",
    industry: "General Contracting",
    poster: "/testimonials/cfc.jpg",
    source: { kind: "mp4", src: "/testimonials/cfc.mp4" },
  },
];

export const VideoTestimonials = () => {
  const [active, setActive] = useState(null);

  return (
    <section className="relative border-y border-white/10 bg-black/40 py-24 sm:py-32" data-testid="testimonials-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          chapter="01"
          kicker="Results"
          title="Contractors in their own words"
          subtitle="Real owners. Real jobs. Real growth. Press play."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name + t.company} delay={i * 0.08}>
              <motion.button
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setActive(t)}
                className="group block w-full text-left"
                data-testid={`testimonial-card-${i + 1}`}
                aria-label={`Play testimonial from ${t.name}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
                  <img
                    src={t.poster}
                    alt={`${t.name} — ${t.company}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
                    {t.industry}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#285EE0]/90 shadow-[0_0_40px_-6px_rgba(40,94,224,0.95)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
                    </span>
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-display text-xl uppercase tracking-tight text-white">{t.name}</p>
                    <p className="mt-1 text-sm text-white/70">{t.company}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/45">
                      <MapPin className="h-3 w-3" /> {t.location}
                    </p>
                  </span>
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>

        <SectionCTA testid="results-cta" />
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl border-white/10 bg-ink-900 p-3" data-testid="testimonial-modal">
          <DialogClose
            data-testid="testimonial-modal-close"
            className="absolute -right-3 -top-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#285EE0]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogTitle className="sr-only">{active?.name} — {active?.company} testimonial</DialogTitle>
          {active && (
            <VideoPlayer
              source={active.source}
              poster={active.poster}
              label={`${active.name} · ${active.company}`}
              autoPlay
              testid="testimonial-video"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoTestimonials;
