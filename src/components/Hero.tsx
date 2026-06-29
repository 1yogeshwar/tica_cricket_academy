import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import heroVideo from "@/assets/hero.mp4";
import Navbar from "./Navbar";

/* ---------- Magnetic Button ---------- */
function MagneticButton({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set(mx * 0.25);
    y.set(my * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };

  const base =
    "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm font-semibold tracking-wide uppercase will-change-transform transition-shadow duration-500";

  const styles =
    variant === "primary"
      ? "text-ink shadow-[0_10px_40px_-10px_oklch(0.78_0.14_72/0.7)] hover:shadow-[0_20px_60px_-10px_oklch(0.78_0.14_72/0.9)]"
      : "border border-white/15 bg-white/[0.04] text-foreground hover:bg-white/[0.08]";

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${styles} ${className}`}
    >
      {variant === "primary" && (
        <span aria-hidden className="absolute inset-0 -z-10 rounded-full" style={{ background: "var(--gradient-gold)" }} />
      )}
      {variant === "primary" && (
        <span aria-hidden className="absolute inset-0 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-80" style={{ background: "var(--gradient-gold)" }} />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

/* ---------- Particles ---------- */
function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 18 + Math.random() * 18,
        size: 1 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-gold-soft"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
            boxShadow: "0 0 6px oklch(0.86 0.09 80 / 0.6)",
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Headline reveal ---------- */
const lines = [
  ["TURN", "YOUR"],
  ["CRICKET", "DREAMS"],
  ["INTO", "REALITY"],
];

function Headline() {
  return (
    <h1 className="text-display text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[7.8rem]">
      {lines.map((line, lIdx) => (
        <span key={lIdx} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              delay: 1.2 + lIdx * 0.22,
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line.map((word, wIdx) => {
              const isAccent = lIdx === 1;
              return (
                <span
                  key={wIdx}
                  className={`inline-block ${wIdx === 0 ? "" : "ml-[0.22em]"} ${isAccent ? "text-gold-gradient" : ""}`}
                  style={isAccent ? { filter: "drop-shadow(0 0 30px oklch(0.78 0.14 72 / 0.3))" } : undefined}
                >
                  {word}
                </span>
              );
            })}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/* ---------- Scroll indicator ---------- */
function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.7, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
    >
      <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Scroll</span>
      <div className="relative h-12 w-px overflow-hidden bg-white/10">
        <span
          className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-gold to-transparent"
          style={{ animation: "scroll-line 2.2s cubic-bezier(0.6,0,0.4,1) infinite" }}
        />
      </div>
    </motion.div>
  );
}

/* ---------- Hero ---------- */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Attempt autoplay; browsers block unmuted autoplay so we mute
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;
    vid.play().catch(() => {
      // autoplay blocked — video stays paused, poster/dark bg shows
    });
  }, []);

  return (
    <>
      <Navbar />
      <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-ink">

        {/* ── Video background ── */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        >
          <video
            ref={videoRef}
            src={heroVideo}
            muted
            loop
            playsInline
            autoPlay
            onCanPlay={() => setVideoReady(true)}
            className="h-full w-full object-cover object-center"
            aria-hidden
          />
        </motion.div>

        {/* Dark overlay so text stays readable over any video */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, oklch(0.05 0.01 250 / 0.92) 0%, oklch(0.05 0.01 250 / 0.65) 55%, oklch(0.05 0.01 250 / 0.30) 100%)",
          }}
        />

        {/* Bottom fog */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-[2] h-1/3"
          style={{
            background:
              "linear-gradient(to top, oklch(0.05 0.01 250) 10%, oklch(0.08 0.015 250 / 0.5) 50%, transparent 100%)",
          }}
        />

        {/* Top fade */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-[2] h-32"
          style={{ background: "linear-gradient(to bottom, oklch(0.05 0.01 250 / 0.6), transparent)" }}
        />

        {/* Gold ambient glow — left side to warm the text area */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-0 z-[2] h-[80vh] w-[60vw]"
          style={{
            background:
              "radial-gradient(ellipse at 20% 40%, oklch(0.75 0.18 60 / 0.18) 0%, transparent 65%)",
            animation: "breathe 7s ease-in-out infinite",
          }}
        />

        {/* Particles */}
        <div className="absolute inset-0 z-[3]">
          <Particles />
        </div>

        {/* Grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 z-[3] opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* ── CONTENT ── */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pt-32 pb-28 sm:px-8 md:pt-40">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold" />
            <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-soft">
              Terminator International Cricket Academy
            </span>
          </motion.div>

          {/* Headline */}
          <Headline />

          {/* Supporting text + CTAs */}
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Where raw talent meets world-class coaching. Train alongside international
              athletes in a facility built for one purpose — producing the next generation
              of cricket champions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticButton variant="primary">
                Register Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton variant="secondary">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
                  <Play className="h-3 w-3 fill-current" />
                </span>
                Watch Academy Story
              </MagneticButton>
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/[0.08] pt-8"
          >
            {[
              { v: "24+", l: "National Players" },
              { v: "15", l: "Pro Coaches" },
              { v: "98%", l: "Selection Rate" },
            ].map((s) => (
              <div key={s.l} className="min-w-0">
                <div className="text-display text-3xl text-foreground sm:text-4xl">{s.v}</div>
                <div className="mt-1 truncate text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <ScrollCue />

        {/* Vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[4]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, oklch(0.05 0.01 250 / 0.65) 100%)",
          }}
        />
      </section>
    </>
  );
}