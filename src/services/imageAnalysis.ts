import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ExtractedMedicationData {
  sucesso: boolean;
  mensagem_erro: string | null;
  medicamento?: {
    nome_principal: string | null;
    nome_generico: string | null;
    concentracao_ou_dosagem: string | null;
    formato_sugerido: string | null;
  };
}

export async function extractMedicationData(base64Image: string, mimeType: string): Promise<ExtractedMedicationData> {
  const schema = {
    type: Type.OBJECT,
    properties: {
      sucesso: {
        type: Type.BOOLEAN,
        description: "true se for realmente a embalagem de um medicamento legível."
      },
      mensagem_erro: {
         type: Type.STRING,
         description: "Mensagem amigável de erro se a leitura falhar, ou null."
      },
      medicamento: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
          nome_principal: { type: Type.STRING, nullable: true },
          nome_generico: { type: Type.STRING, nullable: true },
          concentracao_ou_dosagem: { type: Type.STRING, nullable: true },
          formato_sugerido: { type: Type.STRING, nullable: true }
        }
      }
    },
    required: ["sucesso"]
  };

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Image.replace(/^data:image\/[a-z]+;base64,/, ""), // ensure no prefix
    },
  };

  const textPart = {
    text: `Você é um extrator de dados farmacêuticos altamente preciso.
    Analise esta imagem que deve ser de uma embalagem de medicamento.
    REGRAS DE NEGÓCIO E TOLERÂNCIA A FALHAS:
    1. NUNCA invente informações. Se um dado (como o nome genérico) não estiver visível na embalagem, retorne \`null\` para aquele campo.
    2. Seja tolerante com fotos levemente tremidas ou com reflexos de luz. Tente inferir o medicamento pelo contexto visual se parte do texto estiver obstruída, mas apenas com certeza.
    3. Se a imagem enviada CLARAMENTE não for de um medicamento ou estiver absolutamente ilegível, defina "sucesso" como \`false\` e preencha "mensagem_erro" (ex: "Não consegui ler a caixa. Pode tirar outra foto mais de perto?").`
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text) as ExtractedMedicationData;
    return result;
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return {
      sucesso: false,
      mensagem_erro: "Ocorreu um erro inesperado ao analisar a foto. Tente novamente."
    };
  }
}
