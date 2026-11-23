"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import type { Coach, Taller } from "@/lib/coaches";
import type { CoachState } from "@/lib/types";

type CoachAction = (prev: CoachState, formData: FormData) => Promise<CoachState>;

interface CoachFormModalProps {
  title: string;
  coach?: Coach;
  talleres: Taller[];
  action: CoachAction;
  onClose: () => void;
}

export default function CoachFormModal({
  title,
  coach,
  talleres,
  action,
  onClose,
}: CoachFormModalProps) {
  const [state, formAction, pending] = useActionState<CoachState, FormData>(
    action,
    {}
  );
  const [success, setSuccess] = useState<string | null>(null);

  const selectedTallerIds = useState<number[]>(
    coach?.talleres?.map((t) => t.id) ?? []
  )[0];

  useEffect(() => {
    if (state.ok) {
      setSuccess(state.message ?? "Acción ejecutada correctamente.");
    }
  }, [state.ok, state.message]);

  if (success) {
    return (
      <ModalShell onClose={onClose}>
        <h2 className="text-lg font-semibold text-green-700 dark:text-green-400">Acción ejecutada</h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{success}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Aceptar
        </button>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <form action={formAction} className="mt-4 flex flex-col gap-3">
        {coach && <input type="hidden" name="codigo" value={coach.codigo} />}

        <Field label="Nombres" name="nombres" defaultValue={coach?.nombres ?? ""} required />
        <Field label="Apellidos" name="apellidos" defaultValue={coach?.apellidos ?? ""} required />
        <Field label="Correo electrónico" name="correo" type="email" defaultValue={coach?.correo ?? ""} />
        <Field label="Teléfono" name="telefono" defaultValue={coach?.telefono ?? ""} />
        <Field label="Profesión" name="profesion" defaultValue={coach?.profesion ?? ""} />

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="estado"
            value="true"
            defaultChecked={coach ? coach.estado : true}
            className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
          />
          Activo
        </label>

        <div className="mt-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
            Talleres que dicta
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
            {talleres.map((taller) => (
              <label key={taller.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="taller_ids"
                  value={String(taller.id)}
                  defaultChecked={selectedTallerIds.includes(taller.id)}
                  className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{taller.nombre}</span>
                {taller.duracion_horas && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({taller.duracion_horas}h)</span>
                )}
              </label>
            ))}
          </div>
          {talleres.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              No hay talleres en el catalogo.
            </p>
          )}
        </div>

        {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </label>
  );
}
