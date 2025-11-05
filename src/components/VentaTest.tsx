import React, { useState } from 'react';
import { carritoApi, pedidoApi, pagoApi } from '../services/ventaApi';
import type { AddProductoData, CarritoToPedidoData, PaymentIntentData } from '../services/ventaApi';

export const VentaTest: React.FC = () => {
  const [clienteId, setClienteId] = useState<number>(1); // Cambia el ID según tu base de datos
  const [carrito, setCarrito] = useState<any>(null);
  const [pedido, setPedido] = useState<any>(null);
  const [pago, setPago] = useState<any>(null);
  const [log, setLog] = useState<string>('');

  // 1. Crear/obtener carrito
  const handleCrearCarrito = async () => {
    try {
      const res = await carritoApi.create(clienteId);
      setCarrito(res.data);
      setLog('Carrito creado/recuperado');
    } catch (err: any) {
      setLog(err.message);
    }
  };

  // 2. Agregar producto al carrito
  const handleAgregarProducto = async () => {
    if (!carrito) return setLog('Primero crea el carrito');
    const data: AddProductoData = {
      carritoId: carrito.id,
      videojuegoId: 1, // Cambia por un ID válido
      cantidad: 1,
      subtotal: 1000,
    };
    try {
      const res = await carritoApi.addProducto(data);
      setLog('Producto agregado');
    } catch (err: any) {
      setLog(err.message);
    }
  };

  // 3. Checkout carrito
  const handleCheckout = async () => {
    if (!carrito) return setLog('Primero crea el carrito');
    try {
      await carritoApi.checkout(carrito.id);
      setLog('Carrito completado');
    } catch (err: any) {
      setLog(err.message);
    }
  };

  // 4. Convertir carrito en pedido
  const handleCarritoToPedido = async () => {
    if (!carrito) return setLog('Primero crea el carrito');
    const data: CarritoToPedidoData = {
      carritoId: carrito.id,
      direccion_envio: 'Mi casa',
      tipo_entrega: 'normal',
    };
    try {
      const res = await pedidoApi.carritoToPedido(data);
      setPedido(res.data.pedido);
      setLog('Pedido creado');
    } catch (err: any) {
      setLog(err.message);
    }
  };

  // 5. Pago con Stripe
  const handlePago = async () => {
    if (!pedido) return setLog('Primero crea el pedido');
    const data: PaymentIntentData = {
      amount: 1000, // Monto en centavos
      currency: 'usd',
      description: `Pago pedido ${pedido.id}`,
    };
    try {
      const res = await pagoApi.createPaymentIntent(data);
      setPago(res.data);
      setLog('Intento de pago creado');
    } catch (err: any) {
      setLog(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Prueba Flujo Venta</h2>
      <div>
        <label>Cliente ID: </label>
        <input type="number" value={clienteId} onChange={e => setClienteId(Number(e.target.value))} />
      </div>
      <button onClick={handleCrearCarrito}>Crear/Obtener Carrito</button>
      <button onClick={handleAgregarProducto}>Agregar Producto</button>
      <button onClick={handleCheckout}>Checkout Carrito</button>
      <button onClick={handleCarritoToPedido}>Crear Pedido</button>
      <button onClick={handlePago}>Crear Pago Stripe</button>
      <div style={{ marginTop: 20 }}>
        <strong>Log:</strong> {log}
      </div>
      <div>
        <pre>Carrito: {JSON.stringify(carrito, null, 2)}</pre>
        <pre>Pedido: {JSON.stringify(pedido, null, 2)}</pre>
        <pre>Pago: {JSON.stringify(pago, null, 2)}</pre>
      </div>
    </div>
  );
};
