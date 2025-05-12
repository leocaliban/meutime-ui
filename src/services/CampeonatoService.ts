import { CampeonatosResource } from './Resources';
import type { Campeonato, CampeonatoDetail } from '../types/Campeonato';

export const CampeonatoService = {
  async getAllDetails(): Promise<CampeonatoDetail[]> {
    const response = await CampeonatosResource.get('/details');
    return response.data;
  },

  async getAll(): Promise<Campeonato[]> {
    const response = await CampeonatosResource.get('');
    return response.data;
  },

  async getEmblema(id: number): Promise<Blob> {
    const response = await CampeonatosResource.get(`/${id}/emblema`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async create(formData: FormData): Promise<CampeonatoDetail> {
    const response = await CampeonatosResource.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await CampeonatosResource.delete(`/${id}`);
  }
};
