import crypto from "node:crypto";

export const SESSION_COOKIE = "clases_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

export interface SessionUser {
  username: string;
  name: string;
  exp: number;
}

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-only-insecure-secret";
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

export function signSession(user: { username: string; name: string }): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = base64url(JSON.stringify({ ...user, exp }));
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySession(token: string | null | undefined): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
