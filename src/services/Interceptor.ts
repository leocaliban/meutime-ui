// interceptors.ts
import type { AxiosInstance } from 'axios';
import { toast } from 'react-hot-toast';

export function applyDefaultInterceptors(api: AxiosInstance) {
  api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || 'Erro inesperado ao processar a requisição';

      if (status >= 400 && status < 500) {
        toast.error(message);
      } else if (status >= 500) {

        toast.error(error.response?.data?.message ? error.response?.data?.message : 'Erro interno no servidor. Tente novamente mais tarde.');
      } else {
        toast.error('Erro de conexão. Verifique sua internet.');
      }

      return Promise.reject(error);
    }
  );

  return api;
}
