import { supabase } from "@/lib/supabase-server";
import CoachesClient from "@/components/CoachesClient";
import type { Coach } from "@/lib/coaches";
import type { Taller } from "@/lib/coaches";

export const dynamic = "force-dynamic";

export default async function CoachesPage() {
  const { data: coaches, error: coachesError } = await supabase
    .from("coaches")
    .select(
      `*, coach_talleres(taller_id, talleres(id, nombre, descripcion, duracion_horas, estado))`
    )
    .order("codigo", { ascending: true });

  if (coachesError) {
    return (
      <p className="text-red-600">
        No se pudieron cargar los coaches: {coachesError.message}
      </p>
    );
  }

  const { data: talleres, error: talleresError } = await supabase
    .from("talleres")
    .select("*")
    .order("nombre", { ascending: true });

  if (talleresError) {
    return (
      <p className="text-red-600">
        No se pudieron cargar los talleres: {talleresError.message}
      </p>
    );
  }

  // Mapear coaches para que talleres sea un arreglo plano de Taller
  const coachesWithTalleres: Coach[] = (coaches ?? []).map((coach: any) => {
    const talleresList: Taller[] = (coach.coach_talleres ?? [])
      .map((ct: any) => ct.talleres)
      .filter(Boolean);

    return {
      ...coach,
      talleres: talleresList,
      coach_talleres: undefined,
    };
  });

  return (
    <CoachesClient
      coaches={coachesWithTalleres as Coach[]}
      talleres={(talleres ?? []) as Taller[]}
    />
  );
}
