import { NextResponse } from "next/server";
import { logger } from "../../../../lib/logger";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    logger.info("Login: iniciando petición hacia el backend");

    const response = await fetch(
      `${process.env.API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    logger.info("Login: respuesta del backend", `status ${response.status}`);

    if (!response.ok) {
      logger.warn("Login: credenciales rechazadas", `status ${response.status}`);
      return NextResponse.json(
        {
          mensaje: data.mensaje || "Error al iniciar sesión",
        },
        { status: response.status }
      );
    }

    if (!data.token) {
      throw new Error(
        "Express respondió correctamente, pero no devolvió un JWT."
      );
    }

    const result = NextResponse.json({
      mensaje: data.mensaje,
      usuario: data.usuario,
    });

    result.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    logger.info("Login: sesión creada correctamente");

    return result;

  } catch (error) {
    logger.error("Login: error durante el inicio de sesión", error.message);

    return NextResponse.json(
      {
        mensaje: "Error durante el inicio de sesión",
      },
      { status: 500 }
    );
  }
}