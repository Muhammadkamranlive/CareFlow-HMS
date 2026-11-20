import type { Metadata } from "next";
import { MarketingCmsPage } from "@/components/marketing/marketing-cms-page";

export const metadata: Metadata = {
  title: "Contact us | CareFlow Hospital Management",
  description: "Talk with CareFlow about hospital onboarding. Support Monday–Friday, 8 a.m.–6 p.m. ET."
};

export default function ContactPage() {
  return <MarketingCmsPage route="contact" showContactForm />;
}
