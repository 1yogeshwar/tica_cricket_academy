import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/Hero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TICA — Terminator International Cricket Academy" },
      {
        name: "description",
        content:
          "Elite cricket coaching at Terminator International Cricket Academy. Train with world-class coaches and turn your cricket dreams into reality.",
      },
      { property: "og:title", content: "TICA — Terminator International Cricket Academy" },
      {
        property: "og:description",
        content: "Where raw talent meets world-class coaching. Join the next generation of cricket champions.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-ink text-foreground">
      <Hero />
      {/* Placeholder so scroll cue has somewhere to go */}
      <section className="min-h-[60vh] border-t border-white/5 bg-ink px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Phase 1 — Hero complete</p>
          <h2 className="text-display mt-4 text-5xl text-foreground sm:text-7xl">
            The rest of the journey<br />awaits in <span className="text-gold-gradient">Phase 2</span>.
          </h2>
        </div>
      </section>
    </main>
  );
}
