import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
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
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full text-xs font-semibold tracking-widest uppercase will-change-transform transition-shadow duration-500";

  const sizes = "px-6 py-3.5 sm:px-7 sm:py-4 sm:text-sm";

  const styles =
    variant === "primary"
      ? "text-ink shadow-[0_8px_32px_-8px_oklch(0.78_0.14_72/0.6)] hover:shadow-[0_16px_48px_-8px_oklch(0.78_0.14_72/0.85)]"
      : "border border-white/15 bg-white/[0.04] text-foreground hover:bg-white/[0.08]";

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${sizes} ${styles} ${className}`}
    >
      {variant === "primary" && (
        <>
          <span aria-hidden className="absolute inset-0 -z-10 rounded-full" style={{ background: "var(--gradient-gold)" }} />
          <span aria-hidden className="absolute inset-0 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70" style={{ background: "var(--gradient-gold)" }} />
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

/* ---------- Floating particles ---------- */
function Particles() {
  const particles = useMemo(
    () => Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 18 + Math.random() * 18,
      size: 1 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.35,
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
            boxShadow: "0 0 4px oklch(0.86 0.09 80 / 0.5)",
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Hero ---------- */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;
    vid.play().catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <section id="top" className="relative w-full overflow-hidden bg-ink" style={{ minHeight: "100svh" }}>

        {/* ── Video ── */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <video
            ref={videoRef}
            src={heroVideo}
            muted loop playsInline autoPlay
            onCanPlay={() => setVideoReady(true)}
            className="h-full w-full object-cover object-center"
            aria-hidden
          />
        </motion.div>

        {/* Overlays */}
        {/* Main dark overlay — heavier on left for text legibility */}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(105deg, oklch(0.04 0.01 250 / 0.96) 0%, oklch(0.05 0.01 250 / 0.78) 45%, oklch(0.05 0.01 250 / 0.35) 100%)",
        }} />
        {/* Bottom fog */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-[2] h-2/5" style={{
          background: "linear-gradient(to top, oklch(0.04 0.01 250) 0%, oklch(0.05 0.01 250 / 0.6) 50%, transparent 100%)",
        }} />
        {/* Top edge */}
        <div aria-hidden className="absolute inset-x-0 top-0 z-[2] h-28" style={{
          background: "linear-gradient(to bottom, oklch(0.04 0.01 250 / 0.7), transparent)",
        }} />
        {/* Warm gold ambient left */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-2/3" style={{
          background: "radial-gradient(ellipse at 15% 55%, oklch(0.75 0.18 60 / 0.14) 0%, transparent 60%)",
          animation: "breathe 8s ease-in-out infinite",
        }} />

        {/* Particles */}
        <div className="absolute inset-0 z-[3]"><Particles /></div>

        {/* Subtle grid */}
        <div aria-hidden className="absolute inset-0 z-[3] opacity-[0.025] mix-blend-overlay" style={{
          backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }} />

        {/* ── CONTENT ── */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 sm:px-8 lg:px-12"
          style={{ paddingTop: "clamp(6rem, 12vh, 9rem)", paddingBottom: "clamp(4rem, 10vh, 7rem)" }}
        >

          {/* Two-column layout on lg+ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] lg:gap-16 lg:items-end">

            {/* ── Left: Main content ── */}
            <div className="flex flex-col">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 flex items-center gap-3"
              >
                <span className="h-px w-8 bg-gold opacity-80" />
                <span className="text-[10px] font-medium uppercase tracking-[0.45em] text-gold-soft opacity-90">
                  Terminator International Cricket Academy
                </span>
              </motion.div>

              {/* Headline — tighter, more editorial */}
              <div className="mb-7">
                {[
                  { words: ["TURN YOUR"], accent: false },
                  { words: ["CRICKET", "DREAMS"], accent: true },
                  { words: ["INTO REALITY"], accent: false },
                ].map((line, lIdx) => (
                  <div key={lIdx} className="overflow-hidden">
                    <motion.div
                      className="block"
                      initial={{ y: "105%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        delay: 1.0 + lIdx * 0.18,
                        duration: 1.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <span
                        className={`block font-black leading-[0.88] tracking-tight ${
                          line.accent ? "text-gold-gradient" : "text-white"
                        }`}
                        style={{
                          fontSize: "clamp(2.6rem, 7.5vw, 6.4rem)",
                          filter: line.accent ? "drop-shadow(0 0 28px oklch(0.78 0.14 72 / 0.25))" : undefined,
                        }}
                      >
                        {line.words.join(" ")}
                      </span>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.72, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mb-9 max-w-md text-sm leading-[1.8] sm:text-base"
                style={{ color: "rgba(255,255,255,0.48)" }}
              >
                Where raw talent meets world-class coaching. A facility built for one purpose —
                producing the next generation of cricket champions.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.92, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-3"
              >
                <MagneticButton variant="primary">
                  Register Now
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </MagneticButton>
                <MagneticButton variant="secondary">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10">
                    <Play className="h-2.5 w-2.5 fill-current" />
                  </span>
                  Watch Story
                </MagneticButton>
              </motion.div>
            </div>

            {/* ── Right: Stats column ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex flex-col gap-6 pb-1"
            >
              {[
                { v: "24+", l: "National\nPlayers" },
                { v: "15",  l: "Pro\nCoaches" },
                { v: "98%", l: "Selection\nRate" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 border-l pl-5"
                  style={{ borderColor: "rgba(245,166,35,0.2)" }}
                >
                  <div
                    className="font-black leading-none text-white"
                    style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)" }}
                  >
                    {s.v}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.22em] whitespace-pre-line leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Mobile stats row ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.9 }}
            className="mt-12 flex lg:hidden gap-8 border-t pt-6"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            {[
              { v: "24+", l: "National Players" },
              { v: "15",  l: "Pro Coaches" },
              { v: "98%", l: "Selection Rate" },
            ].map((s) => (
              <div key={s.l} className="min-w-0 flex flex-col gap-1">
                <div className="text-2xl font-black text-white sm:text-3xl">{s.v}</div>
                <div className="text-[9px] uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Scroll cue ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.4em]" style={{ color: "rgba(255,255,255,0.2)" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" style={{ color: "rgba(245,166,35,0.4)" }} />
          </motion.div>
        </motion.div>

        {/* Edge vignette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[4]" style={{
          background: "radial-gradient(ellipse at center, transparent 45%, oklch(0.04 0.01 250 / 0.6) 100%)",
        }} />
      </section>
    </>
  );
}