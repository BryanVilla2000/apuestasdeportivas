import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema web de apuestas deportivas",
  description: "Fundación inicial del sistema web de apuestas deportivas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
