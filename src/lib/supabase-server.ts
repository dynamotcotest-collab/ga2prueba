import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en el entorno."
  );
}

// Cliente de servidor: usa la clave secreta y no mantiene sesión en el navegador.
export const supabase = createClient(url, secretKey, {
  auth: { persistSession: false },
});
