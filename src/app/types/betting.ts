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

export type BetCalculation = {
  totalStake: number;
  totalReturn: number;
  profit: number;
};
