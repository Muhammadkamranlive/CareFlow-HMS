"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ModuleBreadcrumbs } from "@/components/common/module-breadcrumbs";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { DataListToolbar } from "@/components/common/data-list-toolbar";
import { useConfirm } from "@/components/common/use-confirm";
import { Button, Field, Panel, SelectInput, TextInput } from "@/components/ui";
import { getStoredTenantId } from "@/lib/auth/session";
import { exportListCsv } from "@/lib/list-export";
import { filterAndSort } from "@/lib/list-query";
import { money } from "@/lib/utils";
import { ensureStandaloneHmsDemo } from "@/modules/healthcare/services/hms-demo-seed";
import { fromCents } from "@/modules/healthcare/services/hms-ledger";
import {
  auditClinicalLedger,
  createInvoice,
  listEncounters,
  listInvoices,
  listPatients,
  pullHmsFromSupabase,
  recordPayment,
  startHmsInvoiceCheckout,
  subscribeHms,
  type HmsInvoice
} from "@/modules/healthcare/services/hms.store";

export default function ClinicalBillingPage() {
  const tenantId = getStoredTenantId() ?? "alpha";
  const { askSave, dialog } = useConfirm();
  const [rows, setRows] = useState<HmsInvoice[]>([]);
  const [patients, setPatients] = useState(listPatients(tenantId));
  const [encounters, setEncounters] = useState(listEncounters(tenantId));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    patient_id: "",
    encounter_id: "",
    description: "OPD consultation",
    category: "consultation" as const,
    unit_price: "50",
    tax_rate: "0"
  });
  const [checkoutError, setCheckoutError] = useState("");

  function refresh() {
    setRows(listInvoices(tenantId));
    setPatients(listPatients(tenantId));
    setEncounters(listEncounters(tenantId));
  }
  useEffect(() => {
    ensureStandaloneHmsDemo(tenantId);
    void pullHmsFromSupabase(tenantId).finally(() => refresh());
    return subscribeHms(() => refresh());
  }, [tenantId]);

  const ledger = useMemo(() => auditClinicalLedger(tenantId), [tenantId, rows]);

  const filtered = useMemo(
    () =>
      filterAndSort(rows as unknown as Array<Record<string, unknown>>, {
        search,
        searchFields: ["invoice_no", "patient_name", "status"],
        statusField: "status",
        statusValue: statusFilter,
        sortField: "invoice_date",
        sortDir: "desc"
      }) as unknown as HmsInvoice[],
    [rows, search, statusFilter]
  );

  function doSave() {
    const patient = patients.find((p) => p.id === form.patient_id);
    if (!patient) return;
    createInvoice(tenantId, {
      patient_id: patient.id,
      patient_name: patient.full_name,
      encounter_id: form.encounter_id || null,
      tax_rate: Number(form.tax_rate) || 0,
      lines: [
        {
          description: form.description,
          category: form.category,
          quantity: 1,
          unit_price: Number(form.unit_price) || 0
        }
      ],
      actor: "billing"
    });
    setOpenForm(false);
    refresh();
  }

  return (
    <AppShell activeModule="healthcare">
      {dialog}
      <ModuleBreadcrumbs />
      <PageHeader
        title="Clinical billing"
        description="Encounter invoices stay in balance: line totals, tax, discount, posted payments, and status."
        actionLabel="New invoice"
        onAction={() => {
          setForm({
            patient_id: patients[0]?.id ?? "",
            encounter_id: "",
            description: "OPD consultation",
            category: "consultation",
            unit_price: "50",
            tax_rate: "0"
          });
          setOpenForm(true);
        }}
      />
      {openForm ? (
        <Panel className="mb-4">
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              askSave({ editing: false, entityLabel: "clinical invoice", onConfirm: doSave });
            }}
          >
            <Field label="Patient">
              <SelectInput value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })}>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.mrn} · {p.full_name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Encounter (optional)">
              <SelectInput value={form.encounter_id} onChange={(e) => setForm({ ...form, encounter_id: e.target.value })}>
                <option value="">None</option>
                {encounters
                  .filter((e) => !form.patient_id || e.patient_id === form.patient_id)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.encounter_no} · {e.visit_date}
                    </option>
                  ))}
              </SelectInput>
            </Field>
            <Field label="Line description">
              <TextInput value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Amount">
              <TextInput type="number" step="0.01" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} />
            </Field>
            <Field label="Tax rate (%)">
              <TextInput type="number" step="0.01" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} />
            </Field>
            <div className="md:col-span-2">
              <Button type="submit">Issue invoice</Button>
            </div>
          </form>
        </Panel>
      ) : null}
      <Panel className="mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Checks and balance</p>
            <p className="mt-1 text-sm text-ink">
              {ledger.invoiceCount} invoice{ledger.invoiceCount === 1 ? "" : "s"} · charges {money(fromCents(ledger.chargesCents))} · paid{" "}
              {money(fromCents(ledger.paymentsCents))} · open {money(fromCents(ledger.openCents))}
            </p>
          </div>
          <p className={`text-sm font-semibold ${ledger.balanced ? "text-emerald-700" : "text-amber-700"}`}>
            {ledger.balanced ? "Ledger in balance" : `${ledger.issues.length} imbalance${ledger.issues.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {ledger.issues.length ? (
          <ul className="mt-3 space-y-1 text-sm text-amber-800">
            {ledger.issues.slice(0, 6).map((issue) => (
              <li key={`${issue.invoiceNo}-${issue.message}`}>
                {issue.invoiceNo}: {issue.message}
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>
      {checkoutError ? (
        <Panel className="mb-4">
          <p className="text-sm text-amber-700">{checkoutError}</p>
        </Panel>
      ) : null}
      <Panel>
        <DataListToolbar
          search={search}
          onSearchChange={setSearch}
          filterValue={statusFilter}
          filterOptions={[
            { value: "issued", label: "Issued" },
            { value: "paid", label: "Paid" },
            { value: "partially_paid", label: "Partial" }
          ]}
          onFilterChange={setStatusFilter}
          onExportCsv={() =>
            exportListCsv({
              tenantId,
              module: "healthcare",
              filename: "clinical-invoices",
              rows: filtered.map((r) => ({
                Invoice: r.invoice_no,
                Patient: r.patient_name,
                Total: r.total_amount,
                Status: r.status
              }))
            })
          }
        />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2">Invoice</th>
                <th>Patient</th>
                <th>Total</th>
                <th>Balance</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-3 py-3 font-semibold">{row.invoice_no}</td>
                  <td>{row.patient_name}</td>
                  <td>
                    {money(row.total_amount)}
                    <div className="text-xs text-slate-500">Paid {money(row.paid_amount)}</div>
                  </td>
                  <td>{money(Math.max(0, row.total_amount - row.paid_amount))}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td>
                    {row.status !== "paid" ? (
                      <div className="flex flex-wrap gap-1">
                        <Button
                          type="button"
                          variant="primary"
                          className="!px-2 !py-1 text-xs"
                          onClick={() => {
                            setCheckoutError("");
                            void startHmsInvoiceCheckout(tenantId, row.id).catch((err) => {
                              setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
                              refresh();
                            });
                          }}
                        >
                          Pay with Stripe
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className="!px-2 !py-1 text-xs"
                          onClick={() => {
                            setCheckoutError("");
                            try {
                              const due = Math.round((row.total_amount - row.paid_amount) * 100) / 100;
                              recordPayment(tenantId, row.id, due, "card", "billing");
                              refresh();
                            } catch (err) {
                              setCheckoutError(err instanceof Error ? err.message : "Payment was rejected.");
                            }
                          }}
                        >
                          Record payment
                        </Button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
