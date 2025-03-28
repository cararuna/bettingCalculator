"use client";

import React, { useState, useEffect } from "react";
import { gameData } from "../rtp/mock"; // Importa os dados mock

export default function GameTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState(gameData);

  // Filtra os jogos com base na pesquisa
  useEffect(() => {
    const filtered = gameData.filter((game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchQuery]);

  const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      {/* Cabeçalho com Logo e Barra de Pesquisa */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10">
        {/* Logo */}
        <div className="mb-6 md:mb-0">
          <img
            src="/image.png" // Substitua pelo caminho do seu logo
            alt="Logo da Empresa"
            className="h-20 w-auto drop-shadow-md"
          />
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Procure por um jogo..."
            className="w-full p-3 pl-10 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md transition-all duration-300"
          />
          {/* Ícone de Lupa */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </header>

      {/* Tabela de Jogos */}
      <div className="flex-grow overflow-x-auto bg-gray-800 rounded-xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="p-4 font-semibold rounded-tl-xl">Provedor</th>
              <th className="p-4 font-semibold">Nome do Jogo</th>
              <th className="p-4 font-semibold">RTP</th>
              <th className="p-4 font-semibold">Exposição Máxima</th>
              <th className="p-4 font-semibold rounded-tr-xl">Aposta Mínima (€)</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.length > 0 ? (
              filteredGames.map((game, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-200"
                >
                  <td className="p-4 text-gray-300">{game.provider}</td>
                  <td className="p-4 font-medium">{game.name}</td>
                  <td className="p-4 text-gray-300">{game.rtp}</td>
                  <td className="p-4 text-gray-300">{game.maxExposure}</td>
                  <td className="p-4 text-gray-300 whitespace-pre-wrap">{game.minBet}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Nenhum jogo encontrado para sua pesquisa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé Opcional */}
      <footer className="mt-6 text-center text-gray-500 text-sm">
        © 2025 - Todos os direitos reservados
      </footer>
    </div>
  );
}