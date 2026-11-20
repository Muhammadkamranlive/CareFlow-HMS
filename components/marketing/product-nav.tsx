"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductNav({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium transition",
          open ? "bg-[color:var(--bs-cloud)] text-[color:var(--bs-ink)]" : "text-slate-600 hover:bg-[color:var(--bs-cloud)] hover:text-[color:var(--bs-ink)]"
        )}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        CareFlow
        <ChevronDown className={cn("size-3.5 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="mkt-nav-panel absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(42rem,calc(100vw-2rem))] rounded-2xl border border-[color:var(--bs-line)] bg-white p-3 shadow-[0_24px_50px_rgba(10,37,64,0.12)]">
          <Link
            href="/#modules"
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[color:var(--bs-ink)] hover:bg-[color:var(--bs-cloud)]"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            CareFlow Hospital Management
            <span className="mt-0.5 block text-xs font-medium text-slate-500">
              Patients, wards, pharmacy, lab, and clinical billing
            </span>
          </Link>
          <Link
            href="/pricing"
            className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-[color:var(--bs-teal)] hover:bg-[color:var(--bs-cloud)]"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            Hospital plans
          </Link>
          <div className="mt-2 grid gap-1">
            {[
              { href: "/healthcare", label: "CareFlow", tagline: "Patients, OPD/IPD, EMR, pharmacy, lab, billing" },
              { href: "/settings", label: "Administration", tagline: "Users, roles, and access" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 transition hover:bg-[color:var(--bs-cloud)]"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                <span className="block text-[13px] font-semibold text-[color:var(--bs-ink)]">{item.label}</span>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{item.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
