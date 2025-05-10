import type { Campeonato } from "./Campeonato";
import type { Clube } from "./Clube";

export interface Partida {
  id: number; 
  data: string; 
  campeonato: Campeonato; 
  clube: Clube; 
  adversario: Clube; 
  emCasa: boolean;
  golsClube: number;
  golsAdversario: number;
  resultado: 'VITORIA' | 'DERROTA' | 'EMPATE';
  tevePenaltis: boolean; 
  golsPenaltisClube: number | null; 
  golsPenaltisAdversario: number | null; 
}

