"use client";

import React from "react";
import { BET_TYPES } from "../types/betting";

interface BetTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selections: number) => void;
}

export default function BetTypeModal({
  isOpen,
  onClose,
  onSelect,
}: BetTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Escolha um Tipo de Aposta
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        <div className="px-4 py-2 border-b border-gray-700 flex justify-between text-sm text-gray-400">
          <span>Tipo</span>
          <div className="flex gap-8">
            <span>Seleções</span>
            <span>Apostas</span>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {BET_TYPES.map((betType) => (
            <button
              key={betType.name}
              onClick={() => {
                onSelect(betType.selections);
                onClose();
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex justify-between items-center border-b border-gray-700"
            >
              <span className="text-green-400">{betType.name}</span>
              <div className="flex gap-8">
                <span className="text-gray-400 w-16 text-center">
                  {betType.selections}
                </span>
                <span className="text-gray-400 w-16 text-center">
                  {betType.bets}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
