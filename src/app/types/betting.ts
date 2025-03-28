export type BetType = "accumulator" | "simple" | "more";

export type BetResult =
  | "Para Ganhar"
  | "Para Ficar Colocado"
  | "Perdida"
  | "Anulada / N/P"
  | "Dead Heat";

export interface DeadHeatConfig {
  participants: number;
}

export interface Selection {
  odds: number;
  id: number;
  result: BetResult;
  deadHeatConfig?: DeadHeatConfig;
}

export interface BetTypeOption {
  name: string;
  selections: number;
  bets: number;
}

export const BET_TYPES: BetTypeOption[] = [
  { name: "Dupla", selections: 2, bets: 1 },
  { name: "Tripla", selections: 3, bets: 1 },
  { name: "Múltiplas de 4", selections: 4, bets: 1 },
  { name: "Múltiplas de 5", selections: 5, bets: 1 },
  { name: "Múltiplas de 6", selections: 6, bets: 1 },
  { name: "Múltiplas de 7", selections: 7, bets: 1 },
  { name: "Múltiplas de 8", selections: 8, bets: 1 },
];

export type BetCalculation = {
  totalStake: number;
  totalReturn: number;
  profit: number;
};
