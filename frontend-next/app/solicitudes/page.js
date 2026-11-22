
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function obtenerSolicitudes() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "No has iniciado sesión", solicitudes: [] };
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/solicitudes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        error: response.status === 401
          ? "Tu sesión ha expirado. Inicia sesión nuevamente."
          : "No se pudieron obtener las solicitudes.",
        solicitudes: [],
      };
    }

    return await response.json();
  } catch (error) {
    return {
      error: "No se pudo conectar con el servidor.",
      solicitudes: [],
    };
  }
}

export default async function SolicitudesPage() {
  const data = await obtenerSolicitudes();

  return (
    <main className="main-container">
      <nav className="navbar">
        <h2>Gestión Académica</h2>
        <Link href="/">Inicio</Link>
      </nav>

      <section style={{ padding: "40px 8%" }}>
        <h1>Solicitudes académicas</h1>

        <p style={{ margin: "15px 0 25px" }}>
          Listado de solicitudes obtenidas desde el servidor.
        </p>

        {data.error && (
          <p style={{ color: "#dc2626" }}>
            {data.error}
          </p>
        )}

        {data.solicitudes.length === 0 && !data.error && (
          <p>No existen solicitudes registradas.</p>
        )}

        {data.solicitudes.map((solicitud) => (
          <article
            key={solicitud._id}
            className="feature-card"
            style={{ marginBottom: "15px" }}
          >
            <h3>{solicitud.curso}</h3>

            <p>{solicitud.descripcion}</p>

            <p>Alumno: {solicitud.alumno}</p>

            <p>Estado: {solicitud.estado}</p>

            <Link href={`/solicitudes/${solicitud._id}`}>
              Ver detalle
            </Link>
          </article>
        ))}

        <p style={{ marginTop: "25px", color: "#64748b" }}>
          Renderizado mediante Server-Side Rendering (SSR).
        </p>
      </section>
    </main>
  );
}
