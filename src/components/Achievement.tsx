import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView, useScroll } from "framer-motion";

/* ─── Data ─── */
const FEATURED_PLAYER = {
  name: "Arjun Sharma",
  role: "Opening Batsman",
  achievement: "India U-19 · 2023",
  quote: "TICA didn't just teach me cricket. They taught me how to think like a champion.",
  journey: ["Joined at age 11", "State selection at 14", "India U-19 squad at 17"],
  stats: [
    { v: "1,240", l: "Runs — U-19 Season" },
    { v: "3", l: "Centuries" },
    { v: "67.4", l: "Average" },
  ],
};

const ACHIEVEMENTS = [
  {
    id: "state",
    label: "State Selections",
    value: "48",
    sub: "Students representing their state in the last 5 seasons",
    accent: "#F5A623",
    accentRgb: "245,166,35",
    icon: "🏅",
  },
  {
    id: "national",
    label: "National Selections",
    value: "24",
    sub: "Players selected for national-level tournaments",
    accent: "#FFD700",
    accentRgb: "255,215,0",
    icon: "🏆",
  },
  {
    id: "tournaments",
    label: "Tournament Titles",
    value: "31",
    sub: "District, State & Zonal championship victories",
    accent: "#FF6B35",
    accentRgb: "255,107,53",
    icon: "🥇",
  },
  {
    id: "students",
    label: "Alumni in Pro Cricket",
    value: "12",
    sub: "Graduates now playing professionally",
    accent: "#4FC3F7",
    accentRgb: "79,195,247",
    icon: "⭐",
  },
];

const MILESTONES = [
  { year: "2006", label: "Founded", desc: "Academy established" },
  { year: "2009", label: "First Selection", desc: "District-level debut" },
  { year: "2013", label: "State Title", desc: "First state championship" },
  { year: "2017", label: "National Stage", desc: "U-19 national exposure" },
  { year: "2020", label: "PitchVision", desc: "Technology integration" },
  { year: "2023", label: "India U-19", desc: "First national cap" },
];

const HALL_PLAYERS = [
  { name: "Arjun Sharma", year: "2023", badge: "India U-19", initials: "AS", accent: "#F5A623" },
  { name: "Priya Menon", year: "2022", badge: "MP Ranji", initials: "PM", accent: "#4FC3F7" },
  { name: "Rahul Gupta", year: "2021", badge: "State Captain", initials: "RG", accent: "#FF6B35" },
  { name: "Karan Patel", year: "2020", badge: "U-23 National", initials: "KP", accent: "#FFD700" },
  { name: "Sneha Joshi", year: "2022", badge: "Women's State", initials: "SJ", accent: "#C6F135" },
];

/* ─── Ambient particles ─── */
function AmbientParticles() {
  const p = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 1 + Math.random() * 1.5, dur: 14 + Math.random() * 14,
    delay: Math.random() * 8, op: 0.06 + Math.random() * 0.1,
  })), []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {p.map(pt => (
        <motion.div key={pt.id} className="absolute rounded-full"
          style={{ left: `${pt.x}%`, top: `${pt.y}%`, width: pt.size, height: pt.size, background: "#F5A623", opacity: pt.op }}
          animate={{ y: [0, -35, 0], opacity: [pt.op * 0.4, pt.op, pt.op * 0.4] }}
          transition={{ duration: pt.dur, delay: pt.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Spotlight ─── */
function Spotlight({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const x = useMotionValue(-400); const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 55, damping: 18 });
  const sy = useSpring(y, { stiffness: 55, damping: 18 });
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top); };
    const leave = () => { x.set(-400); y.set(-400); };
    el.addEventListener("mousemove", move); el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [x, y, containerRef]);
  return (
    <motion.div className="pointer-events-none absolute z-10"
      style={{ left: sx, top: sy, width: 600, height: 600, x: "-50%", y: "-50%",
        background: "radial-gradient(circle, rgba(245,166,35,0.045) 0%, transparent 65%)", borderRadius: "50%" }}
    />
  );
}

/* ─── Featured player card ─── */
function FeaturedPlayer() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative rounded-3xl overflow-hidden"
      style={{ minHeight: 520 }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Player image / gradient bg */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a1a0a 0%, #1a2d10 30%, #0d1f2a 70%, #0a0d1a 100%)",
          }}
        />
        {/* Decorative avatar / silhouette area */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
          {/* Large decorative circle — player placeholder */}
          <motion.div
            className="absolute bottom-0 right-0 w-3/4 h-full flex items-end justify-center"
            animate={{ scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-full h-full"
              style={{
                background: "radial-gradient(ellipse at 60% 100%, rgba(245,166,35,0.12) 0%, rgba(245,166,35,0.04) 40%, transparent 70%)",
              }}
            />
            {/* Silhouette placeholder circle */}
            <div
              className="absolute bottom-0 right-10 w-56 h-56 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(245,166,35,0.1) 0%, rgba(245,166,35,0.03) 60%, transparent 100%)",
                border: "1px solid rgba(245,166,35,0.15)",
              }}
            >
              <span style={{ fontSize: 80, filter: "drop-shadow(0 0 30px rgba(245,166,35,0.4))" }}>🏏</span>
            </div>
          </motion.div>
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.2) 100%), linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      {/* Light sweep on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: "linear-gradient(105deg, transparent 35%, rgba(245,166,35,0.06) 50%, transparent 65%)" }}
      />

      {/* Top accent line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        animate={{ opacity: hovered ? 0.9 : 0.35 }}
        style={{ background: "linear-gradient(to right, rgba(245,166,35,0.8), transparent 60%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10" style={{ minHeight: 520 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.25)", color: "#F5A623" }}
          >
            ⭐ Hall of Fame — Featured
          </div>
        </motion.div>

        {/* Player info */}
        <div className="mt-auto">
          {/* Journey pills */}
          <motion.div
            className="mb-6 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {FEATURED_PLAYER.journey.map((j, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.55 + i * 0.1 }}
                className="flex items-center gap-1.5 text-[10px]"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {i > 0 && <span style={{ color: "rgba(245,166,35,0.4)" }}>→</span>}
                {j}
              </motion.span>
            ))}
          </motion.div>

          {/* Name */}
          <div className="overflow-hidden mb-1">
            <motion.h3
              className="font-black leading-none text-white"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {FEATURED_PLAYER.name}
            </motion.h3>
          </div>

          {/* Role + achievement */}
          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.65 }}
          >
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{FEATURED_PLAYER.role}</span>
            <div className="h-1 w-1 rounded-full" style={{ background: "#F5A623" }} />
            <span className="text-sm font-semibold" style={{ color: "#F5A623" }}>{FEATURED_PLAYER.achievement}</span>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            className="mb-8 max-w-sm border-l-2 pl-4 text-sm leading-relaxed italic"
            style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(245,166,35,0.4)" }}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            "{FEATURED_PLAYER.quote}"
          </motion.blockquote>

          {/* Stats row */}
          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {FEATURED_PLAYER.stats.map(s => (
              <div key={s.l}>
                <div className="text-xl font-black text-white">{s.v}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Achievement stat card ─── */
function AchievementCard({ item, index }: { item: typeof ACHIEVEMENTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const inView = useInView(useRef<HTMLDivElement>(null), { once: true });
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${item.accentRgb},0.04) 0%, rgba(0,0,0,0.6) 100%)`,
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      animate-hover={{
        boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(${item.accentRgb},0.2)`,
        y: -4,
      }}
      whileHover={{ y: -4, boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(${item.accentRgb},0.2)` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent top line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        animate={{ opacity: hovered ? 1 : 0.3 }}
        style={{ background: `linear-gradient(to right, transparent, rgba(${item.accentRgb},0.8), transparent)` }}
      />

      {/* Trophy glow on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: `radial-gradient(circle 180px at 80% 30%, rgba(${item.accentRgb},0.08) 0%, transparent 70%)` }}
      />

      <div className="p-6">
        <motion.div
          className="mb-4 text-3xl"
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? [0, -5, 5, 0] : 0 }}
          transition={{ duration: 0.4 }}
          style={{ filter: hovered ? `drop-shadow(0 0 12px rgba(${item.accentRgb},0.6))` : "none" }}
        >
          {item.icon}
        </motion.div>

        <div className="mb-1 font-black text-white" style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1 }}>
          {item.value}
          <span className="text-lg" style={{ color: `rgba(${item.accentRgb},0.7)` }}>+</span>
        </div>

        <div className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: item.accent }}>
          {item.label}
        </div>

        <motion.p
          className="text-[11px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.35)" }}
          animate={{ opacity: hovered ? 0.7 : 0.4 }}
        >
          {item.sub}
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ─── Milestone timeline ─── */
function MilestoneTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    if (!isInView) return;
    MILESTONES.forEach((_, i) => {
      setTimeout(() => setActiveIdx(i), 300 + i * 220);
    });
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      {/* Line */}
      <div className="relative h-px w-full mb-8" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div
          className="absolute left-0 top-0 h-full"
          style={{ background: "linear-gradient(to right, #F5A623, #FFD700)" }}
          initial={{ width: "0%" }}
          animate={isInView ? { width: "100%" } : {}}
          transition={{ duration: 2.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {MILESTONES.map((m, i) => (
          <motion.div
            key={m.year}
            className="flex flex-col gap-1"
            initial={{ opacity: 0, y: 12 }}
            animate={activeIdx >= i ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Dot on line */}
            <div className="relative -mt-12 mb-4 flex justify-center">
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                animate={activeIdx >= i
                  ? { background: "#F5A623", boxShadow: "0 0 12px rgba(245,166,35,0.8)" }
                  : { background: "rgba(255,255,255,0.15)", boxShadow: "none" }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="text-sm font-black" style={{ color: activeIdx >= i ? "#F5A623" : "rgba(255,255,255,0.2)" }}>
              {m.year}
            </div>
            <div className="text-xs font-semibold text-white" style={{ opacity: activeIdx >= i ? 0.9 : 0.2 }}>
              {m.label}
            </div>
            <div className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)", opacity: activeIdx >= i ? 1 : 0 }}>
              {m.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Hall of fame player row ─── */
function HallPlayer({ p, index }: { p: typeof HALL_PLAYERS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4 rounded-xl px-4 py-3.5 cursor-default"
      style={{ background: hovered ? `rgba(${p.accent.replace("#","")},0.04)` : "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "background 0.3s" }}
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <motion.div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-black"
        style={{ background: `rgba(${p.accent.replace(/^#/,"")},0.15)`, border: `1px solid rgba(${p.accent.replace(/^#/,"")},0.3)`, color: p.accent }}
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {p.initials}
      </motion.div>

      {/* Name + year */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{p.name}</div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{p.year}</div>
      </div>

      {/* Badge */}
      <motion.div
        className="flex-shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em]"
        style={{ background: `rgba(${p.accent.replace(/^#/,"")},0.1)`, border: `1px solid rgba(${p.accent.replace(/^#/,"")},0.2)`, color: p.accent }}
        animate={{ opacity: hovered ? 1 : 0.75 }}
      >
        {p.badge}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main export ─── */
export default function HallOfFame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      id="stories"
      className="relative overflow-hidden py-24 md:py-36 scroll-mt-28"
      style={{ background: "oklch(0.04 0.01 250)" }}
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.10 0.025 55 / 0.5) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 85% 60%, oklch(0.08 0.02 250 / 0.4) 0%, transparent 65%)" }} />
      </div>

      <AmbientParticles />

      <div ref={containerRef} className="relative mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <Spotlight containerRef={containerRef as React.RefObject<HTMLDivElement>} />

        {/* ── Section header ── */}
        <div ref={headerRef} className="mb-16 md:mb-20">
          <motion.div
            className="mb-5 flex items-center gap-3"
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="h-px w-10" style={{ background: "rgba(245,166,35,0.6)" }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.45em]" style={{ color: "rgba(245,166,35,0.7)" }}>
              Hall of Fame
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="overflow-hidden">
              <motion.h2
                className="font-black leading-[0.88] tracking-tight text-white"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
                initial={{ y: "110%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Champions
                <br />
                <span style={{ WebkitTextStroke: "1px rgba(245,166,35,0.65)", color: "transparent" }}>
                  We Made
                </span>
              </motion.h2>
            </div>

            <motion.p
              className="max-w-xs text-sm leading-relaxed md:text-right"
              style={{ color: "rgba(255,255,255,0.38)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Every name here started as a student. Every record started as a dream. This is what the academy builds.
            </motion.p>
          </div>
        </div>

        {/* ── Main editorial grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">

          {/* Featured player — 7 cols */}
          <div className="md:col-span-7">
            <FeaturedPlayer />
          </div>

          {/* Right column — achievement stats (5 cols) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3 content-start">
            {ACHIEVEMENTS.map((item, i) => (
              <AchievementCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* ── Hall of fame roster + milestone ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">

          {/* Player roster — 4 cols */}
          <div className="md:col-span-4">
            <motion.div
              className="mb-5 flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: "rgba(245,166,35,0.6)" }}>
                Notable Alumni
              </span>
            </motion.div>
            <div className="flex flex-col gap-2">
              {HALL_PLAYERS.map((p, i) => (
                <HallPlayer key={p.name} p={p} index={i} />
              ))}
            </div>
          </div>

          {/* Milestone timeline — 8 cols */}
          <div className="md:col-span-8">
            <motion.div
              className="mb-8 flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: "rgba(245,166,35,0.6)" }}>
                Academy Milestones
              </span>
            </motion.div>
            <MilestoneTimeline />
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          className="relative flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl p-8 md:p-10 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(0,0,0,0.5) 100%)", border: "1px solid rgba(245,166,35,0.12)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Accent glow */}
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(245,166,35,0.06) 0%, transparent 70%)" }} />

          <div className="relative z-10">
            <div className="text-2xl font-black text-white mb-1">Your name could be next.</div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
              Every champion on this wall once walked through our gates as a beginner.
            </div>
          </div>

          <motion.button
            className="relative z-10 flex-shrink-0 flex items-center gap-2.5 rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-black"
            style={{ background: "linear-gradient(135deg, #F5A623, #FFD700)", boxShadow: "0 8px 32px rgba(245,166,35,0.35)" }}
            whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(245,166,35,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            Begin Your Journey →
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom transition */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{ background: "linear-gradient(to bottom, transparent, oklch(0.04 0.01 250))" }}
      />
    </section>
  );
}