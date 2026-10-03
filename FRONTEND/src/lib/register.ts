import type { Role, User } from "./types";
import { users } from "../data/farmers";
import {
  validateCert,
  validateConfirm,
  validateCrops,
  validateDocuments,
  validateEmailFormat,
  validateExperience,
  validateFarmName,
  validateFarmSize,
  validateLocation,
  validateName,
  validatePassword,
  validatePhone,
  type FieldErrors,
  type RegisterDoc,
} from "./validation";
import { buildSessionUser } from "./auth";
import { findRegistered, saveRegistered } from "./accounts";
import { apiConfigured } from "./api";
import { registerApi } from "./api/auth";
import { createFarmerProfileApi } from "./api/farmers";

export type RegisterPath = "customer" | "farmer";

export type RegisterDraft = {
  path: RegisterPath;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  location: string;
  state: string;
  farmName: string;
  farmSize: string;
  crops: string[];
  experience: string;
  organic: "yes" | "no" | "progress";
  certNumber: string;
  documents: RegisterDoc[];
};

export const emptyDraft = (path: RegisterPath = "customer"): RegisterDraft => ({
  path,
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
  location: "",
  state: "",
  farmName: "",
  farmSize: "",
  crops: [],
  experience: "",
  organic: "no",
  certNumber: "",
  documents: [],
});

export function emailExists(email: string) {
  const key = email.trim().toLowerCase();
  if (!key) return false;
  if (users.some((u) => u.email.toLowerCase() === key)) return true;
  return Boolean(findRegistered(key));
}

export function validateAccountStep(draft: RegisterDraft): FieldErrors {
  const errors: FieldErrors = {};
  const name = validateName(draft.name);
  if (name) errors.name = name;
  const email = validateEmailFormat(draft.email);
  if (email) errors.email = email;
  const phone = validatePhone(draft.phone, draft.path === "customer");
  if (phone) errors.phone = phone;
  const password = validatePassword(draft.password);
  if (password) errors.password = password;
  const confirm = validateConfirm(draft.password, draft.confirm);
  if (confirm) errors.confirm = confirm;
  return errors;
}

export function validatePlaceStep(draft: RegisterDraft): FieldErrors {
  const errors: FieldErrors = {};
  if (!draft.state) errors.state = "required";
  const loc = validateLocation(draft.location);
  if (loc) errors.location = loc;
  return errors;
}

export function validateFarmStep(draft: RegisterDraft): FieldErrors {
  const errors: FieldErrors = {};
  const farm = validateFarmName(draft.farmName);
  if (farm) errors.farmName = farm;
  const size = validateFarmSize(draft.farmSize);
  if (size) errors.farmSize = size;
  const crops = validateCrops(draft.crops);
  if (crops) errors.crops = crops;
  const exp = validateExperience(draft.experience);
  if (exp) errors.experience = exp;
  const cert = validateCert(draft.organic, draft.certNumber);
  if (cert) errors.certNumber = cert;
  return errors;
}

export function validateDocsStep(draft: RegisterDraft): FieldErrors {
  const errors: FieldErrors = {};
  const docs = validateDocuments(draft.documents, draft.organic);
  if (docs) errors.documents = docs;
  return errors;
}

export function validateFullDraft(draft: RegisterDraft): FieldErrors {
  return {
    ...validateAccountStep(draft),
    ...validatePlaceStep(draft),
    ...(draft.path === "farmer" ? validateFarmStep(draft) : {}),
    ...(draft.path === "farmer" ? validateDocsStep(draft) : {}),
  };
}

/** Simulated server: re-validates every field and checks email uniqueness. */
export async function submitRegistration(draft: RegisterDraft): Promise<
  | { ok: true; user: User }
  | { ok: false; errors: FieldErrors }
> {
  await new Promise((r) => window.setTimeout(r, 640));
  const errors = validateFullDraft(draft);
  if (emailExists(draft.email)) errors.email = "emailTaken";
  if (Object.keys(errors).length) return { ok: false, errors };

  const role: Role = draft.path;
  saveRegistered({
    email: draft.email.trim().toLowerCase(),
    password: draft.password,
    role,
    name: draft.name.trim().replace(/\s+/g, " "),
    phone: draft.phone.trim(),
    location: draft.location.trim(),
    state: draft.state,
    farmName: draft.farmName.trim() || undefined,
    farmSize: draft.farmSize || undefined,
    crops: draft.crops,
    experience: draft.experience || undefined,
    organic: draft.organic,
  });

  if (apiConfigured()) {
    try {
      const nameParts = draft.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");
      
      const res = await registerApi({
        firstName,
        lastName,
        email: draft.email.trim().toLowerCase(),
        password: draft.password,
        role,
      });

      if (role === "farmer") {
        try {
          await createFarmerProfileApi({
            farmName: draft.farmName.trim() || `${firstName}'s Farm`,
            description: draft.crops.join(", "),
            experienceYears: Number(draft.experience) || 0,
            organicCertification: draft.organic === "yes",
            location: {
              address: draft.location.trim(),
              state: draft.state,
            }
          });
        } catch (e) {
          // Log and ignore profile creation errors so registration succeeds
          console.warn("Farmer profile creation failed", e);
        }
      }

      // Optionally update user properties beyond auth schema
      const user = res.user;
      user.phone = draft.phone.trim();
      user.state = draft.state;
      user.district = draft.location.trim();
      if (draft.path === "farmer") user.village = draft.farmName.trim();
      return { ok: true, user };
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes("email")) {
        return { ok: false, errors: { email: "emailTaken" } };
      }
      return { ok: false, errors: { _form: err.message || "Registration failed" } as any };
    }
  }

  const user = buildSessionUser(draft.email, role, draft.name);
  user.phone = draft.phone.trim();
  user.state = draft.state;
  user.district = draft.location.trim();
  if (draft.path === "farmer") user.village = draft.farmName.trim();
  return { ok: true, user };
}


