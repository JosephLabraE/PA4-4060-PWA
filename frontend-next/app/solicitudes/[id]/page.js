
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function obtenerSolicitud(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "Debes iniciar sesión.", solicitud: null };
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/solicitudes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.mensaje || "No se pudo obtener la solicitud.",
        solicitud: null,
      };
    }

    return { solicitud: data.solicitud, error: null };
  } catch (error) {
    return {
      error: "No se pudo conectar con el servidor.",
      solicitud: null,
    };
  }
}

export default async function DetalleSolicitudPage({ params }) {
  const { id } = await params;
  const { solicitud, error } = await obtenerSolicitud(id);

  return (
    <main className="main-container">
      <nav className="navbar">
        <h2>Gestión Académica</h2>
        <Link href="/solicitudes">Volver a solicitudes</Link>
      </nav>

      <section style={{ padding: "40px 8%" }}>
        <h1>Detalle de solicitud</h1>

        {error && (
          <p style={{ color: "#dc2626", marginTop: "20px" }}>
            {error}
          </p>
        )}

        {solicitud && (
          <article className="feature-card" style={{ marginTop: "25px" }}>
            <h2>{solicitud.curso}</h2>

            <p><strong>Alumno:</strong> {solicitud.alumno}</p>

            <p>
              <strong>Descripción:</strong> {solicitud.descripcion}
            </p>

            <p><strong>Estado:</strong> {solicitud.estado}</p>

            <p>
              <strong>Fecha de creación:</strong>{" "}
              {new Date(solicitud.fechaCreacion).toLocaleString("es-PE")}
            </p>
          </article>
        )}

        <p style={{ marginTop: "25px", color: "#64748b" }}>
          Esta página utiliza una ruta dinámica mediante el
          parámetro ID y obtiene los datos desde Express.
        </p>
      </section>
    </main>
  );
}
