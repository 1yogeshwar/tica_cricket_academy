import { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import slideCoaching from "@/assets/slide-coaching.jpg";
import slideFacilities from "@/assets/slide-facilities.jpg";
import slideTech from "@/assets/slide-tech.jpg";
import slideJourney from "@/assets/slide-journey.jpg";

type Slide = {
  index: string;
  kicker: string;
  headline: [string, string, string];
  body: string;
  image: string;
  tone: "warm" | "cool" | "tech" | "victory";
};

const SLIDES: Slide[] = [
  {
    index: "01",
    kicker: "Professional Coaching",
    headline: ["Discipline", "Creates", "Champions."],
    body: "Mentorship from coaches who have stood inside the boundary at the highest level. Every drill, every word, every silence — designed to forge mindset before stroke.",
    image: slideCoaching,
    tone: "warm",
  },
  {
    index: "02",
    kicker: "World-Class Facilities",
    headline: ["Train", "Like The", "Professionals."],
    body: "Turf wickets, indoor lanes, bowling machines, recovery zones. A complete environment engineered so the only thing standing between you and your best is the next ball.",
    image: slideFacilities,
    tone: "cool",
  },
  {
    index: "03",
    kicker: "Technology Meets Performance",
    headline: ["Every Session.", "Every Frame.", "Every Improvement."],
    body: "PitchVision, slow-motion biomechanics, swing analytics, and on-demand video review. Your game, decoded — so progress is measured, not guessed.",
    image: slideTech,
    tone: "tech",
  },
  {
    index: "04",
    kicker: "Your Journey",
    headline: ["Dream.", "Train.", "Achieve."],
    body: "From the first net to the lifted trophy. The path is long, the standard is high, the reward is yours. Take the first step into the academy.",
    image: slideJourney,
    tone: "victory",
  },
];

/* ---------- Cursor Spotlight Hook ---------- */
function useCursorSpotlight(ref: React.RefObject<HTMLElement | null>) {
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const sx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.4 });
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width) * 100);
    y.set(((e.clientY - r.top) / r.height) * 100);
  };
  return { sx, sy, handleMove };
}

/* ---------- Floating dust particles ---------- */
function Dust({ count = 18, tint = "oklch(0.85 0.12 70 / 0.6)" }: { count?: number; tint?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 12,
        duration: Math.random() * 14 + 16,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: tint,
            boxShadow: `0 0 ${p.size * 4}px ${tint}`,
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Slide ---------- */
function SlidePanel({
  slide,
  sectionProgress,
  range,
}: {
  slide: Slide;
  sectionProgress: MotionValue<number>;
  range: [number, number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { sx, sy, handleMove } = useCursorSpotlight(ref);

  // 0 enter -> 1 exit. local 0..1 within this slide window
  const local = useTransform(sectionProgress, range, [0, 0.5, 1]);

  const imageX = useTransform(local, [0, 1], [60, -60]);
  const imageScale = useTransform(local, [0, 0.5, 1], [1.18, 1.05, 1.12]);
  const imageOpacity = useTransform(local, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.5]);
  const titleY = useTransform(local, [0, 0.5, 1], [80, 0, -60]);
  const titleOpacity = useTransform(local, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const bodyX = useTransform(local, [0, 0.5, 1], [40, 0, -30]);
  const indexY = useTransform(local, [0, 1], [40, -40]);

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx}% ${sy}%, oklch(0.78 0.14 72 / 0.18), transparent 70%)`;

  const toneOverlay = {
    warm: "radial-gradient(ellipse at 70% 30%, oklch(0.55 0.18 50 / 0.35), transparent 60%)",
    cool: "radial-gradient(ellipse at 50% 100%, oklch(0.35 0.12 230 / 0.5), transparent 65%)",
    tech: "radial-gradient(ellipse at 20% 50%, oklch(0.45 0.18 260 / 0.4), transparent 60%)",
    victory: "radial-gradient(ellipse at 50% 50%, oklch(0.65 0.18 60 / 0.4), transparent 70%)",
  }[slide.tone];

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className="relative flex h-screen w-screen shrink-0 items-center overflow-hidden bg-ink"
    >
      {/* Image layer */}
      <motion.div
        className="absolute inset-0"
        style={{ x: imageX, scale: imageScale, opacity: imageOpacity }}
      >
        <img
          src={slide.image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          width={1920}
          height={1280}
        />
        {/* color grade */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />
        <div className="absolute inset-0" style={{ background: toneOverlay }} />
      </motion.div>

      {/* cursor spotlight */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

      {/* dust */}
      <Dust count={slide.tone === "tech" ? 24 : 16} />

      {/* tech-specific data overlay */}
      {slide.tone === "tech" && <TechOverlay local={local} />}

      {/* Giant index numeral */}
      <motion.div
        style={{ y: indexY, opacity: titleOpacity }}
        className="absolute right-[6vw] top-[10vh] select-none text-[26vh] font-extralight leading-none text-white/[0.04]"
      >
        {slide.index}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col justify-center px-8 sm:px-14 lg:px-20">
        <motion.p
          style={{ opacity: titleOpacity, x: bodyX }}
          className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.45em] text-[color:var(--gold-soft)]"
        >
          <span className="h-px w-10 bg-[color:var(--gold)]/60" />
          {slide.kicker}
        </motion.p>

        <motion.h2
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-display text-[clamp(3rem,9vw,9rem)] text-foreground"
        >
          {slide.headline.map((line, i) => (
            <MaskLine key={i} text={line} highlight={i === 1 && slide.tone === "victory"} />
          ))}
        </motion.h2>

        <motion.p
          style={{ opacity: titleOpacity, x: bodyX }}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {slide.body}
        </motion.p>

        {slide.tone === "victory" && (
          <motion.div style={{ opacity: titleOpacity, x: bodyX }} className="mt-10">
            <a
              href="#enroll"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-[oklch(0.86_0.12_80)] to-[oklch(0.68_0.17_50)] px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink shadow-[0_20px_60px_-15px_oklch(0.78_0.14_72/0.9)] transition-transform duration-500 hover:scale-[1.03]"
            >
              Begin Your Journey
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- Mask reveal line ---------- */
function MaskLine({ text, highlight = false }: { text: string; highlight?: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className={`block ${highlight ? "text-gold-gradient" : ""}`}
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ---------- Tech slide floating data overlay ---------- */
function TechOverlay({ local }: { local: MotionValue<number> }) {
  const o = useTransform(local, [0.1, 0.5, 0.9], [0, 1, 0.5]);
  return (
    <motion.div style={{ opacity: o }} className="pointer-events-none absolute inset-0">
      <div className="absolute right-[8vw] top-[22vh] w-56 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Bat Speed</p>
        <p className="text-display mt-1 text-3xl text-foreground">128<span className="text-base text-white/40"> km/h</span></p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 0.78 }}
            viewport={{ once: false }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
            className="h-full bg-gradient-to-r from-[oklch(0.78_0.14_72)] to-[oklch(0.86_0.09_80)]"
          />
        </div>
      </div>
      <div className="absolute bottom-[24vh] right-[20vw] w-44 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Stance</p>
        <p className="mt-1 text-sm text-foreground">Front-foot 62°</p>
        <p className="text-xs text-emerald-300/80">+4% balance</p>
      </div>
    </motion.div>
  );
}

/* ---------- Cricket Pitch Progress ---------- */
function PitchProgress({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const batsmanX = useTransform(progress, [0.02, 0.98], ["0%", "100%"]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed bottom-6 left-1/2 z-40 w-[min(560px,86vw)] -translate-x-1/2"
    >
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-white/40">
        <span>Crease</span>
        <span className="text-[color:var(--gold-soft)]">Academy Tour</span>
        <span>Boundary</span>
      </div>
      <div className="relative h-9 overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-[oklch(0.22_0.04_60)] via-[oklch(0.32_0.06_55)] to-[oklch(0.22_0.04_60)] shadow-[inset_0_2px_8px_oklch(0_0_0/0.6)]">
        {/* pitch lines */}
        <div className="absolute inset-y-0 left-[6%] w-px bg-white/30" />
        <div className="absolute inset-y-0 right-[6%] w-px bg-white/30" />
        {/* center stumps */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/20"
            style={{ left: `${20 + i * 20}%` }}
          />
        ))}
        {/* batsman */}
        <motion.div
          style={{ left: batsmanX }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-[oklch(0.78_0.14_72/0.5)] blur-md" />
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.92_0.1_85)] to-[oklch(0.66_0.17_45)] shadow-[0_0_12px_oklch(0.78_0.14_72/0.9)]">
              <span className="block h-2 w-px bg-ink" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------- Main Section ---------- */
export default function Academy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // smooth it
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  // 4 slides + a small entry/exit easing
  const trackX = useTransform(smoothProgress, [0, 1], ["0%", "-75%"]);




  // Per-slide window ranges (4 slides)
  const ranges: [number, number, number][] = [
    [0.0, 0.125, 0.25],
    [0.25, 0.375, 0.5],
    [0.5, 0.625, 0.75],
    [0.75, 0.875, 1.0],
  ];

  // intro transition opacity (hero -> academy)
  const introVeil = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  return (
    <section
      id="academy"
      ref={containerRef}
      aria-label="Inside the Academy"
      className="relative bg-ink scroll-mt-28"
      style={{ height: "500vh" }} // 4 slides + 1 viewport for smooth entry/exit
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        {/* veil from hero */}
        <motion.div
          style={{ opacity: introVeil }}
          className="pointer-events-none absolute inset-0 z-30 bg-ink"
        />

        {/* drifting ambient lights */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute -left-40 top-1/3 h-[60vh] w-[60vh] rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, oklch(0.6 0.18 55 / 0.35), transparent 60%)",
              animation: "breathe 9s ease-in-out infinite",
            }}
          />
          <div
            className="absolute -right-40 bottom-0 h-[70vh] w-[70vh] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, oklch(0.45 0.15 240 / 0.4), transparent 60%)",
              animation: "breathe 13s ease-in-out infinite",
            }}
          />
        </div>

        {/* Slide counter */}
        <div className="pointer-events-none absolute left-6 top-6 z-30 hidden items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40 sm:flex">
          <span className="h-px w-8 bg-white/30" />
          Inside The Academy
        </div>

        {/* horizontal track */}
        <motion.div style={{ x: trackX }} className="flex h-full w-[400vw]">
          {SLIDES.map((s, i) => (
            <SlidePanel
              key={s.index}
              slide={s}
              sectionProgress={scrollYProgress}
              range={ranges[i]}
            />
          ))}
        </motion.div>

        <PitchProgress progress={scrollYProgress} />
      </div>
    </section>
  );
}
