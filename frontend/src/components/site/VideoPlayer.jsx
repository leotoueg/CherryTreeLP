import { useState } from "react";
import { Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_VIDEO = "aqz-KE-bpKQ";

function embedUrl(source) {
  const kind = source?.kind || "youtube";
  const id = source?.id;
  if (kind === "vimeo") return `https://player.vimeo.com/video/${id}?app_id=122963&autoplay=1&title=0&byline=0&portrait=0`;
  if (kind === "loom") return `https://www.loom.com/embed/${id}?autoplay=1&hideEmbedTopBar=true`;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export const VideoPlayer = ({
  videoId = DEFAULT_VIDEO,
  source,
  poster,
  label = "Watch the video",
  eyebrow = "Video Sales Letter",
  autoPlay = false,
  testid = "video-player",
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const src = source || { kind: "youtube", id: videoId };

  return (
    <div
      className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black"
      data-testid={testid}
    >
      <AnimatePresence mode="wait">
        {playing ? (
          src.kind === "mp4" ? (
            <motion.video
              key="mp4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 h-full w-full bg-black object-cover"
              src={src.src}
              poster={poster}
              controls
              autoPlay
              playsInline
            />
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
