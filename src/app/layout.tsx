import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // A leitura do header força Renderização Dinâmica (SSR) garantindo que o 
  // nonce da CSP gerado no middleware sempre sincronize com o HTML gerado.
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || "";

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
