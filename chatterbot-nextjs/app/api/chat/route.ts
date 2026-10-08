// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { ChatRequestBody } from "@/types/chat";

// Inicializar el cliente del SDK con la clave del servidor
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("ADVERTENCIA: GEMINI_API_KEY no está configurada en .env.local");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// Reintenta automáticamente ante errores temporales (red lenta o modelo saturado)
async function generateWithRetry(
  params: Parameters<typeof ai.models.generateContent>[0],
  maxAttempts = 4
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: unknown) {
      lastError = error;
      const msg = error instanceof Error ? error.message : String(error);

      // Solo reintentar errores temporales
      const temporal =
        msg.includes("fetch failed") ||
        msg.includes("503") ||
        msg.includes("UNAVAILABLE");

      if (!temporal || attempt === maxAttempts) break;

      console.warn(`Intento ${attempt} falló, reintentando...`);
      await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  try {
    if (!apiKey || apiKey === "tu_clave_secreta_aqui") {
      return NextResponse.json(
        { error: "La API Key de Gemini no está configurada en el servidor (.env.local)." },
        { status: 500 }
      );
    }

    const body: ChatRequestBody = await req.json();
    const { messages, config } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "El historial de mensajes no puede estar vacío." },
        { status: 400 }
      );
    }

    // Gemini espera que la conversación comience con un turno del usuario,
    // así que descartamos el saludo inicial del bot (turnos 'model' al inicio).
    const firstUserIndex = messages.findIndex((m) => m.role === "user");
    const validMessages = firstUserIndex >= 0 ? messages.slice(firstUserIndex) : [];

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: "Debe existir al menos un mensaje del usuario." },
        { status: 400 }
      );
    }

    // Formatear el historial para el SDK de Gemini
    const contents = validMessages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    // Configuración de los hiperparámetros del modelo
    const response = await generateWithRetry({
      model: config.modelName || "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: config.systemInstruction
          ? config.systemInstruction
          : undefined,
        temperature: config.temperature,
        maxOutputTokens: config.maxOutputTokens,
        topP: config.topP,
        topK: config.topK,
        // Reduce el "razonamiento" interno para responder más rápido
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const replyText = response.text || "Sin respuesta generada por el modelo.";

    return NextResponse.json({
      text: replyText,
      usageMetadata: response.usageMetadata,
    });
  } catch (error: unknown) {
    console.error("Error en /api/chat:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Ocurrió un error al procesar la solicitud con Gemini.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}