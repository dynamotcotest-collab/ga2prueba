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
    `rounded-md px-3 py-2 text-sm font-medium ${
      active
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white">
      <nav className="flex flex-col gap-1 p-3">
        <Link
          href="/coaches"
          className={linkClass(pathname.startsWith("/coaches"))}
        >
          Coaches
        </Link>
        <button
          onClick={handleLogout}
          disabled={pending}
          className="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60"
        >
          {pending ? "Cerrando..." : "Logout"}
        </button>
      </nav>
    </aside>
  );
}
