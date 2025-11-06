import axios from 'axios';

export interface DetallePedido {
  id?: number;
  pedidoId: number;
  videojuegoId: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id?: number;
  clienteId: number;
  fecha?: string;
  direccion_envio?: string;
  tipo_entrega?: 'DIGITAL' | 'FISICA';
  estado?: 'PENDIENTE' | 'ENVIANDO' | 'ENTREGADO' | 'PAGADO';
  detalles?: DetallePedido[];
}

const API_BASE = `${import.meta.env.VITE_API_URL}/pedidos`;

export const getPedidos = () => axios.get<Pedido[]>(API_BASE);
export const getPedido = (id: number) => axios.get<Pedido>(`${API_BASE}/${id}`);
export const getPedidosByCliente = (clienteId?: number | string) => axios.get<Pedido[]>(API_BASE, { params: { clienteId } });
