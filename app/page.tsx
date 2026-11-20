import type { Metadata } from "next";
import { LandingHome } from "@/components/marketing/landing-home";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CareFlow Hospital Management",
  description:
    "CareFlow is the hospital product: patients, OPD and IPD, EMR, pharmacy, lab, radiology, and clinical billing."
};

export default function HomePage() {
  return <LandingHome />;
}
