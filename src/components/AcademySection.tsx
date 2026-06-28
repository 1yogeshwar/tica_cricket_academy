import { useIsMobile } from "@/hooks/use-mobile";
import Academy from "./Academy";
import AcademyMobile from "./AcademyMobile";

export default function AcademySection() {
  const isMobile = useIsMobile();
  // Avoid SSR mismatch: render desktop variant until hook resolves
  if (isMobile === undefined) return <Academy />;
  return isMobile ? <AcademyMobile /> : <Academy />;
}
