"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import type { Taller } from "@/lib/coaches";
import type { TallerState } from "@/lib/types";

type TallerAction = (prev: TallerState, formData: FormData) => Promise<TallerState>;

interface TallerFormModalProps {
  title: string;
  taller?: Taller;
  action: TallerAction;
  onClose: () => void;
}

export default function TallerFormModal({
  title,
  taller,
  action,
  onClose,
}: TallerFormModalProps) {
  const [state, formAction, pending] = useActionState<TallerState, FormData>(
    action,
    {}
  );
  const [success, setSuccess] = useState<string | null>(null);

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
        {taller && <input type="hidden" name="id" value={taller.id} />}

        <Field label="Nombre" name="nombre" defaultValue={taller?.nombre ?? ""} required />
        <Field label="Descripción" name="descripcion" defaultValue={taller?.descripcion ?? ""} />
        <Field label="Duración (horas)" name="duracion_horas" type="number" defaultValue={taller?.duracion_horas != null ? String(taller.duracion_horas) : ""} />

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="estado"
            value="true"
            defaultChecked={taller ? taller.estado : true}
            className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
          />
          Activo
        </label>

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
