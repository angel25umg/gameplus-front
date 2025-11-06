import axios from 'axios';

// Use Vite env var when available so requests go to the configured backend
// in development or production builds. Fallback to relative '/api' to
// preserve behavior when VITE_API_URL is not set.
const API_URL = import.meta.env.VITE_API_URL || '/api';


// Tipos para los parámetros
export interface AddProductoData {
  carritoId: number;
  videojuegoId: number;
  cantidad: number;
  subtotal: number;
}

export interface RemoveProductoData {
  carritoId: number;
  videojuegoId: number;
}

export interface CarritoToPedidoData {
  carritoId: number;
  direccion_envio: string;
  tipo_entrega: string;
}

export interface PaymentIntentData {
  amount: number;
  currency: string;
  description: string;
}

export const carritoApi = {
  create: (clienteId: number) => axios.post(`${API_URL}/carrito/create`, { clienteId }),
  getByCliente: (clienteId: number) => axios.get(`${API_URL}/carrito/cliente/${clienteId}`),
  addProducto: (data: AddProductoData) => axios.post(`${API_URL}/carrito/add-producto`, data),
  removeProducto: (data: RemoveProductoData) => axios.post(`${API_URL}/carrito/remove-producto`, data),
  clear: (carritoId: number) => axios.post(`${API_URL}/carrito/clear`, { carritoId }),
  checkout: (carritoId: number) => axios.post(`${API_URL}/carrito/checkout`, { carritoId }),
};

export const pedidoApi = {
  carritoToPedido: (data: CarritoToPedidoData) => axios.post(`${API_URL}/carrito-pedido/carrito-to-pedido`, data),
  getPedido: (pedidoId: number) => axios.get(`${API_URL}/pedidos/${pedidoId}`),
};

export const pagoApi = {
  createPaymentIntent: (data: PaymentIntentData) => axios.post(`${API_URL}/stripe/create-payment-intent`, data),
};
