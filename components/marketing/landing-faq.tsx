"use client";

import { Plus } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

const faqs = [
  {
    q: "Can we host CareFlow ourselves?",
    a: "Yes. Beyond shared cloud, we offer dedicated cloud or VPS, licensed self-hosting, and fully offline intranet installs for hospitals that cannot depend on the public internet. Talk to sales to scope installation and upgrades."
  },
  {
    q: "What does an intranet deployment mean?",
    a: "CareFlow runs inside the hospital network with no internet dependency — typical for wards and theatres that stay offline. It is available with any package tier."
  },
  {
    q: "What is included?",
    a: "CareFlow is the hospital workspace: patients and MRN, appointments and OPD, emergency, wards and beds, admissions, nursing and vitals, EMR, prescriptions, pharmacy, lab, radiology, claims, and clinical billing. Administration covers users and access."
  },
  {
    q: "Who uses which screens?",
    a: "Front desk, clinicians, pharmacy, lab, and billing each open only the menus their role allows. Company administrators manage users, roles, and the subscription."
  },
  {
    q: "How does access control work?",
    a: "Every menu registers view / create / update / delete rights. You assign role-level defaults (for example doctor, nurse, pharmacist, or billing) and can override per user. Effective rights are the merge of both — the user override wins."
  },
  {
    q: "Can each company customize forms?",
    a: "Yes — every tenant can add extra fields to fixed module forms (text, number, date, select) without a developer. Field answers are stored per record and appear on lists and printouts."
  },
  {
    q: "Is our data isolated from other customers?",
    a: "On shared SaaS, every row is tenant-scoped in Postgres with row-level isolation. Dedicated, self-hosted, and intranet deployments give you a completely separate database and stack."
  },
  {
    q: "Does it work on phones?",
    a: "Every screen is responsive down to phone width, and the same codebase is Capacitor-ready for native mobile shells. Tables scroll inside cards; forms stack; touch targets meet accessibility sizes."
  },
  {
    q: "Can we start on cloud and move to self-hosted later?",
    a: "Yes. Your data and configuration are portable across deployment models. Many customers start on shared SaaS and migrate to a dedicated or self-hosted stack as they scale."
  }
];

export function LandingFaq() {
  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <Reveal className="text-center">
          <p className="mkt-eyebrow">Questions</p>
          <h2 className="mkt-display mt-3 text-3xl text-[color:var(--bs-ink)] sm:text-4xl">
            Everything buyers ask before the demo
          </h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 40}>
              <details className="mkt-faq-item">
                <summary>
                  {item.q}
                  <Plus className="mkt-faq-chevron size-4" aria-hidden />
                </summary>
                <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
