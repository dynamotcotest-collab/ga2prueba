import { supabase } from "@/lib/supabase-server";
import CoachesClient from "@/components/CoachesClient";
import type { Coach } from "@/lib/coaches";

export const dynamic = "force-dynamic";

export default async function CoachesPage() {
  const { data, error } = await supabase
    .from("coaches")
    .select("*")
    .order("codigo", { ascending: true });

  if (error) {
    return (
      <p className="text-red-600">
        No se pudieron cargar los coaches: {error.message}
      </p>
    );
  }

  return <CoachesClient coaches={(data ?? []) as Coach[]} />;
}
