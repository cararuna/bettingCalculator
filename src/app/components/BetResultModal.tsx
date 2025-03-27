"use client";

import React, { useState } from "react";
import { BetResult, DeadHeatConfig } from "../types/betting";

interface BetResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: BetResult, config?: DeadHeatConfig) => void;
  currentSelection?: BetResult;
  currentConfig?: DeadHeatConfig;
}

export default function BetResultModal({
  isOpen,
  onClose,
  onSelect,
  currentSelection = "Para Ganhar",
  currentConfig,
}: BetResultModalProps) {
  const [deadHeatConfig, setDeadHeatConfig] = useState<DeadHeatConfig>({
    participants: currentConfig?.participants || 2,
  });

  if (!isOpen) return null;

  const options: BetResult[] = [
    "Para Ganhar",
    "Para Ficar Colocado",
    "Perdida",
    "Anulada / N/P",
    "Dead Heat",
  ];

  const getButtonClass = (option: BetResult) => {
    const baseClass =
      "w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors";
    if (option === currentSelection) {
      return `${baseClass} text-green-400`;
    }
    return baseClass;
  };

  const handleSelect = (result: BetResult) => {
    if (result === "Dead Heat") {
      onSelect(result, deadHeatConfig);
    } else {
      onSelect(result);
      onClose();
    }
  };

  const handleConfigChange = (value: number) => {
    const newConfig = { participants: value };
    setDeadHeatConfig(newConfig);
    onSelect("Dead Heat", newConfig);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Selecione um Resultado
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        <div className="py-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={getButtonClass(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {currentSelection === "Dead Heat" && (
          <div className="p-4 border-t border-gray-700">
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Configurações Dead Heat
              </label>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Participantes
                </label>
                <select
                  className="w-full bg-gray-700 rounded p-2 text-sm"
                  value={deadHeatConfig.participants}
                  onChange={(e) => handleConfigChange(Number(e.target.value))}
                >
                  {[2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Participantes
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
