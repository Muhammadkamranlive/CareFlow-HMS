import type { Metadata } from "next";
import { MarketingCmsPage } from "@/components/marketing/marketing-cms-page";

export const metadata: Metadata = {
  title: "Terms of service | CareFlow",
  description: "The agreement that governs your use of CareFlow Hospital Management."
};

export default function TermsPage() {
  return <MarketingCmsPage route="terms" />;
}
