import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, ArrowRight, TriangleAlert } from "lucide-react";
import CTAButton from "./CTAButton";
import VideoPlayer from "./VideoPlayer";

const EASE = [0.22, 1, 0.36, 1];

const HEADLINE = [
  { text: "We become your", accent: false },
  { text: "in-house", accent: false },
  { text: "growth team.", accent: true },
];

const lineVariants = {
  hidden: { y: "110%" },
  visible: (i) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE },
  }),
};

const VSL_POSTER = "/vsl/vsl-poster.jpg";
const VSL_SOURCE = { kind: "mp4", src: "/vsl/vsl.mp4" };

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-20 sm:pt-24" data-testid="hero-section">
      <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-[720px]" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand/20 blur-[160px]" />

      {/* Attention badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto mb-5 flex w-full max-w-7xl justify-center px-5 sm:px-8"
      >
        <div
          className="flex w-full items-center justify-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-2 shadow-[0_0_30px_-8px_rgba(251,191,36,0.6)] sm:w-auto sm:px-5 sm:py-1.5"
          data-testid="hero-warning-badge"
        >
          <TriangleAlert className="h-3 w-3 shrink-0 text-amber-400 sm:h-3.5 sm:w-3.5" />
          <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.04em] text-amber-300 sm:text-[11px] sm:tracking-[0.22em]">
            For Contractors Doing Over $2M+ Per Year
          </span>
          <TriangleAlert className="h-3 w-3 shrink-0 text-amber-400 sm:h-3.5 sm:w-3.5" />
        </div>
      </motion.div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-10 sm:px-8 sm:pb-16 lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-10">
        {/* Left column */}
        <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
          {/* Eyebrow (desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-5 hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-xl lg:inline-flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
            <span className="text-[11px] uppercase tracking-[0.24em] text-white/70">
              Done-for-you growth for established contractors
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display uppercase leading-[0.9] tracking-tight text-4xl sm:text-6xl lg:text-7xl">
            {HEADLINE.map((line, i) => (
              <span key={i} className="block overflow-hidden py-0.5">
                <motion.span
                  className={`block ${line.accent ? "text-gradient" : "text-white"}`}
                  custom={i}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Mobile video (between headline and subtext) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="mt-7 w-full lg:hidden"
          >
            <div className="rounded-[1.25rem] border border-[#285EE0]/50 bg-white/[0.03] p-2 shadow-[0_30px_90px_-30px_rgba(44,92,229,0.8)] backdrop-blur-xl">
              <VideoPlayer source={VSL_SOURCE} poster={VSL_POSTER} label="See how it works" eyebrow="Our Process" testid="hero-vsl-mobile" borderClass="border-[#285EE0]/40" vslTracking />
            </div>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            We help established contractors generate more profitable jobs by building and running their entire
            acquisition system — professionally filmed ads, paid media, landing pages, CRM and follow-up.
            We fly to you. We build it. We run it.
          </motion.p>

          {/* Mobile CTA (after subtext) */}
          <div className="mt-8 flex w-full justify-center lg:hidden">
            <CTAButton to="apply" data-testid="hero-primary-cta-mobile" className="w-full sm:w-auto">
              Book Your Strategy Call <ArrowRight className="h-4 w-4" />
            </CTAButton>
          </div>

          {/* Desktop CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="mt-7 hidden flex-col gap-4 sm:flex-row lg:flex lg:justify-start"
          >
            <CTAButton to="apply" data-testid="hero-primary-cta">
              Book Your Strategy Call <ArrowRight className="h-4 w-4" />
            </CTAButton>
            <CTAButton to="vsl" variant="glass" data-testid="hero-secondary-cta">
              Watch The Video
            </CTAButton>
          </motion.div>

          {/* Social proof (desktop only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 hidden flex-wrap items-center gap-x-6 gap-y-3 lg:flex"
            data-testid="hero-social-proof"
          >
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex shrink-0 -space-x-2">
                {["1607990281513-2c110a25bd8c", "1600486913747-55e5470d6f40", "1541888946425-d81bb19240f5"].map((id) => (
                  <img
                    key={id}
                    src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=80&h=80&q=60`}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full border-2 border-ink-950 object-cover"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5 text-brand-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="whitespace-nowrap text-xs text-white/55">Trusted by contractors doing $2M–$25M+</p>
              </div>
            </div>
            <div className="hidden h-8 w-px bg-white/10 xl:block" />
            <p className="whitespace-nowrap text-xs uppercase tracking-[0.18em] text-white/40">
              Roofing · Remodeling · HVAC · Concrete · Landscaping
            </p>
          </motion.div>
        </div>

        {/* Desktop video (right column) */}
        <motion.div
          id="vsl"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          style={{ y: videoY, scale: videoScale }}
          className="hidden w-full lg:block"
        >
          <div className="rounded-[1.5rem] border border-[#285EE0]/50 bg-white/[0.03] p-2 shadow-[0_40px_120px_-30px_rgba(44,92,229,0.8)] backdrop-blur-xl sm:p-3">
            <VideoPlayer source={VSL_SOURCE} poster={VSL_POSTER} label="See how it works" eyebrow="Our Process" testid="hero-vsl" borderClass="border-[#285EE0]/40" vslTracking />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
