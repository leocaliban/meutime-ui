export interface PartidaRequestDTO {
  data: string;
  campeonato: IdRequestDTO;
  adversario: IdRequestDTO;
  clube: IdRequestDTO;
  emCasa: boolean;
  golsClube: number;
  golsAdversario: number;
  tevePenaltis: boolean;
  golsPenaltisClube?: number;
  golsPenaltisAdversario?: number;
}

interface IdRequestDTO {
  id: number;
}
