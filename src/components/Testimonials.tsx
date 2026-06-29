"use client";
import { useRef, useState, useMemo, useEffect, memo } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

/* ─── Data ─── */
const TESTIMONIALS = [
  {
    id: "t1",
    name: "Arjun Mehta",
    role: "Under-19 State Selection",
    quote: "The PitchVision Lab changed how I understood my own batting. I could see exactly where I was losing shape at the top of the backlift. Three months later, I scored my first century in the Cooch Behar Trophy.",
    accent: "#D4A020",
    accentRgb: "212,160,32",
    size: "large" as const,
    initials: "AM",
  },
  {
    id: "t2",
    name: "Priya Sharma",
    role: "Women's District Team",
    quote: "The coaches here don't just fix technique — they build confidence. I came in nervous to bowl in front of people. Now I open the bowling.",
    accent: "#3AA8D8",
    accentRgb: "58,168,216",
    size: "medium" as const,
    initials: "PS",
  },
  {
    id: "t3",
    name: "Rahul Verma",
    role: "Parent of Foundation Student",
    quote: "My son transformed completely in 6 months. Not just technically — his discipline, focus, and respect for the game changed entirely.",
    accent: "#9ED420",
    accentRgb: "158,212,32",
    size: "small" as const,
    initials: "RV",
  },
  {
    id: "t4",
    name: "Kavya Nair",
    role: "Elite Programme Graduate",
    quote: "When I joined the Elite programme, I was on the fringe of selection. The personalized blueprint and sports science support gave me a roadmap nobody else in my state had access to.",
    accent: "#E05A20",
    accentRgb: "224,90,32",
    size: "large" as const,
    initials: "KN",
  },
  {
    id: "t5",
    name: "Dev Patel",
    role: "Holiday Camp Attendee",
    quote: "The two weeks felt like six months of practice. The intensity is real. The fun is realer. I came back the next holiday too.",
    accent: "#F0C830",
    accentRgb: "240,200,48",
    size: "small" as const,
    initials: "DP",
  },
  {
    id: "t6",
    name: "Coach Suresh Iyer",
    role: "Former Ranji Cricketer",
    quote: "I've trained at national facilities. What makes this academy exceptional isn't the equipment — it's the philosophy. Every student is treated like a future professional.",
    accent: "#00C4D8",
    accentRgb: "0,196,216",
    size: "medium" as const,
    initials: "SI",
  },
];

/* ─── Ambient particles ─── */
const Particles = memo(() => {
  const ps = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 0.8 + Math.random() * 1.6, dur: 18 + Math.random() * 22, delay: Math.random() * 15,
    op: 0.04 + Math.random() * 0.08, drift: (Math.random() - 0.5) * 50,
  })), []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {ps.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: "rgba(212,160,32,1)", opacity: p.op }}
          animate={{ y: [0, -60, 0], x: [0, p.drift, 0], opacity: [p.op * 0.3, p.op, p.op * 0.3] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
});
Particles.displayName = "Particles";

/* ─── Testimonial card ─── */
function TestimonialCard({ t, style }: { t: typeof TESTIMONIALS[0]; style: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  const isLarge = t.size === "large";
  const isMedium = t.size === "medium";

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute rounded-2xl overflow-hidden select-none"
      style={{
        ...style,
        backdropFilter: hovered ? "blur(20px)" : "blur(14px)",
        WebkitBackdropFilter: hovered ? "blur(20px)" : "blur(14px)",
        background: hovered
          ? `linear-gradient(145deg, rgba(${t.accentRgb},0.1) 0%, rgba(255,255,255,0.06) 50%, rgba(${t.accentRgb},0.06) 100%)`
          : `rgba(255,255,255,0.04)`,
        border: `1px solid rgba(${t.accentRgb},${hovered ? 0.3 : 0.12})`,
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(${t.accentRgb},0.15), 0 0 40px rgba(${t.accentRgb},0.06)`
          : `0 8px 30px rgba(0,0,0,0.3)`,
        zIndex: hovered ? 20 : 1,
        transform: hovered ? "scale(1.04) translateY(-4px)" : "scale(1) translateY(0)",
        transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, background 0.45s ease, border-color 0.45s ease, backdrop-filter 0.45s ease",
        cursor: "default",
      }}
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, rgba(${t.accentRgb},${hovered ? 0.8 : 0.35}), transparent)`, transition: "opacity 0.4s" }} />

      <div className="p-5 md:p-6 h-full flex flex-col justify-between">
        {/* Quote mark */}
        <div className="mb-3 font-serif text-4xl leading-none" style={{ color: `rgba(${t.accentRgb},0.25)`, fontFamily: "Georgia, serif" }}>"</div>

        {/* Quote */}
        <p className={`leading-relaxed mb-4 flex-1 ${isLarge ? "text-sm md:text-base" : "text-xs md:text-sm"}`}
          style={{ color: hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)", transition: "color 0.4s" }}>
          {t.quote}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mt-auto">
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: `rgba(${t.accentRgb},0.15)`, border: `1px solid rgba(${t.accentRgb},0.3)`, color: t.accent }}>
            {t.initials}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">{t.name}</div>
            <div className="text-[10px] tracking-wide" style={{ color: `rgba(${t.accentRgb},0.7)` }}>{t.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Floating wall — desktop ─── */
// Cards placed in a natural overlapping layout
const CARD_POSITIONS: React.CSSProperties[] = [
  { top: "4%",  left: "0%",  width: "34%", height: "44%" },   // t1 large
  { top: "10%", left: "36%", width: "24%", height: "34%" },   // t2 medium
  { top: "8%",  left: "62%", width: "20%", height: "26%" },   // t3 small
  { top: "50%", left: "2%",  width: "34%", height: "45%" },   // t4 large
  { top: "52%", left: "38%", width: "20%", height: "26%" },   // t5 small
  { top: "45%", left: "60%", width: "26%", height: "38%" },   // t6 medium
];

// Ambient float offsets per card
const FLOAT_VARIANTS = [
  { y: [0, -12, 0], duration: 14 },
  { y: [0, -8,  0], duration: 18 },
  { y: [0, -15, 0], duration: 12 },
  { y: [0, -10, 0], duration: 16 },
  { y: [0, -6,  0], duration: 20 },
  { y: [0, -11, 0], duration: 15 },
];

/* ─── Main ─── */
export default function Testimonials() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #030507 0%, #04060a 50%, #030507 100%)" }}>
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(58,168,216,0.03) 0%, transparent 65%)" }} />
      <Particles />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10 lg:px-14">
        {/* Header */}
        <div className="mb-16">
          <motion.div className="mb-5 flex items-center gap-3"
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="h-px w-8" style={{ background: "rgba(58,168,216,0.5)" }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.5em]" style={{ color: "rgba(58,168,216,0.7)" }}>What Students Say</span>
          </motion.div>
          <motion.h2 className="font-black leading-[0.88] tracking-tighter text-white"
            style={{ fontSize: "clamp(2.6rem,5.5vw,5rem)" }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }}>
            Voices from<br />
            <span style={{ WebkitTextStroke: "1px rgba(58,168,216,0.7)", color: "transparent" }}>the Academy</span>
          </motion.h2>
        </div>

        {/* Desktop floating wall */}
        {!isMobile && (
          <motion.div className="relative hidden md:block" style={{ height: 560 }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.id} className="absolute"
                style={CARD_POSITIONS[i]}
                animate={{ y: FLOAT_VARIANTS[i].y }}
                transition={{ duration: FLOAT_VARIANTS[i].duration, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 }}>
                <TestimonialCard t={t} style={{ position: "relative", width: "100%", height: "100%", inset: "unset" }} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mobile: swipeable stack */}
        {isMobile && (
          <div>
            <div className="overflow-x-auto flex gap-4 pb-4"
              style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="flex-shrink-0" style={{ width: "80vw", scrollSnapAlign: "start" }}>
                  <div className="rounded-2xl p-5 h-64"
                    style={{ background: `rgba(255,255,255,0.04)`, border: `1px solid rgba(${t.accentRgb},0.18)`, backdropFilter: "blur(12px)" }}>
                    <div className="font-serif text-3xl mb-2" style={{ color: `rgba(${t.accentRgb},0.3)`, fontFamily: "Georgia, serif" }}>"</div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{t.quote}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `rgba(${t.accentRgb},0.15)`, color: t.accent }}>{t.initials}</div>
                      <div>
                        <div className="text-xs font-semibold text-white">{t.name}</div>
                        <div className="text-[10px]" style={{ color: `rgba(${t.accentRgb},0.7)` }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fades */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to bottom, transparent, #030507)" }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16" style={{ background: "linear-gradient(to top, transparent, #030507)" }} />
    </section>
  );
}