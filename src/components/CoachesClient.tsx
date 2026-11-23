"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  createCoach,
  deleteCoach,
  updateCoach,
} from "@/lib/actions/coaches";
import type { Coach } from "@/lib/coaches";
import CoachFormModal from "./CoachFormModal";

type FormState = { mode: "create" } | { mode: "edit"; coach: Coach } | null;

export default function CoachesClient({ coaches }: { coaches: Coach[] }) {
  const [form, setForm] = useState<FormState>(null);
  const [result, setResult] = useState<{ title: string; message: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  function handleDelete(codigo: number) {
    const formData = new FormData();
    formData.append("codigo", String(codigo));

    startTransition(async () => {
      const res = await deleteCoach(formData);
      if (res.ok) {
        setResult({
          title: "Acción ejecutada",
          message: res.message ?? "Coach desactivado.",
        });
      } else {
        setResult({
          title: "No se pudo ejecutar",
          message: res.error ?? "Error desconocido.",
        });
      }
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Coaches</h1>
          <p className="text-sm text-gray-600">Mantenimiento de coaches</p>
        </div>
        <button
          onClick={() => setForm({ mode: "create" })}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Nuevo coach
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Código</Th>
              <Th>Nombres</Th>
              <Th>Apellidos</Th>
              <Th>Correo</Th>
              <Th>Teléfono</Th>
              <Th>Profesión</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coaches.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No hay coaches registrados.
                </td>
              </tr>
            )}
            {coaches.map((coach) => (
              <tr key={coach.codigo}>
                <Td>{coach.codigo}</Td>
                <Td>{coach.nombres}</Td>
                <Td>{coach.apellidos}</Td>
                <Td>{coach.correo ?? "-"}</Td>
                <Td>{coach.telefono ?? "-"}</Td>
                <Td>{coach.profesion ?? "-"}</Td>
                <Td>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      coach.estado
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {coach.estado ? "Activo" : "Inactivo"}
                  </span>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForm({ mode: "edit", coach })}
                      disabled={!coach.estado}
                      className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(coach.codigo)}
                      disabled={isPending || !coach.estado}
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Desactivar
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form?.mode === "create" && (
        <CoachFormModal
          key="create"
          title="Nuevo coach"
          action={createCoach}
          onClose={() => setForm(null)}
        />
      )}
      {form?.mode === "edit" && (
        <CoachFormModal
          key={`edit-${form.coach.codigo}`}
          title={`Editar coach #${form.coach.codigo}`}
          coach={form.coach}
          action={updateCoach}
          onClose={() => setForm(null)}
        />
      )}

      {result && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">{result.title}</h2>
            <p className="mt-2 text-sm text-gray-700">{result.message}</p>
            <button
              onClick={() => setResult(null)}
              className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-2 text-sm text-gray-700 ${className}`}>{children}</td>
  );
}
