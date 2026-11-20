import type { Metadata } from "next";
import { MarketingCmsPage } from "@/components/marketing/marketing-cms-page";

export const metadata: Metadata = {
  title: "Security | CareFlow Hospital Management",
  description: "Tenant isolation, clinical access control, PHI audit, and responsible disclosure for CareFlow."
};

export default function SecurityPage() {
  return <MarketingCmsPage route="security" />;
}
