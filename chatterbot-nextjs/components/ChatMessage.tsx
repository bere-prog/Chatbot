// components/ChatMessage.tsx
import React from "react";
import { Message } from "@/types/chat";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 my-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#FFDBFD] flex items-center justify-center flex-shrink-0 text-pink-500 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-black ${
          isUser
            ? "bg-[#FFDBFD] rounded-tr-none"
            : "bg-white border border-[#f0b8ee] rounded-tl-none"
        }`}
      >
        <p className="text-xs font-semibold mb-1 text-black/70">
          {isUser ? "Tú (Estudiante)" : "Gemini AI"}
        </p>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
        <span className="block text-[10px] mt-2 text-black/50 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#FFDBFD] flex items-center justify-center flex-shrink-0 text-black">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};