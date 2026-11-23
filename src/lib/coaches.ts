export interface Coach {
  codigo: number;
  nombres: string;
  apellidos: string;
  correo: string | null;
  telefono: string | null;
  profesion: string | null;
  estado: boolean;
}

export interface CoachInput {
  nombres: string;
  apellidos: string;
  correo?: string;
  telefono?: string;
  profesion?: string;
  estado?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+0-9][0-9\s-]{5,}$/;

export function validateCoach(input: CoachInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!input.nombres.trim()) errors.nombres = "Nombres es obligatorio";
  if (!input.apellidos.trim()) errors.apellidos = "Apellidos es obligatorio";
  if (input.correo && !EMAIL_RE.test(input.correo.trim())) {
    errors.correo = "Correo inválido";
  }
  if (input.telefono && !PHONE_RE.test(input.telefono.trim())) {
    errors.telefono = "Teléfono inválido";
  }

  return errors;
}

export function coachFromFormData(formData: FormData): CoachInput {
  return {
    nombres: String(formData.get("nombres") ?? "").trim(),
    apellidos: String(formData.get("apellidos") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim() || undefined,
    telefono: String(formData.get("telefono") ?? "").trim() || undefined,
    profesion: String(formData.get("profesion") ?? "").trim() || undefined,
    estado: formData.get("estado") === "true",
  };
}

export function cleanInput(input: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );
}
