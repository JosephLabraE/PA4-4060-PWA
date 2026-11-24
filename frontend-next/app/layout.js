import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Gestión de Solicitudes Académicas",
  description:
    "Plataforma de Gestión de Solicitudes Académicas desarrollada con Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <footer
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            padding: "0.5rem",
            opacity: 0.6,
          }}
        >
          Entorno: {process.env.NEXT_PUBLIC_ENTORNO}
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}