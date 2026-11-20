"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PublicSiteShell } from "@/components/layout/public-site-shell";
import { PricingCards } from "@/components/billing/subscription-checkout";
import { Reveal } from "@/components/marketing/reveal";
import { MktCta } from "@/components/marketing/mkt-button";
import { LaptopFrame } from "@/components/marketing/screenshot-frame";
import { LandingHero } from "@/components/marketing/landing-hero";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { FeatureBento } from "@/components/marketing/feature-bento";
import { DeploymentOptions } from "@/components/marketing/deployment-options";
import { InfraCompare } from "@/components/marketing/infra-compare";
import { StatsBand } from "@/components/marketing/stats-band";
import { Testimonials } from "@/components/marketing/testimonials";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { ensureProductionSiteContent, listBlogs, type BlogPost } from "@/modules/cms/services/cms.store";
import type { BillingInterval } from "@/modules/billing/services/subscriptions.store";
import { screenshotForModule } from "@/lib/marketing-media";

const careAreas = [
  {
    slug: "patients",
    eyebrow: "Front desk",
    title: "Patients & OPD",
    summary: "MRN registration, appointments, tokens, and the live outpatient queue."
  },
  {
    slug: "wards",
    eyebrow: "Inpatient",
    title: "Wards, beds & admissions",
    summary: "Admit, transfer, and discharge. Bed status and housekeeping stay with the stay."
  },
  {
    slug: "emr",
    eyebrow: "Clinical",
    title: "EMR & orders",
    summary: "SOAP notes, problems, allergies, prescriptions, and allergy checks before a drug is issued."
  },
  {
    slug: "diagnostics",
    eyebrow: "Diagnostics",
    title: "Lab & radiology",
    summary: "Lab orders, results, and imaging requests on the same encounter."
  },
  {
    slug: "pharmacy",
    eyebrow: "Pharmacy",
    title: "Pharmacy & dispensing",
    summary: "Stock, expiry, and dispense from an issued prescription."
  },
  {
    slug: "billing",
    eyebrow: "Revenue",
    title: "Clinical billing",
    summary: "Encounter invoices stay in balance: charges, payments, and the open balance."
  }
];
import { useLandingMedia } from "@/components/marketing/use-landing-media";

export function LandingHome() {
  const router = useRouter();
  const media = useLandingMedia();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [interval, setInterval] = useState<BillingInterval>("year");
  useEffect(() => {
    ensureProductionSiteContent();
    setBlogs(listBlogs().slice(0, 3));
  }, []);

  return (
    <PublicSiteShell>
      <LandingHero />

      <TrustStrip />

      <section id="product" className="relative px-4 pb-4 pt-10 md:px-6">
        <Reveal className="mx-auto max-w-5xl">
          <LaptopFrame
            src={screenshotForModule("healthcare", media)}
            alt="CareFlow hospital workspace — patients, wards, pharmacy, and billing"
            href="/healthcare"
            label="CareFlow"
            hero
          />
        </Reveal>
      </section>

      <section id="modules" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mkt-eyebrow">Inside the hospital</p>
            <h2 className="mkt-display mt-3 text-3xl text-[color:var(--bs-ink)] sm:text-4xl">
              One clinical workspace, from registration to billing.
            </h2>
            <p className="mkt-muted mt-4 text-[15px] leading-7">
              CareFlow covers the hospital day: front desk, wards, the chart, diagnostics, pharmacy, and the invoice.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careAreas.map((item, i) => (
              <Reveal key={item.slug} delay={(i % 3) * 60}>
                <Link href="/healthcare" className="mkt-card block h-full p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--bs-teal)]">{item.eyebrow}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[color:var(--bs-ink)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                  <p className="mt-3 text-sm font-semibold text-[color:var(--bs-teal)]">
                    Open CareFlow <ArrowRight className="ml-1 inline size-3.5" />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FeatureBento />

      <StatsBand />

      <DeploymentOptions />

      <InfraCompare />

      <section id="pricing" className="border-t border-[color:var(--bs-line)] bg-[color:var(--bs-cloud)]">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="mkt-eyebrow">Pricing</p>
              <h2 className="mkt-display mt-4 text-3xl text-[color:var(--bs-ink)] sm:text-4xl">
                Hospital plans for the clinical workspace
              </h2>
              <p className="mkt-muted mt-4 text-sm leading-6">
                Silver through Platinum run CareFlow on shared cloud. Professional is a dedicated hospital deployment —
                cloud, VPS, self-hosted, or intranet. Every plan is the hospital product plus administration.
              </p>
            </div>
            <div className="inline-flex self-start rounded-full border border-[color:var(--bs-line)] bg-white p-1">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${interval === "month" ? "bg-[color:var(--bs-ink)] text-white shadow-sm" : "text-slate-600"}`}
                onClick={() => setInterval("month")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${interval === "year" ? "bg-[color:var(--bs-ink)] text-white shadow-sm" : "text-slate-600"}`}
                onClick={() => setInterval("year")}
              >
                Annual
              </button>
            </div>
          </div>
          <div className="mkt-pricing mt-12">
            <PricingCards
              appearance="marketing"
              interval={interval}
              onSelect={(pkg) => router.push(`/signup?plan=${pkg.code}&interval=${interval}`)}
            />
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Need the hospital on your own network?{" "}
            <Link href="/contact" className="font-semibold text-[color:var(--bs-teal)] hover:underline">
              Talk to sales
            </Link>
          </p>
        </div>
      </section>

      <Testimonials />

      <LandingFaq />

      {blogs.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="mb-8 flex items-end justify-between gap-3">
            <div>
              <p className="mkt-eyebrow">Insights</p>
              <h2 className="mkt-display mt-3 text-3xl text-[color:var(--bs-ink)]">From the CareFlow desk</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-[color:var(--bs-teal)] hover:underline">
              All articles
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {blogs.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group mkt-card block p-5">
                <h3 className="text-lg font-semibold text-[color:var(--bs-ink)] transition group-hover:text-[color:var(--bs-teal)]">{post.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-4 pb-20 md:px-6 md:pb-28">
        <div className="mkt-band mkt-dark-band mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] px-6 py-14 sm:px-12">
          <div className="mkt-beam" aria-hidden />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mkt-display max-w-xl text-3xl sm:text-4xl">
                Ready to run the hospital on one chart?
              </h2>
              <p className="mkt-muted mt-4 max-w-lg text-sm leading-6">
                Create the hospital, pick a plan, invite clinical staff — live on shared cloud in minutes. Need a
                dedicated or intranet deployment? Sales will map it in one call.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <MktCta href="/signup" variant="light" className="w-full sm:w-auto">
                Get started <ArrowRight className="size-4" />
              </MktCta>
              <MktCta href="/contact" variant="ghost" className="w-full border border-white/25 text-white hover:bg-white/10 sm:w-auto">
                Talk to sales
              </MktCta>
            </div>
          </div>
        </div>
      </section>
    </PublicSiteShell>
  );
}
