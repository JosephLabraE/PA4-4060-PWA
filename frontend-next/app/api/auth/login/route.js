
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    console.log("LOGIN NEXT: iniciando petición");
    console.log("API_URL:", process.env.API_URL);

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

    console.log("LOGIN EXPRESS STATUS:", response.status);

    if (!response.ok) {
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

    return result;

  } catch (error) {
    console.error("ERROR EN LOGIN NEXT.JS:", error);

    return NextResponse.json(
      {
        mensaje: "Error durante el inicio de sesión",
      },
      { status: 500 }
    );
  }
}
