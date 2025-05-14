import type { Clube } from "./Clube";
import type { Partida } from "./Partida";

export interface Confronto {
  adversario: Clube;
  vitorias: number;
  derrotas: number;
  empates: number;
  decisoesPorPenaltis: number;
  partidas: Partida[];
}