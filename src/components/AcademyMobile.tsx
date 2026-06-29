import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useTransform, useSpring, useMotionValue, type MotionValue } from "framer-motion";
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
    body: "Mentorship from coaches who have stood at the highest level. Every drill — designed to forge mindset before stroke.",
    image: slideCoaching,
    tone: "warm",
  },
  {
    index: "02",
    kicker: "World-Class Facilities",
    headline: ["Train", "Like The", "Pros."],
    body: "Turf wickets, indoor lanes, bowling machines, recovery zones — engineered for your best.",
    image: slideFacilities,
    tone: "cool",
  },
  {
    index: "03",
    kicker: "Tech Meets Performance",
    headline: ["Every Session.", "Every Frame.", "Every Gain."],
    body: "PitchVision, biomechanics, swing analytics — your game, decoded.",
    image: slideTech,
    tone: "tech",
  },
  {
    index: "04",
    kicker: "Your Journey",
    headline: ["Dream.", "Train.", "Achieve."],
    body: "From the first net to the lifted trophy. Take the first step.",
    image: slideJourney,
    tone: "victory",
  },
];

const TONE_OVERLAYS: Record<Slide["tone"], string> = {
  warm: "radial-gradient(ellipse at 70% 25%, oklch(0.6 0.18 50 / 0.45), transparent 65%)",
  cool: "radial-gradient(ellipse at 50% 100%, oklch(0.38 0.13 230 / 0.55), transparent 65%)",
  tech: "radial-gradient(ellipse at 20% 50%, oklch(0.45 0.18 260 / 0.45), transparent 65%)",
  victory: "radial-gradient(ellipse at 50% 50%, oklch(0.65 0.18 60 / 0.45), transparent 70%)",
};

function MobilePanel({
  slide,
  active,
  scrollX,
  index,
  total,
}: {
  slide: Slide;
  active: boolean;
  scrollX: MotionValue<number>;
  index: number;
  total: number;
}) {
  // each slide is 100vw wide; compute local progress relative to this panel
  const [w, setW] = useState(360);
  useEffect(() => {
    const onR = () => setW(window.innerWidth);
    onR();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  const start = index * w;
  const local = useTransform(scrollX, [start - w, start, start + w], [-1, 0, 1]);
  const imgScale = useTransform(local, [-1, 0, 1], [1.15, 1.05, 1.15]);
  const imgX = useTransform(local, [-1, 0, 1], [40, 0, -40]);
  const contentY = useTransform(local, [-1, 0, 1], [40, 0, 40]);
  const contentOpacity = useTransform(local, [-1, -0.4, 0, 0.4, 1], [0, 0.3, 1, 0.3, 0]);

  return (
    <div
      className="relative h-[100svh] w-screen shrink-0 snap-center snap-always overflow-hidden bg-ink"
      style={{ scrollSnapStop: "always" }}
    >
      <motion.div className="absolute inset-0" style={{ scale: imgScale, x: imgX }}>
        <img
          src={slide.image}
          alt=""
          loading={active || index === 0 ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="absolute inset-0" style={{ background: TONE_OVERLAYS[slide.tone] }} />
      </motion.div>

      {/* index numeral */}
      <div className="pointer-events-none absolute right-5 top-5 text-[14vh] font-extralight leading-none text-white/[0.06]">
        {slide.index}
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-32 pt-24"
      >
        <p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[color:var(--gold-soft)]">
          <span className="h-px w-8 bg-[color:var(--gold)]/60" />
          {slide.kicker}
        </p>
        <h2 className="text-display text-[clamp(2.8rem,12vw,4.5rem)] text-foreground">
          {slide.headline.map((line, i) => (
            <span key={i} className="block">
              {i === 1 && slide.tone === "victory" ? (
                <span className="text-gold-gradient">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">{slide.body}</p>

        {slide.tone === "victory" && (
          <a
            href="#coaches"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-br from-[oklch(0.86_0.12_80)] to-[oklch(0.68_0.17_50)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink shadow-[0_18px_45px_-15px_oklch(0.78_0.14_72/0.9)]"
          >
            Begin Your Journey
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}

        {/* swipe hint on first panel */}
        {index === 0 && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: [0, 1, 1, 0], x: [0, 12, 12, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6 }}
            className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/45"
          >
            Swipe <ArrowRight className="h-3 w-3" />
          </motion.div>
        )}
      </motion.div>

      {/* page dots */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-[color:var(--gold)]" : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Mobile Pitch Progress ---------- */
function MobilePitch({ activeIndex, total }: { activeIndex: number; total: number }) {
  const pct = total > 1 ? activeIndex / (total - 1) : 0;
  return (
    <div className="pointer-events-none absolute inset-x-5 bottom-14 z-30">
      <div className="mb-2 flex items-center justify-between text-[9px] uppercase tracking-[0.4em] text-white/40">
        <span>Crease</span>
        <span className="text-[color:var(--gold-soft)]">{activeIndex + 1} / {total}</span>
        <span>Boundary</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-[oklch(0.22_0.04_60)] via-[oklch(0.32_0.06_55)] to-[oklch(0.22_0.04_60)] shadow-[inset_0_2px_6px_oklch(0_0_0/0.6)]">
        <div className="absolute inset-y-0 left-[6%] w-px bg-white/30" />
        <div className="absolute inset-y-0 right-[6%] w-px bg-white/30" />
        <motion.div
          animate={{ left: `${pct * 100}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="absolute -inset-2.5 rounded-full bg-[oklch(0.78_0.14_72/0.5)] blur-md" />
            <div className="relative flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.92_0.1_85)] to-[oklch(0.66_0.17_45)] shadow-[0_0_10px_oklch(0.78_0.14_72/0.9)]">
              <span className="block h-1.5 w-px bg-ink" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AcademyMobile() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const smoothX = useSpring(scrollX, { stiffness: 120, damping: 26, mass: 0.4 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      scrollX.set(el.scrollLeft);
      const w = el.clientWidth || 1;
      setActive(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollX]);

  const ambient = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 12,
        duration: Math.random() * 12 + 18,
      })),
    []
  );

  return (
    <section
      id="academy"
      aria-label="Inside the Academy"
      className="relative h-[100svh] w-full overflow-hidden bg-ink scroll-mt-28"
    >
      {/* top kicker */}
      <div className="pointer-events-none absolute left-5 top-5 z-30 flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-white/45">
        <span className="h-px w-6 bg-white/30" />
        Inside The Academy
      </div>

      {/* ambient dust (cheap, fixed count) */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {ambient.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-0 rounded-full bg-[oklch(0.85_0.12_70/0.55)]"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 4}px oklch(0.85 0.12 70 / 0.5)`,
              animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        ref={trackRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-x" }}
      >
        {SLIDES.map((s, i) => (
          <MobilePanel
            key={s.index}
            slide={s}
            index={i}
            total={SLIDES.length}
            active={active === i}
            scrollX={smoothX}
          />
        ))}
      </div>

      <MobilePitch activeIndex={active} total={SLIDES.length} />
    </section>
  );
}
