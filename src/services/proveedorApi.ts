import axios from 'axios';

export interface Proveedor {
  id?: number;
  nombre: string;
  contacto: string;
  contrato: string;
  status: boolean;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/proveedores`;

export const getProveedores = () => axios.get<Proveedor[]>(API_BASE_URL);
export const createProveedor = (data: Proveedor) => axios.post(API_BASE_URL + '/create', data);
export const updateProveedor = (id: number, data: Proveedor) => axios.put(`${API_BASE_URL}/update/${id}`, data);
export const deleteProveedor = (id: number) => axios.delete(`${API_BASE_URL}/delete/${id}`);
