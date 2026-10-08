// components/ChatInput.tsx
"use client";

import React, { useState, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-[#FFDBFD] border-t border-[#f0b8ee] flex items-end gap-2">
      <textarea
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu consulta aquí... (Shift + Enter para salto de línea)"
        disabled={isLoading}
        className="flex-1 bg-white text-black placeholder:text-black/40 border border-[#f0b8ee] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="bg-pink-500 hover:bg-pink-600 disabled:bg-white disabled:text-black/30 text-white p-3 rounded-xl transition-all flex items-center justify-center h-12 w-12"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
      </button>
    </div>
  );
};