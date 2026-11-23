"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  createTaller,
  deleteTaller,
  updateTaller,
} from "@/lib/actions/talleres";
import type { Taller } from "@/lib/coaches";
import type { TallerState } from "@/lib/types";
import TallerFormModal from "./TallerFormModal";

type TallerFormState = { mode: "create" } | { mode: "edit"; taller: Taller } | null;

export default function TalleresClient({
  talleres,
}: {
  talleres: Taller[];
}) {
  const [form, setForm] = useState<TallerFormState>(null);
  const [result, setResult] = useState<{ title: string; message: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number) {
    const formData = new FormData();
    formData.append("id", String(id));

    startTransition(async () => {
      const res = await deleteTaller(formData);
      if (res.ok) {
        setResult({
          title: "Acción ejecutada",
          message: res.message ?? "Taller eliminado.",
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Talleres</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Catálogo de talleres y cursos</p>
        </div>
        <button
          onClick={() => setForm({ mode: "create" })}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Nuevo taller
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Descripción</Th>
              <Th>Duración (horas)</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {talleres.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No hay talleres registrados.
                </td>
              </tr>
            )}
            {talleres.map((taller) => (
              <tr key={taller.id}>
                <Td>{taller.id}</Td>
                <Td>{taller.nombre}</Td>
                <Td>{taller.descripcion ?? "-"}</Td>
                <Td>{taller.duracion_horas ?? "-"}</Td>
                <Td>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      taller.estado
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {taller.estado ? "Activo" : "Inactivo"}
                  </span>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForm({ mode: "edit", taller })}
                      className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(taller.id)}
                      disabled={isPending}
                      className="rounded-md border border-red-200 dark:border-red-900/30 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-60"
                    >
                      Eliminar
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form?.mode === "create" && (
        <TallerFormModal
          key="create"
          title="Nuevo taller"
          action={createTaller}
          onClose={() => setForm(null)}
        />
      )}
      {form?.mode === "edit" && (
        <TallerFormModal
          key={`edit-${form.taller.id}`}
          title={`Editar taller #${form.taller.id}`}
          taller={form.taller}
          action={updateTaller}
          onClose={() => setForm(null)}
        />
      )}

      {result && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{result.title}</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{result.message}</p>
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
    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${className}`}>{children}</td>
  );
}
