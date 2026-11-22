
import Link from "next/link";

export default function Home() {
  return (
    <main className="main-container">
      <nav className="navbar">
        <h2>PA4 | Gestión Académica</h2>
        <span>Next.js</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">PLATAFORMA ACADÉMICA</p>

        <h1>
          Gestión de Solicitudes
          <br />
          Académicas
        </h1>

        <p className="description">
          Plataforma para administrar, consultar y
          realizar seguimiento de solicitudes académicas.
        </p>

        <div className="actions">
          <Link href="/solicitudes" className="btn-primary">
            Consultar solicitudes
          </Link>

          <Link href="/informacion" className="btn-secondary">
            Información del sistema
          </Link>
        </div>
      </section>

      <section className="features">
        <article className="feature-card">
          <h3>Solicitudes</h3>
          <p>Consulta y seguimiento de solicitudes académicas.</p>
        </article>

        <article className="feature-card">
          <h3>Información</h3>
          <p>Conoce el funcionamiento de nuestra plataforma.</p>
        </article>

        <article className="feature-card">
          <h3>Next.js</h3>
          <p>Implementación de SSR, SSG y rutas dinámicas.</p>
        </article>
      </section>

      <footer>
        PA4 - Programación Web II | 2026
      </footer>
    </main>
  );
}
