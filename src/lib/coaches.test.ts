import { describe, expect, it } from "vitest";
import { cleanInput, coachFromFormData, validateCoach } from "./coaches";

describe("validateCoach", () => {
  it("acepta un coach válido", () => {
    const errors = validateCoach({
      nombres: "Ana",
      apellidos: "López",
      correo: "ana@example.com",
      telefono: "+51 999 999 999",
      profesion: "Coach",
    });

    expect(errors).toEqual({});
  });

  it("exige nombres y apellidos", () => {
    const errors = validateCoach({ nombres: "", apellidos: "  " });

    expect(errors.nombres).toBeTruthy();
    expect(errors.apellidos).toBeTruthy();
  });

  it("valida el correo", () => {
    const errors = validateCoach({
      nombres: "Ana",
      apellidos: "López",
      correo: "correo-malo",
    });

    expect(errors.correo).toBeTruthy();
  });

  it("valida el teléfono", () => {
    const errors = validateCoach({
      nombres: "Ana",
      apellidos: "López",
      telefono: "abc",
    });

    expect(errors.telefono).toBeTruthy();
  });

  it("permite campos opcionales vacíos", () => {
    const errors = validateCoach({ nombres: "Ana", apellidos: "López" });

    expect(errors).toEqual({});
  });
});

describe("coachFromFormData", () => {
  it("convierte el formulario a CoachInput", () => {
    const formData = new FormData();
    formData.append("nombres", "Ana");
    formData.append("apellidos", "López");
    formData.append("correo", "ana@example.com");
    formData.append("telefono", "999999999");
    formData.append("profesion", "Coach");
    formData.append("estado", "true");

    const input = coachFromFormData(formData);

    expect(input).toMatchObject({
      nombres: "Ana",
      apellidos: "López",
      correo: "ana@example.com",
      telefono: "999999999",
      profesion: "Coach",
      estado: true,
    });
  });

  it("estado es false cuando no se envía", () => {
    const formData = new FormData();
    formData.append("nombres", "Ana");
    formData.append("apellidos", "López");

    expect(coachFromFormData(formData).estado).toBe(false);
  });
});

describe("cleanInput", () => {
  it("elimina valores vacíos pero conserva false", () => {
    expect(
      cleanInput({ a: "x", b: "", c: undefined, d: null, e: false })
    ).toEqual({ a: "x", e: false });
  });
});
