// QA test code for Samixa Context Engine retrieval tests (17-Nov-2026). Safe to delete.
export const EXPORT_MAX_ROWS = 5000;
export const EXPORT_FILE_PREFIX = "orders-export";

export interface OrderRow {
  orderId: string;
  customerEmail: string;
  totalCents: number;
}

/** Builds a CSV export of orders. Rows beyond EXPORT_MAX_ROWS are dropped. */
export function buildOrderCsv(rows: OrderRow[]): string {
  const header = "orderId,customerEmail,totalCents";
  const body = rows.slice(0, EXPORT_MAX_ROWS).map((r) => `${r.orderId},${r.customerEmail},${r.totalCents}`);
  return [header, ...body].join("\n");
}

/** File name for an export, e.g. orders-export-2026-11-17.csv */
export function exportFileName(day: string): string {
  return `${EXPORT_FILE_PREFIX}-${day}.csv`;
}
