import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Geração de Nonce Criptográfico para CSP Dinâmica
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDev = process.env.NODE_ENV !== "production";

  const cspHeader = `
    default-src 'self';
    script-src 'self' ${isDev ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}' 'strict-dynamic'`};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${!isDev ? "upgrade-insecure-requests;" : ""}
  `.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Aplicação da Content Security Policy (Prevenção Avançada a XSS e Injeções)
  response.headers.set("Content-Security-Policy", cspHeader);
  
  // Previne MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Impede que o site seja incluído em iframes de outros sites (Prevenção de Clickjacking)
  response.headers.set("X-Frame-Options", "DENY");
  
  // Limita a passagem excessiva de dados via URL a outros sites
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // HSTS (HTTP Strict Transport Security) - Imposição do uso de HTTPS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica o proxy interceptor em todas as páginas (inclusive API Routes),
     * exceto estáticos e arquivos internos cruciais do framework Next.js.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json).*)",
  ],
};
