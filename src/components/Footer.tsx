"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  Clock,
  Share2,
  Camera,
  Video,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const navigationLinks = [
  { label: "Home", id: "top" },
  { label: "Academy", id: "academy" },
  { label: "Programs", id: "programs" },
  { label: "Mentors", id: "coaches" },
  { label: "Facilities", id: "facilities" },
  { label: "Gallery", id: "stories" },
  { label: "Testimonials", id: "testimonials" },
  { label: "Contact", id: "contact" },
];

const contactItems: Array<{ label: string; value: string; icon: LucideIcon }> = [
  { label: "Phone", value: "+91 98765 43210", icon: Phone },
  { label: "Email", value: "training@tica.academy", icon: Mail },
  { label: "Address", value: "TICA Performance Campus, India", icon: MapPin },
  { label: "Working Hours", value: "Mon - Sat, 6:00 AM - 8:00 PM", icon: Clock },
];

const socialLinks: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "Instagram", href: "#contact", icon: Camera },
  { label: "Facebook", href: "#contact", icon: Share2 },
  { label: "YouTube", href: "#contact", icon: Video },
  { label: "WhatsApp", href: "#contact", icon: MessageCircle },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: "smooth" });
}

function MagneticButton({
  children,
  variant = "primary",
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.45 });
  const y = useSpring(my, { stiffness: 260, damping: 22, mass: 0.45 });

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    my.set((event.clientY - rect.top - rect.height / 2) * 0.24);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.965, y: 0 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      className={[
        "group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-full px-7 text-xs font-semibold uppercase tracking-[0.24em] outline-none will-change-transform sm:px-8",
        variant === "primary"
          ? "text-ink shadow-[0_22px_60px_-24px_oklch(0.78_0.14_72/0.95)]"
          : "border border-white/12 bg-white/4.5 text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          background:
            variant === "primary"
              ? "linear-gradient(135deg, oklch(0.93 0.11 88), oklch(0.76 0.16 62) 48%, oklch(0.62 0.13 44))"
              : "linear-gradient(135deg, rgba(255,255,255,0.085), rgba(212,160,32,0.07), rgba(255,255,255,0.035))",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gold-soft/70 transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
      </span>
    </motion.button>
  );
}

function AmbientParticles({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: (index * 37 + 11) % 100,
        top: (index * 23 + 17) % 88,
        size: 1 + (index % 4) * 0.55,
        drift: index % 2 === 0 ? 20 : -18,
        duration: 18 + (index % 6) * 4,
        delay: index * 0.45,
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-gold-soft"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: "0 0 14px rgba(245,196,82,0.28)",
          }}
          initial={{ opacity: 0.04 }}
          animate={
            reduced
              ? { opacity: 0.06 }
              : {
                  x: [0, particle.drift, 0],
                  y: [0, -34, 0],
                  opacity: [0.025, 0.11, 0.035],
                }
          }
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function AcademyLogo() {
  return (
    <motion.div
      className="flex items-center gap-3"
      animate={{ scale: [1, 1.018, 1] }}
      transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="relative grid h-12 w-12 place-items-center rounded-full"
        style={{
          background: "var(--gradient-gold)",
          boxShadow: "0 18px 52px -26px oklch(0.78 0.14 72 / 0.9)",
        }}
      >
        <span className="text-display text-2xl text-ink">T</span>
        <span className="absolute inset-0 -z-10 rounded-full bg-gold/20 blur-2xl" />
      </div>
      <div className="leading-none">
        <div className="text-display text-3xl text-white">TICA</div>
        <div className="mt-1 text-[9px] uppercase tracking-[0.34em] text-gold-soft/62">Cricket Academy</div>
      </div>
    </motion.div>
  );
}

function FooterLink({ label, id }: { label: string; id: string }) {
  return (
    <button
      type="button"
      onClick={() => scrollToSection(id)}
      className="group flex min-h-9 w-fit items-center gap-3 text-left text-sm text-white/48 outline-none transition-colors duration-300 hover:text-white"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold opacity-0 transition-all duration-300 group-hover:opacity-100" />
      <span className="-translate-x-3 transition-transform duration-300 ease-out group-hover:translate-x-0">{label}</span>
    </button>
  );
}

function ContactRow({ item, index }: { item: (typeof contactItems)[number]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.div
      className="group flex gap-3"
      initial={{ opacity: 0.55 }}
      whileHover={{ opacity: 1, x: 3 }}
      transition={{ type: "spring", stiffness: 320, damping: 25 }}
    >
      <motion.span
        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/4.5 text-gold-soft"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4.5 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className="h-4 w-4" />
      </motion.span>
      <span>
        <span className="block text-[10px] uppercase tracking-[0.3em] text-white/30">{item.label}</span>
        <span className="mt-1 block text-sm leading-relaxed text-white/58 transition-colors duration-300 group-hover:text-white/78">
          {item.value}
        </span>
      </span>
    </motion.div>
  );
}

function SocialButton({ item, index }: { item: (typeof socialLinks)[number]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.a
      href={item.href}
      aria-label={item.label}
      title={item.label}
      className="grid h-12 w-12 place-items-center rounded-full border border-white/12 bg-white/5.5 text-white/64 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl outline-none"
      whileHover={{
        y: -4,
        rotate: index % 2 === 0 ? 2.5 : -2.5,
        color: "oklch(0.86 0.09 80)",
        boxShadow: "0 16px 46px -24px oklch(0.78 0.14 72 / 0.85), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
      whileTap={{ scale: 0.94, y: -1 }}
      transition={{ type: "spring", stiffness: 340, damping: 21 }}
    >
      <Icon className="h-4.5 w-4.5" />
    </motion.a>
  );
}

function ScrollToTopButton({ visible }: { visible: boolean }) {
  const [launching, setLaunching] = useState(false);

  const handleClick = () => {
    setLaunching(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => setLaunching(false), 900);
  };

  return (
    <motion.button
      type="button"
      aria-label="Scroll to top"
      onClick={handleClick}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 18, pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.45, ease: EASE }}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full border border-white/12 bg-black/36 shadow-[0_20px_60px_-26px_rgba(0,0,0,0.9)] backdrop-blur-xl outline-none sm:bottom-7 sm:right-7"
      whileHover={{ y: -3, boxShadow: "0 20px 58px -28px oklch(0.78 0.14 72 / 0.9)" }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        className="relative block h-7 w-7 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 28%, #fff0c8 0 8%, #d7a139 10% 32%, #9f572b 70%, #542917 100%)",
          boxShadow: "0 0 18px rgba(245,196,82,0.32)",
        }}
        animate={launching ? { y: [-1, -28, 0], rotate: [0, -70, 0] } : { rotate: [0, 8, 0] }}
        whileHover={{ rotate: 28 }}
        transition={
          launching
            ? { duration: 0.82, ease: EASE }
            : { rotate: { duration: 4.8, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <span className="absolute left-1.5 top-1/2 h-[82%] w-px -translate-y-1/2 rotate-18 rounded-full bg-white/42" />
        <span className="absolute right-1.5 top-1/2 h-[82%] w-px -translate-y-1/2 rotate-18 rounded-full bg-white/30" />
        <span className="absolute inset-1 rounded-full border border-white/10" />
      </motion.span>
    </motion.button>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, { once: false, margin: "-120px" });
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 26 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 26 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${smoothX}% ${smoothY}%, rgba(245,196,82,0.095), transparent 62%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <footer
      id="contact"
      ref={footerRef}
      onPointerMove={handlePointerMove}
      className="relative isolate overflow-hidden bg-[#020306] px-5 pb-10 pt-28 text-foreground sm:px-8 md:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-1 h-64"
        style={{ background: "linear-gradient(to bottom, #030507 0%, rgba(3,5,7,0.64) 38%, transparent 100%)" }}
      />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        animate={inView ? { backgroundPosition: ["0% 50%", "100% 52%", "0% 50%"] } : undefined}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(115deg, rgba(4,8,12,0.1), rgba(212,160,32,0.045), rgba(40,130,160,0.035), rgba(4,8,12,0.1))",
          backgroundSize: "220% 220%",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-12 h-176"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(245,166,35,0.22) 0%, rgba(245,166,35,0.095) 24%, transparent 66%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-52 h-40 opacity-45"
        style={{
          background:
            "repeating-linear-gradient(105deg, transparent 0 54px, rgba(255,221,142,0.035) 56px 57px, transparent 59px 116px)",
          transform: "perspective(900px) rotateX(58deg)",
        }}
      />
      <AmbientParticles active={inView} />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <motion.section
          className="mx-auto max-w-5xl py-10 text-center md:py-16"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 1.05, ease: EASE }}
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gold/50" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.5em] text-gold-soft/70">Final Over</span>
            <span className="h-px w-10 bg-gold/50" />
          </div>
          <h2 className="text-display mx-auto max-w-4xl text-[clamp(3.2rem,9vw,8rem)] text-white">
            Your Journey Begins Here
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/56 sm:text-lg">
            Train under experienced mentors, practice with world-class facilities, and become the next generation of
            champions.
          </p>
          <motion.div
            className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
          >
            <MagneticButton onClick={() => scrollToSection("courses")}>Join Academy</MagneticButton>
            <MagneticButton variant="secondary" onClick={() => scrollToSection("contact")}>
              Book a Trial Session
            </MagneticButton>
          </motion.div>
        </motion.section>

        <motion.div
          className="my-12 h-px bg-linear-to-r from-transparent via-gold/35 to-transparent shadow-[0_0_28px_rgba(245,196,82,0.12)] md:my-16"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.15, ease: EASE }}
        />

        <div className="grid gap-12 md:grid-cols-[1.35fr_0.9fr_1.25fr_0.8fr] md:gap-10 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <AcademyLogo />
            <p className="mt-7 max-w-sm text-sm leading-7 text-white/50">
              A focused cricket environment built for discipline, intelligent coaching, and the quiet confidence of
              athletes preparing for bigger stages.
            </p>
            <motion.div
              className="mt-7 h-px w-24 bg-linear-to-r from-gold to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>

          <motion.nav
            aria-label="Footer navigation"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } } }}
          >
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-white/82">Navigation</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 md:grid-cols-1">
              {navigationLinks.map((link) => (
                <motion.div
                  key={link.label}
                  variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.42, ease: EASE }}
                >
                  <FooterLink {...link} />
                </motion.div>
              ))}
            </div>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.32 }}
            transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
          >
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.34em] text-white/82">Contact</h3>
            <div className="space-y-5">
              {contactItems.map((item, index) => (
                <ContactRow key={item.label} item={item} index={index} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
          >
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.34em] text-white/82">Social</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item, index) => (
                <SocialButton key={item.label} item={item} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-16 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex flex-col gap-3 py-8 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Terminator International Cricket Academy</p>
          <p>Designed to inspire future champions.</p>
        </div>
      </motion.div>

      <ScrollToTopButton visible={inView} />
    </footer>
  );
}
