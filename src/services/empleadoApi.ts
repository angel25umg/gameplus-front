import axios from 'axios';

export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: 'ADMINISTRADOR' | 'VENDEDOR' | 'SOPORTE';
  status: boolean;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/empleados`;

export const getEmpleados = () => axios.get<Empleado[]>(API_BASE_URL);
export const createEmpleado = (data: Empleado) => axios.post(API_BASE_URL + '/create', data);
export const updateEmpleado = (id: number, data: Empleado) => axios.put(`${API_BASE_URL}/update/${id}`, data);
export const deleteEmpleado = (id: number) => axios.delete(`${API_BASE_URL}/delete/${id}`);
