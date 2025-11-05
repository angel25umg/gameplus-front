import axios from 'axios';

const API_URL = '/api/carrito';

// Obtiene el carrito activo del cliente (requiere clienteId)
export const getCarritoCliente = async (clienteId?: number) => {
  // Si no se pasa clienteId, intenta obtenerlo de localStorage
  const id = clienteId || Number(localStorage.getItem('clienteId'));
  return axios.get(`${API_URL}/cliente/${id}`);
};


// Agrega un producto al carrito
export const addProductoCarrito = async (carritoId: number, videojuegoId: number, cantidad: number, subtotal: number) => {
  return axios.post(`${API_URL}/add-producto`, { carritoId, videojuegoId, cantidad, subtotal });
};

// Elimina un producto del carrito
export const removeProductoCarrito = async (carritoId: number, videojuegoId: number) => {
  return axios.post(`${API_URL}/remove-producto`, { carritoId, videojuegoId });
};

// Vacía el carrito
export const clearCarrito = async (carritoId: number) => {
  return axios.post(`${API_URL}/clear`, { carritoId });
};
