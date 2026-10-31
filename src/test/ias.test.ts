import { describe, expect, it } from "vitest";
import { IAS_VALUE, IAS_YEAR, multiplicarIAS } from "@/lib/ias";

describe("IAS oficial e exemplos da FAQ", () => {
  it("usa o IAS de 537,13 euros para 2026", () => {
    expect(IAS_VALUE).toBe(537.13);
    expect(IAS_YEAR).toBe(2026);
  });
  it("converte 2 IAS em 1074,26 euros", () => {
    expect(multiplicarIAS(2)).toBe(1074.26);
  });
  it("arredonda 2,5 IAS a 1342,83 euros", () => {
    expect(multiplicarIAS(2.5)).toBe(1342.83);
  });
});