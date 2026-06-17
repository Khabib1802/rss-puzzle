export type Validator = (value: string) => string | null;

export const required =
  (message = 'Fill in this field'): Validator =>
  (v) =>
    v.trim() === '' ? message : null;

export const allowedSymbols =
  (regex: RegExp = /^[A-Za-z-]+$/, message = 'Only English letters and "-" are allowed'): Validator =>
  (v) =>
    !regex.test(v) ? message : null;

export const firstUppercase =
  (message = 'First letter should be uppercase'): Validator =>
  (v) =>
    v.length > 0 && v[0] !== v[0].toUpperCase() ? message : null;

export const minLength =
  (n: number, message?: string): Validator =>
  (v) =>
    v.length < n ? message || `Minimum length is ${String(n)}` : null;

export function runValidators(value: string, validators: Validator[]): string {
  const found = validators.map((v) => v(value)).find((r) => r != null);
  return found ?? '';
}

export default {
  required,
  allowedSymbols,
  firstUppercase,
  minLength,
  runValidators,
};
