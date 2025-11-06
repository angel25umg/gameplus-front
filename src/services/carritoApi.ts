import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/carrito`;

// Obtiene el carrito activo del cliente (requiere clienteId)
export const getCarritoCliente = async (clienteId?: number) => {
  const id = clienteId || Number(localStorage.getItem('clienteId'));
  return axios.get(`${API_BASE}/cliente/${id}`);
};

// Agrega un producto al carrito
export const addProductoCarrito = async (carritoId: number, videojuegoId: number, cantidad: number) => {
  // subtotal ahora se calcula en backend; no es necesario enviarlo desde cliente
  return axios.post(`${API_BASE}/add-producto`, { carritoId, videojuegoId, cantidad });
};

// Elimina un producto del carrito
export const removeProductoCarrito = async (carritoId: number, videojuegoId: number) => {
  return axios.post(`${API_BASE}/remove-producto`, { carritoId, videojuegoId });
};

// Vacía el carrito
export const clearCarrito = async (carritoId: number) => {
  return axios.post(`${API_BASE}/clear`, { carritoId });
};