import axios from 'axios';

export interface VentaMensual {
  mes: string;
  tipo_entrega: string;
  total_pedidos: string | number;
}

export interface TopCliente {
  clienteid: number;
  nombre: string;
  apellido: string;
  correo: string;
  total_compras: number;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/reporteria`;

export const getVentasMensuales = (year?: number) =>
  axios.get<VentaMensual | VentaMensual[]>(`${API_BASE_URL}/ventas-mensuales`, { params: { year } });

export const getTopClientes = () =>
  axios.get<TopCliente | TopCliente[]>(`${API_BASE_URL}/top-clientes`);
