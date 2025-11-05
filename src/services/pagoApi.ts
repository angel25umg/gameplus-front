import axios from 'axios';

export interface Pago {
  id?: number;
  pedidoId: number;
  metodo: 'STRIPE' | 'PAYPAL';
  monto: number;
  factura_digital?: string;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/pagos`;

export const getPagos = () => axios.get<Pago[]>(API_BASE_URL);
export const getPago = (id: number) => axios.get<Pago>(`${API_BASE_URL}/${id}`);
export const createPago = (data: Pago) => axios.post(API_BASE_URL + '/create', data);
