import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/videojuegos`;

export type Videojuego = {
  id?: number;
  titulo: string;
  genero: string;
  plataforma: string;
  edad_recomendada?: number | null;
  existencias?: number | null;
  licencias_digitales?: number | null;
  precio?: number | null;
  trailer_url?: string | null;
  status?: boolean;
};

export const getVideojuegos = async () => {
  return await axios.get(API_BASE_URL);
};

export const createVideojuego = async (vj: Videojuego) => {
  return await axios.post(`${API_BASE_URL}/create`, vj);
};

export const updateVideojuego = async (id: number, vj: Videojuego) => {
  return await axios.put(`${API_BASE_URL}/update/${id}`, vj);
};

export const deleteVideojuego = async (id: number) => {
  return await axios.delete(`${API_BASE_URL}/delete/${id}`);
};
