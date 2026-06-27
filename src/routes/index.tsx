import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/Hero";
import Academy from "@/components/Academy";

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
      <Academy />
      <section className="min-h-[40vh] border-t border-white/5 bg-ink px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Next — Programs</p>
        </div>
      </section>
    </main>
  );
}
