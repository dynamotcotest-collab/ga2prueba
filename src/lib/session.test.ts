import { beforeAll, describe, expect, it } from "vitest";
import { SESSION_COOKIE, signSession, verifySession } from "./session";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret";
});

describe("session", () => {
  it("firma y verifica un token válido", () => {
    const token = signSession({ username: "admin", name: "Administrador" });
    const user = verifySession(token);

    expect(user?.username).toBe("admin");
    expect(user?.name).toBe("Administrador");
  });

  it("rechaza un token alterado", () => {
    const token = signSession({ username: "admin", name: "Administrador" });
    const tampered = `${token.slice(0, -2)}${token.endsWith("aa") ? "bb" : "aa"}`;

    expect(verifySession(tampered)).toBeNull();
  });

  it("rechaza un token con firma inválida", () => {
    const token = signSession({ username: "admin", name: "Administrador" });
    const [payload] = token.split(".");

    expect(verifySession(`${payload}.firma-falsa`)).toBeNull();
  });

  it("rechaza tokens vacíos", () => {
    expect(verifySession(null)).toBeNull();
    expect(verifySession("")).toBeNull();
    expect(verifySession(undefined)).toBeNull();
  });

  it("usa el nombre de cookie esperado", () => {
    expect(SESSION_COOKIE).toBe("clases_session");
  });
});
