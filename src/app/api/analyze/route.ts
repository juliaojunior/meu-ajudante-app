import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ sucesso: false, mensagem_erro: "Nenhuma imagem enviada." }, { status: 400 });
    }

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
  } catch (error) {
    console.error("Erro na conversão Gemini:", error);
    return NextResponse.json(
      { sucesso: false, mensagem_erro: "Erro interno ao processar a foto. Tente novamente." },
      { status: 500 }
    );
  }
}
