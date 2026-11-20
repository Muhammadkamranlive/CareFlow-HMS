"use client";

import { Star } from "lucide-react";
import { mediaUrl } from "@/lib/marketing-media";
import { Reveal } from "@/components/marketing/reveal";
import { useLandingMedia } from "@/components/marketing/use-landing-media";

const quotes = [
  {
    quote:
      "Front desk, ward, and pharmacy finally share one chart. We stopped retyping the MRN between three systems.",
    name: "Medical Director",
    company: "General hospital"
  },
  {
    quote:
      "OPD tokens and the pharmacy queue are on the same patient. Auditors stopped asking for the spreadsheet export.",
    name: "Chief Pharmacist",
    company: "Clinic network"
  },
  {
    quote:
      "Bed status is visible before we admit. Housekeeping and nursing are no longer calling each other for a free bed.",
    name: "Nursing Lead",
    company: "Inpatient ward"
  },
  {
    quote:
      "We run CareFlow on the hospital intranet. Theatres stay offline, and the chart is still there.",
    name: "IT Lead",
    company: "Private hospital"
  },
  {
    quote:
      "Billing sees the encounter lines. A payment cannot post above the open balance, which closed a month of disputes.",
    name: "Billing Supervisor",
    company: "Outpatient clinic"
  },
  {
    quote:
      "The recycle bin and audit log saved us in a dispute. Every change had a name and a timestamp attached.",
    name: "Head of Compliance",
    company: "Healthcare network"
  }
];

export function Testimonials() {
  const media = useLandingMedia();
  const loop = [...quotes, ...quotes];
  return (
    <section className="border-t border-[color:var(--bs-line)] bg-[color:var(--bs-cloud)] py-16 md:py-24">
      <Reveal className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <p className="mkt-eyebrow">What operators say</p>
          <h2 className="mkt-display mt-3 text-3xl text-[color:var(--bs-ink)] sm:text-4xl">
            Used on the ward, not only at the front desk
          </h2>
          <p className="mkt-muted mt-4 max-w-lg text-base leading-7">
            Hospitals and clinics run the day on CareFlow —
            from the front desk to the ward. Here is what their teams tell us.
          </p>
        </div>
        <div className="mkt-testimonial-photo">
          <img
            src={mediaUrl("testimonials.photo", media)}
            alt="CareFlow hospital workspace — clinicians reviewing the patient chart"
            width={1200}
            height={900}
          />
        </div>
      </Reveal>

      <div className="mkt-marquee mkt-marquee-slow mt-12">
        <div className="mkt-marquee-track px-4">
          {loop.map((q, i) => (
            <figure key={`${q.name}-${i}`} className="mkt-quote-card">
              <div className="flex gap-0.5 text-amber-400" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-[15px] leading-6 text-[color:var(--bs-ink)]">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4">
                <p className="text-sm font-semibold text-[color:var(--bs-ink)]">{q.name}</p>
                <p className="text-xs text-slate-500">{q.company}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
