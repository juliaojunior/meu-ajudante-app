import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { verifyAuthAndRateLimit } from "@/lib/security";

const analyzeRequestSchema = z.object({
  imageBase64: z.string().min(1, "A imagem em Base64 é obrigatória"),
  mimeType: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verificação de Segurança e Limitador (Prevenção de Abuso)
    const securityCheck = await verifyAuthAndRateLimit(req);
    if (!securityCheck.authorized) {
      const isRateLimit = securityCheck.reason === "rate-limit";
      return NextResponse.json(
        { sucesso: false, mensagem_erro: isRateLimit ? "Muitas requisições. Tente novamente mais tarde." : "Não autorizado." },
        { status: isRateLimit ? 429 : 401 }
      );
    }

    const body = await req.json();
    const parsedBody = analyzeRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { sucesso: false, mensagem_erro: "Dados de requisição inválidos.", detalhes: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { imageBase64, mimeType } = parsedBody.data;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const schema = {
      type: Type.OBJECT,
      properties: {
        sucesso: { type: Type.BOOLEAN },
        mensagem_erro: { type: Type.STRING, nullable: true },
        medicamento: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            nome_principal: { type: Type.STRING, nullable: true },
            nome_generico: { type: Type.STRING, nullable: true },
            concentracao_ou_dosagem: { type: Type.STRING, nullable: true },
            formato_sugerido: { type: Type.STRING, nullable: true },
          },
        },
      },
      required: ["sucesso"],
    };

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ""),
      },
    };

    const textPart = {
      text: `Você é um extrator de dados farmacêuticos altamente preciso.
      Analise esta imagem que deve ser de uma embalagem de medicamento.
      REGRAS DE NEGÓCIO E TOLERÂNCIA A FALHAS:
      1. NUNCA invente informações. Se não estiver visível na embalagem, retorne null.
      2. Seja tolerante com fotos tremidas ou com reflexos. Inferir apenas com alta confiança.
      3. Se a imagem enviada CLARAMENTE não for medicamento, defina "sucesso" como false e preencha "mensagem_erro" (ex: "Não consegui ler a caixa. Pode tirar outra foto mais de perto?").`
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erro na conversão Gemini:", error);
    return NextResponse.json(
      { sucesso: false, mensagem_erro: "Erro Interno do Servidor: " + (error.message || "Falha desconhecida") },
      { status: 500 }
    );
  }
}
