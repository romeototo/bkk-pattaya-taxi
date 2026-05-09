/**
 * Single source of truth for all route pricing.
 * Update here and it flows to translations + chatbot prompt.
 */
export const PRICING = {
  bkkToPattaya: 1_200,
  pattayaToBkk: 1_200,
  suvarnabhumiToPattaya: 1_100,
  donMueangToPattaya: 1_300,
} as const;

export function formatPrice(amount: number): string {
  return `฿${amount.toLocaleString()}`;
}

/** Generate pricing lines for chatbot system prompt */
export function getPricingSummary(): string {
  return [
    `Bangkok → Pattaya: From ${formatPrice(PRICING.bkkToPattaya)}`,
    `Pattaya → Bangkok: From ${formatPrice(PRICING.pattayaToBkk)}`,
    `Suvarnabhumi Airport (BKK) → Pattaya: From ${formatPrice(PRICING.suvarnabhumiToPattaya)}`,
    `Don Mueang Airport (DMK) → Pattaya: From ${formatPrice(PRICING.donMueangToPattaya)}`,
  ].join("\n  • ");
}
