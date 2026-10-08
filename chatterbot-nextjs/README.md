# Chatbot Inteligente con Next.js y Google Gemini

## Cómo ejecutarlo
1. `npm install`
2. Edita `.env.local` y pon tu clave de https://aistudio.google.com (Get API key)
3. `npm run dev`
4. Abre http://localhost:3000

## Estructura
- `app/api/chat/route.ts` → backend seguro (la API key nunca llega al navegador)
- `components/` → ChatInput, ChatMessage, ConfigPanel
- `types/chat.ts` → tipos TypeScript
