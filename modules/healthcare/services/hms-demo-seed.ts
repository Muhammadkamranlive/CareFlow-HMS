import { isClientDatabasePrimary } from "@/lib/database-mode";
import { admitPatient, createBed, createWard } from "@/modules/healthcare/services/hms-clinical.store";
import {
  createEncounter,
  createInvoice,
  createPatient,
  listPatients,
  recordPayment
} from "@/modules/healthcare/services/hms.store";

const seeded = new Set<string>();

/**
 * In-memory chart for standalone runs (no Supabase).
 * One paid-in-part invoice so the billing ledger has a real open balance.
 */
export function ensureStandaloneHmsDemo(tenantId: string) {
  if (typeof window === "undefined") return;
  if (isClientDatabasePrimary()) return;
  if (seeded.has(tenantId) || listPatients(tenantId).length > 0) {
    seeded.add(tenantId);
    return;
  }
  seeded.add(tenantId);

  const outpatient = createPatient(tenantId, {
    full_name: "Noor Fatima",
    dob: "1992-04-18",
    gender: "female",
    phone: "+971500000101",
    email: "noor.fatima@example.com",
    national_id: null,
    address: "Demo clinic catchment",
    blood_group: "O+",
    emergency_contact_name: "Ali Fatima",
    emergency_contact_phone: "+971500000102",
    insurance_payer: "CareFlow Demo Payer",
    insurance_policy_no: "CF-1001",
    insurance_group_no: null,
    guardian_patient_id: null,
    status: "active",
    actor: "local-demo",
    consent: { consent_type: "treatment", version: "1.0", signed_by: "Noor Fatima" }
  });

  const inpatient = createPatient(tenantId, {
    full_name: "Hassan Qureshi",
    dob: "1978-11-02",
    gender: "male",
    phone: "+971500000201",
    email: "hassan.qureshi@example.com",
    national_id: null,
    address: "Demo clinic catchment",
    blood_group: "A+",
    emergency_contact_name: "Sara Qureshi",
    emergency_contact_phone: "+971500000202",
    insurance_payer: "CareFlow Demo Payer",
    insurance_policy_no: "CF-1002",
    insurance_group_no: null,
    guardian_patient_id: null,
    status: "active",
    actor: "local-demo",
    consent: { consent_type: "treatment", version: "1.0", signed_by: "Hassan Qureshi" }
  });

  const encounter = createEncounter(tenantId, {
    encounter_type: "opd",
    patient_id: outpatient.id,
    patient_name: outpatient.full_name,
    doctor_name: "Dr. Amina Rahman",
    department: "General medicine",
    queue_status: "completed",
    visit_date: new Date().toISOString().slice(0, 10),
    chief_complaint: "Follow-up consultation",
    appointment_id: null,
    status: "closed",
    actor: "local-demo"
  });

  const invoice = createInvoice(tenantId, {
    patient_id: outpatient.id,
    patient_name: outpatient.full_name,
    encounter_id: encounter.id,
    tax_rate: 0,
    actor: "local-demo",
    lines: [
      { description: "OPD consultation", category: "consultation", quantity: 1, unit_price: 80 },
      { description: "CBC lab", category: "lab", quantity: 1, unit_price: 40 }
    ]
  });
  recordPayment(tenantId, invoice.id, 40, "cash", "local-demo");

  const ward = createWard(tenantId, {
    branch_id: null,
    code: "GW-1",
    name: "General ward",
    ward_type: "general"
  });
  const occupied = createBed(tenantId, { ward_id: ward.id, bed_no: "GW-1-01", status: "available" });
  createBed(tenantId, { ward_id: ward.id, bed_no: "GW-1-02", status: "available" });
  admitPatient(tenantId, {
    patient_id: inpatient.id,
    patient_name: inpatient.full_name,
    encounter_id: null,
    ward_id: ward.id,
    bed_id: occupied.id,
    admitted_at: new Date().toISOString(),
    admission_type: "elective",
    attending_doctor: "Dr. Amina Rahman",
    actor: "local-demo"
  });
}
