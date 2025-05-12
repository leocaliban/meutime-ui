import { PartidasResource } from './Resources';
import type { Partida } from '../types/Partida';
import type { Confronto } from '../types/Confronto';
import type { PartidaRequestDTO } from '../types/PartidaRequestDTO';

export const PartidaService = {

  async getAll(): Promise<Partida[]> {
    const response = await PartidasResource.get('');
    return response.data;
  },

  async getConfrontos(clubeId: number, adversarioId: number): Promise<Confronto> {
    const response = await PartidasResource.get(`/confrontos`, {
      params: {
        clubeId,
        adversarioId
      }
    });
    return response.data;
  },

  async create(partida: PartidaRequestDTO): Promise<Partida> {
    const response = await PartidasResource.post('', partida);
    return response.data;
  },

};
