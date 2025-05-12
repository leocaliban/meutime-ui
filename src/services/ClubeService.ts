import { ClubesResource } from './Resources';
import type { Clube, ClubeDetails } from '../types/Clube';

export const ClubeService = {
  async getAllDetails(): Promise<ClubeDetails[]> {
    const response = await ClubesResource.get('/details');
    return response.data;
  },

  async getAll(): Promise<Clube[]> {
    const response = await ClubesResource.get('');
    return response.data;
  },

  async getEmblema(id: number): Promise<Blob> {
    const response = await ClubesResource.get(`/${id}/emblema`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async getById(id: number): Promise<ClubeDetails> {
    const response = await ClubesResource.get(`/${id}`);
    return response.data;
  },

  async create(formData: FormData): Promise<ClubeDetails> {
    const response = await ClubesResource.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await ClubesResource.delete(`/${id}`);
  }
};
