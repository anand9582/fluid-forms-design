/* ================================
    GLOBAL TIME UTILS (IST ONLY)
================================ */

const MONTHS = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC"
];

/* -------------------------------
   Convert ANY date → IST
-------------------------------- */
export const toIST = (date: Date | string | number): Date => {
  const d = new Date(date);
  return new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

/* -------------------------------
   Full Format (UI)
   17 MAR 2026 06:55:57 AM
-------------------------------- */
export const formatIST = (date: Date | string | number): string => {
  const ist = toIST(date);

  const day = ist.getDate();
  const month = MONTHS[ist.getMonth()];
  const year = ist.getFullYear();

  const h = ist.getHours();
  const m = String(ist.getMinutes()).padStart(2, "0");
  const s = String(ist.getSeconds()).padStart(2, "0");

  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;

  return `${day} ${month} ${year} ${h12}:${m}:${s} ${ampm}`;
};

/* -------------------------------
   Short Format
   MAR 17 06:55:57
-------------------------------- */
export const formatISTShort = (date: Date | string | number): string => {
  const ist = toIST(date);

  const h = ist.getHours();
  const m = String(ist.getMinutes()).padStart(2, "0");
  const s = String(ist.getSeconds()).padStart(2, "0");

  return `${MONTHS[ist.getMonth()]} ${ist.getDate()} ${h % 12 || 12}:${m}:${s}`;
};

/* -------------------------------
   API Safe (IST with timezone)
-------------------------------- */
export const toISTISOString = (date: Date | string | number): string => {
  const ist = toIST(date);
  return `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, "0")}-${String(ist.getDate()).padStart(2, "0")}T${String(ist.getHours()).padStart(2, "0")}:${String(ist.getMinutes()).padStart(2, "0")}:${String(ist.getSeconds()).padStart(2, "0")}`;
};