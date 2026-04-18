import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Meu Ajudante - Remédios",
  description: "Acessibilidade e controle de medicamentos para idosos",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative pb-24 border-x border-gray-200">
          {children}
        </main>
      </body>
    </html>
  );
}
