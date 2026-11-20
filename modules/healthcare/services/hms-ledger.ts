/** Clinical invoice checks and balances — line math, tax, payments, and status. */

export type LedgerLine = {
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type LedgerInvoice = {
  id: string;
  invoice_no: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  lines: LedgerLine[];
};

export type LedgerPayment = {
  invoice_id: string;
  amount: number;
};

export type LedgerIssue = {
  invoiceNo: string;
  message: string;
};

export type LedgerAudit = {
  balanced: boolean;
  invoiceCount: number;
  chargesCents: number;
  paymentsCents: number;
  openCents: number;
  issues: LedgerIssue[];
};

export function toCents(amount: number) {
  return Math.round((Number.isFinite(amount) ? amount : 0) * 100);
}

export function fromCents(cents: number) {
  return Math.round(cents) / 100;
}

const OPEN_STATUSES = new Set(["issued", "partially_paid", "paid"]);

export function auditInvoiceSet(invoices: LedgerInvoice[], payments: LedgerPayment[]): LedgerAudit {
  const issues: LedgerIssue[] = [];
  let chargesCents = 0;
  let paymentsCents = 0;

  const paidByInvoice = new Map<string, number>();
  for (const payment of payments) {
    const cents = toCents(payment.amount);
    paidByInvoice.set(payment.invoice_id, (paidByInvoice.get(payment.invoice_id) ?? 0) + cents);
    if (cents <= 0) {
      issues.push({ invoiceNo: payment.invoice_id, message: "Payment amount must be greater than zero." });
    }
  }

  for (const invoice of invoices) {
    const label = invoice.invoice_no || invoice.id;
    let lineCents = 0;
    for (const line of invoice.lines) {
      const expected = toCents(line.quantity * line.unit_price);
      const actual = toCents(line.line_total);
      lineCents += actual;
      if (expected !== actual) {
        issues.push({
          invoiceNo: label,
          message: `Line total ${fromCents(actual).toFixed(2)} does not match quantity × price ${fromCents(expected).toFixed(2)}.`
        });
      }
      if (!(line.quantity > 0)) {
        issues.push({ invoiceNo: label, message: "Line quantity must be greater than zero." });
      }
      if (line.unit_price < 0) {
        issues.push({ invoiceNo: label, message: "Line price cannot be negative." });
      }
    }

    const subtotalCents = toCents(invoice.subtotal);
    const taxCents = toCents(invoice.tax_amount);
    const discountCents = toCents(invoice.discount_amount);
    const totalCents = toCents(invoice.total_amount);
    const paidCents = toCents(invoice.paid_amount);
    const paymentSum = paidByInvoice.get(invoice.id) ?? 0;
    const expectedTotal = subtotalCents + taxCents - discountCents;

    if (lineCents !== subtotalCents) {
      issues.push({
        invoiceNo: label,
        message: `Subtotal ${fromCents(subtotalCents).toFixed(2)} does not match line totals ${fromCents(lineCents).toFixed(2)}.`
      });
    }
    if (expectedTotal !== totalCents) {
      issues.push({
        invoiceNo: label,
        message: `Total ${fromCents(totalCents).toFixed(2)} does not equal subtotal + tax − discount ${fromCents(expectedTotal).toFixed(2)}.`
      });
    }
    if (discountCents < 0 || taxCents < 0 || totalCents < 0) {
      issues.push({ invoiceNo: label, message: "Tax, discount, and total cannot be negative." });
    }
    if (discountCents > subtotalCents + taxCents) {
      issues.push({ invoiceNo: label, message: "Discount exceeds charges." });
    }
    if (paidCents !== paymentSum) {
      issues.push({
        invoiceNo: label,
        message: `Paid amount ${fromCents(paidCents).toFixed(2)} does not match posted payments ${fromCents(paymentSum).toFixed(2)}.`
      });
    }
    if (paidCents > totalCents) {
      issues.push({ invoiceNo: label, message: "Paid amount exceeds the invoice total." });
    }

    if (OPEN_STATUSES.has(invoice.status)) {
      if (paidCents <= 0 && invoice.status !== "issued") {
        issues.push({ invoiceNo: label, message: `Status is ${invoice.status} but nothing has been paid.` });
      } else if (paidCents > 0 && paidCents < totalCents && invoice.status !== "partially_paid") {
        issues.push({ invoiceNo: label, message: `Status is ${invoice.status} but a balance is still open.` });
      } else if (totalCents > 0 && paidCents >= totalCents && invoice.status !== "paid") {
        issues.push({ invoiceNo: label, message: `Status is ${invoice.status} but the invoice is fully paid.` });
      } else if (paidCents === 0 && totalCents > 0 && invoice.status !== "issued") {
        issues.push({ invoiceNo: label, message: `Status is ${invoice.status} but the invoice is unpaid.` });
      }
    }

    chargesCents += totalCents;
    paymentsCents += paidCents;
  }

  const openCents = Math.max(0, chargesCents - paymentsCents);
  return {
    balanced: issues.length === 0,
    invoiceCount: invoices.length,
    chargesCents,
    paymentsCents,
    openCents,
    issues
  };
}
