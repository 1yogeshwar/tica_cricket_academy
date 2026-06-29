import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";

/* ─── Facility data ─── */
const FACILITIES = [
  {
    id: "turf",
    size: "large",        // large | medium | small | tall
    heading: "Professional Turf Wickets",
    desc: "6 BCCI-standard turf pitches with genuine bounce and carry",
    icon: "🏏",
    accent: "#F5A623",
    accentRgb: "245,166,35",
    // Placeholder gradient — replace src prop with real image path
    gradient: "linear-gradient(135deg, #1a2a0a 0%, #2d4a15 40%, #1a3010 100%)",
    imageSrc: null, // e.g. "@/assets/facilities/turf.jpg"
  },
  {
    id: "nets",
    size: "medium",
    heading: "Indoor & Outdoor Nets",
    desc: "12 lanes with natural and artificial surfaces",
    icon: "🎯",
    accent: "#4FC3F7",
    accentRgb: "79,195,247",
    gradient: "linear-gradient(135deg, #071a2a 0%, #0d2d42 50%, #071a2a 100%)",
    imageSrc: null,
  },
  {
    id: "machine",
    size: "small",
    heading: "Bowling Machines",
    desc: "Merlyn & ProBatter for pace and spin simulation",
    icon: "⚙️",
    accent: "#FF6B35",
    accentRgb: "255,107,53",
    gradient: "linear-gradient(135deg, #1a0a04 0%, #2d1508 50%, #1a0a04 100%)",
    imageSrc: null,
  },
  {
    id: "pitchvision",
    size: "tall",
    heading: "PitchVision Analysis",
    desc: "Ball-tracking, biomechanics and real-time performance data",
    icon: "📡",
    accent: "#00E5FF",
    accentRgb: "0,229,255",
    gradient: "linear-gradient(135deg, #021a1f 0%, #043040 50%, #021a1f 100%)",
    imageSrc: null,
  },
  {
    id: "fitness",
    size: "medium",
    heading: "High Performance Fitness",
    desc: "Sport science lab, gym and conditioning programs",
    icon: "💪",
    accent: "#C6F135",
    accentRgb: "198,241,53",
    gradient: "linear-gradient(135deg, #0d1a02 0%, #1a2d04 50%, #0d1a02 100%)",
    imageSrc: null,
  },
  {
    id: "match",
    size: "large",
    heading: "Match Simulation Ground",
    desc: "Floodlit match practice with umpires, scorers and live broadcast",
    icon: "🏟️",
    accent: "#FFD700",
    accentRgb: "255,215,0",
    gradient: "linear-gradient(135deg, #1a1400 0%, #2d2400 40%, #1a1800 100%)",
    imageSrc: null,
  },
];

/* ─── Ambient particles ─── */
function AmbientParticles() {
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 12 + Math.random() * 16,
    delay: Math.random() * 10,
    opacity: 0.08 + Math.random() * 0.14,
  })), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "#F5A623",
            opacity: p.opacity,
          }}
          animate={{ y: [0, -40, 0], opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Cursor spotlight ─── */
function CursorSpotlight({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    const leave = () => { x.set(-300); y.set(-300); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [x, y, containerRef]);

  return (
    <motion.div
      className="pointer-events-none absolute z-10"
      style={{
        left: sx,
        top: sy,
        width: 500,
        height: 500,
        x: "-50%",
        y: "-50%",
        background: "radial-gradient(circle, rgba(245,166,35,0.055) 0%, transparent 65%)",
        borderRadius: "50%",
      }}
    />
  );
}

/* ─── Individual facility card ─── */
function FacilityCard({
  facility,
  index,
  className = "",
}: {
  facility: typeof FACILITIES[0];
  index: number;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 120, damping: 22 });
  const smy = useSpring(my, { stiffness: 120, damping: 22 });

  const rotX = useTransform(smy, [-0.5, 0.5], [4, -4]);
  const rotY = useTransform(smx, [-0.5, 0.5], [-5, 5]);
  const lightX = useTransform(smx, [-0.5, 0.5], ["20%", "80%"]);
  const lightY = useTransform(smy, [-0.5, 0.5], ["20%", "80%"]);

  const onMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
      style={{
        background: facility.gradient,
        border: "1px solid rgba(255,255,255,0.07)",
        transformStyle: "preserve-3d",
        rotateX: rotX,
        rotateY: rotY,
      }}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      animate={{
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(${facility.accentRgb},0.25), 0 0 40px rgba(${facility.accentRgb},0.08)`
          : `0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)`,
        y: hovered ? -6 : 0,
      }}
      whileHover={{ scale: 1.01 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
    >
      {/* Background image placeholder / gradient */}
      <div className="absolute inset-0">
        {facility.imageSrc ? (
          <motion.img
            src={facility.imageSrc}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          // Placeholder: visually rich gradient scene
          <motion.div
            className="absolute inset-0"
            style={{ background: facility.gradient }}
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Decorative geometric ambient */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 70%, rgba(${facility.accentRgb},0.3) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(${facility.accentRgb},0.15) 0%, transparent 45%)`,
              }}
            />
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Gradient overlay — always present */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* Light sweep on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle 220px at ${lightX} ${lightY}, rgba(${facility.accentRgb},0.12) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Shimmer sweep animation */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={hovered ? { x: ["−100%", "200%"] } : { x: "-100%" }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
        }}
      />

      {/* Accent border glow top */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        animate={{ opacity: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.4 }}
        style={{ background: `linear-gradient(to right, transparent, rgba(${facility.accentRgb},0.8), transparent)` }}
      />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-6 md:p-7"
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Icon */}
        <motion.div
          className="mb-4 flex"
          animate={{ scale: hovered ? 1.1 : 1, y: hovered ? -2 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{
              background: `rgba(${facility.accentRgb}, 0.12)`,
              border: `1px solid rgba(${facility.accentRgb}, 0.25)`,
              backdropFilter: "blur(8px)",
            }}
          >
            {facility.icon}
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h3
          className="mb-2 font-black leading-tight tracking-tight text-white"
          style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
          animate={{ opacity: hovered ? 1 : 0.9 }}
        >
          {facility.heading}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-xs leading-relaxed"
          style={{ color: "rgba(255,255,255,0.5)" }}
          animate={{ opacity: hovered ? 0.8 : 0.45 }}
          transition={{ duration: 0.35 }}
        >
          {facility.desc}
        </motion.p>

        {/* Hover CTA */}
        <motion.div
          className="mt-4 flex items-center gap-2"
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: facility.accent }}>
            Explore
          </span>
          <div className="h-px flex-1 max-w-[40px]" style={{ background: `rgba(${facility.accentRgb},0.5)` }} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Facilities component ─── */
export default function Facilities() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-80px" });

  // Map facilities to grid positions
  // Layout (desktop): 12-col grid
  // Row 1: turf(large=8col, 2row) | pitchvision(tall=4col, 3row)
  // Row 2: nets(medium=5col) | machine(small=3col)   | (pitchvision continues)
  // Row 3: fitness(medium=4col) | match(large=8col, 2row)
  // Row 4: (match continues)

  const turf       = FACILITIES[0]; // large
  const nets       = FACILITIES[1]; // medium
  const machine    = FACILITIES[2]; // small
  const pitchvision = FACILITIES[3]; // tall
  const fitness    = FACILITIES[4]; // medium
  const match      = FACILITIES[5]; // large

  return (
    <section
      id="facilities"
      className="relative py-24 md:py-32 overflow-hidden scroll-mt-28"
      style={{ background: "oklch(0.05 0.012 250)" }}
    >
      {/* Subtle background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.12 0.03 250 / 0.6) 0%, transparent 70%)",
        }}
      />

      <AmbientParticles />

      <div ref={containerRef} className="relative mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <CursorSpotlight containerRef={containerRef as React.RefObject<HTMLDivElement>} />

        {/* ── Section header ── */}
        <div ref={headerRef} className="mb-16 md:mb-20">
          <motion.div
            className="mb-5 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-px w-10" style={{ background: "rgba(245,166,35,0.6)" }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.45em]" style={{ color: "rgba(245,166,35,0.7)" }}>
              World-Class Infrastructure
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              className="font-black leading-[0.9] tracking-tight text-white"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Built for
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px rgba(245,166,35,0.7)",
                  color: "transparent",
                }}
              >
                Champions
              </span>
            </motion.h2>

            <motion.p
              className="max-w-xs text-sm leading-relaxed md:text-right"
              style={{ color: "rgba(255,255,255,0.4)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              Every surface, every tool, every square metre — designed to extract your best performance.
            </motion.p>
          </div>
        </div>

        {/* ── Bento Grid — Desktop ── */}
        <div
          className="hidden md:grid gap-3"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "280px 200px 200px 280px",
          }}
        >
          {/* Turf — large, rows 1-2, cols 1-8 */}
          <div style={{ gridColumn: "1 / 9", gridRow: "1 / 3" }}>
            <FacilityCard facility={turf} index={0} className="h-full" />
          </div>

          {/* PitchVision — tall, rows 1-3, cols 9-12 */}
          <div style={{ gridColumn: "9 / 13", gridRow: "1 / 4" }}>
            <FacilityCard facility={pitchvision} index={1} className="h-full" />
          </div>

          {/* Nets — medium, row 3, cols 1-7 */}
          <div style={{ gridColumn: "1 / 8", gridRow: "3 / 4" }}>
            <FacilityCard facility={nets} index={2} className="h-full" />
          </div>

          {/* Machine — small, row 3, cols 7-9 */}
          <div style={{ gridColumn: "8 / 9", gridRow: "3 / 4" }}>
            <FacilityCard facility={machine} index={3} className="h-full" />
          </div>

          {/* Fitness — medium, row 4, cols 1-5 */}
          <div style={{ gridColumn: "1 / 5", gridRow: "4 / 5" }}>
            <FacilityCard facility={fitness} index={4} className="h-full" />
          </div>

          {/* Match — large, row 4, cols 5-13 */}
          <div style={{ gridColumn: "5 / 13", gridRow: "4 / 5" }}>
            <FacilityCard facility={match} index={5} className="h-full" />
          </div>
        </div>

        {/* ── Bento Grid — Mobile ── */}
        <div className="grid md:hidden gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Turf — full width */}
          <div className="col-span-2 h-64">
            <FacilityCard facility={turf} index={0} className="h-full" />
          </div>
          {/* Nets */}
          <div className="col-span-1 h-52">
            <FacilityCard facility={nets} index={1} className="h-full" />
          </div>
          {/* PitchVision */}
          <div className="col-span-1 h-52">
            <FacilityCard facility={pitchvision} index={2} className="h-full" />
          </div>
          {/* Machine */}
          <div className="col-span-1 h-44">
            <FacilityCard facility={machine} index={3} className="h-full" />
          </div>
          {/* Fitness */}
          <div className="col-span-1 h-44">
            <FacilityCard facility={fitness} index={4} className="h-full" />
          </div>
          {/* Match — full width */}
          <div className="col-span-2 h-56">
            <FacilityCard facility={match} index={5} className="h-full" />
          </div>
        </div>

        {/* ── Bottom stat strip ── */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {[
            { value: "6", label: "Turf Pitches", accent: "#F5A623" },
            { value: "12", label: "Practice Lanes", accent: "#4FC3F7" },
            { value: "3", label: "Bowling Machines", accent: "#FF6B35" },
            { value: "2", label: "Floodlit Grounds", accent: "#FFD700" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1 py-8 px-4"
              style={{ background: "oklch(0.07 0.015 250)" }}
              whileHover={{ background: "oklch(0.09 0.02 250)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="text-4xl font-black" style={{ color: stat.accent }}>
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom transition gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, oklch(0.05 0.01 250))" }}
      />
    </section>
  );
}