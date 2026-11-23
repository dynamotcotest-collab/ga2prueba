"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase-server";
import {
  cleanInput,
  coachFromFormData,
  validateCoach,
} from "@/lib/coaches";
import type { CoachState } from "@/lib/types";

function parseCodigo(formData: FormData): number | null {
  const codigo = Number(formData.get("codigo"));
  return Number.isInteger(codigo) ? codigo : null;
}

async function saveCoachTalleres(coachId: number, tallerIds: number[]) {
  // Eliminar asignaciones previas
  await supabase.from("coach_talleres").delete().eq("coach_id", coachId);

  // Insertar nuevas asignaciones
  if (tallerIds.length > 0) {
    const rows = tallerIds.map((taller_id) => ({ coach_id: coachId, taller_id }));
    const { error } = await supabase.from("coach_talleres").insert(rows);
    return error;
  }
  return null;
}

export async function createCoach(
  _prev: CoachState,
  formData: FormData
): Promise<CoachState> {
  const input = coachFromFormData(formData);
  const errors = validateCoach(input);
  if (Object.keys(errors).length > 0) {
    return { error: Object.values(errors).join(". ") };
  }

  const { data, error } = await supabase
    .from("coaches")
    .insert(cleanInput(input))
    .select()
    .single();
  if (error) {
    return { error: `No se pudo crear el coach: ${error.message}` };
  }

  const coachId = (data as { codigo: number }).codigo;
  const tallerIds = input.taller_ids ?? [];
  if (tallerIds.length > 0) {
    const terrError = await saveCoachTalleres(coachId, tallerIds);
    if (terrError) {
      return { error: `Coach creado pero no se pudieron asignar los talleres: ${terrError.message}` };
    }
  }

  revalidatePath("/coaches");
  return { ok: true, message: "Coach creado correctamente." };
}

export async function updateCoach(
  _prev: CoachState,
  formData: FormData
): Promise<CoachState> {
  const codigo = parseCodigo(formData);
  if (codigo === null) return { error: "Código inválido." };

  const input = coachFromFormData(formData);
  const errors = validateCoach(input);
  if (Object.keys(errors).length > 0) {
    return { error: Object.values(errors).join(". ") };
  }

  const { error } = await supabase
    .from("coaches")
    .update(cleanInput(input))
    .eq("codigo", codigo);
  if (error) {
    return { error: `No se pudo actualizar el coach: ${error.message}` };
  }

  const tallerIds = input.taller_ids ?? [];
  const terrError = await saveCoachTalleres(codigo, tallerIds);
  if (terrError) {
    return { error: `Coach actualizado pero no se pudieron asignar los talleres: ${terrError.message}` };
  }

  revalidatePath("/coaches");
  return { ok: true, message: "Coach actualizado correctamente." };
}

export async function deleteCoach(formData: FormData): Promise<CoachState> {
  const codigo = parseCodigo(formData);
  if (codigo === null) return { error: "Código inválido." };

  const { error } = await supabase
    .from("coaches")
    .update({ estado: false })
    .eq("codigo", codigo);
  if (error) {
    return { error: `No se pudo desactivar el coach: ${error.message}` };
  }

  revalidatePath("/coaches");
  return { ok: true, message: "Coach desactivado correctamente." };
}
