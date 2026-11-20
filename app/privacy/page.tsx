import type { Metadata } from "next";
import { MarketingCmsPage } from "@/components/marketing/marketing-cms-page";

export const metadata: Metadata = {
  title: "Privacy policy | CareFlow",
  description: "How CareFlow Health, Inc. collects, uses, and protects personal and clinical information."
};

export default function PrivacyPage() {
  return <MarketingCmsPage route="privacy" />;
}
