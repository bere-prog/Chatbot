// components/ConfigPanel.tsx
"use client";

import React from "react";
import { ModelConfig } from "@/types/chat";
import { Settings, Sparkles, BookOpen } from "lucide-react";

interface ConfigPanelProps {
  config: ModelConfig;
  onChange: (newConfig: ModelConfig) => void;
}

const fieldClass =
  "bg-white border border-[#f0b8ee] rounded-lg p-2.5 text-black focus:ring-2 focus:ring-pink-400 focus:outline-none";
const badgeClass =
  "font-mono text-xs bg-white border border-[#f0b8ee] px-2 py-0.5 rounded text-black";

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof ModelConfig, value: string | number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <aside className="w-full lg:w-80 bg-[#FFDBFD] border-l border-[#f0b8ee] p-5 flex flex-col gap-6 text-black overflow-y-auto h-full">
      <div className="flex items-center gap-2 pb-3 border-b border-[#f0b8ee]">
        <Settings className="w-5 h-5 text-pink-500" />
        <h2 className="font-semibold text-lg text-black">Parámetros del Modelo</h2>
      </div>

      {/* Selector de Modelo */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center gap-1.5 text-black">
          <Sparkles className="w-4 h-4 text-pink-500" /> Modelo
        </label>
        <select
          value={config.modelName}
          onChange={(e) => handleChange("modelName", e.target.value)}
          className={`${fieldClass} text-sm`}
        >
          <option value="gemini-3.8-flash">Gemini 3.8 Flash (Rápido y equilibrado)</option>
          <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite (Más económico)</option>
          <option value="gemini-3.7-flash">Gemini 3.7 Flash</option>
        </select>
      </div>

      {/* Contexto / System Instruction */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium flex items-center justify-between text-black">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-pink-500" /> System Prompt (Contexto)
          </span>
        </label>
        <p className="text-xs text-black/70">
          Define el rol, tono y restricciones del asistente.
        </p>
        <textarea
          rows={4}
          value={config.systemInstruction}
          onChange={(e) => handleChange("systemInstruction", e.target.value)}
          placeholder="Ej: Eres un tutor universitario de desarrollo de software especializado en TypeScript..."
          className={`${fieldClass} text-xs resize-none placeholder:text-black/40`}
        />
      </div>

      {/* Temperatura */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <label className="font-medium text-black">Temperatura (Creatividad)</label>
          <span className={badgeClass}>{config.temperature}</span>
        </div>
        <input
          type="range"
          min="0.0"
          max="2.0"
          step="0.1"
          value={config.temperature}
          onChange={(e) => handleChange("temperature", parseFloat(e.target.value))}
          className="accent-pink-500 w-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-black/60">
          <span>0.0 (Preciso/Lógico)</span>
          <span>1.0 (Balanceado)</span>
          <span>2.0 (Creativo)</span>
        </div>
      </div>

      {/* Max Tokens de Salida */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <label className="font-medium text-black">Límite de Tokens (Salida)</label>
          <span className={badgeClass}>{config.maxOutputTokens}</span>
        </div>
        <input
          type="range"
          min="64"
          max="4096"
          step="64"
          value={config.maxOutputTokens}
          onChange={(e) => handleChange("maxOutputTokens", parseInt(e.target.value, 10))}
          className="accent-pink-500 w-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-black/60">
          <span>64 (Corto)</span>
          <span>2048 (Medio)</span>
          <span>4096 (Extenso)</span>
        </div>
      </div>

      {/* Top-P */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <label className="font-medium text-black">Top-P (Nucleus Sampling)</label>
          <span className={badgeClass}>{config.topP}</span>
        </div>
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.05"
          value={config.topP}
          onChange={(e) => handleChange("topP", parseFloat(e.target.value))}
          className="accent-pink-500 w-full cursor-pointer"
        />
      </div>

      {/* Top-K */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <label className="font-medium text-black">Top-K</label>
          <span className={badgeClass}>{config.topK}</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={config.topK}
          onChange={(e) => handleChange("topK", parseInt(e.target.value, 10))}
          className="accent-pink-500 w-full cursor-pointer"
        />
      </div>
    </aside>
  );
};