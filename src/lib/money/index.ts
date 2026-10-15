/**
 * Money calculation and formatting utilities for Smart Mazdur.
 * All marketplace currency is explicitly in Pakistani Rupees (PKR / Rs.).
 */

export function formatPKR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Rs. 0";
  }
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString("en-PK")}`;
}

export interface QuoteLineItemInput {
  quantity: number;
  unit_price: number;
}

export function calculateLineTotal(quantity: number, unit_price: number): number {
  if (quantity < 0 || unit_price < 0) {
    throw new Error("Quantity and unit price must be non-negative");
  }
  // Round to 2 decimal places to avoid IEEE-754 precision drift
  return Math.round(quantity * unit_price * 100) / 100;
}

export function calculateQuoteSubtotal(items: QuoteLineItemInput[]): number {
  const sum = items.reduce((acc, item) => {
    return acc + calculateLineTotal(item.quantity, item.unit_price);
  }, 0);
  return Math.round(sum * 100) / 100;
}

export function calculateQuoteTotal(subtotal: number, discount: number = 0): number {
  if (discount < 0) {
    throw new Error("Discount cannot be negative");
  }
  const total = Math.max(0, subtotal - discount);
  return Math.round(total * 100) / 100;
}
