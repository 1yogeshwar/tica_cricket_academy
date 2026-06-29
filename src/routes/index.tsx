import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/Hero";
import AcademySection from "@/components/AcademySection";
import Mentors from "@/components/Mentors";
// import Programs from "@/components/Program";
import Facility from "@/components/Facility"
import Achievement from "@/components/Achievement"

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
    <main className="bg-ink  text-foreground antialiased">
      <Hero />
      <AcademySection />
      <Mentors />
      {/* <Programs /> */}
      <Facility />
      <Achievement />
    </main>
  );
}
