import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meu Ajudante - Remédios",
  description: "Acessibilidade e controle de medicamentos para idosos",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
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
