import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mentor = {
  id: number;
  name: string;
  role: string;
  specialization: string;
  experience: string;
  certifications: string[];
  philosophy: string;
  expertise: string[];
  accentHue: string;
  portrait: string;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const MENTORS: Mentor[] = [
  {
    id: 0,
    name: "Rajesh Verma",
    role: "Head Coach & Founder",
    specialization: "Batting & Strategy",
    experience: "22 Years",
    certifications: ["NIS Patiala", "BCCI Level 3", "ECB Advanced"],
    philosophy:
      "Technique is the foundation, but temperament is the fortress. I train cricketers who can construct innings under pressure, not just conditions.",
    expertise: ["Top-order Batting", "Game Strategy", "Mental Conditioning", "Youth Development"],
    accentHue: "42",
    portrait: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=900&q=80&fit=crop",
  },
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Fast Bowling Coach",
    specialization: "Pace & Swing Bowling",
    experience: "15 Years",
    certifications: ["NIS Patiala", "BCCI Level 2"],
    philosophy:
      "Pace is a gift, but seam position is a craft. Every delivery is a decision — I teach bowlers to think before they run in.",
    expertise: ["Pace Development", "Swing & Seam", "Death Bowling", "Injury Prevention"],
    accentHue: "200",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&fit=crop",
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Spin & Fielding Coach",
    specialization: "Spin Bowling & Fielding",
    experience: "12 Years",
    certifications: ["BCCI Level 2", "Sports Science Diploma"],
    philosophy:
      "Fielding wins matches nobody talks about. A sharp stop, a direct hit, a diving catch — these moments are built in training, one rep at a time.",
    expertise: ["Spin Variations", "Ground Fielding", "Catching Drills", "Agility Training"],
    accentHue: "280",
    portrait: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80&fit=crop",
  },
  {
    id: 3,
    name: "Suresh Kumar",
    role: "Wicket-Keeping Coach",
    specialization: "Wicket Keeping & Leadership",
    experience: "18 Years",
    certifications: ["NIS Patiala", "BCCI Level 3"],
    philosophy:
      "The keeper is the captain's eyes behind the stumps. Anticipation, positioning, and communication are my three pillars.",
    expertise: ["Glove Work", "Standing Up to Spinners", "Leadership", "Reading the Game"],
    accentHue: "150",
    portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=900&q=80&fit=crop",
  },
  {
    id: 4,
    name: "Amit Sharma",
    role: "Fitness & Performance Coach",
    specialization: "Athletic Conditioning",
    experience: "10 Years",
    certifications: ["NSCA CSCS", "Sports Nutrition Cert", "BCCI Fitness Panel"],
    philosophy:
      "A cricketer who can't last Day 5 can't be trusted in a Test match. Fitness is not a supplement — it is the base of everything else.",
    expertise: ["Strength & Power", "Endurance", "Speed & Agility", "Injury Rehab"],
    accentHue: "0",
    portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&fit=crop",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Particles({ count = 28 }: { count?: number }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: 14 + Math.random() * 20,
      delay: Math.random() * -30,
    }))
  );
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
      aria-hidden
    >
      {particles.current.map((p) => (
        <circle
          key={p.id}
          cx={`${p.x}%`}
          cy={`${p.y}%`}
          r={p.size}
          fill="oklch(0.78 0.14 72)"
          style={{
            animation: `floatParticle ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </svg>
  );
}

function CertBadge({ label, i }: { label: string; i: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/[0.07] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-amber-300/80"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
      {label}
    </motion.span>
  );
}

function ExpertiseTag({ label, i }: { label: string; i: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.7 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2.5 text-sm text-white/55"
    >
      <span className="h-px w-4 bg-amber-400/50 shrink-0" />
      {label}
    </motion.li>
  );
}

// ─── Magnetic Portrait (thumbnail) ──────────────────────────────────────────

function ThumbPortrait({
  mentor,
  active,
  onClick,
}: {
  mentor: Mentor;
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const r = ref.current!.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 14);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-label={`View ${mentor.name}`}
      aria-pressed={active}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="group relative shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <motion.span
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-400/40 via-amber-300/20 to-transparent blur-sm"
      />
      <div
        className={`relative overflow-hidden rounded-xl border transition-colors duration-500 ${
          active ? "border-amber-400/60" : "border-white/10 group-hover:border-amber-400/30"
        }`}
      >
        <img
          src={mentor.portrait}
          alt={mentor.name}
          className={`h-20 w-16 object-cover transition-all duration-700 sm:h-24 sm:w-20 ${
            active
              ? "scale-105 brightness-95 saturate-100"
              : "scale-100 brightness-[0.55] saturate-50 group-hover:brightness-75 group-hover:saturate-75"
          }`}
        />
        {active && (
          <motion.div
            layoutId="activeBar"
            className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0"
          />
        )}
      </div>
    </motion.button>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Coaches() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const mentor = MENTORS[activeIdx];

  const portraitMx = useMotionValue(0);
  const portraitMy = useMotionValue(0);
  const portraitSx = useSpring(portraitMx, { stiffness: 60, damping: 18 });
  const portraitSy = useSpring(portraitMy, { stiffness: 60, damping: 18 });
  const tiltX = useTransform(portraitSy, [-30, 30], [4, -4]);
  const tiltY = useTransform(portraitSx, [-30, 30], [-4, 4]);

  const spotX = useMotionValue(50);
  const spotY = useMotionValue(30);
  const smoothSpotX = useSpring(spotX, { stiffness: 40, damping: 22 });
  const smoothSpotY = useSpring(spotY, { stiffness: 40, damping: 22 });

  const sectionRef = useRef<HTMLElement>(null);

  function handlePortraitMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    portraitMx.set((e.clientX - r.left - r.width / 2) * 0.4);
    portraitMy.set((e.clientY - r.top - r.height / 2) * 0.4);
  }
  function handlePortraitLeave() {
    portraitMx.set(0);
    portraitMy.set(0);
  }

  function handleSectionMove(e: React.MouseEvent<HTMLElement>) {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    spotX.set(((e.clientX - r.left) / r.width) * 100);
    spotY.set(((e.clientY - r.top) / r.height) * 100);
  }

  const selectMentor = useCallback(
    (idx: number) => {
      if (idx === activeIdx) return;
      setDirection(idx > activeIdx ? 1 : -1);
      setActiveIdx(idx);
    },
    [activeIdx]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        selectMentor((activeIdx + 1) % MENTORS.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        selectMentor((activeIdx - 1 + MENTORS.length) % MENTORS.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, selectMentor]);

  const touchStartX = useRef(0);
  function handleTouchStart(e: React.TouchEvent<HTMLElement>) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent<HTMLElement>) {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      dx < 0
        ? selectMentor((activeIdx + 1) % MENTORS.length)
        : selectMentor((activeIdx - 1 + MENTORS.length) % MENTORS.length);
    }
  }

  const infoVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 24 : -24,
      filter: "blur(6px)",
    }),
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -24 : 24,
      filter: "blur(6px)",
    }),
  };

  const portraitVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.08,
      x: dir > 0 ? 60 : -60,
      clipPath: "inset(0 100% 0 0)",
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      clipPath: "inset(0 0% 0 0)",
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.94,
      x: dir > 0 ? -60 : 60,
      clipPath: "inset(0 100% 0 0)",
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="coaches"
      aria-label="Meet Our Mentors"
      className="relative min-h-screen overflow-hidden bg-[#080809] py-16 sm:py-20 scroll-mt-20"
      onMouseMove={handleSectionMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          100% { transform: translateY(-40px) translateX(20px); opacity: 0.7; }
        }
        @keyframes breatheGlow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.85; }
        }
      `}</style>

      <Particles />

      {/* Ambient spotlight following mouse */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: useTransform(
            [smoothSpotX, smoothSpotY],
            ([x, y]) =>
              `radial-gradient(ellipse 55% 40% at ${x}% ${y}%, oklch(0.62 0.12 ${mentor.accentHue} / 0.12), transparent 70%)`
          ),
        }}
        aria-hidden
      />

      {/* Fixed accent glow behind active mentor */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${mentor.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none absolute left-[28%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70vh] w-[70vh] rounded-full"
          style={{
            background: `radial-gradient(circle, oklch(0.7 0.15 ${mentor.accentHue} / 0.13) 0%, transparent 65%)`,
            animation: "breatheGlow 8s ease-in-out infinite",
          }}
          aria-hidden
        />
      </AnimatePresence>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mb-10 flex items-center gap-4 text-[10px] uppercase tracking-[0.45em] text-amber-400/60 sm:mb-14"
        >
          <span className="h-px w-10 bg-amber-400/40" />
          Elite Mentors
          <span className="h-px w-10 bg-amber-400/40" />
        </motion.div>

        {/* ── Desktop layout ───────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:items-stretch lg:gap-10 xl:gap-16">
          {/* LEFT — Portrait spotlight */}
          <div className="relative w-[46%] shrink-0">
            <div
              className="relative h-[78vh] min-h-[580px] overflow-hidden rounded-3xl"
              onMouseMove={handlePortraitMove}
              onMouseLeave={handlePortraitLeave}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={mentor.id}
                  custom={direction}
                  variants={portraitVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
                >
                  <img
                    src={mentor.portrait}
                    alt={mentor.name}
                    className="h-full w-full object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/20 to-transparent" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 60% 10%, oklch(0.65 0.16 ${mentor.accentHue} / 0.22), transparent 55%)`,
                  transition: "background 1s ease",
                }}
              />

              {/* Name plate */}
              <div className="absolute inset-x-0 bottom-0 p-7 xl:p-9">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`plate-${mentor.id}`}
                    custom={direction}
                    variants={infoVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400/70">
                      {mentor.specialization}
                    </p>
                    <h2
                      className="mt-2 font-black uppercase leading-none tracking-tight text-white"
                      style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
                    >
                      {mentor.name}
                    </h2>
                    <p className="mt-1.5 text-sm text-white/50 tracking-wide">{mentor.role}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Experience badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`exp-${mentor.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute right-5 top-5 rounded-2xl border border-amber-400/25 bg-black/50 px-4 py-2.5 backdrop-blur-xl"
                >
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">Experience</p>
                  <p className="mt-0.5 text-lg font-bold tabular-nums text-amber-300">
                    {mentor.experience}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail rail */}
            <div className="mt-6 flex items-center gap-5 pl-2">
              <span className="text-[9px] uppercase tracking-[0.35em] text-white/30">
                {activeIdx + 1}/{MENTORS.length}
              </span>
              <div className="flex gap-3">
                {MENTORS.map((m, i) => (
                  <ThumbPortrait
                    key={m.id}
                    mentor={m}
                    active={i === activeIdx}
                    onClick={() => selectMentor(i)}
                  />
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                {(["←", "→"] as const).map((arrow, ai) => (
                  <button
                    key={arrow}
                    aria-label={ai === 0 ? "Previous mentor" : "Next mentor"}
                    onClick={() =>
                      selectMentor(
                        ai === 0
                          ? (activeIdx - 1 + MENTORS.length) % MENTORS.length
                          : (activeIdx + 1) % MENTORS.length
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:border-amber-400/40 hover:text-amber-300 active:scale-95"
                  >
                    {arrow}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Detailed info */}
          <div className="flex flex-1 flex-col justify-center py-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`info-${mentor.id}`}
                custom={direction}
                variants={infoVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-8"
              >
                <div>
                  <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-white/30">
                    Certifications
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.certifications.map((c, i) => (
                      <CertBadge key={c} label={c} i={i} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-white/30">
                    Coaching Philosophy
                  </p>
                  <motion.blockquote
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="border-l-2 border-amber-400/50 pl-5 text-[1.15rem] leading-relaxed text-white/80 xl:text-[1.3rem]"
                    style={{ fontStyle: "italic" }}
                  >
                    "{mentor.philosophy}"
                  </motion.blockquote>
                </div>

                <div>
                  <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-white/30">
                    Areas of Expertise
                  </p>
                  <ul className="flex flex-col gap-3">
                    {mentor.expertise.map((expertise, i) => (
                      <ExpertiseTag key={expertise} label={expertise} i={i} />
                    ))}
                  </ul>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-px origin-left bg-gradient-to-r from-amber-400/30 via-amber-400/10 to-transparent"
                />

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">Role</p>
                    <p className="mt-1 text-sm font-medium text-white/70">{mentor.role}</p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                      Specialization
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/70">
                      {mentor.specialization}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                      Experience
                    </p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-amber-300">
                      {mentor.experience}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile layout ────────────────────────────────────────────── */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden rounded-2xl" style={{ height: "55svh" }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`mob-img-${mentor.id}`}
                custom={direction}
                variants={portraitVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={mentor.portrait}
                  alt={mentor.name}
                  className="h-full w-full object-cover object-top"
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`mob-plate-${mentor.id}`}
                  custom={direction}
                  variants={infoVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-[9px] uppercase tracking-[0.35em] text-amber-400/70">
                    {mentor.specialization}
                  </p>
                  <h2 className="mt-1.5 text-3xl font-black uppercase leading-none tracking-tight text-white">
                    {mentor.name}
                  </h2>
                  <p className="mt-1 text-xs text-white/50">{mentor.role}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute right-4 top-4 rounded-xl border border-amber-400/20 bg-black/50 px-3 py-2 backdrop-blur-xl">
              <p className="text-[8px] uppercase tracking-widest text-white/35">Experience</p>
              <p className="text-base font-bold text-amber-300">{mentor.experience}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 pb-1">
            {MENTORS.map((m, i) => (
              <ThumbPortrait
                key={m.id}
                mentor={m}
                active={i === activeIdx}
                onClick={() => selectMentor(i)}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-[9px] uppercase tracking-[0.3em] text-white/25">
            Swipe or tap to explore
          </p>

          <div className="mt-7">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`mob-info-${mentor.id}`}
                custom={direction}
                variants={infoVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-wrap gap-2">
                  {mentor.certifications.map((c, i) => (
                    <CertBadge key={c} label={c} i={i} />
                  ))}
                </div>
                <blockquote className="border-l-2 border-amber-400/50 pl-4 text-[15px] leading-relaxed text-white/75 italic">
                  "{mentor.philosophy}"
                </blockquote>
                <ul className="flex flex-col gap-2.5">
                  {mentor.expertise.map((e, i) => (
                    <ExpertiseTag key={e} label={e} i={i} />
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress dots (mobile) */}
        <div
          className="mt-10 flex justify-center gap-2 lg:hidden"
          role="tablist"
          aria-label="Mentor navigation"
        >
          {MENTORS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Go to mentor ${i + 1}`}
              onClick={() => selectMentor(i)}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <motion.span
                animate={
                  i === activeIdx
                    ? { width: 24, backgroundColor: "rgb(251 191 36)" }
                    : { width: 6, backgroundColor: "rgba(255,255,255,0.2)" }
                }
                transition={{ duration: 0.4 }}
                className="block h-1.5 rounded-full"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}