"use client";

import React, { useState } from "react";
import { X, Sliders, Key, Server, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  setSystemPrompt: (val: string) => void;
  temperature: number;
  setTemperature: (val: number) => void;
  customApiKey: string;
  setCustomApiKey: (val: string) => void;
  customBaseUrl: string;
  setCustomBaseUrl: (val: string) => void;
  model: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  systemPrompt,
  setSystemPrompt,
  temperature,
  setTemperature,
  customApiKey,
  setCustomApiKey,
  customBaseUrl,
  setCustomBaseUrl,
  model,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Model & Gateway Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Active Model Display */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              <Cpu className="w-4 h-4 text-emerald-500" /> Active Model
            </label>
            <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-mono text-neutral-800 dark:text-neutral-200">
              {model}
            </div>
          </div>

          {/* System Instructions */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              System Instructions
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              placeholder="Define persona, tone, or specific constraints..."
              className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 resize-none"
            />
          </div>

          {/* Temperature Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Temperature: {temperature}
              </label>
              <span className="text-xs text-neutral-400">
                {temperature < 0.4 ? "Deterministic" : temperature > 0.8 ? "Creative" : "Balanced"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-neutral-900 dark:accent-neutral-100"
            />
          </div>

          {/* Custom Base URL */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              <Server className="w-4 h-4 text-blue-500" /> Inference Base URL
            </label>
            <input
              type="text"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
              placeholder="https://openrouter.ai/api/v1"
              className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          {/* Custom API Key */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              <Key className="w-4 h-4 text-amber-500" /> Override API Key (Optional)
            </label>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="sk-or-v1-... (leave blank to use server environment key)"
              className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <Button variant="default" onClick={onClose}>
            Save & Close
          </Button>
        </div>
      </div>
    </div>
  );
};
