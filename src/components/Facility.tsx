"use client";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

/* ════════════════════════════════════════════
   FACILITY DATA
════════════════════════════════════════════ */
const FACILITIES = [
  {
    id: "turf",
    heading: "Professional\nTurf Wickets",
    sub: "BCCI-standard surfaces. Genuine bounce. Authentic carry.",
    accent: "#D4A020",
    accentRgb: "212,160,32",
    bg: "linear-gradient(160deg,#06120200 0%,#0d2208 30%,#152d08 60%,#0a1a05 100%)",
    imageSrc: null as string | null,
  },
  {
    id: "nets",
    heading: "Indoor &\nOutdoor Nets",
    sub: "12 lanes. Every surface. Every condition. Every day.",
    accent: "#3AA8D8",
    accentRgb: "58,168,216",
    bg: "linear-gradient(160deg,#02091500 0%,#041525 30%,#0a2035 60%,#020d1a 100%)",
    imageSrc: null as string | null,
  },
  {
    id: "machine",
    heading: "Bowling\nMachines",
    sub: "Merlyn & ProBatter — every pace, every line, on demand.",
    accent: "#E05A20",
    accentRgb: "224,90,32",
    bg: "linear-gradient(160deg,#15050000 0%,#1a0803 30%,#2a0e04 60%,#0a0300 100%)",
    imageSrc: null as string | null,
  },
  {
    id: "pitchvision",
    heading: "PitchVision\nPerformance Lab",
    sub: "Ball-tracking. Biomechanics. Real-time data. The invisible, made visible.",
    accent: "#00C4D8",
    accentRgb: "0,196,216",
    bg: "linear-gradient(160deg,#01121500 0%,#021520 30%,#031e26 60%,#000a10 100%)",
    imageSrc: null as string | null,
  },
  {
    id: "fitness",
    heading: "High Performance\nFitness Centre",
    sub: "Sport science. Strength. Speed. Built for the cricket athlete.",
    accent: "#9ED420",
    accentRgb: "158,212,32",
    bg: "linear-gradient(160deg,#060d0000 0%,#0a1302 30%,#101a02 60%,#040800 100%)",
    imageSrc: null as string | null,
  },
  {
    id: "match",
    heading: "Floodlit\nMatch Arena",
    sub: "Full simulation. Live umpires. Broadcast lights. Real pressure, practised.",
    accent: "#F0C830",
    accentRgb: "240,200,48",
    bg: "linear-gradient(160deg,#12100000 0%,#181200 30%,#241c00 60%,#0a0800 100%)",
    imageSrc: null as string | null,
  },
] as const;

type Facility = (typeof FACILITIES)[number];

/* ════════════════════════════════════════════
   AMBIENT ANIMATIONS
════════════════════════════════════════════ */
const TurfAmbient = memo(({ accent }: { accent: string }) => (
  <svg className="absolute bottom-0 left-0 w-full h-36 opacity-25 pointer-events-none" viewBox="0 0 1440 144" preserveAspectRatio="none">
    {Array.from({ length: 55 }, (_, i) => {
      const x = (i / 54) * 1440;
      const h = 18 + (i * 31 % 44);
      const dur = 2.4 + (i % 5) * 0.4;
      const delay = (i % 7) * 0.3;
      return (
        <motion.line key={i} x1={x} y1={144} x2={x} y2={144 - h}
          stroke={accent} strokeWidth={1.4} strokeLinecap="round"
          animate={{ x2: [x, x + 5, x - 3, x] }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }} />
      );
    })}
  </svg>
));
TurfAmbient.displayName = "TurfAmbient";

const NetsAmbient = memo(({ accent }: { accent: string }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 1440 900" preserveAspectRatio="none">
    {Array.from({ length: 13 }, (_, i) => {
      const x = 60 + i * 110;
      return (
        <motion.line key={i} x1={x} y1={0} x2={x} y2={900}
          stroke={accent} strokeWidth={0.9}
          animate={{ x1: [x, x + 9, x], x2: [x, x + 9, x] }}
          transition={{ duration: 4 + i * 0.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }} />
      );
    })}
    {Array.from({ length: 10 }, (_, i) => {
      const y = 30 + i * 84;
      return (
        <motion.line key={`h${i}`} x1={0} y1={y} x2={1440} y2={y}
          stroke={accent} strokeWidth={0.5}
          animate={{ y1: [y, y + 6, y], y2: [y, y + 6, y] }}
          transition={{ duration: 4, delay: i * 0.22, repeat: Infinity, ease: "easeInOut" }} />
      );
    })}
  </svg>
));
NetsAmbient.displayName = "NetsAmbient";

const MachineAmbient = memo(({ accent }: { accent: string }) => (
  <svg className="absolute right-20 top-1/2 -translate-y-1/2 opacity-[0.18] pointer-events-none" width={160} height={160} viewBox="0 0 160 160">
    <motion.g style={{ transformOrigin: "80px 80px" }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
      <circle cx={80} cy={80} r={55} stroke={accent} strokeWidth={1} fill="none" strokeDasharray="9 7" />
      <line x1={80} y1={25} x2={80} y2={80} stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={80} cy={25} r={7} fill={accent} opacity={0.8} />
    </motion.g>
    {[0,1,2,3].map(i => (
      <motion.circle key={i} cx={20 + i * 40} cy={150} r={4} fill={accent}
        animate={{ opacity: [0.15, 1, 0.15] }}
        transition={{ duration: 1.1, delay: i * 0.28, repeat: Infinity }} />
    ))}
  </svg>
));
MachineAmbient.displayName = "MachineAmbient";

const PitchVisionAmbient = memo(({ accent }: { accent: string }) => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.13] pointer-events-none" viewBox="0 0 1440 900" preserveAspectRatio="none">
    <motion.path d="M180 780 Q720 80 1260 580" fill="none" stroke={accent} strokeWidth={1.5}
      strokeDasharray="1600"
      animate={{ strokeDashoffset: [1600, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }} />
    {[220, 580, 940, 1180].map((cx, i) => (
      <motion.circle key={i} cx={cx} cy={380 + (i % 2 === 0 ? -90 : 90)} r={18 + i * 12}
        fill="none" stroke={accent} strokeWidth={0.7}
        animate={{ r: [18 + i * 12, 28 + i * 12, 18 + i * 12], opacity: [0.25, 0.9, 0.25] }}
        transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }} />
    ))}
    <motion.line x1={0} y1={450} x2={1440} y2={450} stroke={accent} strokeWidth={0.4}
      animate={{ y1: [180, 720, 180], y2: [180, 720, 180], opacity: [0, 0.6, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} />
  </svg>
));
PitchVisionAmbient.displayName = "PitchVisionAmbient";

const FitnessAmbient = memo(({ accentRgb }: { accentRgb: string }) => (
  <motion.div className="absolute inset-0 pointer-events-none"
    animate={{ opacity: [0.025, 0.07, 0.025] }}
    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    style={{ background: `radial-gradient(ellipse 50% 60% at 72% 50%, rgba(${accentRgb},1) 0%, transparent 70%)` }} />
));
FitnessAmbient.displayName = "FitnessAmbient";

const MatchAmbient = memo(({ accentRgb }: { accentRgb: string }) => (
  <>
    <motion.div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
      style={{ background: `linear-gradient(to top, rgba(${accentRgb},0.07) 0%, transparent 100%)` }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
    {[8, 88].map((left, idx) => (
      <motion.div key={left} className="absolute top-0 pointer-events-none"
        style={{
          left: `${left}%`, width: "38%", height: "52%",
          background: `conic-gradient(from ${left < 50 ? "8deg" : "172deg"} at ${left < 50 ? "0% 0%" : "100% 0%"}, transparent 0deg, rgba(${accentRgb},0.07) 28deg, transparent 58deg)`,
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4.5, delay: idx * 1.8, repeat: Infinity, ease: "easeInOut" }} />
    ))}
  </>
));
MatchAmbient.displayName = "MatchAmbient";

function AmbientForFacility({ facility }: { facility: Facility }) {
  switch (facility.id) {
    case "turf": return <TurfAmbient accent={facility.accent} />;
    case "nets": return <NetsAmbient accent={facility.accent} />;
    case "machine": return <MachineAmbient accent={facility.accent} />;
    case "pitchvision": return <PitchVisionAmbient accent={facility.accent} />;
    case "fitness": return <FitnessAmbient accentRgb={facility.accentRgb} />;
    case "match": return <MatchAmbient accentRgb={facility.accentRgb} />;
    default: return null;
  }
}

/* ════════════════════════════════════════════
   DUST PARTICLES
════════════════════════════════════════════ */
const DustParticles = memo(({ accentRgb }: { accentRgb: string }) => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.7 + Math.random() * 1.5,
      dur: 15 + Math.random() * 20,
      delay: Math.random() * 12,
      op: 0.04 + Math.random() * 0.09,
      drift: (Math.random() - 0.5) * 55,
    })), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: `rgba(${accentRgb},1)`, opacity: p.op }}
          animate={{ y: [0, -65, 0], x: [0, p.drift, 0], opacity: [p.op * 0.2, p.op, p.op * 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
});
DustParticles.displayName = "DustParticles";

/* ════════════════════════════════════════════
   CURSOR SPOTLIGHT
════════════════════════════════════════════ */
function CursorSpotlight({ containerRef, accentRgb }: { containerRef: React.RefObject<HTMLDivElement>; accentRgb: string }) {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 42, damping: 17 });
  const sy = useSpring(y, { stiffness: 42, damping: 17 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top); };
    const leave = () => { x.set(-500); y.set(-500); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [x, y, containerRef]);

  return (
    <motion.div className="pointer-events-none absolute z-20"
      style={{ left: sx, top: sy, width: 650, height: 650, x: "-50%", y: "-50%", background: `radial-gradient(circle, rgba(${accentRgb},0.042) 0%, transparent 60%)`, borderRadius: "50%" }} />
  );
}

/* ════════════════════════════════════════════
   CRICKET PITCH PROGRESS
════════════════════════════════════════════ */
function CricketPitchProgress({ progress }: { progress: number }) {
  const ballPct = progress * 100;
  return (
    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 w-56 md:w-80 pointer-events-none select-none">
      <svg viewBox="0 0 380 30" xmlns="http://www.w3.org/2000/svg">
        {/* Pitch base */}
        <rect x={0} y={11} width={380} height={8} rx={4} fill="rgba(255,255,255,0.055)" />
        {/* Fill */}
        <rect x={0} y={11} width={ballPct * 3.8} height={8} rx={4} fill="rgba(255,255,255,0.1)" />
        {/* Crease lines */}
        {[0, 190, 380].map(cx => (
          <line key={cx} x1={cx} y1={7} x2={cx} y2={23} stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} />
        ))}
        {/* Popping crease */}
        {[17, 363].map(cx => (
          <line key={cx} x1={cx} y1={9} x2={cx} y2={21} stroke="rgba(255,255,255,0.13)" strokeWidth={1} />
        ))}
        {/* Wickets */}
        {[0, 380].map(base =>
          [-3.5, 0, 3.5].map(off => (
            <line key={`${base}${off}`} x1={base + off} y1={2} x2={base + off} y2={11}
              stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} strokeLinecap="round" />
          ))
        )}
        {/* Ball */}
        <motion.g style={{ translateX: `${ballPct * 3.8}px` }}>
          <motion.circle cx={0} cy={15} r={10} fill="rgba(200,50,35,0.14)"
            animate={{ r: [10, 14, 10] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <circle cx={0} cy={15} r={6} fill="#C13228" />
          <path d="M-3,12 Q0,15 -3,18" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} strokeLinecap="round" />
          <path d="M3,12 Q0,15 3,18" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} strokeLinecap="round" />
          <circle cx={-2} cy={12} r={1.4} fill="rgba(255,255,255,0.32)" />
        </motion.g>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════
   FACILITY PANEL (desktop)
════════════════════════════════════════════ */
function FacilityPanel({ facility, index, activeIndex, rawProgress }: {
  facility: Facility; index: number; activeIndex: number; rawProgress: number;
}) {
  // panelProgress: -1 = past, 0 = current, +1 = upcoming
  const panelProgress = rawProgress * (FACILITIES.length - 1) - index;
  const bgShift = panelProgress * -14; // vw
  const textShift = panelProgress * 6; // px
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;
  const isFuture = index > activeIndex;

  return (
    <div className="relative flex-shrink-0 overflow-hidden" style={{ width: "100vw", height: "100%" }}>
      {/* Deep background with parallax */}
      <div className="absolute inset-0"
        style={{ transform: `translateX(${bgShift}vw) scale(1.1)`, willChange: "transform", transition: "transform 0ms linear" }}>
        {facility.imageSrc
          ? <img src={facility.imageSrc} alt="" aria-hidden className="w-full h-full object-cover" loading="lazy" />
          : (
            <div className="w-full h-full" style={{ background: facility.bg }}>
              <svg className="absolute inset-0 w-full h-full opacity-[0.022]" viewBox="0 0 1440 900" preserveAspectRatio="none">
                {Array.from({ length: 15 }, (_, i) => (
                  <line key={i} x1={720} y1={1000} x2={(i / 14) * 1440} y2={0} stroke="white" strokeWidth="1" />
                ))}
                {Array.from({ length: 8 }, (_, i) => {
                  const y = i * 105;
                  return <line key={`h${i}`} x1={i * 9} y1={y} x2={1440 - i * 9} y2={y} stroke="white" strokeWidth="0.5" />;
                })}
              </svg>
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(ellipse 52% 68% at 28% 55%, rgba(${facility.accentRgb},0.1) 0%, transparent 55%), radial-gradient(ellipse 32% 42% at 72% 28%, rgba(${facility.accentRgb},0.05) 0%, transparent 50%)`
              }} />
            </div>
          )}
      </div>

      {/* Ambient */}
      <AmbientForFacility facility={facility} />
      <DustParticles accentRgb={facility.accentRgb} />

      {/* Cinematic vignettes */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.48) 30%, rgba(0,0,0,0.05) 62%, rgba(0,0,0,0.22) 100%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.52) 0%, transparent 42%, rgba(0,0,0,0.18) 100%)" }} />
      {index > 0 && <div className="pointer-events-none absolute inset-y-0 left-0 w-28" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.65), transparent)" }} />}
      {index < FACILITIES.length - 1 && <div className="pointer-events-none absolute inset-y-0 right-0 w-28" style={{ background: "linear-gradient(to left, rgba(0,0,0,0.65), transparent)" }} />}

      {/* Accent hairline top */}
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(to right, transparent, rgba(${facility.accentRgb},0.75) 45%, rgba(${facility.accentRgb},0.95) 50%, rgba(${facility.accentRgb},0.75) 55%, transparent)`, opacity: isActive ? 1 : 0.15, transition: "opacity 0.9s ease" }} />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pointer-events-none"
        style={{ transform: `translateX(${textShift}px)`, transition: "transform 0ms linear", willChange: "transform" }}>
        <div className="w-full max-w-5xl mx-auto px-10 md:px-20 pb-24 md:pb-32">
          {/* Tag */}
          <div className="mb-5 flex items-center gap-3"
            style={{ opacity: isActive ? 1 : 0, transform: `translateY(${isActive ? 0 : 10}px)`, transition: "opacity 0.7s 0.12s ease, transform 0.7s 0.12s ease" }}>
            <div className="h-px w-7" style={{ background: `rgba(${facility.accentRgb},0.7)` }} />
            <span className="text-[10px] font-medium uppercase tracking-[0.5em]" style={{ color: `rgba(${facility.accentRgb},0.85)` }}>{facility.id}</span>
          </div>

          {/* Headline */}
          <h2 className="font-black leading-[0.87] tracking-tighter text-white mb-5"
            style={{
              fontSize: "clamp(2.8rem,6.5vw,6.5rem)",
              textShadow: "0 6px 55px rgba(0,0,0,0.7)",
              opacity: isActive ? 1 : 0,
              transform: `translateY(${isActive ? 0 : isFuture ? 22 : -8}px)`,
              filter: `blur(${isActive ? 0 : 5}px)`,
              transition: "opacity 1s 0.28s ease, transform 1s 0.28s ease, filter 1s 0.28s ease",
            }}>
            {facility.heading.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i === 1
                  ? <span style={{ WebkitTextStroke: `1.5px rgba(${facility.accentRgb},0.85)`, color: "transparent" }}>{line}</span>
                  : line}
              </span>
            ))}
          </h2>

          {/* Sub */}
          <p className="max-w-sm text-sm md:text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.42)", opacity: isActive ? 1 : 0, transform: `translateY(${isActive ? 0 : 14}px)`, transition: "opacity 0.85s 0.48s ease, transform 0.85s 0.48s ease" }}>
            {facility.sub}
          </p>

          {/* CTA */}
          <div className="mt-7 flex items-center gap-3"
            style={{ opacity: isActive ? 1 : 0, transform: `translateY(${isActive ? 0 : 10}px)`, transition: "opacity 0.7s 0.65s ease, transform 0.7s 0.65s ease" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.42em]" style={{ color: facility.accent }}>Explore</span>
            <div className="h-px w-10" style={{ background: `rgba(${facility.accentRgb},0.4)` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MOBILE SNAP SCROLL
════════════════════════════════════════════ */
function MobileView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / window.innerWidth);
      setActiveIndex(Math.min(idx, FACILITIES.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const progress = FACILITIES.length > 1 ? activeIndex / (FACILITIES.length - 1) : 0;

  return (
    <div className="relative" style={{ height: "100svh" }}>
      <div ref={containerRef} className="flex h-full"
        style={{ overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {FACILITIES.map((facility, i) => (
          <div key={facility.id} className="relative flex-shrink-0 overflow-hidden"
            style={{ width: "100vw", height: "100%", scrollSnapAlign: "start" }}>
            <div className="absolute inset-0" style={{ background: facility.bg }}>
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(ellipse 58% 65% at 32% 55%, rgba(${facility.accentRgb},0.1) 0%, transparent 55%)` }} />
            </div>
            <AmbientForFacility facility={facility} />
            <DustParticles accentRgb={facility.accentRgb} />
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.08) 65%)" }} />
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(to right, transparent, rgba(${facility.accentRgb},0.8) 50%, transparent)` }} />
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-7 pb-24">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px w-7" style={{ background: `rgba(${facility.accentRgb},0.6)` }} />
                  <span className="text-[9px] font-medium uppercase tracking-[0.45em]" style={{ color: `rgba(${facility.accentRgb},0.85)` }}>{facility.id}</span>
                </div>
                <h2 className="font-black leading-[0.88] tracking-tighter text-white mb-3" style={{ fontSize: "clamp(2.1rem,9vw,3.2rem)" }}>
                  {facility.heading.split("\n").map((line, li) => (
                    <span key={li} className="block">
                      {li === 1 ? <span style={{ WebkitTextStroke: `1px rgba(${facility.accentRgb},0.85)`, color: "transparent" }}>{line}</span> : line}
                    </span>
                  ))}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{facility.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <CricketPitchProgress progress={progress} />
    </div>
  );
}

/* ════════════════════════════════════════════
   DESKTOP PINNED HORIZONTAL SCROLL
════════════════════════════════════════════ */
function DesktopView() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const scrolled = -rect.top;
      const maxScroll = outer.offsetHeight - window.innerHeight;
      const raw = Math.max(0, Math.min(1, scrolled / maxScroll));
      setScrollProgress(raw);
      setActiveIndex(Math.min(Math.round(raw * (FACILITIES.length - 1)), FACILITIES.length - 1));
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${raw * (FACILITIES.length - 1) * -100}vw)`;
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.removeEventListener("scroll", handleScroll); cancelAnimationFrame(rafRef.current); };
  }, [handleScroll]);

  const currentFacility = FACILITIES[activeIndex];

  return (
    <div ref={outerRef} style={{ height: `${FACILITIES.length * 100}vh` }} className="relative">
      <div ref={stickyRef} className="sticky top-0 overflow-hidden" style={{ height: "100vh" }}>
        <CursorSpotlight containerRef={stickyRef as React.RefObject<HTMLDivElement>} accentRgb={currentFacility.accentRgb} />

        {/* Track */}
        <div ref={trackRef} className="absolute top-0 left-0 flex" style={{ width: `${FACILITIES.length * 100}vw`, height: "100%", willChange: "transform" }}>
          {FACILITIES.map((facility, i) => (
            <FacilityPanel key={facility.id} facility={facility} index={i} activeIndex={activeIndex} rawProgress={scrollProgress} />
          ))}
        </div>

        {/* Section label — fades immediately on scroll */}
        <div className="absolute top-10 left-12 z-30 pointer-events-none"
          style={{ opacity: scrollProgress < 0.04 ? 1 - scrollProgress * 25 : 0, transition: "opacity 0.25s" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-7" style={{ background: "rgba(212,160,32,0.5)" }} />
            <span className="text-[10px] uppercase tracking-[0.5em]" style={{ color: "rgba(212,160,32,0.7)" }}>World-Class Infrastructure</span>
          </div>
          <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>Scroll to tour the academy →</p>
        </div>

        {/* Counter top-right */}
        <div className="absolute top-10 right-12 z-30 pointer-events-none text-right">
          <div className="text-[9px] uppercase tracking-[0.5em]" style={{ color: "rgba(255,255,255,0.16)" }}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(FACILITIES.length).padStart(2, "0")}
          </div>
        </div>

        {/* Cricket pitch progress */}
        <CricketPitchProgress progress={scrollProgress} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   STAT STRIP
════════════════════════════════════════════ */
function StatStrip() {
  return (
    <div className="relative py-20 md:py-28 overflow-hidden" style={{ background: "linear-gradient(to bottom, #030507 0%, #080a0c 50%, #030507 100%)" }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,160,32,0.04) 0%, transparent 70%)" }} />
      <div className="relative mx-auto max-w-5xl px-8 md:px-14">
        <motion.div className="mb-12 flex items-center gap-4"
          initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="h-px w-8" style={{ background: "rgba(212,160,32,0.5)" }} />
          <span className="text-[10px] uppercase tracking-[0.5em]" style={{ color: "rgba(212,160,32,0.6)" }}>By the numbers</span>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
          {[
            { value: "6", label: "Turf Pitches", accent: "#D4A020" },
            { value: "12", label: "Practice Lanes", accent: "#3AA8D8" },
            { value: "3", label: "Bowling Machines", accent: "#E05A20" },
            { value: "2", label: "Floodlit Grounds", accent: "#F0C830" },
          ].map((stat, i) => (
            <motion.div key={stat.label} className="flex flex-col items-center justify-center gap-2 py-10 px-4"
              style={{ background: "rgba(255,255,255,0.02)" }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}>
              <div className="text-5xl font-black" style={{ color: stat.accent }}>{stat.value}</div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-center" style={{ color: "rgba(255,255,255,0.28)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOT
════════════════════════════════════════════ */
export default function Facilities() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="facilities" style={{ background: "#030507" }} className="relative">
      <style>{`@media (prefers-reduced-motion: reduce) { * { animation-duration:0.01ms!important; transition-duration:0.01ms!important; } }`}</style>
      {isMobile ? <MobileView /> : <DesktopView />}
      <StatStrip />
    </section>
  );
}