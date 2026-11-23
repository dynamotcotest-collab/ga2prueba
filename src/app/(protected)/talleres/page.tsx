import { supabase } from "@/lib/supabase-server";
import TalleresClient from "@/components/TalleresClient";
import type { Taller } from "@/lib/coaches";

export const dynamic = "force-dynamic";

export default async function TalleresPage() {
  const { data, error } = await supabase
    .from("talleres")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    return (
      <p className="text-red-600">
        No se pudieron cargar los talleres: {error.message}
      </p>
    );
  }

  return <TalleresClient talleres={(data ?? []) as Taller[]} />;
}
