import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Bienvenido</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Usa el menú lateral para administrar los coaches y talleres.
      </p>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white">Registro de coaches</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
