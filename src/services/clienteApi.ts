import axios from 'axios';

// Lee la URL de la API desde las variables de entorno de Vite
// Backend expone /api/clientes
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/clientes`;

export type Cliente = {
  id?: number;
  nombre: string;
  apellido: string;
  direccion: string;
  correo: string;
  telefono: string;
  ingreso?: string;
  password?: string;
}

export const getClientes = async () => {
  return await axios.get(API_BASE_URL);
};

export const createCliente = async (cliente: Cliente) => {
  const data = { ...cliente, ingreso: new Date().toISOString() };
  return await axios.post(`${API_BASE_URL}/create`, data);
};

export const updateCliente = async (id: number, cliente: Cliente) => {
  return await axios.put(`${API_BASE_URL}/update/${id}`, cliente);
};

export const deleteCliente = async (id: number) => {
  return await axios.delete(`${API_BASE_URL}/delete/${id}`);
};