/**
 * Arabic-Indic digit rendering helper.
 *
 * The platform is an Arabic RTL interface: numbers inside Arabic sentences are
 * rendered with Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) and are wrapped by the BiDi
 * components (`ArabicNumber` / `LatinText`) or a `<bdi>` when they appear in
 * mixed Arabic/Latin contexts.
 */
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)]);
}
