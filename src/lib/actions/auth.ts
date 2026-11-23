"use server";

import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";
import { SESSION_COOKIE, signSession, verifySession } from "@/lib/session";
import type { LoginState } from "@/lib/types";

const AUTH_USERNAME = process.env.AUTH_USERNAME ?? "admin";
const AUTH_PASSWORD = process.env.AUTH_PASSWORD ?? "12345";

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!safeEqual(username, AUTH_USERNAME) || !safeEqual(password, AUTH_PASSWORD)) {
    return { error: "Usuario o clave incorrectos." };
  }

  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    signSession({ username, name: "Administrador" }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    }
  );

  redirect("/");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  const user = verifySession(store.get(SESSION_COOKIE)?.value);

  if (user) {
    const requestHeaders = await headers();
    await supabase.from("sesiones").insert({
      usuario: user.username,
      user_agent: requestHeaders.get("user-agent") ?? null,
    });
  }

  store.delete(SESSION_COOKIE);
  redirect("/login");
}
