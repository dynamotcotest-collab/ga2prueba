import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Bienvenido</h1>
      <p className="text-gray-600">
        Usa el menú lateral para administrar los coaches.
      </p>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold">Registro de coaches</h2>
        <p className="mt-1 text-sm text-gray-600">
          Crea, edita o desactiva coaches. Los cambios se confirman con un
          modal al finalizar cada acción.
        </p>
        <Link
          href="/coaches"
          className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Ir a Coaches
        </Link>
      </div>
    </div>
  );
}
