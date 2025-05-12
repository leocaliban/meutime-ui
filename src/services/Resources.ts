import axios from 'axios';
import { applyDefaultInterceptors } from './Interceptor';

const BASE_URL = 'http://localhost:8080';


export const CampeonatosResource = applyDefaultInterceptors(axios.create({
  baseURL: `${BASE_URL}/campeonatos`,
  headers: {
    'Content-Type': 'application/json',
  },
}));

export const ClubesResource = applyDefaultInterceptors(axios.create({
  baseURL: `${BASE_URL}/clubes`,
  headers: {
    'Content-Type': 'application/json',
  },
}));

export const PartidasResource = applyDefaultInterceptors(axios.create({
  baseURL: `${BASE_URL}/partidas`,
  headers: {
    'Content-Type': 'application/json',
  },
}));