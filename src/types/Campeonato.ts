export interface CampeonatoDetail {
  id: number;
  nome: string;
  tipo: 'LIGA' | 'COPA' | 'AMISTOSO',
  emblema: string;
}

export interface Campeonato {
  id: number;
  nome: string;
  tipo: 'LIGA' | 'COPA' | 'AMISTOSO'
}