"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase-server";
import type { TallerState } from "@/lib/types";

export async function createTaller(
  _prev: TallerState,
  formData: FormData
): Promise<TallerState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const duracionRaw = String(formData.get("duracion_horas") ?? "").trim();
  const estado = formData.get("estado") === "true";

  if (!nombre) {
    return { error: "El nombre del taller es obligatorio." };
  }

  const duracion = duracionRaw ? Number(duracionRaw) : null;
  if (duracionRaw && (duracion === null || !Number.isInteger(duracion) || duracion < 1)) {
    return { error: "Duración inválida." };
  }

  const datosTaller: Record<string, unknown> = {
    nombre,
    descripcion,
    estado,
  };
  if (duracion !== null) {
    datosTaller.duracion_horas = duracion;
  }

  const { error } = await supabase.from("talleres").insert(datosTaller);
  if (error) {
    return { error: `No se pudo crear el taller: ${error.message}` };
  }

  revalidatePath("/talleres");
  return { ok: true, message: "Taller creado correctamente." };
}

export async function updateTaller(
  _prev: TallerState,
  formData: FormData
): Promise<TallerState> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    return { error: "ID de taller inválido." };
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const duracionRaw = String(formData.get("duracion_horas") ?? "").trim();
  const estado = formData.get("estado") === "true";

  if (!nombre) {
    return { error: "El nombre del taller es obligatorio." };
  }

  const duracion = duracionRaw ? Number(duracionRaw) : null;
  if (duracionRaw && (duracion === null || !Number.isInteger(duracion) || duracion < 1)) {
    return { error: "Duración inválida." };
  }

  const datosTaller: Record<string, unknown> = {
    nombre,
    descripcion,
    estado,
  };
  if (duracion !== null) {
    datosTaller.duracion_horas = duracion;
  }

  const { error } = await supabase
    .from("talleres")
    .update(datosTaller)
    .eq("id", id);
  if (error) {
    return { error: `No se pudo actualizar el taller: ${error.message}` };
  }

  revalidatePath("/talleres");
  return { ok: true, message: "Taller actualizado correctamente." };
}

export async function deleteTaller(formData: FormData): Promise<TallerState> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    return { error: "ID de taller inválido." };
  }

  const { error } = await supabase.from("talleres").delete().eq("id", id);
  if (error) {
    return { error: `No se pudo eliminar el taller: ${error.message}` };
  }

  revalidatePath("/talleres");
  return { ok: true, message: "Taller eliminado correctamente." };
}
