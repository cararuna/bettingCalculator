"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import {
  BetType,
  BetResult,
  DeadHeatConfig,
  BET_TYPES,
  BetTypeOption,
} from "../types/betting";
import Image from "next/image";
import SelectionCounter from "./SelectionCounter";
import BetResultModal from "./BetResultModal";
import BetTypeModal from "./BetTypeModal";

interface Selection {
  odds: number;
  id: number;
  result: BetResult;
  deadHeatConfig?: DeadHeatConfig;
}

export default function BettingCalculator() {
  const [betType, setBetType] = useState<BetType>("accumulator");
  const [selections, setSelections] = useState<Selection[]>([]);
  const [stake, setStake] = useState<number>(100);
  const [numSelections, setNumSelections] = useState<number>(2);
  const [modalOpen, setModalOpen] = useState(false);
  const [betTypeModalOpen, setBetTypeModalOpen] = useState(false);
  const [selectedSelectionId, setSelectedSelectionId] = useState<number | null>(
    null
  );
  const [isComposite, setIsComposite] = useState(false);
  const [currentBetType, setCurrentBetType] = useState<BetTypeOption | null>(
    null
  );

  useEffect(() => {
    if (betType === "accumulator") {
      // Adjust selections array based on numSelections
      if (selections.length < numSelections) {
        const newSelections = [...selections];
        for (let i = selections.length; i < numSelections; i++) {
          newSelections.push({
            odds: 2.0,
            id: Date.now() + i,
            result: "Para Ganhar",
          });
        }
        setSelections(newSelections);
      } else if (selections.length > numSelections) {
        setSelections(selections.slice(0, numSelections));
      }
    }
  }, [numSelections, betType]);

  const calculateTotalStake = (): number => {
    let total = 0;
    if (currentBetType) {
      // Para tipos especiais (Trixie, Yankee, etc), multiplica o stake pelo número de apostas
      total = stake * currentBetType.bets;
    } else if (betType === "simple") {
      total = stake * selections.length;
    } else {
      total = stake;
    }
    return isComposite ? total * 2 : total;
  };

  const calculateReturn = (): number => {
    if (!stake) return 0;

    let totalReturn = 0;
    const stakeToUse = isComposite ? stake * 2 : stake;

    if (currentBetType) {
      // Para tipos especiais, calcula o retorno baseado no número de apostas
      let accumulatedOdds = 1;
      selections.forEach((selection) => {
        if (selection.result === "Para Ganhar") {
          accumulatedOdds *= selection.odds;
        }
      });

      // Multiplica pelo stake e pelo número de apostas
      totalReturn = stakeToUse * accumulatedOdds * currentBetType.bets;
    } else if (betType === "simple") {
      selections.forEach((selection) => {
        let selectionReturn = 0;

        if (selection.result === "Anulada / N/P") {
          selectionReturn = stakeToUse;
        } else {
          switch (selection.result) {
            case "Para Ganhar":
              const effectiveOdds = isComposite ? 2.72 : selection.odds;
              selectionReturn = stakeToUse * effectiveOdds;
              break;
            case "Para Ficar Colocado":
              selectionReturn = stakeToUse * ((selection.odds - 1) * 0.2 + 1);
              break;
            case "Dead Heat":
              if (selection.deadHeatConfig) {
                const { participants } = selection.deadHeatConfig;
                const divisor = 1 / participants;
                selectionReturn = stakeToUse * selection.odds * divisor;
              }
              break;
            default:
              selectionReturn = 0;
          }
        }

        totalReturn += selectionReturn;
      });
    } else {
      // Para apostas acumuladas normais
      let accumulatedOdds = 1;
      let hasLoss = false;
      let activeSelections = 0;

      selections.forEach((selection) => {
        if (selection.result !== "Anulada / N/P") {
          activeSelections++;
          switch (selection.result) {
            case "Para Ganhar":
              accumulatedOdds *= selection.odds;
              break;
            case "Para Ficar Colocado":
              accumulatedOdds *= (selection.odds - 1) * 0.2 + 1;
              break;
            case "Dead Heat":
              if (selection.deadHeatConfig) {
                const { participants } = selection.deadHeatConfig;
                const divisor = 1 / participants;
                accumulatedOdds *= selection.odds * divisor;
              }
              break;
            case "Perdida":
              hasLoss = true;
              break;
          }
        }
      });

      if (hasLoss || activeSelections === 0) {
        totalReturn = 0;
      } else {
        if (isComposite) {
          accumulatedOdds = (accumulatedOdds * 29.9008) / 56;
        }
        totalReturn = stakeToUse * accumulatedOdds;
      }
    }

    return Number(totalReturn.toFixed(2));
  };

  const addSelection = (): void => {
    if (selections.length < 20) {
      if (betType === "simple") {
        // Se estiver no modo simples, muda para acumulador
        setBetType("accumulator");
        setNumSelections(selections.length + 1);
      } else {
        setSelections([
          ...selections,
          { odds: 2.0, id: Date.now(), result: "Para Ganhar" },
        ]);
        setNumSelections(selections.length + 1);
      }
    }
  };

  const removeSelection = (id: number): void => {
    if (betType === "accumulator" && selections.length <= 1) {
      return; // Prevent removing the last selection in accumulator mode
    }
    setSelections(selections.filter((sel: Selection) => sel.id !== id));
    if (betType === "accumulator") {
      setNumSelections((prev) => prev - 1);
    }
  };

  const updateOdds = (id: number, newOdds: number): void => {
    setSelections(
      selections.map((sel: Selection) =>
        sel.id === id ? { ...sel, odds: newOdds } : sel
      )
    );
  };

  const handleStakeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setStake(value);
    }
  };

  const handleBetTypeChange = (newType: BetType) => {
    setBetType(newType);
    if (newType === "simple") {
      // Se mudar para simples, mantém apenas a primeira seleção
      if (selections.length > 0) {
        setSelections([selections[0]]);
      } else {
        setSelections([{ odds: 2.0, id: Date.now(), result: "Para Ganhar" }]);
      }
      setNumSelections(1);
    }
  };

  const handleResultSelect = (
    index: number,
    result: BetResult,
    config?: { participants: number }
  ) => {
    const newSelections = [...selections];
    newSelections[index] = {
      ...newSelections[index],
      result,
      deadHeatConfig: result === "Dead Heat" ? config : undefined,
    };
    setSelections(newSelections);
    if (result !== "Dead Heat") {
      setModalOpen(false);
    }
  };

  const getResultColor = (result: BetResult): string => {
    switch (result) {
      case "Para Ganhar":
        return "text-green-400";
      case "Para Ficar Colocado":
        return "text-blue-400";
      case "Perdida":
        return "text-red-400";
      case "Anulada / N/P":
        return "text-yellow-400";
      case "Dead Heat":
        return "text-purple-400";
      default:
        return "text-white";
    }
  };

  const handleMoreOptionsSelect = (selections: number) => {
    const selectedBetType = BET_TYPES.find(
      (bt) => bt.selections === selections
    );
    if (selectedBetType) {
      setBetType("simple");
      setNumSelections(selections);
      setCurrentBetType(selectedBetType);

      // Cria o número correto de seleções simples
      const newSelections = Array(selections)
        .fill(null)
        .map((_, index) => ({
          odds: 2.0,
          id: Date.now() + index,
          result: "Para Ganhar" as BetResult,
        }));

      setSelections(newSelections);
    }
  };

  return (
    
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-xl">

<header className="flex flex-col md:flex-row justify-center items-center mb-10">
        {/* Logo */}
        <div className="mb-6 md:mb-0">
          <Image
            src="/image.png" // Substitua pelo caminho do seu logo
            alt="Logo da Empresa"
            className="h-20 w-auto justify-center items-center drop-shadow-md"
          />
        </div>

        {/* Barra de Pesquisa */}
        
      </header>


      <h1 className="text-2xl font-bold mb-6">Calculadora de Aposta</h1>

      {/* Bet Type Selection */}
      <div className="mb-6">
        <h2 className="text-lg mb-2">Tipo de aposta</h2>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleBetTypeChange("accumulator")}
            className={`p-2 rounded ${
              betType === "accumulator" ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            Acumulador
          </button>
          <button
            onClick={() => handleBetTypeChange("simple")}
            className={`p-2 rounded ${
              betType === "simple" ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            Simples
          </button>
          <button
            onClick={() => setBetTypeModalOpen(true)}
            className={`p-2 rounded ${
              betType === "more" ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            Mais...
          </button>
        </div>
      </div>

      {/* Selection Counter for Accumulator */}
      {betType === "accumulator" && (
        <SelectionCounter
          numSelections={numSelections}
          onChange={setNumSelections}
        />
      )}

      {/* Selections */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg">
            Seleções {selections.length}
            {currentBetType && (
              <span className="text-sm text-gray-400 ml-2">
                ({currentBetType.name})
              </span>
            )}
          </h2>
          {selections.length < 20 && !currentBetType && (
            <button
              onClick={addSelection}
              className="text-green-400 hover:text-green-300"
            >
              + 1 seleção
            </button>
          )}
        </div>

        <div className="space-y-2">
          {selections.map((selection, index) => (
            <div
              key={selection.id}
              className="flex items-center gap-2 bg-gray-800 p-2 rounded"
            >
              <span className="w-6">{index + 1}</span>
              <button
                onClick={() => {
                  setSelectedSelectionId(selection.id);
                  setModalOpen(true);
                }}
                className={`${getResultColor(
                  selection.result
                )} hover:opacity-80 transition-opacity`}
              >
                {selection.result}
              </button>
              <input
                type="number"
                value={selection.odds}
                onChange={(e) =>
                  updateOdds(selection.id, Number(e.target.value))
                }
                className="bg-gray-700 p-1 rounded w-20 text-right"
                step="0.01"
                min="1.01"
              />
              {isComposite && <span className="text-green-400">1/5</span>}
              {(betType === "simple" || selections.length > 1) && (
                <button
                  onClick={() => removeSelection(selection.id)}
                  className="ml-auto text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stake Input */}
      <div className="mb-6">
        <h2 className="text-lg mb-2">Valor de Aposta</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>R$</span>
            <input
              type="number"
              value={stake}
              onChange={handleStakeChange}
              className="bg-gray-700 p-2 rounded w-32 text-right"
              min="0"
              step="0.01"
            />
            {isComposite && <span>x2</span>}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isComposite}
              onChange={(e) => setIsComposite(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600 rounded bg-gray-700"
            />
            <span>V/C</span>
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded">
        <div>
          <h3 className="text-sm text-gray-400">Valor de Aposta Total</h3>
          <p className="text-xl">R${calculateTotalStake().toFixed(2)}</p>
          <p className="text-sm text-gray-400">
            R${stake.toFixed(2)} {isComposite && "x2"} ×{" "}
            {betType === "simple" ? selections.length : 1}
          </p>
        </div>
        <div>
          <h3 className="text-sm text-gray-400">Retorno</h3>
          <p className="text-xl">R${calculateReturn().toFixed(2)}</p>
          <p
            className={`text-sm ${
              calculateReturn() - calculateTotalStake() >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            R${(calculateReturn() - calculateTotalStake()).toFixed(2)}{" "}
            {calculateReturn() - calculateTotalStake() >= 0
              ? "Lucro"
              : "Perdas"}
          </p>
        </div>
      </div>

      {/* Bet Result Modal */}
      <BetResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(result, config) =>
          handleResultSelect(
            selections.findIndex((s) => s.id === selectedSelectionId),
            result,
            config
          )
        }
        currentSelection={
          selectedSelectionId !== null
            ? selections.find((s) => s.id === selectedSelectionId)?.result
            : undefined
        }
        currentConfig={
          selectedSelectionId !== null
            ? selections.find((s) => s.id === selectedSelectionId)
                ?.deadHeatConfig
            : undefined
        }
      />

      {/* Bet Type Modal */}
      <BetTypeModal
        isOpen={betTypeModalOpen}
        onClose={() => setBetTypeModalOpen(false)}
        onSelect={handleMoreOptionsSelect}
      />
    </div>
  );
}
