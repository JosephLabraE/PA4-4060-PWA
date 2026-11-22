
import "./globals.css";

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
      </body>
    </html>
  );
}
