"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import type { Coach } from "@/lib/coaches";
import type { CoachState } from "@/lib/types";

type CoachAction = (prev: CoachState, formData: FormData) => Promise<CoachState>;

interface CoachFormModalProps {
  title: string;
  coach?: Coach;
  action: CoachAction;
  onClose: () => void;
}

export default function CoachFormModal({
  title,
  coach,
  action,
  onClose,
}: CoachFormModalProps) {
  const [state, formAction, pending] = useActionState<CoachState, FormData>(
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
        <h2 className="text-lg font-semibold text-green-700">Acción ejecutada</h2>
        <p className="mt-2 text-sm text-gray-700">{success}</p>
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <form action={formAction} className="mt-4 flex flex-col gap-3">
        {coach && <input type="hidden" name="codigo" value={coach.codigo} />}

        <Field label="Nombres" name="nombres" defaultValue={coach?.nombres ?? ""} required />
        <Field label="Apellidos" name="apellidos" defaultValue={coach?.apellidos ?? ""} required />
        <Field label="Correo electrónico" name="correo" type="email" defaultValue={coach?.correo ?? ""} />
        <Field label="Teléfono" name="telefono" defaultValue={coach?.telefono ?? ""} />
        <Field label="Profesión" name="profesion" defaultValue={coach?.profesion ?? ""} />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="estado"
            value="true"
            defaultChecked={coach ? coach.estado : true}
          />
          Activo
        </label>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
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
      <span className="font-medium text-gray-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
      />
    </label>
  );
}
