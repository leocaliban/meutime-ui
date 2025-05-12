export interface CampeonatoDetail {
  id: number;
  nome: string;
  tipo: 'LIGA' | 'COPA',
  emblema: string;
}

export interface Campeonato {
  id: number;
  nome: string;
  tipo: 'LIGA' | 'COPA'
}