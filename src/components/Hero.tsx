import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Menu } from "lucide-react";
import heroPlayer from "@/assets/hero-player.jpg";
import cricketBall from "@/assets/cricket-ball.png";

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
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full"
          style={{ background: "var(--gradient-gold)" }}
        />
      )}
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
          style={{ background: "var(--gradient-gold)" }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

/* ---------- Floating Nav ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = ["Academy", "Programs", "Coaches", "Facilities", "Stories"];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6"
    >
      <div
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 sm:py-3 ${
          scrolled
            ? "glass-panel shadow-[0_20px_60px_-20px_oklch(0_0_0/0.5)]"
            : "border border-white/[0.06] bg-white/[0.03] backdrop-blur-md"
        }`}
      >
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-2.5"
          animate={{ scale: scrolled ? 1.04 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--gradient-gold)" }}>
            <span className="text-display text-base text-ink">T</span>
            <span className="absolute inset-0 rounded-full opacity-60 blur-md -z-10" style={{ background: "var(--gradient-gold)" }} />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-display text-base text-foreground">TICA</div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Cricket Academy</div>
          </div>
        </motion.a>

        {/* Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <span className="relative z-10">{label}</span>
              <span className="absolute inset-0 rounded-full bg-white/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            animate={{ scale: scrolled ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            className="hidden rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ink transition-all sm:inline-flex"
            style={{ background: "var(--gradient-gold)" }}
          >
            Enroll
          </motion.button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] md:hidden">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.header>
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
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{
              delay: 1.4 + lIdx * 0.18,
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line.map((word, wIdx) => {
              const isAccent = lIdx === 1; // "CRICKET DREAMS" in gold
              return (
                <span
                  key={wIdx}
                  className={`inline-block ${wIdx === 0 ? "" : "ml-[0.22em]"} ${
                    isAccent ? "text-gold-gradient" : ""
                  }`}
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
  const heroRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  const playerX = useTransform(smx, (v) => v * -15);
  const playerY = useTransform(smy, (v) => v * -10);
  const ballX = useTransform(smx, (v) => v * 30);
  const ballY = useTransform(smy, (v) => v * 25);
  const glowX = useTransform(smx, (v) => v * -40);
  const glowY = useTransform(smy, (v) => v * -25);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Nav />
      <section
        ref={heroRef}
        className="relative min-h-[100svh] w-full overflow-hidden bg-ink"
      >
        {/* Base dark base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.2_0.04_255)_0%,oklch(0.08_0.015_250)_60%,oklch(0.05_0.01_250)_100%)]" />

        {/* Stadium light power-on */}
        <AnimatePresence>
          {mounted && (
            <>
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1.6 }}
                style={{ x: glowX, y: glowY }}
                className="absolute -top-20 left-1/4 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
              >
                <div
                  className="h-full w-full rounded-full opacity-70"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.75 0.18 60 / 0.55) 0%, oklch(0.7 0.19 55 / 0.2) 35%, transparent 70%)",
                    animation: "breathe 7s ease-in-out infinite, light-flicker 6s ease-in-out infinite",
                    filter: "blur(40px)",
                  }}
                />
              </motion.div>

              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.8, duration: 2 }}
                className="absolute right-0 top-1/3 h-[60vh] w-[60vh] translate-x-1/4 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.45 0.15 240 / 0.4) 0%, transparent 70%)",
                  filter: "blur(60px)",
                  animation: "breathe 9s ease-in-out infinite",
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Player image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: playerX, y: playerY }}
          className="absolute inset-y-0 right-0 z-10 hidden md:block md:w-[60%] lg:w-[55%] xl:w-[50%]"
        >
          <div className="relative h-full w-full">
            <img
              src={heroPlayer}
              alt="Elite cricket batsman in ready stance under stadium lights"
              width={1536}
              height={1920}
              className="h-full w-full object-cover object-[30%_center]"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 18%, black 100%), linear-gradient(to bottom, black 80%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 18%, black 100%), linear-gradient(to bottom, black 80%, transparent 100%)",
                WebkitMaskComposite: "source-in",
              }}
            />
            {/* color grade */}
            <div className="absolute inset-0 mix-blend-multiply" style={{ background: "linear-gradient(to right, var(--ink) 0%, transparent 40%)" }} />
            <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{ background: "var(--gradient-radial-amber)" }} />
          </div>
        </motion.div>

        {/* Mobile player (smaller, behind) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 1.1, duration: 1.8 }}
          className="absolute inset-0 z-0 md:hidden"
        >
          <img
            src={heroPlayer}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-[70%_center]"
            style={{
              maskImage: "linear-gradient(to top, transparent 5%, black 50%)",
              WebkitMaskImage: "linear-gradient(to top, transparent 5%, black 50%)",
            }}
          />
        </motion.div>

        {/* Cricket ball */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1.6, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: ballX, y: ballY }}
          className="absolute bottom-[18%] left-[6%] z-20 h-28 w-28 sm:h-36 sm:w-36 md:bottom-[12%] md:left-[42%] md:h-44 md:w-44 lg:h-52 lg:w-52"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="relative h-full w-full"
            style={{ filter: "drop-shadow(0 25px 40px oklch(0 0 0 / 0.7)) drop-shadow(0 0 30px oklch(0.7 0.19 55 / 0.5))" }}
          >
            <img src={cricketBall} alt="" aria-hidden width={1024} height={1024} className="h-full w-full object-contain" />
          </motion.div>
          <div className="absolute inset-0 -z-10 rounded-full opacity-60 blur-2xl" style={{ background: "var(--gradient-gold)" }} />
        </motion.div>

        {/* Floor fog */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-10 h-1/3"
          style={{
            background:
              "linear-gradient(to top, oklch(0.05 0.01 250) 10%, oklch(0.08 0.015 250 / 0.5) 50%, transparent 100%)",
          }}
        />

        {/* Particles */}
        <Particles />

        {/* Grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* CONTENT */}
        <div className="relative z-30 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pt-32 pb-28 sm:px-8 md:pt-40">
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

          {/* Supporting text */}
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
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, oklch(0.05 0.01 250 / 0.7) 100%)",
          }}
        />
      </section>
    </>
  );
}
