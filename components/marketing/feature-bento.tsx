"use client";

import { useCallback } from "react";
import {
  FileSpreadsheet,
  History,
  LayoutDashboard,
  Layers3,
  ListChecks,
  Search,
  ShieldCheck,
  Smartphone,
  SlidersHorizontal,
  Workflow
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const cells = [
  {
    icon: Layers3,
    title: "One chart for the hospital",
    body:
      "Registration, OPD, wards, EMR, lab, radiology, pharmacy, and billing stay on the same patient — no side spreadsheets between desks.",
    span: "lg:col-span-2"
  },
  {
    icon: Workflow,
    title: "Front desk to discharge",
    body:
      "Appointments, OPD tokens, admissions, transfers, and discharge follow the visit. Nursing, vitals, and MAR sit on the inpatient stay.",
    span: "lg:col-span-2"
  },
  {
    icon: ShieldCheck,
    title: "Clinical access control",
    body:
      "Doctors, nurses, pharmacy, lab, and billing each see the menus their role allows. PHI access is audited, including break-glass.",
    span: "lg:col-span-2"
  },
  {
    icon: Search,
    title: "Find a patient or screen",
    body: "Search the hospital menus you are allowed to open. Patients, wards, orders, and invoices stay one click away."
  },
  {
    icon: SlidersHorizontal,
    title: "Extra fields on the chart",
    body: "Each hospital can add its own fields to patient and clinical forms without a developer."
  },
  {
    icon: History,
    title: "PHI audit trail",
    body: "Creates, updates, and exports are logged. Deleted clinical records go to the recycle bin with a name and a time."
  },
  {
    icon: FileSpreadsheet,
    title: "Lists, CSV, and discharge PDFs",
    body: "Export the filtered patient, order, or invoice list. Discharge summaries print from the admission."
  },
  {
    icon: ListChecks,
    title: "Charges that stay in balance",
    body:
      "Clinical invoices check line totals, tax, discount, and posted payments. A payment cannot exceed the open balance.",
    span: "lg:col-span-2"
  },
  {
    icon: Smartphone,
    title: "Usable on the ward phone",
    body: "The same CareFlow screens work at phone width for bedside lookup, not only at the front-desk desktop."
  },
  {
    icon: LayoutDashboard,
    title: "Occupancy and clinical revenue",
    body: "The hospital home shows patients, occupied beds, admissions, and collected clinical revenue from the live chart."
  }
];

export function FeatureBento() {
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <section id="platform" className="bg-[color:var(--bs-cloud)]">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mkt-eyebrow">Clinical workspace</p>
          <h2 className="mkt-display mt-3 text-3xl text-[color:var(--bs-ink)] sm:text-4xl">
            Built for the ward, the lab, and the billing desk
          </h2>
          <p className="mkt-muted mt-4 text-[15px] leading-7">
            CareFlow is a hospital product. Access, audit, exports, and extra chart fields are part of the clinical workspace.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cells.map((cell, i) => {
            const Icon = cell.icon;
            return (
              <Reveal key={cell.title} delay={i * 60} className={cell.span ?? ""}>
                <div className="mkt-bento h-full" onMouseMove={onMove}>
                  <span className="mkt-bento-icon">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold tracking-tight text-[color:var(--bs-ink)]">{cell.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{cell.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
