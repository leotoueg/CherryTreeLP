import { useState, useRef } from "react";
import { Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackCustom } from "../../lib/pixel";

const DEFAULT_VIDEO = "aqz-KE-bpKQ";

function embedUrl(source) {
  const kind = source?.kind || "youtube";
  const id = source?.id;
  if (kind === "vimeo") return `https://player.vimeo.com/video/${id}?app_id=122963&autoplay=1&title=0&byline=0&portrait=0`;
  if (kind === "loom") return `https://www.loom.com/embed/${id}?autoplay=1&hideEmbedTopBar=true`;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

// Distraction-free MP4 player: no seek bar, no duration — click anywhere to play/pause.
function MinimalMp4({ src, poster, testid, vslTracking = false }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const milestones = useRef(new Set());

  // Fire Meta Pixel custom events (VSL_25/50/75/100) once per milestone per page view
  const fireMilestone = (m) => {
    if (milestones.current.has(m)) return;
    milestones.current.add(m);
    trackCustom(`VSL_${m}`, { percent: m });
  };

  const onTimeUpdate = () => {
    if (!vslTracking) return;
    const v = ref.current;
    if (!v || !v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    [25, 50, 75].forEach((m) => {
      if (pct >= m) fireMilestone(m);
    });
  };

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <div className="absolute inset-0 cursor-pointer" onClick={toggle} data-testid={`${testid}-surface`}>
      <video
        ref={ref}
        className="h-full w-full bg-black object-cover"
        src={src}
        poster={poster}
        autoPlay
        playsInline
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onEnded={() => {
          setPaused(true);
          if (vslTracking) fireMilestone(100);
        }}
      />
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#285EE0] shadow-[0_0_50px_-6px_rgba(40,94,224,0.95)]">
              <Play className="ml-1 h-8 w-8 fill-white text-white" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const VideoPlayer = ({
  videoId = DEFAULT_VIDEO,
  source,
  poster,
  label = "Watch the video",
  eyebrow = "Video Sales Letter",
  autoPlay = false,
  testid = "video-player",
  borderClass = "border-white/10",
  vslTracking = false,
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const src = source || { kind: "youtube", id: videoId };

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-2xl border ${borderClass} bg-black`}
      data-testid={testid}
    >
      <AnimatePresence mode="wait">
        {playing ? (
          src.kind === "mp4" ? (
            <MinimalMp4 key="mp4" src={src.src} poster={poster} testid={testid} vslTracking={vslTracking} />
          ) : (
            <motion.iframe
              key="frame"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 h-full w-full"
              src={embedUrl(src)}
              title={label}
              allow="accelerated-media; autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )
        ) : (
          <motion.button
            key="poster"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            data-testid={`${testid}-play`}
            aria-label={label}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {poster && (
              <img
                src={poster}
                alt={label}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#285EE0] shadow-[0_0_50px_-6px_rgba(40,94,224,0.95)] transition-transform duration-300 group-hover:scale-110">
                <Play className="ml-1 h-8 w-8 fill-white text-white" />
              </span>
            </span>
            {eyebrow && (
              <span className="absolute bottom-5 left-6 text-left">
                <span className="block text-[11px] uppercase tracking-[0.28em] text-white/60">{eyebrow}</span>
                <span className="mt-1 block font-display text-xl uppercase text-white">{label}</span>
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
