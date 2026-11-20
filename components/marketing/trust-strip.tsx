"use client";

import { Activity, BedDouble, Building2, ClipboardPlus, FlaskConical, HeartPulse, Pill, Stethoscope } from "lucide-react";

const industries = [
  { icon: Building2, label: "Hospitals" },
  { icon: Stethoscope, label: "Outpatient clinics" },
  { icon: HeartPulse, label: "Inpatient wards" },
  { icon: Pill, label: "Hospital pharmacy" },
  { icon: Activity, label: "Emergency departments" },
  { icon: FlaskConical, label: "Labs & radiology" },
  { icon: BedDouble, label: "Bed management" },
  { icon: ClipboardPlus, label: "Clinical billing" }
];

export function TrustStrip() {
  const loop = [...industries, ...industries];
  return (
    <section className="border-y border-[color:var(--bs-line)] bg-white py-6" aria-label="Industries CareFlow serves">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        Built for hospitals and clinics
      </p>
      <div className="mkt-marquee">
        <div className="mkt-marquee-track">
          {loop.map((item, i) => {
            const Icon = item.icon;
            return (
              <span key={`${item.label}-${i}`} className="mkt-trust-chip">
                <Icon className="size-4 text-[color:var(--bs-teal)]" aria-hidden />
                {item.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
