import { auditInvoiceSet } from "../modules/healthcare/services/hms-ledger.ts";

const balanced = auditInvoiceSet(
  [
    {
      id: "inv-1",
      invoice_no: "HMS-1",
      status: "partially_paid",
      subtotal: 120,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 120,
      paid_amount: 40,
      lines: [
        { quantity: 1, unit_price: 80, line_total: 80 },
        { quantity: 1, unit_price: 40, line_total: 40 }
      ]
    }
  ],
  [{ invoice_id: "inv-1", amount: 40 }]
);

if (!balanced.balanced || balanced.chargesCents !== 12000 || balanced.paymentsCents !== 4000 || balanced.openCents !== 8000) {
  console.error("Expected a balanced partial invoice.", balanced);
  process.exit(1);
}

const broken = auditInvoiceSet(
  [
    {
      id: "inv-2",
      invoice_no: "HMS-2",
      status: "paid",
      subtotal: 50,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 80,
      paid_amount: 80,
      lines: [{ quantity: 1, unit_price: 50, line_total: 50 }]
    }
  ],
  [{ invoice_id: "inv-2", amount: 80 }]
);

if (broken.balanced || !broken.issues.some((issue) => issue.message.includes("does not equal subtotal"))) {
  console.error("Expected a total mismatch.", broken);
  process.exit(1);
}

const unpaid = auditInvoiceSet(
  [
    {
      id: "inv-3",
      invoice_no: "HMS-3",
      status: "paid",
      subtotal: 20,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 20,
      paid_amount: 20,
      lines: [{ quantity: 1, unit_price: 20, line_total: 20 }]
    }
  ],
  []
);

if (unpaid.balanced || !unpaid.issues.some((issue) => issue.message.includes("posted payments"))) {
  console.error("Expected paid amount to disagree with posted payments.", unpaid);
  process.exit(1);
}

console.log(
  `ledger ok · charges ${balanced.chargesCents}¢ · paid ${balanced.paymentsCents}¢ · open ${balanced.openCents}¢ · caught ${broken.issues.length + unpaid.issues.length} imbalances`
);
