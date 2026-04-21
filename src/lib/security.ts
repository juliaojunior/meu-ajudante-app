import { NextRequest } from "next/server";

// Nota de Segurança: Para scale em Vercel Serverless, recomenda-se substituir este Map em memória 
// por uma solução persistente como Upstash Redis (@upstash/ratelimit).
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function verifyAuthAndRateLimit(req: NextRequest) {
  // 1. Proteção de Rota (Autenticação)
  // Substitua essa verificação pela SDK apropriada (ex: await auth() do Clerk ou validação de JWT)
  const authHeader = req.headers.get("authorization");
  const isDev = process.env.NODE_ENV === "development";
  
  // Exemplo de como poderia ser protegido. Por enquanto, se não for dev, seria ideal ter um token.
  if (!isDev && !authHeader) {
     // return { authorized: false, reason: "unauthorized" }; // <-- Descomente para forçar auth
  }

  // 2. Rate Limiter (Limitação de Requisições por IP ou Cliente)
  const identifier = req.headers.get("x-forwarded-for") || req.ip || "anonymous";
  const now = Date.now();
  const windowMs = 60 * 1000; // Janela de 1 minuto
  const maxRequests = 5; // Limite de 5 tentativas por minuto

  const record = rateLimitMap.get(identifier);

  if (!record || record.resetTime < now) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { authorized: true };
  }

  if (record.count >= maxRequests) {
    return { authorized: false, reason: "rate-limit" };
  }

  record.count += 1;
  return { authorized: true };
}
