import type { Metadata } from "next";
import { MarketingCmsPage } from "@/components/marketing/marketing-cms-page";

export const metadata: Metadata = {
  title: "About | CareFlow Hospital Management",
  description: "CareFlow Hospital Management — the clinical workspace for hospitals and clinics."
};

export default function AboutPage() {
  return <MarketingCmsPage route="about" />;
}
