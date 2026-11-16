// Pure rules for shared gifts. Each guest gives a whole gift, or a portion on shareable ones.
export const SHARE_MIN_PRICE = 100;
export const PRESET_PORTIONS = [25, 50, 100] as const;

export const isShareable = (price: number) => price >= SHARE_MIN_PRICE;
export const remaining = (price: number, gathered: number) => Math.max(0, price - gathered);

/** Presets a guest may tap, never more than what is left. */
export const portionOptions = (price: number, gathered: number) =>
  PRESET_PORTIONS.filter((n) => n < remaining(price, gathered));

/** Whole dollars between 1 and what is left, else null. */
export function validPortion(amount: number, price: number, gathered: number): number | null {
  const left = remaining(price, gathered);
  if (!Number.isInteger(amount) || amount < 1 || amount > left) return null;
  return amount;
}
