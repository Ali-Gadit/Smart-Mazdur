import { describe, it, expect } from "vitest";
import {
  formatPKR,
  calculateLineTotal,
  calculateQuoteSubtotal,
  calculateQuoteTotal,
} from "../index";

describe("Money Utilities", () => {
  describe("formatPKR", () => {
    it("formats null or undefined as Rs. 0", () => {
      expect(formatPKR(null)).toBe("Rs. 0");
      expect(formatPKR(undefined)).toBe("Rs. 0");
    });

    it("formats numbers with thousand separators in PKR", () => {
      expect(formatPKR(1500)).toBe("Rs. 1,500");
      expect(formatPKR(25000)).toBe("Rs. 25,000");
      expect(formatPKR(0)).toBe("Rs. 0");
    });
  });

  describe("calculateLineTotal", () => {
    it("computes line item total correctly", () => {
      expect(calculateLineTotal(2, 500)).toBe(1000);
      expect(calculateLineTotal(1.5, 300)).toBe(450);
    });

    it("throws on negative values", () => {
      expect(() => calculateLineTotal(-1, 500)).toThrow();
      expect(() => calculateLineTotal(2, -100)).toThrow();
    });
  });

  describe("calculateQuoteSubtotal and calculateQuoteTotal", () => {
    it("sums multiple line items correctly without floating-point inaccuracies", () => {
      const items = [
        { quantity: 2, unit_price: 350.25 },
        { quantity: 1, unit_price: 1200.5 },
      ];
      const subtotal = calculateQuoteSubtotal(items);
      expect(subtotal).toBe(1901); // 700.5 + 1200.5
      expect(calculateQuoteTotal(subtotal, 100)).toBe(1801);
    });

    it("throws on negative discount", () => {
      expect(() => calculateQuoteTotal(1000, -50)).toThrow();
    });
  });
});
