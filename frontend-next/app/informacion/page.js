
import Link from "next/link";

export const dynamic = "force-static";

export const metadata = {
  title: "Información | Gestión Académica",
  description: "Información de la Plataforma de Gestión de Solicitudes Académicas",
};

export default function InformacionPage() {
  return (
    <main className="main-container">
      <nav className="navbar">
        <h2>Gestión Académica</h2>
        <Link href="/">Inicio</Link>
      </nav>

      <section style={{ padding: "40px 8%" }}>
        <h1>Información del sistema</h1>

        <p style={{ margin: "20px 0" }}>
          La Plataforma de Gestión de Solicitudes Académicas
          permite registrar, consultar y administrar solicitudes
          de los estudiantes.
        </p>

        <div className="feature-card">
          <h2>Objetivo</h2>
          <p>
            Facilitar la gestión de solicitudes académicas
            mediante una plataforma web.
          </p>
        </div>

        <div className="feature-card" style={{ marginTop: "20px" }}>
          <h2>Tecnologías utilizadas</h2>
          <p>Next.js, React, Node.js, Express y MongoDB.</p>
        </div>

        <div className="feature-card" style={{ marginTop: "20px" }}>
          <h2>Generación de páginas</h2>
          <p>
            Esta página utiliza Static Site Generation (SSG),
            por lo que su contenido se genera durante la
            compilación y no necesita consultar la API
            en cada solicitud.
          </p>
        </div>
      </section>
    </main>
  );
}
