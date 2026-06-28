import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Award, Brain, Trophy, Target, ShieldCheck } from "lucide-react";
import founderPortrait from "@/assets/founder-portrait.jpg";
import founderSignature from "@/assets/founder-signature.png";

const MILESTONES = [
  { year: "NIS", title: "Certified Cricket Coach", body: "National Institute of Sports — formal coaching credential recognized across India." },
  { year: "20+", title: "Years Of Coaching", body: "Two decades shaping technique, mindset and match temperament across age groups." },
  { year: "500+", title: "Players Trained", body: "From first-time net sessions to district squads — every journey personally guided." },
  { year: "60+", title: "State & National Selections", body: "Students representing state academies, U-16, U-19 and national-level tournaments." },
];

const TRUST = [
  { icon: ShieldCheck, label: "NIS Certified", note: "Official national credential" },
  { icon: Brain, label: "Modern Methodology", note: "Video, data & biomechanics" },
  { icon: Target, label: "Tournament Prep", note: "Match-ready mental conditioning" },
  { icon: Trophy, label: "Proven Track Record", note: "State & national selections" },
  { icon: Award, label: "Professional Coaching", note: "One-to-one mentorship model" },
];

const QUOTE = ["Champions are built through", "discipline, consistency,", "and passion."];

function Milestone({ m, i }: { m: (typeof MILESTONES)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6 border-l border-white/10 pl-6 sm:pl-8"
    >
      <span className="absolute -left-[6px] top-2 h-3 w-3 rounded-full bg-[color:var(--gold)] shadow-[0_0_18px_oklch(0.78_0.14_72/0.9)]" />
      <div className="flex w-full flex-col gap-1 pb-10 sm:flex-row sm:items-baseline sm:gap-8">
        <p className="text-display shrink-0 text-3xl text-gold-gradient sm:w-28 sm:text-4xl">{m.year}</p>
        <div>
          <h4 className="text-lg font-medium text-foreground sm:text-xl">{m.title}</h4>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">{m.body}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });

  const portraitY = useTransform(smooth, [0, 1], [80, -80]);
  const portraitScale = useTransform(smooth, [0, 0.5, 1], [1.1, 1.02, 1.08]);
  const spotlightOpacity = useTransform(smooth, [0, 0.25, 0.6, 1], [0, 1, 1, 0.5]);
  const grainY = useTransform(smooth, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={sectionRef}
      id="founder"
      aria-label="The Founder"
      className="relative overflow-hidden bg-ink py-32 sm:py-40"
    >
      {/* Top fade from previous section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />

      {/* Spotlight glow */}
      <motion.div
        style={{ opacity: spotlightOpacity }}
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
      >
        <div
          className="h-full w-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.14 72 / 0.18), transparent 65%)",
            animation: "breathe 11s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* Grain / dust */}
      <motion.div
        style={{ y: grainY }}
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        aria-hidden
      >
        <svg width="100%" height="100%">
          <filter id="n">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" />
          </filter>
          <rect width="100%" height="100%" filter="url(#n)" />
        </svg>
      </motion.div>

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex items-center gap-4 text-[11px] uppercase tracking-[0.45em] text-[color:var(--gold-soft)]"
        >
          <span className="h-px w-12 bg-[color:var(--gold)]/60" />
          Meet The Mentor
        </motion.div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <div ref={portraitRef} className="relative">
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_120px_-30px_oklch(0_0_0/0.9)]"
              >
                <motion.img
                  src={founderPortrait}
                  alt="Founder & Head Coach portrait"
                  width={1280}
                  height={1600}
                  loading="lazy"
                  style={{ y: portraitY, scale: portraitScale }}
                  className="h-[70vh] min-h-[520px] w-full object-cover"
                />
                {/* warm grade */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, oklch(0.7 0.18 60 / 0.25), transparent 60%)",
                  }}
                />
                {/* Name plate */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--gold-soft)]">
                    Founder & Head Coach
                  </p>
                  <h3 className="text-display mt-2 text-4xl text-foreground sm:text-5xl">
                    R. Terminator
                  </h3>
                  <p className="mt-2 text-sm text-white/55">NIS Certified · 20+ years</p>
                </div>
              </motion.div>

              {/* floating credential */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute -right-4 -top-4 hidden rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-xl sm:block"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">Certification</p>
                <p className="text-sm font-medium text-foreground">NIS · Patiala</p>
              </motion.div>
            </div>
          </div>

          {/* Story */}
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-display text-[clamp(2.5rem,6vw,5.5rem)] text-foreground"
            >
              The Mentor Behind
              <br />
              <span className="text-gold-gradient">Every Champion.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-8 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
            >
              For over two decades, the academy has been led by a coach whose philosophy is simple —
              technique can be taught, but character must be built. Every session is designed to forge
              mindset before stroke, and players before personalities.
            </motion.p>

            {/* Milestones timeline */}
            <div className="mt-14">
              {MILESTONES.map((m, i) => (
                <Milestone key={m.title} m={m} i={i} />
              ))}
            </div>

            {/* Quote */}
            <div className="mt-12 border-l-2 border-[color:var(--gold)]/60 pl-6 sm:pl-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--gold-soft)]">
                Coaching Philosophy
              </p>
              <blockquote className="text-display mt-4 text-[clamp(1.75rem,3.6vw,3rem)] text-foreground">
                {QUOTE.map((line, i) => (
                  <span key={i} className="block overflow-hidden pb-[0.08em]">
                    <motion.span
                      initial={{ y: "110%" }}
                      whileInView={{ y: "0%" }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 1,
                        delay: i * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="block"
                    >
                      "{line}"
                    </motion.span>
                  </span>
                ))}
              </blockquote>

              <motion.img
                src={founderSignature}
                alt="Signature of the founder"
                width={1024}
                height={512}
                loading="lazy"
                initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 2.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 h-20 w-auto opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Trust panels */}
        <div className="mt-28">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-10 flex items-center gap-4 text-[11px] uppercase tracking-[0.45em] text-[color:var(--gold-soft)]"
          >
            <span className="h-px w-12 bg-[color:var(--gold)]/60" />
            Why Parents & Players Trust Us
          </motion.p>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {TRUST.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors hover:border-[color:var(--gold)]/40"
                style={{
                  animation: `breathe ${8 + i}s ease-in-out ${i * 0.4}s infinite`,
                }}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[color:var(--gold)]/10 blur-2xl transition-opacity duration-500 group-hover:bg-[color:var(--gold)]/30" />
                <t.icon className="relative h-6 w-6 text-[color:var(--gold)]" />
                <p className="relative mt-4 text-sm font-medium text-foreground">{t.label}</p>
                <p className="relative mt-1 text-xs text-white/50">{t.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
