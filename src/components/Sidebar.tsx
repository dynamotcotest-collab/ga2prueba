"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/actions/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await logout();
  }

  const linkClass = (active: boolean) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <nav className="flex flex-col gap-1 p-3">
        <Link
          href="/coaches"
          className={linkClass(pathname.startsWith("/coaches"))}
        >
          Coaches
        </Link>
        <Link
          href="/talleres"
          className={linkClass(pathname.startsWith("/talleres"))}
        >
          Talleres
        </Link>
        <button
          onClick={handleLogout}
          disabled={pending}
          className="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60 transition-colors"
        >
          {pending ? "Cerrando..." : "Logout"}
        </button>
      </nav>
    </aside>
  );
}
