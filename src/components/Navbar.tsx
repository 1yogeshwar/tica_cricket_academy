import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, LayoutGroup } from "framer-motion";
import { Menu, X } from "lucide-react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Academy",    id: "academy"    },
  { label: "Programs",   id: "programs"   },
  { label: "Coaches",    id: "coaches"    },
  { label: "Facilities", id: "facilities" },
  { label: "Stories",    id: "stories"    },
];

const SCROLL_THRESHOLD   = 80;   // px before glass kicks in
const HIDE_THRESHOLD     = 60;   // px scrolled down before hiding
const SHOW_THRESHOLD     = 10;   // px scrolled up before showing

// ─── SMOOTH SCROLL ───────────────────────────────────────────────────────────

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 80; // navbar height + padding
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useScrollDirection() {
  const [visible, setVisible]   = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y     = window.scrollY;
        const delta = y - lastY.current;

        setScrolled(y > SCROLL_THRESHOLD);

        if (delta > HIDE_THRESHOLD / 3 && y > SCROLL_THRESHOLD) {
          setVisible(false);
        } else if (delta < -SHOW_THRESHOLD) {
          setVisible(true);
        }

        lastY.current   = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { visible, scrolled };
}

function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the greatest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

// ─── CTA BUTTON ──────────────────────────────────────────────────────────────

function EnrollButton({ compact = false }: { compact?: boolean }) {
  return (
    <motion.button
      whileHover={{ y: -1.5, boxShadow: "0 8px 28px -6px oklch(0.78 0.14 72 / 0.45)" }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      onClick={() => scrollToSection("programs")}
      className="relative overflow-hidden rounded-full text-ink font-semibold uppercase tracking-wider focus:outline-none"
      style={{
        background: "var(--gradient-gold)",
        fontSize: compact ? "10px" : "11px",
        padding: compact ? "7px 18px" : "8px 22px",
      }}
    >
      {/* Shimmer on hover */}
      <motion.span
        className="pointer-events-none absolute inset-0 -translate-x-full"
        style={{
          background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.18) 50%, transparent 60%)",
        }}
        whileHover={{ x: ["−100%", "200%"] }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />
      <span className="relative">Enroll</span>
    </motion.button>
  );
}

// ─── DESKTOP NAV LINK ─────────────────────────────────────────────────────────

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative rounded-full px-4 py-2 text-sm focus:outline-none"
      style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      {/* Hover pill */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: "oklch(1 0 0 / 0.05)" }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
      />

      {/* Active pill (shared layout) */}
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background: "oklch(1 0 0 / 0.07)",
            boxShadow: "inset 0 0 0 0.5px oklch(1 0 0 / 0.12)",
          }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
        />
      )}

      <motion.span
        className="relative z-10 transition-colors duration-200"
        animate={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}
        whileHover={{ color: "var(--foreground)" }}
      >
        {item.label}
      </motion.span>
    </motion.button>
  );
}

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────

function MobileMenu({
  open,
  onClose,
  activeId,
}: {
  open: boolean;
  onClose: () => void;
  activeId: string;
}) {
  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-40 flex flex-col"
          style={{ background: "oklch(0.06 0.005 250 / 0.92)" }}
          onClick={onClose}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pt-6 pb-4">
            <a href="#top" className="flex items-center gap-2.5" onClick={onClose}>
              <div
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: "var(--gradient-gold)" }}
              >
                <span className="text-base font-bold text-ink">T</span>
              </div>
              <div className="leading-tight">
                <div className="text-base font-semibold text-foreground">TICA</div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-white/40">Cricket Academy</div>
              </div>
            </a>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10"
              aria-label="Close menu"
            >
              <X className="h-4 w-4 text-white/70" />
            </motion.button>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-white/[0.06]" />

          {/* Menu items */}
          <nav className="flex flex-1 flex-col justify-center px-8 gap-1" onClick={(e) => e.stopPropagation()}>
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.38, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => { scrollToSection(item.id); onClose(); }}
                className="group flex items-center justify-between rounded-2xl px-4 py-4 text-left focus:outline-none"
                style={{
                  color: activeId === item.id ? "var(--foreground)" : "oklch(1 0 0 / 0.45)",
                  background: activeId === item.id ? "oklch(1 0 0 / 0.04)" : "transparent",
                }}
              >
                <span
                  className="text-[clamp(1.6rem,6vw,2.4rem)] font-light tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {item.label}
                </span>
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="text-white/20 text-sm"
                >
                  →
                </motion.span>
              </motion.button>
            ))}
          </nav>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="px-8 pb-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { scrollToSection("programs"); onClose(); }}
              className="w-full rounded-full py-4 text-sm font-semibold uppercase tracking-widest text-ink"
              style={{ background: "var(--gradient-gold)" }}
            >
              Enroll Now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── MAIN NAVBAR ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const { visible, scrolled } = useScrollDirection();
  const activeId              = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  return (
    <>
      {/* Google Font for mobile menu */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');`}</style>

      <LayoutGroup>
        <motion.header
          initial={{ y: -56, opacity: 0 }}
          animate={{
            y: visible ? 0 : -88,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            y:       { type: "spring", stiffness: 260, damping: 28 },
            opacity: { duration: 0.22, ease: "easeOut" },
          }}
          // Mount fade-in on first load
          style={{ "--initial-delay": "2.2s" } as React.CSSProperties}
          className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6"
        >
          {/* Outer wrapper — drives glass intensity via scrolled */}
          <motion.div
            animate={{
              paddingTop:    scrolled ? "8px"  : "10px",
              paddingBottom: scrolled ? "8px"  : "10px",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full max-w-6xl items-center justify-between rounded-full px-4 sm:px-5"
            style={{
              backdropFilter:  scrolled ? "blur(22px) saturate(160%)" : "blur(10px) saturate(120%)",
              WebkitBackdropFilter: scrolled ? "blur(22px) saturate(160%)" : "blur(10px) saturate(120%)",
              background:      scrolled
                ? "oklch(0.09 0.005 250 / 0.82)"
                : "oklch(0.09 0.005 250 / 0.35)",
              border:          scrolled
                ? "1px solid oklch(1 0 0 / 0.1)"
                : "1px solid oklch(1 0 0 / 0.055)",
              boxShadow:       scrolled
                ? "0 24px 64px -20px oklch(0 0 0 / 0.55), inset 0 0.5px 0 oklch(1 0 0 / 0.08)"
                : "0 8px 32px -12px oklch(0 0 0 / 0.3)",
              transition: "background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease",
            }}
          >
            {/* Logo */}
            <motion.a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex items-center gap-2.5 focus:outline-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            >
              <motion.div
                animate={{ scale: scrolled ? 1.06 : 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid h-8 w-8 place-items-center rounded-full sm:h-9 sm:w-9"
                style={{ background: "var(--gradient-gold)" }}
              >
                <span className="text-display text-base text-ink font-bold">T</span>
                <span
                  className="absolute inset-0 rounded-full blur-md -z-10 opacity-50"
                  style={{ background: "var(--gradient-gold)" }}
                />
              </motion.div>
              <div className="hidden sm:block leading-tight">
                <div className="text-display text-[15px] text-foreground">TICA</div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                  Cricket Academy
                </div>
              </div>
            </motion.a>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary navigation">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => handleNavClick(item.id)}
                />
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <EnrollButton compact={scrolled} />
              </div>

              {/* Mobile hamburger */}
              <motion.button
                whileTap={{ scale: 0.91 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] md:hidden focus:outline-none"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-4 w-4 text-white/70" />
              </motion.button>
            </div>
          </motion.div>
        </motion.header>
      </LayoutGroup>

      {/* Mobile full-screen menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeId={activeId}
      />
    </>
  );
}