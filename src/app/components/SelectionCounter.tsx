"use client";

import React from "react";

interface SelectionCounterProps {
  numSelections: number;
  onChange: (value: number) => void;
}

export default function SelectionCounter({
  numSelections,
  onChange,
}: SelectionCounterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 20) {
      onChange(value);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Número de Seleções (1-20)
      </label>
      <input
        type="number"
        min="1"
        max="20"
        value={numSelections}
        onChange={handleChange}
        className="bg-gray-700 text-white p-2 rounded w-20 text-right"
      />
    </div>
  );
}
