export const NAME_PATTERN = /^[\p{L}0-9]+(?: [\p{L}0-9]+)*$/u;
export const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PHONE_PATTERN = /^(?:\+91[\s-]?|0)?[6-9]\d{9}$/;
export const PASSWORD_SPECIAL = /[^A-Za-z0-9]/;
export const FARM_NAME_PATTERN = /^[\p{L}0-9][\p{L}0-9 .,'&-]{1,58}[\p{L}0-9.]$/u;
export const LOCATION_PATTERN = /^[\p{L}0-9][\p{L}0-9 .,'/-]{1,58}[\p{L}0-9.]$/u;
export const CERT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9/-]{2,22}$/;

export type FieldErrorKey =
  | "required"
  | "nameBlank"
  | "nameLength"
  | "nameChars"
  | "email"
  | "emailTaken"
  | "passwordLength"
  | "passwordUpper"
  | "passwordLower"
  | "passwordNumber"
  | "passwordSpecial"
  | "match"
  | "phone"
  | "location"
  | "farmName"
  | "farmSize"
  | "crops"
  | "experience"
  | "cert"
  | "documents"
  | "idDoc"
  | "organicDoc"
  | "fileType"
  | "fileSize";

export type FieldErrors = Partial<Record<string, FieldErrorKey>>;

export function passwordRules(value: string) {
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: PASSWORD_SPECIAL.test(value),
  };
}

export function isStrongPassword(value: string) {
  const r = passwordRules(value);
  return r.length && r.upper && r.lower && r.number && r.special;
}

export function validateName(value: string): FieldErrorKey | null {
  const name = value.trim().replace(/\s+/g, " ");
  if (!name) return "nameBlank";
  if (name.length < 3 || name.length > 25) return "nameLength";
  if (!NAME_PATTERN.test(name)) return "nameChars";
  return null;
}

export function validateEmailFormat(value: string): FieldErrorKey | null {
  const email = value.trim();
  if (!email) return "required";
  if (!EMAIL_PATTERN.test(email)) return "email";
  return null;
}

export function validatePassword(value: string): FieldErrorKey | null {
  if (!value) return "required";
  const r = passwordRules(value);
  if (!r.length) return "passwordLength";
  if (!r.upper) return "passwordUpper";
  if (!r.lower) return "passwordLower";
  if (!r.number) return "passwordNumber";
  if (!r.special) return "passwordSpecial";
  return null;
}

export function validateConfirm(password: string, confirm: string): FieldErrorKey | null {
  if (!confirm) return "required";
  if (password !== confirm) return "match";
  return null;
}

export function validatePhone(value: string, required = false): FieldErrorKey | null {
  const phone = value.trim();
  if (!phone) return required ? "required" : null;
  if (!PHONE_PATTERN.test(phone)) return "phone";
  return null;
}

export function validateLocation(value: string): FieldErrorKey | null {
  const loc = value.trim();
  if (!loc) return "required";
  if (loc.length < 3 || loc.length > 60 || !LOCATION_PATTERN.test(loc)) return "location";
  return null;
}

export function validateFarmName(value: string): FieldErrorKey | null {
  const name = value.trim();
  if (!name) return "required";
  if (name.length < 3 || name.length > 60 || !FARM_NAME_PATTERN.test(name)) return "farmName";
  return null;
}

export function validateFarmSize(value: string): FieldErrorKey | null {
  if (!value.trim()) return "required";
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0.1 || n > 5000) return "farmSize";
  return null;
}

export function validateExperience(value: string): FieldErrorKey | null {
  if (!value.trim()) return "required";
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0 || n > 80) return "experience";
  return null;
}

export function validateCrops(crops: string[]): FieldErrorKey | null {
  return crops.length ? null : "crops";
}

export function validateCert(organic: string, cert: string): FieldErrorKey | null {
  if (organic !== "yes") return null;
  const v = cert.trim();
  if (!v || !CERT_PATTERN.test(v)) return "cert";
  return null;
}

export const allowedDocTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const maxDocBytes = 5 * 1024 * 1024;

export function validateFile(file: File): FieldErrorKey | null {
  if (!allowedDocTypes.includes(file.type)) return "fileType";
  if (file.size > maxDocBytes) return "fileSize";
  return null;
}

export type RegisterDoc = {
  id: string;
  kind: "id" | "land" | "organic" | "other";
  name: string;
  size: number;
  type: string;
};

export function validateDocuments(
  docs: RegisterDoc[],
  organic: string,
): FieldErrorKey | null {
  if (!docs.some((d) => d.kind === "id")) return "idDoc";
  if (organic === "yes" && !docs.some((d) => d.kind === "organic")) return "organicDoc";
  return null;
}
