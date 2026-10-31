export const IAS_VALUE = 537.13;
export const IAS_YEAR = 2026;
export const IAS_SOURCE = "https://files.diariodarepublica.pt/1s/2025/12/25001/0000200002.pdf";

/** Round monetary products in cents, including binary floating-point ties. */
export function multiplicarIAS(multiplicador: number): number {
  return Math.round((IAS_VALUE * multiplicador + Number.EPSILON) * 100) / 100;
}

export function euros(valor: number): string {
  return valor.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}