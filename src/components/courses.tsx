"use client";
import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

/* ─── Data ─── */
const PROGRAMS = [
  {
    id: "foundation",
    label: "Foundation",
    duration: "3 Months",
    age: "8 – 14 yrs",
    accent: "#D4A020",
    accentRgb: "212,160,32",
    tagline: "Where champions begin.",
    desc: "A structured introduction to cricket fundamentals. Technique, mindset, and love of the game — built from the ground up by our coaching staff.",
    skills: ["Batting Stance & Grip", "Basic Bowling Mechanics", "Fielding Fundamentals", "Match Awareness", "Physical Literacy"],
    sessions: "3× per week",
    batchSize: "Max 12 students",
    coachRatio: "1 : 4",
    featured: false,
  },
  {
    id: "performance",
    label: "Performance",
    duration: "6 Months",
    age: "14 – 20 yrs",
    accent: "#3AA8D8",
    accentRgb: "58,168,216",
    tagline: "Craft sharpened. Game elevated.",
    desc: "For serious players ready to compete. PitchVision analysis, tailored net sessions, and competitive match simulation — all under expert coaching.",
    skills: ["PitchVision Ball Analysis", "Bowling Machine Sessions", "Video Biomechanics", "Mental Conditioning", "Tactical Game Planning", "Fitness Benchmarking"],
    sessions: "5× per week",
    batchSize: "Max 8 students",
    coachRatio: "1 : 2",
    featured: true,
  },
  {
    id: "elite",
    label: "Elite",
    duration: "12 Months",
    age: "16 – 24 yrs",
    accent: "#9ED420",
    accentRgb: "158,212,32",
    tagline: "Built for selection. Forged for legacy.",
    desc: "Our flagship programme for players targeting state and national cricket. Individualized training blueprints, sports science integration, and selection network access.",
    skills: ["Personalized Development Blueprint", "Sports Science Lab", "Strength & Conditioning", "Selection Network Access", "Live Match Broadcast Training", "Nutritionist Support"],
    sessions: "Daily",
    batchSize: "Max 5 students",
    coachRatio: "1 : 1",
    featured: false,
  },
  {
    id: "camp",
    label: "Holiday Camp",
    duration: "2 Weeks",
    age: "10 – 18 yrs",
    accent: "#E05A20",
    accentRgb: "224,90,32",
    tagline: "Intensity. Fun. Transformation.",
    desc: "Immersive holiday camps that compress months of learning into two weeks. High-energy days, tournament play, and skills that carry beyond the holiday.",
    skills: ["Intensive Net Practice", "Tournament Play", "Bowling Machine Access", "Team Strategy Sessions", "Fun Competitions"],
    sessions: "Full day",
    batchSize: "Max 16 students",
    coachRatio: "1 : 4",
    featured: false,
  },
] as const;

type Program = (typeof PROGRAMS)[number];

/* ─── Cursor spotlight ─── */
function CursorSpotlight({ containerRef, accentRgb }: { containerRef: React.RefObject<HTMLDivElement>; accentRgb: string }) {
  const x = useMotionValue(-500); const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 45, damping: 18 });
  const sy = useSpring(y, { stiffness: 45, damping: 18 });
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top); };
    const leave = () => { x.set(-500); y.set(-500); };
    el.addEventListener("mousemove", move); el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [x, y, containerRef]);
  return (
    <motion.div className="pointer-events-none absolute z-10"
      style={{ left: sx, top: sy, width: 500, height: 500, x: "-50%", y: "-50%", background: `radial-gradient(circle, rgba(${accentRgb},0.05) 0%, transparent 62%)`, borderRadius: "50%" }} />
  );
}

/* ─── Skill pill ─── */
const SkillPill = memo(({ label, accent, accentRgb, delay }: { label: string; accent: string; accentRgb: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.92 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
    style={{ background: `rgba(${accentRgb},0.08)`, border: `1px solid rgba(${accentRgb},0.2)` }}
  >
    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent }} />
    <span className="text-[11px] font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
  </motion.div>
));
SkillPill.displayName = "SkillPill";

/* ─── Program panel ─── */
function ProgramPanel({ program, isActive, onClick, index }: { program: Program; isActive: boolean; onClick: () => void; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      layout
      animate={{
        flex: isActive ? 3.5 : 1,
        opacity: isActive ? 1 : 0.65,
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl cursor-pointer flex-shrink-0 min-w-0"
      style={{
        border: `1px solid rgba(${program.accentRgb}, ${isActive ? 0.35 : hovered ? 0.18 : 0.08})`,
        background: isActive
          ? `linear-gradient(145deg, rgba(${program.accentRgb},0.07) 0%, rgba(255,255,255,0.03) 50%, rgba(${program.accentRgb},0.04) 100%)`
          : `rgba(255,255,255,0.025)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: isActive
          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(${program.accentRgb},0.2), inset 0 1px 0 rgba(${program.accentRgb},0.15)`
          : hovered
          ? `0 8px 30px rgba(0,0,0,0.25), 0 0 0 1px rgba(${program.accentRgb},0.1)`
          : `0 4px 16px rgba(0,0,0,0.2)`,
        transform: hovered && !isActive ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, background 0.5s ease",
      }}
    >
      {/* Active accent bar — left edge */}
      <motion.div
        className="absolute left-0 inset-y-0 w-0.5"
        animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: `linear-gradient(to bottom, transparent, ${program.accent}, transparent)`, transformOrigin: "center" }}
      />

      {/* Top accent hairline */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, rgba(${program.accentRgb},${isActive ? 0.7 : 0.2}), transparent)`, transition: "opacity 0.4s" }} />

      {/* Featured badge */}
      {program.featured && (
        <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.35em]"
          style={{ background: `rgba(${program.accentRgb},0.15)`, border: `1px solid rgba(${program.accentRgb},0.3)`, color: program.accent }}>
          Most Popular
        </div>
      )}

      <div className="relative h-full flex flex-col p-6 md:p-8">
        {/* Header — always visible */}
        <div className="flex-shrink-0">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px w-5" style={{ background: `rgba(${program.accentRgb},0.6)` }} />
            <span className="text-[9px] uppercase tracking-[0.5em] font-medium" style={{ color: `rgba(${program.accentRgb},0.8)` }}>
              {program.duration} · {program.age}
            </span>
          </div>
          <h3 className="font-black leading-tight tracking-tight text-white mb-1"
            style={{ fontSize: isActive ? "clamp(1.6rem,3vw,2.4rem)" : "clamp(1.1rem,2vw,1.5rem)", transition: "font-size 0.5s ease" }}>
            {program.label}
          </h3>
          <p className="text-xs font-light italic mb-0" style={{ color: `rgba(${program.accentRgb},0.85)` }}>
            {program.tagline}
          </p>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5" style={{ borderTop: `1px solid rgba(${program.accentRgb},0.12)` }}>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {program.desc}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {program.skills.map((skill, i) => (
                    <SkillPill key={skill} label={skill} accent={program.accent} accentRgb={program.accentRgb} delay={i * 0.06} />
                  ))}
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                  {[
                    { label: "Sessions", value: program.sessions },
                    { label: "Batch", value: program.batchSize },
                    { label: "Ratio", value: program.coachRatio },
                  ].map((item, i) => (
                    <motion.div key={item.label}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
                      className="rounded-xl p-3 text-center"
                      style={{ background: `rgba(${program.accentRgb},0.06)`, border: `1px solid rgba(${program.accentRgb},0.12)` }}>
                      <div className="text-[10px] uppercase tracking-[0.35em] mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.label}</div>
                      <div className="text-sm font-bold text-white">{item.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide relative overflow-hidden group"
                  style={{ background: `rgba(${program.accentRgb},0.12)`, border: `1px solid rgba(${program.accentRgb},0.3)`, color: program.accent }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Enquire About This Programme</span>
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `rgba(${program.accentRgb},0.08)` }} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Main ─── */
export default function Courses() {
  const [active, setActive] = useState<string>("performance");
  const containerRef = useRef<HTMLDivElement>(null);
  const activeProgram = PROGRAMS.find(p => p.id === active)!;

  return (
    <section id="courses" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #030507 0%, #050810 50%, #030507 100%)" }}>
      {/* Ambient bg glow */}
      <motion.div className="pointer-events-none absolute inset-0"
        animate={{ background: `radial-gradient(ellipse 70% 50% at 50% 30%, rgba(${activeProgram.accentRgb},0.04) 0%, transparent 65%)` }}
        transition={{ duration: 1.2, ease: "easeInOut" }} />

      <div ref={containerRef} className="relative mx-auto max-w-7xl px-5 md:px-10 lg:px-14">
        <CursorSpotlight containerRef={containerRef as React.RefObject<HTMLDivElement>} accentRgb={activeProgram.accentRgb} />

        {/* Header */}
        <div className="mb-14 md:mb-18">
          <motion.div className="mb-5 flex items-center gap-3"
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="h-px w-8" style={{ background: "rgba(212,160,32,0.5)" }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.5em]" style={{ color: "rgba(212,160,32,0.7)" }}>Elite Training Programs</span>
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <motion.h2 className="font-black leading-[0.88] tracking-tighter text-white"
              style={{ fontSize: "clamp(2.6rem,5.5vw,5rem)" }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }}>
              Choose Your<br />
              <span style={{ WebkitTextStroke: "1px rgba(212,160,32,0.7)", color: "transparent" }}>Programme</span>
            </motion.h2>
            <motion.p className="max-w-xs text-sm leading-relaxed md:text-right" style={{ color: "rgba(255,255,255,0.35)" }}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.25 }}>
              Select a programme below to explore what it offers.
            </motion.p>
          </div>
        </div>

        {/* Desktop: horizontal flex accordion */}
        <motion.div className="hidden md:flex gap-3" style={{ height: 520 }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}>
          {PROGRAMS.map((p, i) => (
            <ProgramPanel key={p.id} program={p} isActive={active === p.id} onClick={() => setActive(p.id)} index={i} />
          ))}
        </motion.div>

        {/* Mobile: vertical stacked accordion */}
        <div className="md:hidden flex flex-col gap-3">
          {PROGRAMS.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}>
              <div onClick={() => setActive(active === p.id ? "" : p.id)}
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{ border: `1px solid rgba(${p.accentRgb},${active === p.id ? 0.3 : 0.1})`, background: `rgba(255,255,255,0.025)`, backdropFilter: "blur(10px)" }}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-xl text-white">{p.label}</h3>
                    <motion.div animate={{ rotate: active === p.id ? 45 : 0 }} transition={{ duration: 0.3 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-lg font-light"
                      style={{ background: `rgba(${p.accentRgb},0.1)`, color: p.accent }}>+</motion.div>
                  </div>
                  <p className="text-xs italic" style={{ color: `rgba(${p.accentRgb},0.8)` }}>{p.tagline}</p>
                </div>
                <AnimatePresence>
                  {active === p.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{p.desc}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {p.skills.map(s => <SkillPill key={s} label={s} accent={p.accent} accentRgb={p.accentRgb} delay={0} />)}
                        </div>
                        <button className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: `rgba(${p.accentRgb},0.1)`, border: `1px solid rgba(${p.accentRgb},0.25)`, color: p.accent }}>
                          Enquire Now
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to bottom, transparent, #030507)" }} />
    </section>
  );
}